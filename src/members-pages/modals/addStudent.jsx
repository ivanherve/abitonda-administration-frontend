import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Tab, Tabs, Card } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequest,
  postAuthRequestFormData
} from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

  // Nouveau state
  const [hasSibling, setHasSibling] = useState("no");
  const [familyId, setFamilyId] = useState("");
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);

  // Charger la liste des élèves (exemple)
  useEffect(() => {
    fetch(ENDPOINT("students"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setStudents(r.response);
      });
  }, []);

  useEffect(() => {
    let data = familyId;
    console.log(data);
    fetch(ENDPOINT('assign-family'), postAuthRequest(JSON.stringify(data), token))
      .then(res => res.json())
      .then(r => {
        console.log(r)
      });
  }, [familyId]);

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
          console.log(r, classe, data);
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
              {/* --- Informations personnelles --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Informations personnelles</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Nom</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" onChange={(e) => setLastname(e.target.value)} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Prénom</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" onChange={(e) => setFirstname(e.target.value)} />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Date de naissance</Form.Label>
                    <Col sm="9">
                      <Form.Control type="date" onChange={(e) => setBirthdate(e.target.value)} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* --- Classe --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Classe</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Classe</Form.Label>
                    <Col sm="9">
                      <Form.Control as="select" onChange={(e) => setClasse(e.target.value)}>
                        {classes.map((c) => (
                          <option key={c.ClasseId}>{c.Name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Urubuto</Form.Label>
                    <Col sm="9">
                      <Form.Control type="text" onChange={(e) => setUrubuto(e.target.value)} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* --- Adresse --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Adresse</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Form.Label column sm="3">Adresse</Form.Label>
                    <Col sm="5">
                      <Form.Control onChange={(e) => setAddress(e.target.value)} />
                    </Col>
                    <Col sm="4">
                      <Form.Control as="select" onChange={(e) => setNeighborhoodSelected(e.target.value)}>
                        {neighborhoods.map((n) => (
                          <option key={n.SectorId}>{n.Neighborhood}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* --- Famille --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Famille</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Form.Label as="legend" column sm={3}>
                      A-t-il un frère ou une sœur dans l’école ?
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        type="radio"
                        label="Oui"
                        name="hasSibling"
                        value="yes"
                        checked={hasSibling === "yes"}
                        onChange={(e) => setHasSibling(e.target.value)}
                        inline
                      />
                      <Form.Check
                        type="radio"
                        label="Non"
                        name="hasSibling"
                        value="no"
                        checked={hasSibling === "no"}
                        onChange={(e) => setHasSibling(e.target.value)}
                        inline
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Form.Label column sm={3}>Sélectionner l’élève</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="select"
                        value={familyId}
                        onChange={(e) => setFamilyId(JSON.parse(e.target.value))}
                        disabled={hasSibling === "no"}
                      >
                        <option value="">-- Choisir un élève --</option>
                        {students.map((s) => (
                          <option key={s.StudentId} value={JSON.stringify({ FamilyId: s.FamilyId, SiblingId: s.StudentId })}>
                            {s.Firstname} {s.Lastname}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Card.Body>

                {/* FOOTER avec les infos famille */}
                {familyId && (
                  <Card.Footer>
                    <h6 className="fw-bold mb-2">Parents</h6>
                    <ul>
                      {parents
                        .filter((p) => p.FamilyId === parseInt(familyId))
                        .map((p) => (
                          <li key={p.ParentId}>
                            {p.Firstname} {p.Lastname} ({p.Role})
                          </li>
                        ))}
                    </ul>

                    <h6 className="fw-bold mt-3 mb-2">Autres élèves</h6>
                    <ul>
                      {students
                        .filter((s) => s.FamilyId === parseInt(familyId))
                        .map((s) => (
                          <li key={s.StudentId}>
                            {s.Firstname} {s.Lastname}
                          </li>
                        ))}
                    </ul>
                  </Card.Footer>
                )}
              </Card>

              {/* --- Services --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Services</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check label="Cantine 🍽️" onChange={(e) => setCanteen(e.target.checked)} />
                      <Form.Check label="Transport 🚌" onChange={(e) => setTransport(e.target.checked)} />
                    </Col>
                    <Col md={6}>
                      <Form.Check label="ROI signé 📑" onChange={(e) => setRulesSigned(e.target.checked)} />
                      <Form.Check label="Carnet vaccins 💉" onChange={(e) => setVaccinsFile(e.target.checked)} />
                      <Form.Check label="Fiche inscription 📝" onChange={(e) => setRegistrationFileFilled(e.target.checked)} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* --- Activités --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Activités</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check label="Piano 🎹" onChange={(e) => setPiano(e.target.checked)} />
                      <Form.Check label="Guitare 🎸" onChange={(e) => setGuitar(e.target.checked)} />
                    </Col>
                    <Col md={6}>
                      <Form.Check label="Piscine 🏊" onChange={(e) => setSwimmingpool(e.target.checked)} />
                      <Form.Check label="Danse 💃" onChange={(e) => setDanse(e.target.checked)} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* --- Photo --- */}
              <Card className="mb-4 shadow-sm">
                <Card.Header className="fw-bold">Photo</Card.Header>
                <Card.Body>
                  <FileBase64 onDone={(e) => setPicture(e.base64)} />
                </Card.Body>
              </Card>

              {/* --- Bouton --- */}
              <Button variant="primary" size="lg" className="w-100 mt-3" onClick={addStudent}>
                <FontAwesomeIcon icon={faPlus} /> Ajouter l'élève
              </Button>
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
