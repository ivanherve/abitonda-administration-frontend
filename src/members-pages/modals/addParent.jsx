import { useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import swal from "sweetalert";
import { ENDPOINT, postAuthRequest } from "../../links/links";

export default function AddParent(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [linkChild, setLinkChild] = useState("");

  const addParent = () => {
    let data = JSON.stringify({
      StudentId: props.studentId,
      firstname: firstname,
      lastname: lastname,
      telephone: telephone,
      email: email,
      address: address,
      linkChild: linkChild,
    });

    fetch(ENDPOINT("parents/create"), postAuthRequest(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else console.log(r.response, props);
      });
  };

  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un parent / tuteur</Modal.Title>
      </Modal.Header>
      {/*
      <Alert variant="warning">Tous les champs sont obligatoires</Alert>
      */}

      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="addparentfirstname">
            <Form.Label column sm="2">
              Prénom*
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={(e) => setFirstname(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentlastname">
            <Form.Label column sm="2">
              Nom*
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={(e) => setLastname(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentphone">
            <Form.Label column sm="2">
              Téléphone*
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="number"
                onChange={(e) => setTelephone(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentemail">
            <Form.Label column sm="2">
              E-mail
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentaddress">
            <Form.Label column sm="2">
              Adresse*
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={(e) => setAddress(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentprofession">
            <Form.Label column sm="2">
              Profession
            </Form.Label>
            <Col sm="10">
              <Form.Control />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="addparentlink">
            <Form.Label column sm="2">
              Lien avec l'enfant*
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                onChange={(e) => setLinkChild(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => addParent()}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
