import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequest,
  postAuthRequestFormData
} from "../../links/links";

export default function AddStudent(props) {
  const [classes, setClasses] = useState([{ ClasseId: 0, Name: "" }]);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [canteen, setCanteen] = useState(0);
  const [transport, setTransport] = useState(0);
  const [rulesSigned, setRulesSigned] = useState(false);
  const [registrationFileFilled, setRegistrationFileFilled] = useState(false);
  const [vaccinsFile, setVaccinsFile] = useState(false);
  const [piano, setPiano] = useState(false);
  const [swimmingpool, setSwimmingpool] = useState(false);
  const [guitar, setGuitar] = useState(false);
  const [danse, setDanse] = useState(false);
  const [classe, setClasse] = useState("");
  const [picture, setPicture] = useState(null);
  const [file, setFile] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([
    { SectorId: 0, Neighborhood: "District - Sector" },
  ]);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState("");
  const [address, setAddress] = useState("");

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const getNeighborhoods = () => {
    fetch(ENDPOINT("neighborhoods"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          setNeighborhoods([{ SectorId: 0, Neighborhood: "" }, ...r.response]);
      });
  };

  const uploadFile = (file) => {
    console.log(file);
    const data = new FormData();
    data.append("csv", file);
    fetch(ENDPOINT("student/createmany"), postAuthRequestFormData(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else swal("Erreur!", r.response, "warning");
      });
  };

  const addStudent = () => {
    let data = JSON.stringify({
      Lastname: lastname.toUpperCase(),
      Firstname: firstname.toUpperCase(),
      Birthdate: birthdate,
      Canteen: canteen,
      Transport: transport,
      Classe: classe,
      Picture: picture,
      neighborhoodSelected,
      rulesSigned,
      registrationFileFilled,
      vaccinsFile,
      piano,
      guitar,
      danse,
      swimmingpool,
      address
    });

    fetch(ENDPOINT("student/create"), postAuthRequest(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (!r.status) {
          //console.log(r, classe);
          swal('Oups!', r.response, "warning");
        }
        else
          swal(
            "Nouvel élève!",
            `${r.response.Firstname} ${r.response.Lastname} a bien été ajouté`,
            "success"
          ).then(() => {
            window.location.reload();
          });
      });
  };

  const LABEL_SIZE = 4;
  const CHECKBOX_SIZE = 8;

  useEffect(() => {
    getNeighborhoods();
    fetch(ENDPOINT("classes"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasses([{ ClasseId: 0, Name: "" }, ...r.response]);
        //console.log(r)
      });
    //console.log([prevInfo.classes, classes])
  }, []);

  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter des élèves</Modal.Title>
      </Modal.Header>
      <Tabs defaultActiveKey="addOne">
        <Tab eventKey="addOne" title="Ajouter un élève">
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

              <Form.Group as={Row} controlId="formPlaintextAddress">
                <Form.Label column sm="2">
                  Adresse*
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    as="select"
                    onChange={(e) => setNeighborhoodSelected(e.target.value)}
                  >
                    {neighborhoods.map((n) => (
                      <option key={n.SectorId}>{n.Neighborhood}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Row>
                <Col xs="4">
                  <Form.Group as={Row} controlId="formPlaintextCanteen">
                    <Form.Label column sm={LABEL_SIZE}>
                      Cantine
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-canteen"
                        onChange={(e) => setCanteen(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formPlaintextTransport">
                    <Form.Label column sm={LABEL_SIZE}>
                      Transport
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) => setTransport(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Row} controlId="formPlaintextRulesSigned">
                    <Form.Label column sm={LABEL_SIZE}>
                      ROI signé
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) => setRulesSigned(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formPlaintextVaccin">
                    <Form.Label column sm={LABEL_SIZE}>
                      Carnet de vaccination
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) => setVaccinsFile(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formPlaintextRegistrationFile"
                  >
                    <Form.Label column sm={LABEL_SIZE}>
                      Fiche d'inscription
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) =>
                          setRegistrationFileFilled(e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    as={Row}
                    controlId="formPlaintextPiano"
                  >
                    <Form.Label column sm={LABEL_SIZE}>
                      Piano
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) =>
                          setPiano(e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formPlaintextSwimmingpool"
                  >
                    <Form.Label column sm={LABEL_SIZE}>
                      Piscine
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) =>
                          setSwimmingpool(e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formPlaintextGuitar"
                  >
                    <Form.Label column sm={LABEL_SIZE}>
                      Guitar
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) =>
                          setGuitar(e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formPlaintextDanse"
                  >
                    <Form.Label column sm={LABEL_SIZE}>
                      Danse
                    </Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        id="checkbox-transport"
                        onChange={(e) =>
                          setDanse(e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Form.Group as={Row} controlId="formPlaintextPicture">
                <Form.Label column sm={LABEL_SIZE}>
                  Photo
                </Form.Label>
                <Col sm={CHECKBOX_SIZE}>
                  <FileBase64 onDone={(e) => setPicture(e.base64)} />
                </Col>
              </Form.Group>
              <Button variant="outline-primary" onClick={() => addStudent()}>
                Ajouter
              </Button>
            </Form>
          </Modal.Body>
        </Tab>
        <Tab eventKey="addMany" title="Ajouter plusieurs élèves">
          <div style={{ padding: "30px" }}>
            <Form>
              <Form.Group as={Row} controlId="formPlaintextCSV">
                <Form.Label>Importer un fichier (.csv)</Form.Label>
              </Form.Group>
              <Row>
                <FileBase64 onDone={(e) => setFile(e.file)} />
              </Row>
            </Form>
            <br />
            <Button variant="outline-primary" onClick={() => uploadFile(file)}>
              Ajouter
            </Button>
          </div>
        </Tab>
      </Tabs>
      <Modal.Footer></Modal.Footer>
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
