import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

library.add(faArrowAltCircleLeft, faArrowAltCircleRight);

export default function DailyPresenceKitchen(props) {
  const [today, setToday] = useState(new Date());
  const yesterday = () => {
    let mainDate = today;
    mainDate.setDate(mainDate.getDate() - 1);
    setToday(mainDate);
  };
  const tommorow = () => {
    let mainDate = today;
    mainDate.setDate(mainDate.getDate() + 1);
    setToday(mainDate);
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col xs lg="1">
          <Button variant="light" onClick={() => yesterday()}>
            <FontAwesomeIcon icon={["fas", "arrow-alt-circle-left"]} />
          </Button>
        </Col>
        <Col md="auto">
          <h2>{moment(today).format("Do MMMM YYYY")}</h2>
        </Col>
        <Col xs lg="1">
          <Button variant="light" onClick={() => tommorow()}>
            <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} />
          </Button>
        </Col>
      </Row>
      <br />
      <label>Tout séléctionner</label>
      <input type="checkbox" />
      <br />
      <Table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Présent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark Otto</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Jacob Thornton</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Mark Otto</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Jacob Thornton</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Mark Otto</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Jacob Thornton</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Mark Otto</td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
