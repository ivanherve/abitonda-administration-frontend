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
  const [urubuto, setUrubuto] = useState("");
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
  const [pointDeRamassage, setPointDeRamassage] = useState("");
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
      Urubuto: urubuto,
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
      address,
      pointDeRamassage
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
        {/* Ajouter un seul élève */}
        <Tab eventKey="addOne" title="Ajouter un élève">
          <Modal.Body>
            <Form>
              {/* Informations personnelles */}
              <Form.Group as={Row} controlId="formLastname">
                <Form.Label column sm="2">Nom de famille</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formFirstname">
                <Form.Label column sm="2">Prénom</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formUrubuto">
                <Form.Label column sm="2">Code Urubuto</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    min={202021334852}
                    onChange={(e) => setUrubuto(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBirthdate">
                <Form.Label column sm="2">Date de naissance</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="date"
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formClasse">
                <Form.Label column sm="2">Classe</Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="select"
                    onChange={(e) => setClasse(e.target.value)}
                  >
                    {classes.map((c, idx) => (
                      <option key={idx}>{c.Name}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>

              {/* Adresse et quartier */}
              <Form.Group as={Row} controlId="formAddress">
                <Form.Label column sm="2">Adresse*</Form.Label>
                <Col sm="5">
                  <Form.Control onChange={(e) => setAddress(e.target.value)} />
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

              <Form.Group as={Row} controlId="formPickupPoint">
                <Form.Label column sm="2">Point de ramassage (si transport)</Form.Label>
                <Col sm="10">
                  <Form.Control
                    onChange={(e) => setPointDeRamassage(e.target.value)}
                  />
                </Col>
              </Form.Group>

              {/* Services et options */}
              <Row>
                <Col xs="4">
                  <Form.Group as={Row} controlId="formCanteen">
                    <Form.Label column sm={LABEL_SIZE}>Cantine</Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => setCanteen(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formTransport">
                    <Form.Label column sm={LABEL_SIZE}>Transport</Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => setTransport(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group as={Row} controlId="formRulesSigned">
                    <Form.Label column sm={LABEL_SIZE}>ROI signé</Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => setRulesSigned(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formVaccins">
                    <Form.Label column sm={LABEL_SIZE}>Carnet de vaccination</Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => setVaccinsFile(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formRegistrationFile">
                    <Form.Label column sm={LABEL_SIZE}>Fiche d'inscription</Form.Label>
                    <Col sm={CHECKBOX_SIZE}>
                      <Form.Check
                        type="checkbox"
                        onChange={(e) => setRegistrationFileFilled(e.target.checked)}
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  {["Piano", "Piscine", "Guitar", "Danse"].map((activity) => (
                    <Form.Group as={Row} controlId={`form${activity}`} key={activity}>
                      <Form.Label column sm={LABEL_SIZE}>{activity}</Form.Label>
                      <Col sm={CHECKBOX_SIZE}>
                        <Form.Check
                          type="checkbox"
                          onChange={(e) =>
                            eval(`set${activity}`)(e.target.checked)
                          }
                        />
                      </Col>
                    </Form.Group>
                  ))}
                </Col>
              </Row>

              <hr />

              {/* Photo */}
              <Form.Group as={Row} controlId="formPicture">
                <Form.Label column sm={LABEL_SIZE}>Photo</Form.Label>
                <Col sm={CHECKBOX_SIZE}>
                  <FileBase64 onDone={(e) => setPicture(e.base64)} />
                </Col>
              </Form.Group>

              <Button variant="outline-primary" onClick={addStudent}>Ajouter</Button>
            </Form>
          </Modal.Body>
        </Tab>

        {/* Ajouter plusieurs élèves */}
        <Tab eventKey="addMany" title="Ajouter plusieurs élèves">
          <div style={{ padding: "30px" }}>
            <Form>
              <Form.Group as={Row} controlId="formCSV">
                <Form.Label>Importer un fichier (.csv)</Form.Label>
              </Form.Group>
              <Row>
                <FileBase64 onDone={(e) => setFile(e.file)} />
              </Row>
            </Form>
            <br />
            <Button variant="outline-primary" onClick={() => uploadFile(file)}>Ajouter</Button>
          </div>
        </Tab>
      </Tabs>

      <Modal.Footer />
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
