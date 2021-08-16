import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import pic from "../../img/ppx.jpg";
import {
  ENDPOINT,
  getAuthRequest,
  Loading,
  postAuthRequestFormData,
} from "../../links/links";

library.add(faEdit, faTimes, faArrowCircleDown);

export default function GeneralInformation(props) {
  const [toEdit, setToEdit] = useState(false);
  const [showBirthDayAlert, setShowBirthDayAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [newPic, setNewPic] = useState(pic);

  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [classe, setClasse] = useState("");
  const [allergies, setAllergies] = useState("");
  const [canteen, setCanteen] = useState(false);
  const [transport, setTransport] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState([
    { SectorId: 0, Neighborhood: "District - Sector" },
  ]);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState("");
  const [address, setAddress] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  setTimeout(() => {
    setLoading(false);
    //console.log(student);
  }, 5000);

  setTimeout(() => {
    setLoading2(false);
  }, 500);

  const student = props.student;

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const editStudent = () => {
    let data = new FormData();
    data.append("studentId", student.StudentId);
    data.append("lastname", lastname);
    data.append("firstname", firstname);
    data.append("birthdate", birthdate);
    data.append("classe", classe);
    data.append("allergies", allergies);
    data.append("Canteen", canteen);
    data.append("Transport", transport);
    data.append("Registered", registered);
    data.append("Picture", newPic);
    data.append("neighborhood", neighborhoodSelected);
    data.append("address", address);
    data.append("newStudent", newStudent);
    fetch(ENDPOINT("editstudent"), postAuthRequestFormData(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else {
          swal("Oups!", "Une erreur s'est produit", "warning");
          console.log(r);
        }
      });
  };

  const getNeighborhoods = () => {
    fetch(ENDPOINT("neighborhoods"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          setNeighborhoods([{ SectorId: 0, Neighborhood: "" }, ...r.response]);
      });
  };

  const getClasses = () => {
    fetch(ENDPOINT("classes"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setAllClasses([{ Name: "" }, ...r.response]);
        console.log(r.response);
      });
  };

  useEffect(() => {
    if (student.Registered) setRegistered(student.Registered);
    if (student.Canteen) setCanteen(student.Canteen);
    if (student.Transport) setTransport(student.Transport);
    getNeighborhoods();
    getClasses();
    setLoading2(true);
  }, [student]);

  useEffect(() => {
    console.log(student.Picture === newPic);
    if (student.Picture) setNewPic(student.Picture);
    //else setNewPic(pic);
  }, [student]);

  return loading ? (
    <div>Chargement ...</div>
  ) : loading2 ? (
    <Loading />
  ) : (
    <div>
      <Row>
        <Col xs="3">
          <Image src={newPic} width="200" height="200" rounded />
          <br />
          {toEdit && (
            <div style={{ width: "100%" }}>
              <FileBase64
                className="form-control"
                onDone={(e) => setNewPic(e.base64)}
              />
            </div>
          )}
          <hr />
          <h4>{student.Lastname}</h4>
          <h6>
            <i>{student.Firstname}</i>
          </h6>
          <Row>
            <Col>
              {toEdit ? (
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Annuler</Tooltip>}
                >
                  <Button
                    style={{ width: "100%" }}
                    variant="outline-info"
                    onClick={() => setToEdit(false)}
                  >
                    <FontAwesomeIcon icon={["fas", "times"]} />
                  </Button>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Modifier</Tooltip>}
                >
                  <Button
                    style={{ width: "100%" }}
                    variant="light"
                    onClick={() => setToEdit(true)}
                  >
                    <FontAwesomeIcon icon={["far", "edit"]} />
                  </Button>
                </OverlayTrigger>
              )}
            </Col>
            <Col>
              {/*!toEdit && (
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Désinscrire</Tooltip>}
                >
                  <Button style={{ width: "100%" }} variant="light">
                    <FontAwesomeIcon icon={["fas", "times"]} />
                  </Button>
                </OverlayTrigger>
              )*/}
            </Col>
          </Row>
          <br />
          {/*!toEdit && (
            <Button variant="light" style={{ width: "100%" }}>
              Fiche d'inscription{" "}
              <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} />
            </Button>
          )*/}
        </Col>
        <Col>
          <Form>
            <Form.Group as={Row} controlId="formPlaintextNom">
              <Form.Label column sm="2">
                Nom
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  disabled={!toEdit}
                  placeholder={student.Lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPrenom">
              <Form.Label column sm="2">
                Prénom
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  disabled={!toEdit}
                  placeholder={student.Firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextBirthday">
              <Form.Label column sm="2">
                Date de naissance
              </Form.Label>
              <Col sm="10">
                {!toEdit ? (
                  <Form.Control
                    disabled
                    placeholder={moment(student.Birthdate).format(
                      "Do MMMM YYYY"
                    )}
                  />
                ) : (
                  <Form.Control
                    type="date"
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formAddress">
              <Form.Label column sm="2">
                Adresse
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!toEdit}
                  placeholder={student.Address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Col>
              <Col sm="5">
                {!toEdit ? (
                  <Form.Control disabled placeholder={student.Neighborhood} />
                ) : (
                  <Form.Control
                    as="select"
                    onChange={(e) => setNeighborhoodSelected(e.target.value)}
                  >
                    {neighborhoods.map((n) => (
                      <option key={n.SectorId}>{n.Neighborhood}</option>
                    ))}
                  </Form.Control>
                )}
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId="formPlaintextClass">
              <Form.Label column sm="2">
                Classe
              </Form.Label>
              <Col sm="10">
                {!toEdit ? (
                  <Form.Control disabled placeholder={student.Classe} />
                ) : (
                  <Form.Control
                    as="select"
                    disabled={!toEdit}
                    placeholder="CP"
                    onChange={(e) => setClasse(e.target.value)}
                  >
                    {allClasses.map((c) => (
                      <option key={allClasses.indexOf(c)}>{c.Name}</option>
                    ))}
                  </Form.Control>
                )}
              </Col>
            </Form.Group>
            
            <hr />
            <Form.Group as={Row} controlId="formPlaintextRegistering">
              <Form.Label column sm="2">
                Inscription
              </Form.Label>
              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  disabled={!toEdit}
                  defaultChecked={student.Registered}
                  onChange={(e) => setRegistered(e.target.checked)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextNewStudent">
              <Form.Label column sm="2">
                Nouvel élève
              </Form.Label>
              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  disabled={!toEdit}
                  defaultChecked={student.NewStudent}
                  onChange={(e) => setNewStudent(e.target.checked)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextCantine">
              <Form.Label column sm="2">
                Cantine
              </Form.Label>
              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  disabled={!toEdit}
                  defaultChecked={student.Canteen}
                  onChange={(e) => setCanteen(e.target.checked)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextTransport">
              <Form.Label column sm="2">
                Transport
              </Form.Label>
              <Col sm="1">
                <Form.Check
                  type="checkbox"
                  disabled={!toEdit}
                  defaultChecked={student.Transport}
                  onChange={(e) => setTransport(e.target.checked)}
                />
              </Col>
            </Form.Group>
            <hr />
{/*
            <Form.Group as={Row} controlId="formPlaintextExtraActivities">
              <Form.Label column sm="4">
                Activités Parascolaires
              </Form.Label>
              <Col sm="8">
                <Form.Control as="select" disabled={!toEdit}>
                  <option>Aucun</option>
                  <option>Karaté</option>
                  <option>Piscine</option>
                  <option>Dance Traditionelle</option>
                  <option>Musique</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId="formPlaintextGarde">
              <Form.Label column sm="4">
                Mode de garde *
              </Form.Label>
              <Col sm="8">
                <Form.Check
                  type="radio"
                  label="Journée"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios1"
                  disabled={!toEdit}
                />
                <Form.Check
                  type="radio"
                  label="Demi-journée"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios2"
                  disabled={!toEdit}
                />
              </Col>
            </Form.Group>
*/}
            <Form.Group as={Row} controlId="formPlaintextAllergies">
              <Form.Label column sm="4">
                Allergies
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="textarea"
                  disabled={!toEdit}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </Col>
            </Form.Group>
            <hr />
            {toEdit && (
              <Button variant="outline-primary" onClick={() => editStudent()}>
                Sauvegarder
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </div>
  );
}
