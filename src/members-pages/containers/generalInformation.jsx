import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { use, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
  Card
} from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import pic from "../../img/ppx.jpg";
import ShowStudentInfo from "../modals/showStudentInfo";
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
  const [loadingPicture, setLoadingPicture] = useState(false);
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
  const [pointDeRamassage, setPointDeRamassage] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [newStudent, setNewStudent] = useState("");
  const [rulesSigned, setRulesSigned] = useState(false);
  const [registrationFileFilled, setRegistrationFileFilled] = useState(false);
  const [vaccinsFile, setVaccinsFile] = useState(false);
  const [paid, setPaid] = useState(false);
  const [sexe, setSexe] = useState(false);
  const [urubuto, setUrubuto] = useState("");

  const [showStudentFile, setShowStudentFile] = useState(false);

  const imgSize = 150;

  setTimeout(() => {
    setLoading(false);
    //console.log(student);
  }, 5000);

  setTimeout(() => {
    setLoading2(false);
  }, 500);

  setTimeout(() => {
    setLoadingPicture(false);
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
    if (newPic !== pic) data.append("Picture", newPic);
    data.append("neighborhood", neighborhoodSelected);
    data.append("address", address);
    data.append("pointDeRamassage", pointDeRamassage);
    data.append("newStudent", newStudent);
    data.append("Canteen", canteen);
    data.append("Transport", transport);
    data.append("Registered", registered);
    data.append("rulesSigned", rulesSigned);
    data.append("registrationFileFilled", registrationFileFilled);
    data.append("vaccinsFile", vaccinsFile);
    data.append("paid", paid);
    data.append("Sexe", sexe);
    data.append("Urubuto", urubuto);

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

    /*console.log(sexe) */
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

  const daysOfWeek = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 7, label: "Dimanche" }
  ];

  const COL_SIZE = 5;

  useEffect(() => {
    if (student.Registered) setRegistered(student.Registered);
    if (student.Canteen) setCanteen(student.Canteen);
    if (student.Transport) setTransport(student.Transport);
    if (student.NewStudent) setNewStudent(student.NewStudent);
    if (student.InternalRulesSigned)
      setRulesSigned(student.InternalRulesSigned);
    if (student.RegistrationFileFilled)
      setRegistrationFileFilled(student.RegistrationFileFilled);
    if (student.VaccinsFile) setVaccinsFile(student.VaccinsFile);
    if (student.Paid) setPaid(student.Paid);
    if (student.Sexe) setSexe(student.Sexe);
    getNeighborhoods();
    getClasses();
    setLoading2(true);
    console.log(student);
  }, [student]);

  useEffect(() => {
    console.log(student.Picture === newPic);
    let data = new FormData();
    data.append("studentId", student.StudentId);
    if (student.Picture) {
      setLoadingPicture(true);
      fetch(ENDPOINT("studentspicture"), postAuthRequestFormData(data, token))
        .then((r) => r.json())
        .then((r) => {
          if (r.status) setNewPic(r.response[0]["Picture"]);
        });
    } else setNewPic(pic);
  }, [student]);

  return loading ? (
    <div className="text-center my-5 fw-bold">Chargement ...</div>
  ) : loading2 ? (
    <Loading />
  ) : (
    <div className="p-3">
      <Row>
        {/* Colonne de gauche : infos principales */}
        <Col xs="3">
          <Card className="shadow-sm mb-3 text-center">
            <Card.Body>
              {loadingPicture ? (
                <Loading />
              ) : (
                <Image
                  src={newPic}
                  width={imgSize}
                  height={imgSize}
                  roundedCircle
                  className="mb-3 shadow"
                />
              )}

              {toEdit && (
                <div className="mb-3">
                  <FileBase64
                    className="form-control"
                    onDone={(e) => setNewPic(e.base64)}
                  />
                </div>
              )}

              <h4 className="fw-bold mb-1">{student.Lastname}</h4>
              <h6 className="text-muted mb-2">{student.Firstname}</h6>
              <div className="fw-semibold text-secondary mb-2" style={{ fontSize: "0.85em" }}>
                Urubuto : {student.Urubuto}
              </div>
              <div className="small text-muted mb-3">
                Inscrit le <strong>{moment(student.created_at).format("DD MMMM YYYY")}</strong>
              </div>

              <Row className="g-2">
                <Col>
                  {toEdit ? (
                    <OverlayTrigger placement="auto" overlay={<Tooltip>Annuler</Tooltip>}>
                      <Button
                        style={{ width: "100%" }}
                        variant="outline-info"
                        onClick={() => setToEdit(false)}
                      >
                        <FontAwesomeIcon icon={["fas", "times"]} />
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger placement="auto" overlay={<Tooltip>Modifier</Tooltip>}>
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
              </Row>

              {!toEdit && (
                <Button
                  variant="light"
                  style={{ width: "100%" }}
                  className="mt-3"
                  onClick={() => setShowStudentFile(true)}
                >
                  Fiche d'inscription{" "}
                  <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} />
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Colonne de droite : formulaire */}
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Form>
                {/* Identité */}
                <h5 className="fw-bold mb-3">Informations personnelles</h5>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextNom">
                  <Form.Label column sm="2">Nom</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      disabled={!toEdit}
                      placeholder={student.Lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPrenom">
                  <Form.Label column sm="2">Prénom</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      disabled={!toEdit}
                      placeholder={student.Firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextUrubuto">
                  <Form.Label column sm="2">Code Urubuto</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      disabled={!toEdit}
                      placeholder={student.Urubuto}
                      onChange={(e) => setUrubuto(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextBirthday">
                  <Form.Label column sm="2">Naissance</Form.Label>
                  <Col sm="6">
                    {!toEdit ? (
                      <Form.Control
                        disabled
                        placeholder={moment(student.Birthdate).format("Do MMMM YYYY")}
                      />
                    ) : (
                      <Form.Control
                        type="date"
                        onChange={(e) => setBirthdate(e.target.value)}
                      />
                    )}
                  </Col>
                  <Form.Label column sm="2">Sexe</Form.Label>
                  <Col sm="2">
                    {!toEdit ? (
                      <Form.Control disabled placeholder={student.Sexe ? "F" : "M"} />
                    ) : (
                      <Form.Control
                        as="select"
                        onChange={(e) => setSexe(e.target.value !== "M")}
                      >
                        <option>M</option>
                        <option>F</option>
                      </Form.Control>
                    )}
                  </Col>
                </Form.Group>

                {/* Adresse */}
                <h5 className="fw-bold mt-4 mb-3">Adresse & Transport</h5>
                <Form.Group as={Row} className="mb-3" controlId="formAddress">
                  <Form.Label column sm="2">Adresse</Form.Label>
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
                      <Form.Control as="select" onChange={(e) => setNeighborhoodSelected(e.target.value)}>
                        {neighborhoods.map((n) => (
                          <option key={n.SectorId}>{n.Neighborhood}</option>
                        ))}
                      </Form.Control>
                    )}
                  </Col>
                </Form.Group>

                {/* Classe */}
                <h5 className="fw-bold mt-4 mb-3">Scolarité</h5>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextClass">
                  <Form.Label column sm="2">Classe</Form.Label>
                  <Col sm="10">
                    {!toEdit ? (
                      <Form.Control disabled placeholder={student.Classe} />
                    ) : (
                      <Form.Control
                        as="select"
                        onChange={(e) => setClasse(e.target.value)}
                      >
                        {allClasses.map((c) => (
                          <option key={allClasses.indexOf(c)}>{c.Name}</option>
                        ))}
                      </Form.Control>
                    )}
                  </Col>
                </Form.Group>

                {/* Cases à cocher */}
                <h5 className="fw-bold mt-4 mb-3">Dossiers & Options</h5>
                <Row>
                  <Col md={6}>
                    {[
                      { label: "Inscription", value: student.Registered, setter: setRegistered },
                      { label: "Nouvel élève", value: student.NewStudent, setter: setNewStudent },
                      { label: "ROI signé", value: student.InternalRulesSigned, setter: setRulesSigned },
                      { label: "Fiche d'inscription", value: student.RegistrationFileFilled, setter: setRegistrationFileFilled },
                      { label: "Carnet vaccination", value: student.VaccinsFile, setter: setVaccinsFile },
                    ].map((item, idx) => (
                      <Form.Group as={Row} key={idx} className="mb-2">
                        <Form.Label column sm="8">{item.label}</Form.Label>
                        <Col sm="4" className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            disabled={!toEdit}
                            defaultChecked={item.value}
                            onChange={(e) => item.setter(e.target.checked)}
                          />
                        </Col>
                      </Form.Group>
                    ))}
                  </Col>
                  <Col md={6}>
                    {[
                      { label: "Cantine", value: student.Canteen, setter: setCanteen },
                      { label: "Transport", value: student.Transport, setter: setTransport },
                      { label: "Payé", value: student.Paid, setter: setPaid },
                    ].map((item, idx) => (
                      <Form.Group as={Row} key={idx} className="mb-2">
                        <Form.Label column sm="8">{item.label}</Form.Label>
                        <Col sm="4" className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            disabled={!toEdit}
                            defaultChecked={item.value}
                            onChange={(e) => item.setter(e.target.checked)}
                          />
                        </Col>
                      </Form.Group>
                    ))}
                  </Col>
                </Row>

                {/* Allergies */}
                <h5 className="fw-bold mt-4 mb-3">Santé</h5>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextAllergies">
                  <Form.Label column sm="4">Allergies</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="textarea"
                      disabled={!toEdit}
                      onChange={(e) => setAllergies(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                {/* Bouton sauvegarde */}
                {toEdit && (
                  <div className="text-end">
                    <Button variant="outline-primary" onClick={() => editStudent()}>
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ShowStudentInfo
        show={showStudentFile}
        student={student}
        hide={() => setShowStudentFile(false)}
        picture={newPic}
      />
    </div>
  );

}

/*
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});
*/
