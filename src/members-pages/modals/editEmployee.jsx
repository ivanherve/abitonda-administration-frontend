import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  Form,
  Modal,
  Row,
  Col,
  Alert,
  ListGroup,
  Button,
  Badge,
} from "react-bootstrap";
import swal from "sweetalert";
import { bank, jobs } from "../modals/addEmployee";

library.add(faTimes);

export default function EditEmployee(props) {
  let employee = props.employee;
  const [Lastname, setLastname] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [bankSelected, setBankSelected] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [nbRSSB, setNbRSSB] = useState("");
  const [positions, setPositions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [doc, setDoc] = useState("");
  const [over, setOver] = useState(false);
  const [over2, setOver2] = useState(false);

  const editEmployee = () => {
    console.log({
      Lastname,
      Firstname,
      bankSelected,
      bankAccount,
      nbRSSB,
      positions,
      documents,
    });
  };
  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Modifier un employé</Modal.Title>
      </Modal.Header>
      <Alert variant="warning">
        Aucune modification ne sera appliqué sur le champ non modifié
      </Alert>
      <Modal.Body>
        <Form>
          <FrmGroupText
            controlId="formLastname"
            label="Nom de famille"
            placeholder={employee.Name}
            change={(e) => setLastname(e.target.value)}
          />
          <FrmGroupText
            controlId="formFirstname"
            label="Prénom"
            placeholder={employee.Firstname}
            change={(e) => setFirstname(e.target.value)}
          />
          <FrmGroupSelect
            controlId="formBank"
            label="Banque"
            defaultValue={bank[bank.indexOf(employee.Bank)]}
            change={(e) => setBankSelected(e.target.value)}
            data={bank}
          />
          <FrmGroupText
            controlId="formAccount"
            label="Compte Bancaire"
            placeholder={employee.Account}
            change={(e) => setBankAccount(e.target.value)}
          />
          <FrmGroupText
            controlId="formRSSB"
            label="N° RSSB"
            placeholder={employee.NbRSSB}
            change={(e) => setNbRSSB(e.target.value)}
          />
          <hr />
          <Form.Group
            as={Row}
            controlId="formJob"
            style={{ maxHeight: "200px", overflow: "auto" }}
          >
            <Form.Label column sm="2">
              Position
            </Form.Label>
            <Col sm="5">
              <Form.Control
                as="select"
                multiple
                onChange={(e) => {
                  positions.length < 1
                    ? setPositions([e.target.value])
                    : positions.indexOf(e.target.value) === -1
                    ? setPositions([...positions, e.target.value])
                    : swal("Déjà ajouté", "", "warning");
                }}
              >
                {jobs.map((d) => (
                  <option key={d.BankId}>{d.Name}</option>
                ))}
              </Form.Control>
            </Col>
            <Col sm="5">
              <ListGroup variant="flush">
                {positions.map((p) => (
                  <ListGroup.Item key={positions.indexOf(p)}>
                    <Row>
                      <Col sm="11">{p}</Col>
                      <Col sm="1">
                        <Button
                          variant="light"
                          onClick={() => {
                            let arr = [...positions];
                            arr.splice(positions.indexOf(p), 1);
                            setPositions(arr);
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
          </Form.Group>
          <hr />
          <Form.Group
            as={Row}
            controlId="formDocs"
            style={{ maxHeight: "200px", overflow: "auto" }}
          >
            <Form.Label column sm="2">
              Documents
            </Form.Label>
            <Col sm="4">
              <Form.Control onChange={(e) => setDoc(e.target.value)} />
              <Badge
                variant={over ? "info" : "secondary"}
                style={{
                  marginRight: "10px",
                  fontSize: "0.8em",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setOver(!over)}
                onMouseLeave={() => setOver(!over)}
                pill
                onClick={(e) => {
                  documents.length < 1
                    ? setDocuments([e.target.innerText])
                    : documents.indexOf(e.target.innerText) === -1
                    ? setDocuments([...documents, e.target.innerText])
                    : swal("Déjà ajouté", "", "warning");
                }}
              >
                Certificat Formation
              </Badge>
              <Badge
                variant={over2 ? "info" : "secondary"}
                style={{
                  marginRight: "10px",
                  fontSize: "0.8em",
                  cursor: "pointer",
                }}
                pill
                onMouseEnter={() => setOver2(!over2)}
                onMouseLeave={() => setOver2(!over2)}
                onClick={(e) => {
                  documents.length < 1
                    ? setDocuments([e.target.innerText])
                    : documents.indexOf(e.target.innerText) === -1
                    ? setDocuments([...documents, e.target.innerText])
                    : swal("Déjà ajouté", "", "warning");
                }}
              >
                Diplôme secondaire
              </Badge>
            </Col>
            <Col sm="1">
              <Button
                variant="outline-secondary"
                style={{ width: "100%" }}
                onClick={() => {
                  documents.length < 1
                    ? setDocuments([doc])
                    : documents.indexOf(doc) === -1
                    ? setDocuments([...documents, doc])
                    : swal("Déjà ajouté", "", "warning");
                }}
              >
                <FontAwesomeIcon icon={["fas", "plus"]} />
              </Button>
            </Col>
            <Col sm="5">
              <ListGroup variant="flush">
                {documents.map((p) => (
                  <ListGroup.Item key={documents.indexOf(p)}>
                    <Row>
                      <Col sm="11">{p}</Col>
                      <Col sm="1">
                        <Button
                          variant="light"
                          onClick={() => {
                            let arr = [...documents];
                            arr.splice(documents.indexOf(p), 1);
                            setDocuments(arr);
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
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-info" onClick={() => editEmployee()}>
          Modifier
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
        <Form.Control onChange={props.change} placeholder={props.placeholder} />
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