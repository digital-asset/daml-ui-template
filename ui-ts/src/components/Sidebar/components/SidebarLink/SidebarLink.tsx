import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";
import { History, Location } from "history";
import classnames from "classnames";
import useStyles from "./styles";

type SidebarLinkProps = {
  path : string
  icon : JSX.Element
  label : string
  location : Location<History.PoorMansUnknown>
  isSidebarOpened : boolean
}

export default function SidebarLink({ path, icon, label, location, isSidebarOpened } : SidebarLinkProps) {
  const classes = useStyles();
  const isLinkActive = path && (location.pathname === path || location.pathname.indexOf(path) !== -1);

  return (
    <ListItem
      button={true}
      component={Link}
      to={path}
      className={classes.link}
      classes={{
        root: classnames(classes.linkRoot, {
          [classes.linkActive]: isLinkActive,
        }),
      }}
      disableRipple
    >
      <ListItemIcon
        className={classnames(classes.linkIcon, {
          [classes.linkIconActive]: isLinkActive,
        })}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        classes={{
          primary: classnames(classes.linkText, {
            [classes.linkTextActive]: isLinkActive,
            [classes.linkTextHidden]: !isSidebarOpened,
          }),
        }}
        primary={label}
      />
    </ListItem>
  );

  // ###########################################################
}
