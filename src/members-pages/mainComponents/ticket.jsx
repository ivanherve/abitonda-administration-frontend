import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export default function Ticket(props) {
  const [nbAdultsPlus, setNbAdultsPlus] = useState(0);
  const [nbKidsPlus, setNbKidsPlus] = useState(0);
  const [nbPersonSimple, setNbPersonSimple] = useState(0);
  const [results, setResults] = useState(0);
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Vente de Ticket</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <fieldset>
              <Form.Group as={Row} controlId="formPlaintextLastname">
                <Form.Label column sm="2">
                  Nombre d'adultes ++ (10 000 RWF)
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    min="0"
                    onChange={(e) => setNbAdultsPlus(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextLastname">
                <Form.Label column sm="2">
                  Nombre d'enfant ++ (8 000 RWF)
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    min="0"
                    onChange={(e) => setNbKidsPlus(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextLastname">
                <Form.Label column sm="2">
                  Nombre de personnes simple (5000 RWF)
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    min="0"
                    onChange={(e) => setNbPersonSimple(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Button
                onClick={() =>
                  setResults(
                    CalculeTicket(nbAdultsPlus, nbKidsPlus, nbPersonSimple)
                  )
                }
              >
                CALCULER
              </Button>
            </fieldset>
          </Form>
        </Card.Body>
        <Card.Footer>
          <h2>
            Il faut payer{" "}
            <strong>
              <u>{results.r}</u> RWF
            </strong>
            .
          </h2>
          <br />
          <div style={{ fontSize: "1.2em" }}>
            Et distribuer :
            <ul>
              <li>
                <strong>{results.plus}</strong> tickets plus pack ++
              </li>
              <li>
                <strong>{results.ps}</strong> tickets normaux
              </li>
            </ul>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

function CalculeTicket(adultePlus, enfantPlus, personSimple) {
  // Convertir les valeurs d'entrée en nombres entiers au cas où elles seraient des chaînes de caractères
  adultePlus = parseInt(adultePlus);
  enfantPlus = parseInt(enfantPlus);
  personSimple = parseInt(personSimple);

  let amountAdultePlus = adultePlus * 10000;
  let amountEnfantPlus = enfantPlus * 8000;
  let amountPersonSimple = personSimple * 5000;

  let results = amountAdultePlus + amountEnfantPlus + amountPersonSimple;

  // Additionner correctement les valeurs d'adultePlus et d'enfantPlus
  let nbPlusTicket = adultePlus + enfantPlus;

  let message = {
    r: results, // Total du prix des tickets
    ap: adultePlus, // Nombre de tickets adulte "plus"
    ep: enfantPlus, // Nombre de tickets enfant "plus"
    plus: nbPlusTicket, // Nombre total de tickets "plus"
    ps: personSimple, // Nombre de tickets simples
  };

  return message;
}
