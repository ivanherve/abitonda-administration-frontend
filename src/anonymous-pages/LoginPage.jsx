import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import Logo from "../img/logo-transparent.png";
import LogoMaternelle from "../img/logo-maternelle-transparent.png";
import LogoCreche from "../img/logo-creche-transparent.png";
import { ENDPOINT, postRequest } from "../links/links";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const signIn = () => {
    let data = {
      email: email,
      password: password,
    };
    data = JSON.stringify(data);
    setIsLogging(true);
    fetch(ENDPOINT("signin"), postRequest(data))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          sessionStorage.setItem("userData", JSON.stringify(r.response));
          setLoggedIn(true);
        } else {
          swal("Oups!", r.response[0], "warning").then(() =>
            console.log(r.data)
          );
        }
      });
  };

  setTimeout(() => {
    setIsLogging(false);
  }, 5000);

  if (loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <div
        className="d-flex justify-content-center"
        style={{ paddingTop: "100px" }}
      >
        <img src={LogoCreche} alt="Logo" width="199.5" height="225" />
        <img src={LogoMaternelle} alt="Logo" width="199.5" height="225" />
        <img src={Logo} alt="Logo" width="199.5" height="225" />
      </div>
      <div className="d-flex justify-content-center" style={{ color: "blue" }}>
        <h3>Administration</h3>
      </div>
      <div className="d-flex justify-content-center">
        <Card style={{ width: "35%" }}>
          <Card.Header>
            <Card.Title>Connexion</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Adresse E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="adresse@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) signIn(email, password);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) signIn(email, password);
                  }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="outline-primary"
              onClick={() => signIn(email, password)}
              disabled={isLogging}
            >
              {isLogging ? "Connexion..." : "Connexion"}
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
}
