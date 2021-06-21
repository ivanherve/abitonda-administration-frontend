import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddEmployee from "../modals/addEmployee";
import EditEmployee from "../modals/editEmployee";
import {
  Badge,
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { ENDPOINT, getAuthRequest } from "../../links/links";

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
  const emp = [
    {
      EmployeeId: 1,
      Lastname: "Hategekimana",
      Firstname: "Protais",
      Account: "0130-2043600",
      Bank: "COGEBANK",
      Position: ["Chauffeur/Coursier"],
      NbDays: 22,
      NbRSSB: "3101046700000S",
      Doc: ["Certificat Formation", "Diplôme Secondaire"],
    },
    {
      EmployeeId: 2,
      Lastname: "Irakoze",
      Firstname: "Belyse",
      Account: "00048-06790820-06",
      Bank: "BK",
      Position: ["Enseignante", "Responsable Maternelle"],
      NbDays: 22,
      NbRSSB: "",
      Doc: [
        "Certificat Formation",
        "Diplôme Secondaire",
        "Attestion de Service PTS",
        "Attestion de Service Les poussins",
        "Attestion de Service EBK",
        "Attestion de Service EFASE",
      ],
    },
    {
      EmployeeId: 3,
      Lastname: "Bahati",
      Firstname: "Sophia",
      Account: "00040-65000020-29",
      Bank: "BK",
      Position: ["Assistante Crèche", "Job 2"],
      NbDays: 22,
      NbRSSB: "3101046700000S",
      Doc: ["Diplôme secondaire", "Bachelor en pédagogie (Univ. Bukavu)"],
    },
    {
      EmployeeId: 4,
      Lastname: "Kayumba",
      Firstname: "Leaty",
      Account: "00002-01390241612-83",
      Bank: "COGEBANK",
      Position: ["Responsable Adm et Fin"],
      NbDays: 22,
      NbRSSB: "10216978",
      Doc: [""],
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
            <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter un employée
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
                key={employees.indexOf(e)}
                onClick={() => setEmployee(e)}
              >
                <strong>{e.Lastname.toUpperCase()}</strong> {e.Firstname}
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
