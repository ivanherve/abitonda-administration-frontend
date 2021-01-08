import Login from './anonymous-pages/LoginPage';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Layout from './members-pages/layout';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

moment().locale('fr');

function App() {
  return (
    <div style={{ backgroundColor: '#82E4FF', height: '100vh'}}>
      <Router>
        <Switch>
          <Route exact path="/login" name="Page de Connexion" component={Login} />
          <Route path="/" name="Accueil" component={Layout} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;