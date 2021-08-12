import { useEffect } from "react";
import { useState } from "react";
import { Alert, Button, ListGroup, Modal } from "react-bootstrap";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequestFormData,
} from "../../links/links";

export default function AddAssistant(props) {
  const [employees, setEmployees] = useState([
    { EmployeeId: 0, Firstname: "", Lastname: "" },
  ]);
  const [empSelected, setEmpSelected] = useState({
    EmployeeId: 0,
    Firstname: "aucun assistant séléctionné",
    Lastname: "",
  });
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const getEmployees = () => {
    fetch(ENDPOINT("employees"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setEmployees(r.response);
      });
  };
  const addAssistant = () => {
    let data = new FormData();
    data.append("employeeId", empSelected.EmployeeId);
    data.append("classeId", props.classe.ClasseId);
    fetch(ENDPOINT("addassistant"), postAuthRequestFormData(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", "L'enseignant a bien été ajouté", "success").then(
            () => window.location.reload()
          );
      });
  };
  useEffect(() => {
    getEmployees();
  }, []);
  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un assistant</Modal.Title>
      </Modal.Header>
      <Alert variant="warning">
        <h6>
          <i>
            {empSelected.Firstname} {empSelected.Lastname}
          </i>
        </h6>
      </Alert>
      <ListGroup variant="flush">
        {employees.map((e) => (
          <ListGroup.Item
            key={employees.indexOf(e)}
            action
            onClick={() =>
              setEmpSelected({
                EmployeeId: e.EmployeeId,
                Firstname: e.Firstname,
                Lastname: e.Lastname,
              })
            }
          >
            {e.Firstname} {e.Lastname}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Modal.Footer>
        <Button onClick={() => addAssistant()}>Confirmer</Button>
      </Modal.Footer>
    </Modal>
  );
}
