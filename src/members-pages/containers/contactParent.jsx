import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest, postAuthRequestFormData
} from "../../links/links";
import AddParent from "../modals/addParent";
import EditParent from "../modals/editParent";

const { Row, Col, Alert, Button } = require("react-bootstrap");

library.add(faPlus, faEdit, faTimes);

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
  const [showEditParent, setShowEditParent] = useState(false);
  const [selectedParent, setSelectedParent] = useState({
    Firstname: "",
    Lastname: "",
  });

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const removeParent = (studentId, parentId) => {
    let data = new FormData();
    data.append("studentId", studentId);
    data.append("parentId", parentId);
    swal({
      title: "Êtes-vous sûr?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(
          ENDPOINT("removelinkparent"),
          postAuthRequestFormData(data, token)
        )
          .then((r) => r.json())
          .then((r) => {
            if (r.status)
              swal("Le contact a bien été retiré", {
                icon: "success",
              }).then(() => window.location.reload());
          });
      }
    });
  };

  useEffect(() => {
    fetch(
      ENDPOINT(`parents?studentid=${props.studentId}`),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          if (r.response.length < 1) setParents([]);
          setParents(r.response);
          setStudentId(props.studentId);
          setSelectedParent(r.response[0] || selectedParent);
        }
      });
  }, [props.studentId]);

  const editSelectedParent = (p) => {
    setShowEditParent(true);
    setSelectedParent(p);
  };

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
                <Row>
                  <Button
                    variant="light"
                    style={{ width: "100%" }}
                    onClick={() => editSelectedParent(p)}
                  >
                    <FontAwesomeIcon icon={["far", "edit"]} />
                  </Button>
                </Row>
                <Row>
                  <Button
                    variant="light"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => removeParent(props.studentId, p.ParentId)}
                  >
                    <FontAwesomeIcon icon={["fas", "times"]} />
                  </Button>
                </Row>
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
      <EditParent
        show={showEditParent}
        hide={() => setShowEditParent(false)}
        parent={selectedParent}
      />
    </div>
  );
}
