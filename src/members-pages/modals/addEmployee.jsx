import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
  Badge,
} from "react-bootstrap";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequest,
  postAuthRequestFormData,
} from "../../links/links";

export default function AddEmployee(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [bankSelected, setBankSelected] = useState("");
  const [account, setAccount] = useState("");
  const [rssb, setRssb] = useState("");
  const [nbDays, setNbDays] = useState("");
  const [position, setPosition] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [banks, setBanks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [doc, setDoc] = useState("");
  const [over, setOver] = useState(false);
  const [over2, setOver2] = useState(false);

  let getJobs = () => {
    fetch(ENDPOINT("jobs"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setJobs([{ JobId: 0, Name: "" }, ...r.response]);
      });
  };

  let getBanks = () => {
    fetch(ENDPOINT("banks"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setBanks([{ BankId: 0, Name: "" }, ...r.response]);
      });
  };

  useEffect(() => {
    getJobs();
    getBanks();
  }, []);

  const addEmp = () => {
    let data = {
      lastname,
      firstname,
      bankSelected,
      account,
      position,
      documents,
      rssb,
      nbDays,
      email,
    };
    let formData = new FormData();
    formData.append("data", JSON.stringify(data));
    fetch(ENDPOINT("addemployee"), postAuthRequestFormData(formData, token))
      .then((r) => r.json())
      .then((r) => {
        if (!r.status) swal("Oups!", r.response, "warning");
        else
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
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
          <FrmGroupText
            controlId="formPlaintextEmail"
            label="E-mail"
            change={(e) => setEmail(e.target.value)}
          />
          <FrmGroupSelect
            controlId="formPlaintextBank"
            label="Banque"
            change={(e) => setBankSelected(e.target.value)}
            data={banks}
          />
          <FrmGroupText
            controlId="formPlaintextBankAccount"
            label="Compte Banquaire"
            change={(e) => setAccount(e.target.value)}
          />
          <FrmGroupText
            controlId="formPlaintextNumbRSSB"
            label="Numéro RSSB"
            change={(e) => setRssb(e.target.value)}
          />
          <FrmGroupText
            controlId="formPlaintextNumbDays"
            label="Nombre de Jour"
            change={(e) => setNbDays(e.target.value)}
          />
          <Form.Group as={Row} controlId="formPlaintextJob">
            <Form.Label column sm="2">
              Position
            </Form.Label>
            <Col sm="10">
              <Row>
                <Col sm="6">
                  <Form.Control
                    as="select"
                    onChange={(e) =>
                      position.length < 1
                        ? position.indexOf(e.target.value) === -1
                          ? setPosition([e.target.value])
                          : swal("Déjà ajouté", "", "warning")
                        : position.indexOf(e.target.value) === -1
                        ? setPosition([...position, e.target.value])
                        : swal("Déjà ajouté", "", "warning")
                    }
                  >
                    {jobs.map((d) => (
                      <option key={jobs.indexOf(d)}>{d.Name}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col sm="6">
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
            <option key={props.data.indexOf(d)}>{d.Name}</option>
          ))}
        </Form.Control>
      </Col>
    </Form.Group>
  );
}
