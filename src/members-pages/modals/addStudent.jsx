import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequest,
  postRequest,
  usePrevious,
} from "../../links/links";

export default function AddStudent(props) {
  const [classes, setClasses] = useState([]);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [canteen, setCanteen] = useState(0);
  const [transport, setTransport] = useState(0);
  const [classe, setClasse] = useState(1);
  const [picture, setPicture] = useState("");

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const addStudent = () => {
    let data = JSON.stringify({
      Lastname: lastname.toUpperCase(),
      Firstname: firstname.toUpperCase(),
      Birthdate: birthdate,
      Canteen: canteen,
      Transport: transport,
      Classe: classe,
      Picture: picture,
    });

    fetch(ENDPOINT("student/create"), postAuthRequest(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (!r.status) console.log(r, classe);
        swal(
          "Nouvel élève!",
          `${r.response.Firstname} ${r.response.Lastname} a bien été ajouté`,
          "success"
        ).then(() => {
          props.hide();
        });
      });
  };

  useEffect(() => {
    fetch(ENDPOINT("classes"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasses(r.response);
        //console.log(r)
      });
    //console.log([prevInfo.classes, classes])
  }, []);

  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un élève</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="formPlaintextLastname">
            <Form.Label column sm="2">
              Nom de famille
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                onChange={(e) => setLastname(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextFirstname">
            <Form.Label column sm="2">
              Prénom
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextBirthdate">
            <Form.Label column sm="2">
              Date de naissance
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="date"
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextBirthdate">
            <Form.Label column sm="2">
              Cantine
            </Form.Label>
            <Col sm="10">
              <Form.Check
                type="checkbox"
                id="checkbox-canteen"
                onChange={(e) => setCanteen(e.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextBirthdate">
            <Form.Label column sm="2">
              Transport
            </Form.Label>
            <Col sm="10">
              <Form.Check
                type="checkbox"
                id="checkbox-transport"
                onChange={(e) => setTransport(e.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextClasse">
            <Form.Label column sm="2">
              Classe
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                onChange={(e) => setClasse(e.target.value)}
              >
                {classes.map((c) => (
                  <option
                    key={classes.indexOf(c)}
                    onClick={() => console.log(c)}
                  >
                    {c.Name}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextPicture">
            <Form.Label column sm="2">
              Photo
            </Form.Label>
            <Col sm="10">
              <FileBase64 onDone={(e) => setPicture(e.base64)} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => addStudent()}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const styles = {
  dragDropFile: {
    display: "flex",
    justifyContent: "center",
    color: "gray",
  },
};
