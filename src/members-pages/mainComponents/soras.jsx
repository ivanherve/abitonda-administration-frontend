import moment from "moment";
import { useEffect, useState } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";

export default function Soras(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [tabSoras, setTabSoras] = useState([
    {
      StudentId: 0,
      Firstname: "",
      Lastname: "",
      Birthdate: "",
      NewStudent: 0,
      Urubuto: "",
      order: 0,
      Classe: "",
      Sexe: 0,
    },
  ]);
  const getSoras = () => {
    fetch(ENDPOINT("soras"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setTabSoras(r.response);
      });
  };
  useEffect(() => {
    getSoras();
  }, []);

  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Liste SORAS - Rentrée Scolaire</Card.Title>
        </Card.Header>
        <Card.Body>
          <ListGroup as="ol" hover numbered>
            {tabSoras.map((t) => (
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                variant={t.Paid ? "success" : "danger"}
                action
              >
                <div className="ms-2 me-auto">
                  <h5><u>{t.Firstname}</u> <i>{t.Lastname}</i></h5>
                  <strong>Classe : </strong>{t.Classe}
                  <br />
                  <strong>Urubuto : </strong>{t.Urubuto}
                </div>
                <Badge bg="primary" pill>
                  {t.Paid ? "Payé" : "Pas payé"}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

function tabb() {
  return (
    <table striped bordered hover>
      <thead>
        <th>Nom de l'enfant</th>
        <th>Classe</th>
        <th>Urubuto</th>
        <th>Payé</th>
      </thead>
      <tbody>
        <tr bgcolor="#444">
          <td>Jean-Patrick</td>
          <td>CP</td>
          <td>20232045689</td>
          <td>Oui</td>
        </tr>
        <tr color="green">
          <td>Jean-pierre</td>
          <td>CE1</td>
          <td>20317145689</td>
        </tr>
        <tr>
          <td>Pierre-Patrick</td>
          <td>MS</td>
          <td>20232486189</td>
        </tr>
      </tbody>
    </table>
  );
}
