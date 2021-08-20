import { useState } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import AnnualPresenceKitchen from "../containers/annualPresenceKitchen";
import DailyPresenceKitchen from "../containers/dailyPresenceKitchen";

export default function Kitchen(props) {
  const [link, setLink] = useState("first");
  return (
    <div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="day">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="day">Présences Aujourd'hui</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="year">Présences Annuelles</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="day" defaultActiveKey>
                    <DailyPresenceKitchen />
                  </Tab.Pane>
                  <Tab.Pane eventKey="year">
                    <AnnualPresenceKitchen />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
