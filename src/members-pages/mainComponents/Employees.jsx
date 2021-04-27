import { useState } from "react";
import { Card, Col, Form, ListGroup, Row } from "react-bootstrap";

const numbFormat = (number) => {
  let numb = parseInt(number);
  let format = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(numb);
  return format;
};

export default function Employees(props) {
  const emp = [
    {
      EmployeeId: 1,
      Name: "Hategekimana",
      Firstname: "Protais",
      Account: "0130-2043600",
      Bank: "COGEBANK",
      SalaireNet: "100000",
      SalaireBrut: "",
      Avance: "7000",
      Difference: "93000",
      Position: "Chauffeur/Coursier",
      NbDays: 22,
      NbRSSB: "",
      Doc: "",
    },
    {
      EmployeeId: 2,
      Name: "Irakoze",
      Firstname: "Belyse",
      Account: "00048-06790820-06",
      Bank: "BK",
      SalaireNet: "200000",
      SalaireBrut: "",
      Avance: "48500",
      Difference: "151000",
      Position: "Enseignante",
      NbDays: 22,
      NbRSSB: "",
      Doc: "",
    },
    {
      EmployeeId: 3,
      Name: "Bahati",
      Firstname: "Sophia",
      Account: "00040-65000020-29",
      Bank: "BK",
      SalaireNet: "100000",
      SalaireBrut: "",
      Avance: "3500",
      Difference: "96500",
      Position: "Assistante Crèche",
      NbDays: 22,
      NbRSSB: "",
      Doc: "",
    },
    {
      EmployeeId: 4,
      Name: "Kayumba",
      Firstname: "Leaty",
      Account: "00002-01390241612-83",
      Bank: "COGEBANK",
      SalaireNet: "300000",
      SalaireBrut: "",
      Avance: "68500",
      Difference: "231500",
      Position: "Responsable Adm et Fin",
      NbDays: 22,
      NbRSSB: "10216978",
      Doc: "",
    },
  ];
  const [surname, setSurname] = useState("");
  const [firstname, setfirstname] = useState("");
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [sNet, setSNet] = useState("");
  const [sBrut, setSBrut] = useState("");
  const [difference, setDifference] = useState("");
  const [position, setPosition] = useState("");
  const [nbDays, setNbDays] = useState("");
  const [nbRSSB, setNbRSSB] = useState("");
  const [doc, setDoc] = useState("");

  const selectEmployee = (e) => {
    setSurname(e.Name);
    setfirstname(e.Firstname);
    setAccount(e.Account);
    setBank(e.Bank);
    setSNet(e.SalaireNet);
    setSBrut(e.SalaireBrut);
    setDifference(e.Difference);
    setPosition(e.Position);
    setNbDays(e.NbDays);
    setNbRSSB(e.NbRSSB);
    setDoc(e.Doc);
  };

  return (
    <div>
      <Row>
        <Col xs="2">
          <ListGroup>
            {emp.map((e) => (
              <ListGroup.Item
                action
                key={emp.indexOf(e)}
                onClick={() => selectEmployee(e)}
              >
                <strong>{e.Name.toUpperCase()}</strong> {e.Firstname}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>{`${firstname} ${surname.toUpperCase()}`}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group as={Row} controlId="formPlaintextAccount">
                  <Form.Label column sm="2">
                    Numéro de compte
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={account} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextBank">
                  <Form.Label column sm="2">
                    Banque
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={bank} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextSNet">
                  <Form.Label column sm="2">
                    Salaire/Net
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={numbFormat(sNet)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextSBrut">
                  <Form.Label column sm="2">
                    Salaire/Brut
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={sBrut} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextDifference">
                  <Form.Label column sm="2">
                    Différence
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={difference}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextPosition">
                  <Form.Label column sm="2">
                    Poste Occupé
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={position} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextNbDays">
                  <Form.Label column sm="2">
                    Nombre de jours
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={nbDays} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextNbRSSB">
                  <Form.Label column sm="2">
                    Nombre de RSSB
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={nbRSSB} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextDoc">
                  <Form.Label column sm="2">
                    Documents Remis
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={doc} />
                  </Col>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
