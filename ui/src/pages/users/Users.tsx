import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

import { useStreamQueryAsPublic } from "@daml/dabl-react";
import { User } from "@daml.js/daml-ui-template-0.0.1";

import useStyles from "./styles";

export default function Users() {
  const classes = useStyles();
  const usernames = useStreamQueryAsPublic(User.UserName)

  return (
    <Table size="small">
      <TableHead>
        <TableRow className={classes.tableRow}>
          <TableCell key={0} className={classes.tableCell}>User</TableCell>
          <TableCell key={1} className={classes.tableCell}>Username</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {usernames.contracts.map(u => (
          <TableRow key={u.payload.common.user} className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>{u.payload.common.user}</TableCell>
            <TableCell key={0} className={classes.tableCell}>{u.payload.common.userName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}