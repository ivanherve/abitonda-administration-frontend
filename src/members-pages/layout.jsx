import { Container } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Header from "./header";
import Classe from "./mainComponents/classes";
import Employees from "./mainComponents/Employees";
import Presence from "./mainComponents/presence";
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
            <Route path="/presence" component={Presence} />
            <Route
              path="/activity/swimmingpool"
              render={() => <div>piscine</div>}
            />
            <Route path="/activity/karate" render={() => <div>karaté</div>} />
            <Route path="/employees" render={() => <Employees />} />
            <Route path="/birthdays" render={() => <div>Anniversaires</div>} />
            <Route path="/statistics" render={() => <div>Statistiques</div>} />
            <Route path="/schoolreport" render={() => <div>Bulletin</div>} />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}
