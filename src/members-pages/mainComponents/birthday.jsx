import { useState } from "react";
import { Card, Nav } from "react-bootstrap";

export default function Birthday(props) {
  const [key, setKey] = useState("past");
  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>Anniversaire</Card.Title>
          <Nav
            fill
            variant="tabs"
            defaultActiveKey="past"
            onSelect={(e) => setKey(e)}
          >
            <Nav.Item>
              <Nav.Link eventKey="past">Anniversaire Passé</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="coming">Anniversaire à venir</Nav.Link>
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
  if (props.eventkey === "past") return <div>past birthdays</div>;
  else return <div>coming birthdays</div>;
}
