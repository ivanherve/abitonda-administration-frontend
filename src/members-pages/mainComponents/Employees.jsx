import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import AddEmployee from "../modals/addEmployee";
import EditEmployee from "../modals/editEmployee";

library.add(faPlus, faEdit);

const numbFormat = (number) => {
  let numb = parseInt(number);
  let format = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(numb);
  return format;
};

export default function Employees(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const [loading, setLoading] = useState(false);
  const emp = [
    {
      EmployeeId: 0,
      Lastname: "",
      Firstname: "",
      Account: "",
      Bank: "",
      Position: [],
      NbDays: 0,
      NbRSSB: "",
      Doc: [],
    },
  ];

  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(emp[0]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);

  const getEmployees = () => {
    fetch(ENDPOINT("employees"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          setEmployees(r.response);
          setEmployee(r.response[0]);
        }
      });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div>
      {/**/}
      <Row>
        <Col sm="12">
          <Button
            style={{ width: "100%" }}
            variant="outline-success"
            onClick={() => setShowAddEmployee(true)}
          >
            <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter un employé
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs="2">
          <ListGroup>
            {employees.map((e) => (
              <ListGroup.Item
                action
                variant={e.isEmployed ? 'success' : 'danger'}
                key={employees.indexOf(e)}
                onClick={() => setEmployee(e)}
              >
                <strong>{e.Firstname.toUpperCase()}</strong> {e.Lastname}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Row>
                <Col sm="11">
                  <Card.Title>{`${
                    employee.Firstname
                  } ${employee.Lastname.toUpperCase()}`}</Card.Title>
                </Col>
                <Col sm="1">
                  <Button
                    variant="outline-info"
                    onClick={() => setShowEditEmployee(true)}
                  >
                    <FontAwesomeIcon icon={["far", "edit"]} />
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}></th>
                    <th>
                      <h3>
                        {`${
                          employee.Firstname
                        } ${employee.Lastname.toUpperCase()}`}
                      </h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(employee).map((e) => (
                    <tr key={e}>
                      <td>
                        <strong>{e !== "EmployeeId" && e}</strong>
                      </td>
                      {e === "Position" ? (
                        <td>
                          {Object.values(employee)[
                            Object.keys(employee).indexOf(e)
                          ].map((p) => (
                            <Badge
                              pill
                              variant="secondary"
                              style={{
                                marginRight: "10px",
                                fontSize: "0.9em",
                              }}
                            >
                              {p}
                            </Badge>
                          ))}
                        </td>
                      ) : e === "Doc" ? (
                        <td>
                          {Object.values(employee)[
                            Object.keys(employee).indexOf(e)
                          ].map((p) => (
                            <Badge
                              pill
                              variant="info"
                              style={{
                                marginRight: "10px",
                                fontSize: "0.9em",
                              }}
                            >
                              {p}
                            </Badge>
                          ))}
                        </td>
                      ) : (
                        <td>
                          {e !== "EmployeeId" &&
                            Object.values(employee)[
                              Object.keys(employee).indexOf(e)
                            ]}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AddEmployee
        show={showAddEmployee}
        hide={() => setShowAddEmployee(false)}
      />
      <EditEmployee
        show={showEditEmployee}
        hide={() => setShowEditEmployee(false)}
        employee={employee}
      />
    </div>
  );
}
