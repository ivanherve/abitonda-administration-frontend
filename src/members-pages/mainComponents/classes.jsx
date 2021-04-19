import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Nav, Row, Table } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";

const classes = ["TPS", "PS", "MS", "GS", "CP", "CE1"];

export default function Classe(props) {
  const [link, setLink] = useState("link-0");
  const [selectedClasse, setSelectedClasse] = useState("TPS");
  const [students, setStudents] = useState([]);
  const [presenceLoading, setPresenceLoading] = useState(false);

  const getStudentPerClasse = (classe) => {
    const token = JSON.parse(sessionStorage.getItem("userData")).token
      .Api_token;
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

  //setTimeout(setPresenceLoading(true), 3000);

  useEffect(() => {
    getStudentPerClasse(selectedClasse);
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
                onClick={() => setSelectedClasse(c)}
              >
                {c}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <h2>{selectedClasse}</h2>
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
          Tout séléctionner <input type="checkbox" />
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
                    <input type="checkbox" />
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
          <Button>Enregistrer</Button>
        </Card.Footer>
      </div>
    );
}

function Informations(props) {
  return (
    <Card.Body>
      <h2>{props.classe}</h2>
      <div>
        <h3>
          <u>Enseignant(e)</u>
        </h3>
        Jean-Pierre Dubois
        <br />
        <h5>
          <u>
            <i>Assistant(e)</i>
          </u>
        </h5>
        Julie Dubois
      </div>
    </Card.Body>
  );
}
