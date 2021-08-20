import { useState } from "react";
import { Card, Nav } from "react-bootstrap";
import SchoolPresence from "../containers/schoolPresence";
import Kitchen from "./kitchen";
import Transport from "./transport";

export default function Presence(props) {
  const [link, setLink] = useState("school");
  return (
    <div>
      <Card>
        <Card.Header>
          <Nav
            fill
            variant="tabs"
            defaultActiveKey="school"
            onSelect={(e) => setLink(e)}
          >
            <Nav.Item>
              <Nav.Link eventKey="school">Ecole</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="kitchen">Cantine</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="transport">Transport</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Links link={link} />
        </Card.Body>
      </Card>
    </div>
  );
}

function Links(props) {
  switch (props.link) {
    case "kitchen":
      return <Kitchen title="Cantine" />;
    case "transport":
      return <Transport />;
    default:
      return <SchoolPresence />;
  }
}
