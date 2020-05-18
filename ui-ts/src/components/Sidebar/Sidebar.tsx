import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List, Theme } from "@material-ui/core";
import { Home, List as ListIcon, ArrowBack } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import useStyles from "./styles";
import SidebarLink from "./components/SidebarLink/SidebarLink";
import { useLayoutState, useLayoutDispatch, toggleSidebar } from "../../context/LayoutContext";

function Sidebar({ location } : RouteComponentProps) {
  var classes = useStyles();
  var theme = useTheme() as Theme;

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBack
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List>
        <SidebarLink
          key="default"
          label="Default"
          path="/app/default"
          icon={(<Home />)}
          location={location}
          isSidebarOpened={isSidebarOpened}
        />
        <SidebarLink
          key="Report"
          label="Report"
          path="/app/report"
          icon={(<ListIcon />)}
          location={location}
          isSidebarOpened={isSidebarOpened}
        />
        <SidebarLink
          key="NewAsset"
          label="New Asset"
          path="/app/newasset"
          icon={(<ListIcon />)}
          location={location}
          isSidebarOpened={isSidebarOpened}
        />
        <SidebarLink
          key="Role"
          label="Role"
          path="/app/role"
          icon={(<ListIcon />)}
          location={location}
          isSidebarOpened={isSidebarOpened}
        />
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
