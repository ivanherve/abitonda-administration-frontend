import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import swal from "sweetalert";

export const bank = [
  { BankId: 1, Name: "" },
  { BankId: 2, Name: "BK" },
  { BankId: 3, Name: "COGEBANK" },
];

export const jobs = [
  { JobId: 1, Name: "Chauffeur/Coursier" },
  { JobId: 2, Name: "Enseignant(e)" },
  { JobId: 3, Name: "Assistant(e)" },
  { JobId: 4, Name: "Gardien(ne)" },
  { JobId: 5, Name: "Ménagère" },
  { JobId: 6, Name: "Secrétaire" },
  { JobId: 7, Name: "Directeur" },
];

export default function AddEmployee(props) {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [bankSelected, setBankSelected] = useState("");
  const [account, setAccount] = useState("");
  const [position, setPosition] = useState([]);
  const addEmp = () => {
    console.log({
      Lastname: lastname,
      Firstname: firstname,
      Bank: bankSelected,
      Account: account,
      Postions: position,
    });
  };
  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un(e) Employé(e)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FrmGroupText
            controlId="formPlaintextLastname"
            label="Nom de famille"
            change={(e) => setLastname(e.target.value)}
          />
          <FrmGroupText
            controlId="formPlaintextFirstname"
            label="Prénom"
            change={(e) => setFirstname(e.target.value)}
          />
          <FrmGroupSelect
            controlId="formPlaintextBank"
            label="Banque"
            change={(e) => setBankSelected(e.target.value)}
            data={bank}
          />
          <FrmGroupText
            controlId="formPlaintextBankAccount"
            label="Compte Banquaire"
            change={(e) => setAccount(e.target.value)}
          />
          <FrmGroupSelect
            controlId="formPlaintextJob"
            label="Position"
            change={(e) =>
              position.length < 1
                ? position.indexOf(e.target.value) === -1
                  ? setPosition([e.target.value])
                  : swal("Déjà ajouté", "", "warning")
                : position.indexOf(e.target.value) === -1
                ? setPosition([...position, e.target.value])
                : swal("Déjà ajouté", "", "warning")
            }
            data={jobs}
          />
          <br />
          <Row>
            <Col sm="2"></Col>
            <Col sm="10">
              <ListGroup variant="flush">
                {position.map((p) => (
                  <ListGroup.Item key={position.indexOf(p)}>
                    <Row>
                      <Col sm="11">{p}</Col>
                      <Col sm="1">
                        <Button
                          variant="light"
                          onClick={() => {
                            let arr = [...position];
                            arr.splice(position.indexOf(p), 1);
                            setPosition(arr);
                          }}
                        >
                          <FontAwesomeIcon icon={["fas", "times"]} />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-info" onClick={() => addEmp()}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function FrmGroupText(props) {
  return (
    <Form.Group as={Row} controlId={props.controlId}>
      <Form.Label column sm="2">
        {props.label}
      </Form.Label>
      <Col sm="10">
        <Form.Control onChange={props.change} />
      </Col>
    </Form.Group>
  );
}

function FrmGroupSelect(props) {
  return (
    <Form.Group as={Row} controlId={props.controlId}>
      <Form.Label column sm="2">
        {props.label}
      </Form.Label>
      <Col sm="10">
        <Form.Control as="select" onChange={props.change}>
          {props.data.map((d) => (
            <option key={d.BankId}>{d.Name}</option>
          ))}
        </Form.Control>
      </Col>
    </Form.Group>
  );
}
