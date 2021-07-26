import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Nav, Row, Table } from "react-bootstrap";
import swal from "sweetalert";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";

//const classes = ["TPS", "PS", "MS", "GS", "CP", "CE1"];

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
      <Presence students={props.students} loading={props.presenceLoading} />
    );
  } else if (props.link === "link-1") {
    return <Informations classe={props.classe} />;
  } else {
    return <div>nothin</div>;
  }
}

function Presence(props) {
  const students = props.students;
  if (props.loading) {
    return <Loading />;
  } else
    return (
      <div>
        <Card.Body>
          <h6>
            {
              /*Tout séléctionner <input type="checkbox" />*/
              students.length + " élèves"
            }
          </h6>
        </Card.Body>
        <Table striped bordered hover size="lg" style={{ marginBottom: "0" }}>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={students.indexOf(s)}>
                  <td>
                    <strong>{s.Lastname}</strong> <i>{s.Firstname}</i>
                  </td>
                  <td>
                    <input type="checkbox" disabled />
                  </td>
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
        <Card.Footer>
          <Button disabled>Enregistrer</Button>
        </Card.Footer>
      </div>
    );
}

function Informations(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [classeInfo, setClasseInfo] = useState([]);
  useEffect(() => {
    fetch(ENDPOINT("classes?classe=" + props.classe), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setClasseInfo(r.response[0]);
      });
  }, [props.classe]);

  return (
    <Card.Body>
      <h2>{props.classe}</h2>
      <div>
        <h3>
          <u>Enseignant(e)</u>
        </h3>
        {classeInfo.Teacher || "Il n'y a pas d'enseignant"}
        <br />
        <h5>
          <u>
            <i>Assistant(e)</i>
          </u>
        </h5>
        <ul>
          {classeInfo.length < 1 ? (
            <div>Chargement ...</div>
          ) : classeInfo.assistants.length < 1 ? (
            <div>Pas d'assistant</div>
          ) : (
            classeInfo.assistants.map((a) => (
              <li key={classeInfo.assistants.indexOf(a)}>{a.Assistants}</li>
            ))
          )}
        </ul>
      </div>
    </Card.Body>
  );
}
