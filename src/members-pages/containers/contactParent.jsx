import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  ENDPOINT,
  getAuthRequest,
  Loading,
  usePrevious,
} from "../../links/links";
import AddParent from "../modals/addParent";
import AddStudent from "../modals/addStudent";

const { Row, Col, Alert, Button } = require("react-bootstrap");

library.add(faPlus, faEdit);

function formatNumb(numb) {
  var res;
  if (numb.length !== 10) res = numb;
  else {
    res =
      numb.substring(0, 4) +
      " " +
      numb.substring(4, 7) +
      " " +
      numb.substring(7, numb.length);
  }
  return res;
}

export default function ContactParent(props) {
  const [showAddParent, setShowAddParent] = useState(false);
  const [parents, setParents] = useState([]);
  const [studentId, setStudentId] = useState(0);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  useEffect(() => {
    if (parents.length < 1)
      fetch(
        ENDPOINT(`parents?studentid=${props.studentId}`),
        getAuthRequest(token)
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.status) {
            setParents(r.response);
            setStudentId(props.studentId);
          }
        });
  }, [parents]);

  return (
    <div>
      <Button
        style={{ width: "100%" }}
        variant="light"
        onClick={() => setShowAddParent(true)}
      >
        <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter un Parent
      </Button>
      {parents.length < 1 ? (
        <div>Il n'y a pas de parents</div>
      ) : (
        parents.map((p) => (
          <div key={parents.indexOf(p)}>
            <hr />
            <Row>
              <Col xs="5">
                <h2>{p.Firstname + " " + p.Lastname}</h2>
                <p>
                  <i>{p.Link}</i>
                </p>
              </Col>
              <Col xs="5">
                <ul>
                  {p.Address && (
                    <li>
                      <u>Adresse</u>: {p.Address}
                    </li>
                  )}
                  {p.Email && (
                    <li>
                      <u>E-mail</u>: <a href={p.Email}>{p.Email}</a>
                    </li>
                  )}
                  {p.PhoneNumb && (
                    <li>
                      <u>Téléphone</u>: {formatNumb(p.PhoneNumb)}
                    </li>
                  )}
                  {p.Profession && (
                    <li>
                      <u>Profession</u>: {p.Profession}
                    </li>
                  )}
                </ul>
              </Col>
              <Col xs="2">
                <Button variant="light" style={{ width: "100%" }}>
                  <FontAwesomeIcon icon={["far", "edit"]} />
                </Button>
              </Col>
            </Row>
          </div>
        ))
      )}
      <AddParent
        show={showAddParent}
        hide={() => setShowAddParent(false)}
        studentId={studentId}
      />
    </div>
  );
}
