import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Header from "./header";
import Birthday from "./mainComponents/birthday";
import Classe from "./mainComponents/classes";
import Employees from "./mainComponents/Employees";
import PaymentBook from "./mainComponents/paymentBook";
import Statistics from "./mainComponents/statistics";
import Student from "./mainComponents/students";

export default function Layout(props) {
  if (!sessionStorage.getItem("userData")) {
    return <Redirect to="/login" />;
  }

  if (JSON.parse(sessionStorage.getItem("userData")).user.ProfilId < 2) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header />
      <Container style={{ marginTop: "10px" }}>
        <Router>
          <Switch>
            <Route path="/classes" component={Classe} />
            <Route path="/students" component={Student} />
            {/*<Route path="/presence" component={Presence} />*/}
            {/*
            <Route
              path="/activity/swimmingpool"
              render={() => <div>piscine</div>}
            />

            <Route path="/activity/karate" render={() => <div>karaté</div>} />*/}
            <Route path="/employees" render={() => <Employees />} />
            <Route path="/birthdays" component={Birthday} />
            <Route path="/statistics" component={Statistics} />
            {/*<Route path="/schoolreport" component={Transcripts} />*/}
            <Route path="/payments" component={PaymentBook} />
            <Redirect to="/classes" />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}
