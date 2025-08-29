import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequestFormData,
} from "../../links/links";
import AddParent from "../modals/addParent";
import EditParent from "../modals/editParent";

import { Row, Col, Alert, Button, Card } from "react-bootstrap";
// import ReactCountryFlag from "react-country-flag";

library.add(faPlus, faEdit, faTimes);

function formatNumb(numb) {
  if (!numb) return "";
  if (numb.length !== 10) return numb;
  return (
    numb.substring(0, 4) +
    " " +
    numb.substring(4, 7) +
    " " +
    numb.substring(7, numb.length)
  );
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
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera le parent de la liste.",
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
          setParents(r.response || []);
          setStudentId(props.studentId);
          setSelectedParent(r.response?.[0] || selectedParent);
          // console.log(r.response);
        }
      });
  }, [props.studentId]);

  const editSelectedParent = (p) => {
    setShowEditParent(true);
    setSelectedParent(p);
  };

  return (
    <div>
      {/* Bouton ajouter */}
      <Button
        variant="light"
        className="w-100 mb-3"
        onClick={() => setShowAddParent(true)}
      >
        <FontAwesomeIcon icon={["fas", "plus"]} className="me-2" />
        Ajouter un parent
      </Button>

      {/* Liste des parents */}
      {parents.length < 1 ? (
        <Alert variant="info">Aucun parent n’est enregistré pour cet élève.</Alert>
      ) : (
        parents.map((p, index) => (
          <Card key={index} className="mb-3 shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h5 className="fw-bold mb-1">
                    {p.Firstname} {p.Lastname}
                  </h5>
                  <p className="text-muted">
                    <i>{p.Link}</i>
                  </p>

                  <ul className="list-unstyled mb-0">
                    <li>
                      <strong>Langues : </strong> {p.French ? (
                      // <ReactCountryFlag
                      //   countryCode="FR"
                      //   svg
                      //   style={{ width: "1.5em", height: "1.5em" }}
                      // />
                      <div>Français.</div>
                    ) : null}{" "}
                    {p.English ? (
                      // <ReactCountryFlag
                      //   countryCode="GB"
                      //   svg
                      //   style={{ width: "1.5em", height: "1.5em" }}
                      // />
                      <div>Anglais.</div>
                    ) : null}{" "}
                    {p.Kinyarwanda ? (
                      // <ReactCountryFlag
                      //   countryCode="RW"
                      //   svg
                      //   style={{ width: "1.5em", height: "1.5em" }}
                      // />
                      <div>Kinyarwanda</div>
                    ) : null}{" "}
                    </li>
                    {p.Address && (
                      <li>
                        <strong>Adresse :</strong> {p.Address}
                      </li>
                    )}
                    {p.Email && (
                      <li>
                        <strong>Email :</strong>{" "}
                        <a href={`mailto:${p.Email}`}>{p.Email}</a>
                      </li>
                    )}
                    {p.PhoneNumb && (
                      <li>
                        <strong>Téléphone :</strong> {formatNumb(p.PhoneNumb)}
                      </li>
                    )}
                    {p.Profession && (
                      <li>
                        <strong>Profession :</strong> {p.Profession}
                      </li>
                    )}
                  </ul>
                </Col>
                <Col
                  md={4}
                  className="d-flex flex-column justify-content-center align-items-end"
                >
                  <Button
                    variant="light"
                    className="mb-2 w-100"
                    onClick={() => editSelectedParent(p)}
                  >
                    <FontAwesomeIcon icon={["far", "edit"]} className="me-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="light"
                    className="w-100"
                    onClick={() => removeParent(props.studentId, p.ParentId)}
                  >
                    <FontAwesomeIcon icon={["fas", "times"]} className="me-2" />
                    Supprimer
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Modals */}
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
