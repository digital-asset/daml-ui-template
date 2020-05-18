import { makeStyles, createStyles } from "@material-ui/styles";

export default makeStyles((theme : any) => createStyles({
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
  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  marginB: {
    marginBottom: theme.spacing(2),
  }
}));
