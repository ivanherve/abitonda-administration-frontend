import moment from "moment";
import { useState, useEffect } from "react";
import { Card, Nav, Table } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";

export default function Birthday(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [key, setKey] = useState("coming");
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Anniversaire</Card.Title>
          <Nav
            fill
            variant="tabs"
            defaultActiveKey="coming"
            onSelect={(e) => setKey(e)}
          >
            <Nav.Item>
              <Nav.Link eventKey="coming">Anniversaire à venir</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="past">Anniversaire Passé</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Bday eventkey={key} />
        </Card.Body>
      </Card>
    </div>
  );
}

function Bday(props) {
  if (props.eventkey === "past") return <PastBday />;
  else return <ComingBday />;
}

function PastBday(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [bdays, setBdays] = useState([]);
  useEffect(() => {
    fetch(ENDPOINT("pastbday"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => setBdays(r.response));
  }, []);
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Élève</th>
          <th>Date d'anniversaire</th>
          <th>Âge</th>
        </tr>
      </thead>
      <tbody>
        {bdays.map((b) => (
          <tr key={bdays.indexOf(b)}>
            <td>
              <strong>{b.Firstname}</strong> {b.Lastname}
            </td>
            <td>{moment(b.BirthDay).format("Do MMMM")}</td>
            <td>{b.Age} ans</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function ComingBday(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [bdays, setBdays] = useState([]);
  useEffect(() => {
    fetch(ENDPOINT("comingbday"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => setBdays(r.response));
  }, []);
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Élève</th>
          <th>Date d'anniversaire</th>
          <th>Âge</th>
        </tr>
      </thead>
      <tbody>
        {bdays.map((b) => (
          <tr key={bdays.indexOf(b)}>
            <td>
              <strong>{b.Firstname}</strong> {b.Lastname}
            </td>
            <td>{moment(b.BirthDay).format("Do MMMM")}</td>
            <td>{b.Age} ans</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
