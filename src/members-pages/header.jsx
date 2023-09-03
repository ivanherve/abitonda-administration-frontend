import { library } from "@fortawesome/fontawesome-svg-core";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Redirect } from "react-router-dom";

library.add(faSignOutAlt);

export default function Header(props) {
  const [loggedIn, setLoggedIn] = useState(true);

  const signOut = () => {
    //fetch(ENDPOINT())
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/*<Nav.Link href="/presence">Présence</Nav.Link>*/}
          <Nav.Link href="/classes">Classes</Nav.Link>
          <Nav.Link href="/students">Eleves</Nav.Link>
          {/*
          <NavDropdown title="Activités Parascolaires" id="basic-nav-dropdown">
            <NavDropdown.Item href="/activity/swimmingpool" disabled>
              Piscine
            </NavDropdown.Item>
            <NavDropdown.Item href="/activity/karate" disabled>
              Karaté
            </NavDropdown.Item>
            <NavDropdown.Item href="/activity/dance" disabled>
              Dances Traditionelles
            </NavDropdown.Item>
            <NavDropdown.Item href="/activity/music" disabled>
              Musique
            </NavDropdown.Item>
          </NavDropdown>
*/}
          <Nav.Link href="/employees">Employés</Nav.Link>
          <Nav.Link href="/birthdays">Anniversaires</Nav.Link>
          <Nav.Link href="/statistics">Statistiques</Nav.Link>
          {/*<Nav.Link href="/schoolreport">Livret scolaire</Nav.Link>*/}
          <Nav.Link href="/invoices">Factures</Nav.Link>
          {/*<Nav.Link href="/payment">Paiement</Nav.Link>
          <Nav.Link href="/food">Alimentaire</Nav.Link>
<Nav.Link href="/stock">Stock</Nav.Link>*/}
          <Nav.Link href="/soras">SORAS</Nav.Link>
          {/*<Nav.Link href="/prints">Impression</Nav.Link>*/}
        </Nav>
        <div inline={true}>
          <Button variant="outline-warning" onClick={() => signOut()}>
            Déconnexion <FontAwesomeIcon icon={["fas", "sign-out-alt"]} />
          </Button>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
