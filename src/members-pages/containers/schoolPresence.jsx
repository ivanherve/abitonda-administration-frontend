import { Button, Col, Row, Table } from "react-bootstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import AddStudent from "../modals/addStudent";

library.add(faArrowAltCircleLeft, faArrowAltCircleRight);

export default function SchoolPresence(props) {
  const [today, setToday] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  useEffect(() => {
    fetch(ENDPOINT("students"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setStudents(r.response);
      });
  }, []);

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
      <Button
        variant="outline-success"
        style={{ width: "100%" }}
        onClick={() => setShowAddStudent(true)}
      >
        Ajouter un élève <FontAwesomeIcon icon={["fas", "plus"]} />
      </Button>
      <br />
      <div style={{ overflowX: "auto", maxHeight: "650px" }}>
        <Table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Présent</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={students.indexOf(s)}>
                  <td>
                    <strong>{s.Lastname}</strong> <i>{s.Firstname}</i>
                  </td>
                  <td>
                    <input type="checkbox" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Chargement...</td>
              </tr>
            )}
          </tbody>
          <AddStudent
            show={showAddStudent}
            hide={() => setShowAddStudent(false)}
          />
        </Table>
      </div>
    </div>
  );
}
