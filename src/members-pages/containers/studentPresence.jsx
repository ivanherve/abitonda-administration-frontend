import moment from "moment";
import { useState } from "react";

const { Row, Col } = require("react-bootstrap");
const { default: Calendar } = require("react-calendar");

export default function StudentPresence(props) {
  const [value, onChange] = useState(new Date());
  const mark = ["04-11-2020", "03-11-2020", "05-11-2020", "05-10-2020"];
  return (
    <Row>
      <Col>
        <Calendar
          onChange={onChange}
          value={value}
          tileClassName={({ date, view }) => {
            if (mark.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
              return "highlight";
            }
          }}
        />
      </Col>
      <Col>
        <p>Absences:</p>
        <ul>
          {mark.map((m) => (
            <li key={mark.indexOf(m)}>
              {moment(m, "DD-MM-YYYY").format("Do MMMM YYYY")}
            </li>
          ))}
        </ul>
      </Col>
    </Row>
  );
}
