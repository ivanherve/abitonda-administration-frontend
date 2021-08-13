import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  ListGroup,
  Nav,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  Loading,
  postAuthRequestFormData,
} from "../../links/links";
import AddAssistant from "../modals/addAssistant";
import AddTeacher from "../modals/addTeacher";
import DownloadDocsPerClasse from "../modals/downloadDocsPerClasse";

library.add(faDownload, faPlus, faMinus);

export default function Classe(props) {
  const [link, setLink] = useState("link-0");
  const [selectedClasse, setSelectedClasse] = useState("TPS");
  const [students, setStudents] = useState([]);
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const getStudentPerClasse = (classe) => {
    fetch(ENDPOINT("sclasse?classe=" + classe), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          if (r.response.length < 1) setStudents([]);
          else setStudents(r.response);
        } else setStudents([]);
        //console.log(r);
      });
  };

  const getClasses = () => {
    fetch(ENDPOINT("classes"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasses(r.response);
      });
  };

  const switchToNextClass = () => {
    let title = "Êtes-vous sûr ?";
    let description =
      'Cette fonctionalité fait passer tous les élèves en classe supérieur! Si un élève ne doit pas passer en classe supérieur, vous pouvez modifier sa classe dans l\'onglet "Élève"';
    let isOk = {
      title: title,
      text: description,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    };
    swal(isOk).then((ok) => {
      if (ok) {
        // fetch
        fetch(ENDPOINT("passtonextclass"), getAuthRequest(token))
          .then((r) => r.json())
          .then((r) => {
            if (r.status)
              swal(
                "Parfait",
                "Tous les élèves sont passé en classe supérieur",
                "success"
              ).then(() => window.location.reload());
          });
        // swal
      } else {
        swal("Aucune modification n'a été faite");
      }
    });
  };

  //setTimeout(setPresenceLoading(true), 3000);

  useEffect(() => {
    getStudentPerClasse(selectedClasse);
    getClasses();
  }, [selectedClasse]);

  return (
    <div>
      <Row>
        <Col xs="2">
          <ListGroup>
            {classes.map((c) => (
              <ListGroup.Item
                action
                key={classes.indexOf(c)}
                onClick={() => setSelectedClasse(c.Name)}
              >
                {c.Name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <Row>
            <Col>
              <h2>{selectedClasse}</h2>
            </Col>
            <Col>
              <Button
                variant="outline-secondary"
                onClick={() => switchToNextClass()}
                style={{ width: "100%" }}
              >
                Faire passer tout le monde en classe supérieur
              </Button>
            </Col>
          </Row>
          <Card>
            <Card.Header>
              <Nav
                justify
                variant="tabs"
                defaultActiveKey="link-0"
                onSelect={(e) =>
                  e.length > 0 ? setLink(e) : setLink("link-0")
                }
              >
                <Nav.Item>
                  <Nav.Link eventKey="link-0">Présences</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Informations générales</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <div>
              <Links
                link={link}
                students={students}
                classe={selectedClasse}
                presenceLoading={presenceLoading}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function Links(props) {
  if (props.link === "link-0") {
    return (
      <Presence
        students={props.students}
        loading={props.presenceLoading}
        classe={props.classe}
      />
    );
  } else if (props.link === "link-1") {
    return <Informations classe={props.classe} />;
  } else {
    return <div>nothin</div>;
  }
}

function Presence(props) {
  const students = props.students;
  const classe = props.classe;
  const [showDownloadDocsPerClasse, setShowDownloadDocsPerClasse] =
    useState(false);
  if (props.loading) {
    return <Loading />;
  } else
    return (
      <div>
        <Card.Body>
          <Row>
            <Col xs="11">
              <h6>{students.length + " élèves"}</h6>
            </Col>
            <Col>
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Télécharger documents</Tooltip>}
              >
                <Button
                  variant="light"
                  style={{ width: "100%" }}
                  onClick={() => setShowDownloadDocsPerClasse(true)}
                >
                  <FontAwesomeIcon icon={["fas", "download"]} />
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </Card.Body>
        <Table striped bordered hover size="lg" style={{ marginBottom: "0" }}>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={students.indexOf(s)}>
                  <td>
                    <strong>{s.Lastname}</strong> <i>{s.Firstname}</i>
                  </td>
                  {/*
                  <td>
                    <input type="checkbox" disabled />
                  </td>
*/}
                </tr>
              ))
            ) : (
              <tr>
                <td>Il n'y a aucun élève inscrit dans cette classe</td>
                <td>
                  <input type="checkbox" disabled />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {/*
        <Card.Footer>
          <Button disabled>Enregistrer</Button>
        </Card.Footer>
        */}
        <DownloadDocsPerClasse
          show={showDownloadDocsPerClasse}
          hide={() => setShowDownloadDocsPerClasse(false)}
          classe={classe}
        />
      </div>
    );
}

function Informations(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [classeInfo, setClasseInfo] = useState({
    assistants: [{ Assistants: "personne" }],
  });
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  useEffect(() => {
    fetch(ENDPOINT("classes?classe=" + props.classe), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasseInfo(r.response);
        //console.log(r.response);
      });
  }, [props.classe]);

  const removeTeacher = () => {
    let data = new FormData();
    data.append("employeeId", classeInfo.EmployeeId);
    data.append("classeId", classeInfo.ClasseId);
    swal({
      title: "Retirer un enseignant",
      text: `Êtes-vous sûr de vouloir retirer ${classeInfo.Teacher} de la classe de ${props.classe}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(ENDPOINT("removeteacher"), postAuthRequestFormData(data, token))
          .then((r) => r.json())
          .then((r) => {
            if (r.status)
              swal(r.response, {
                icon: "success",
              }).then(() => window.location.reload());
          });
      }
    });
  };

  const removeAssistant = (empId) => {
    let link = ENDPOINT("removeassistant");
    let data = new FormData();
    data.append("employeeId", empId);
    data.append("classeId", classeInfo.ClasseId);
    swal({
      title: "Retirer un assistant",
      text: `Êtes-vous sûr de vouloir cet assistant de la classe`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log(classeInfo.assistants);
        /**/
        fetch(link, postAuthRequestFormData(data, token))
          .then((r) => r.json())
          .then((r) => {
            if (r.status)
              swal(r.response, {
                icon: "success",
              }).then(() => window.location.reload());
          })
          .catch((e) => console.log(e));
      }
    });
  };

  return (
    <Card.Body>
      <div>
        <Row>
          <Col xs="11">
            <h3>
              <u>Enseignant(e)</u>
            </h3>
            {classeInfo.Teacher || "Il n'y a pas d'enseignant"}
          </Col>
          <Col>
            {classeInfo.Teacher ? (
              <Button variant="light" onClick={() => removeTeacher()}>
                <FontAwesomeIcon icon={["fas", "minus"]} />
              </Button>
            ) : (
              <Button variant="light" onClick={() => setShowAddTeacher(true)}>
                <FontAwesomeIcon icon={["fas", "plus"]} />
              </Button>
            )}
          </Col>
        </Row>
        <br />
        <hr />
        <Row>
          <Col xs="10">
            <h5>
              <u>
                <i>Assistant(e)</i>
              </u>
            </h5>
            <ListGroup variant="flush">
              {classeInfo.assistants.length < 1 ? (
                <div>Il n'y a pas d'assistant</div>
              ) : (
                classeInfo.assistants.map((a) => (
                  <ListGroup.Item key={classeInfo.assistants.indexOf(a)}>
                    <Row>
                      <Col xs="10">{a.Assistants}</Col>
                      <Col>
                        <Button
                          variant="light"
                          onClick={() => removeAssistant(a.EmployeeId)}
                        >
                          <FontAwesomeIcon icon={["fas", "minus"]} />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Col>
          <Col xs="2">
            <Button
              variant="light"
              style={{ width: "100%" }}
              onClick={() => setShowAddAssistant(true)}
            >
              <FontAwesomeIcon icon={["fas", "plus"]} />
            </Button>
          </Col>
        </Row>
      </div>
      <AddTeacher
        hide={() => setShowAddTeacher(false)}
        show={showAddTeacher}
        classe={classeInfo}
      />
      <AddAssistant
        hide={() => setShowAddAssistant(false)}
        show={showAddAssistant}
        classe={classeInfo}
      />
    </Card.Body>
  );
}
