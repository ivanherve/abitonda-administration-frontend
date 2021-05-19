import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, ListGroup, Row, Table } from "react-bootstrap";

library.add(faEdit, faPlus);

export default function Transcripts(props) {
  return (
    <Row>
      <Col sm="2">
        <ListGroup>
          <ListGroup.Item>hello</ListGroup.Item>
          <ListGroup.Item>hello</ListGroup.Item>
          <ListGroup.Item>hello</ListGroup.Item>
          <ListGroup.Item>hello</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col sm="10">
        <Card>
          <Card.Header>
            <Row>
              <Col sm="11">
                <Card.Title>Bulletin</Card.Title>
              </Col>
              <Col sm="1">
                <Button variant="outline-success">
                  <FontAwesomeIcon icon={["fas", "plus"]} />
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <RateTable
            module="Mathématiques"
            submodules={[
              "Nombre et calcul",
              "Espace et Géométrie",
              "Grandeur et mesure",
              "Problèmes",
            ]}
          />
          <RateTable
            module="Français"
            submodules={[
              "LECTURE ET EXPRESSION",
              "ORTHOGRAPHE",
              "GRAMMAIRE",
              "CONJUGAISON",
              "LANGAGE ORAL",
              "ECRITURE",
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}

function RateTable(props) {
  return (
    <div>
      <Card.Body>
        <Row>
          <Col sm="10">
            <Card.Title>{props.module}</Card.Title>
          </Col>
          <Col sm="1">
            <Button variant="outline-secondary" style={{ width: "100%" }}>
              <FontAwesomeIcon icon={["fas", "edit"]} />
            </Button>
          </Col>
          <Col sm="1">
            <Button variant="outline-success" style={{ width: "100%" }}>
              <FontAwesomeIcon icon={["fas", "plus"]} />
            </Button>
          </Col>
        </Row>
        <br />
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th></th>
              <th colSpan="3">
                1<sup>er</sup> Trimestre
              </th>
              <th colSpan="3">
                2<sup>ème</sup> Trimestre
              </th>
              <th colSpan="3">
                3<sup>ème</sup> Trimestre
              </th>
            </tr>
            <tr>
              <th></th>
              <th>Évaluation Périodique</th>
              <th>Examen</th>
              <th>TOTAL</th>
              <th>Évaluation Périodique</th>
              <th>Examen</th>
              <th>TOTAL</th>
              <th>Évaluation Périodique</th>
              <th>Examen</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {props.submodules.map((s) => (
              <tr key={props.submodules.indexOf(s)}>
                <th>{s}</th>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
      </Card.Body>
    </div>
  );
}
