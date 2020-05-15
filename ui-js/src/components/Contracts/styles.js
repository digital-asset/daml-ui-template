import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(theme => ({
  tableCell: {
    verticalAlign: "top",
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: "0.75rem"
  },
  tableRow: {
    height: "auto"
  },
  textField: {
    fontSize: "0.75rem"
  },
  marginB: {
    marginBottom: theme.spacing(2),
  }
}));
