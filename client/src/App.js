import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoChat from "./components/VideoChat";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    border: "2px solid black",
    // [theme.breakpoints.down("xs")]: {
    //   width: "90%",
    // },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

function App() {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center">
          Video Chat
        </Typography>
      </AppBar>
      <VideoChat />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}

export default App;
