import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { Modal, Row, Col, Image, Table, Button } from "react-bootstrap";
import pic from "../../img/ppx.jpg";
import logo from "../../img/logo.PNG";
import Pdf from "react-to-pdf";
import { ENDPOINT, getAuthRequest } from "../../links/links";

export default function ShowStudentInfo(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [parents, setParents] = useState([
    {
      Address: "",
      Email: "",
      Firstname: "",
      Lastname: "",
      ParentId: 0,
      PhoneNumb: "",
      StudentId: 0,
    },
  ]);
  const student = props.student;
  const picture = props.picture;
  const ref = useRef();
  const getParents = () => {
    fetch(
      ENDPOINT(`parents?studentid=${student.StudentId}`),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setParents(r.response);
        console.log(r.response);
      });
  };
  useEffect(() => {
    getParents();
  }, [student]);
  return (
    <Modal show={props.show} onHide={props.hide} centered size="lg">
      <Modal.Body ref={ref}>
        <Row>
          <Col xs="9">
            <h2>Fiche d'inscription</h2>
          </Col>
          <Col>
            <Image src={logo} width="150" height="100" rounded />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3">
            <Image src={picture || pic} width="200" height="200" rounded />
            <div>{picture ? "" : "Il manque une photo"}</div>
          </Col>
          <Col xs="9">
            <Table style={{ marginLeft: "10px" }}>
              <tbody>
                <tr>
                  <th>Prénom</th>
                  <td>{student.Firstname}</td>
                </tr>
                <tr>
                  <th>Nom</th>
                  <td>{student.Lastname}</td>
                </tr>
                <tr>
                  <th>Date de naissance</th>
                  <td>{moment(student.Birthdate).format("LL")}</td>
                </tr>
                <tr>
                  <th>Classe</th>
                  <td>{student.Classe}</td>
                </tr>
                <tr>
                  <th>Adresse</th>
                  <td>
                    <i>{student.Neighborhood}</i>
                    <br />
                    {student.Address}
                  </td>
                </tr>
                {parents.map((p) => (
                  <tr>
                    <th>Contact {parents.indexOf(p) + 1}</th>
                    <td>
                      {p.Firstname} {p.Lastname}
                      <br />
                      {p.PhoneNumb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Pdf
          targetRef={ref}
          filename={`${student.Firstname} ${student.Lastname}.pdf`}
        >
          {({ toPdf }) => (
            <Button onClick={toPdf}>Télécharger la fiche d'inscription</Button>
          )}
        </Pdf>
      </Modal.Footer>
    </Modal>
  );
}
