import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowCircleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Nav,
  Pagination,
  Row,
} from "react-bootstrap";
import {
  ENDPOINT,
  getAuthRequest,
  Loading,
  usePrevious,
} from "../../links/links";
import ContactParent from "../containers/contactParent";
import GeneralInformation from "../containers/generalInformation";
import Payment from "../containers/studentPayment";
import StudentPresence from "../containers/studentPresence";
import AddStudent from "../modals/addStudent";

library.add(faPlus, faArrowCircleDown);

let pages = [];
const createPages = (max, click, activePage) => {
  for (let index = 0; index < max; index++) {
    if (pages.length < max)
      pages.push(
        /*
                <Pagination.Item key={index} onClick={click} active={index === activePage}>
                    {index + 1}
                </Pagination.Item>
                */
        { idx: index, toClick: click, toActive: index === activePage }
      );
  }
};

export default function Student(props) {
  const [link, setLink] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [students, setStudents] = useState([]);
  const [oneStudent, setOneStudent] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const [isParents, setIsParents] = useState(true);

  setTimeout(() => {
    setIsParents(false);
    setLoadingLink(false);
  }, 3000);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const changePage = (e) => {
    let page = parseInt(e.target.innerText);
    setCurrentPage(page);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    console.log(page);
  };

  useEffect(() => {
    if (link.length < 1) setLink("link-0");
    fetch(
      ENDPOINT("students/pagination?limit=10&page=" + currentPage),
      getAuthRequest(token)
    )
      .then((r) => r.json())
      .then((r) => {
        //console.log(r)
        //if (r.response.data !== students)
        setStudents(r.response.data);
        createPages(r.response.last_page, (e) => changePage(e), currentPage);
        if (!oneStudent) setOneStudent(r.response.data[0]);
      });
  }, []);

  return (
    <div>
      <Row>
        <Col xs="8">
          <Form.Control placeholder="Rechercher ..." />
        </Col>
        <Col>
          <Button
            variant="outline-success"
            style={{ width: "100%" }}
            onClick={() => setShowAddStudent(true)}
          >
            Ajouter un élève <FontAwesomeIcon icon={["fas", "plus"]} />
          </Button>
        </Col>
        <Col xs="1">
          <Button variant="outline-secondary" style={{ width: "100%" }}>
            <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} />
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs="2">
          <ListGroup>
            {loading ? (
              <Loading />
            ) : (
              students.map((s) => (
                <ListGroup.Item
                  action
                  key={students.indexOf(s)}
                  onClick={() => {
                    setOneStudent(s);
                    setIsParents(true);
                  }}
                >
                  <strong>{s.Lastname}</strong> {s.Firstname}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Nav
                justify
                variant="tabs"
                defaultActiveKey="link-0"
                onSelect={(e) => {
                  e ? setLink(e) : setLink("link-0");
                  setLoadingLink(true);
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Informations Générales</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-0">Contact Parents</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-3">Présences</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-2">Paiement</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {loadingLink ? (
                <div>Chargement...</div>
              ) : (
                <Links link={link} student={oneStudent} isParents={isParents} />
              )}
            </Card.Body>
          </Card>
          <br />
          <Row>
            <Col md={{ span: 6, offset: 5 }}>
              <Pagination>
                {pages.map((p) => (
                  <Pagination.Item
                    key={pages.indexOf(p)}
                    onClick={(e) => p.toClick(e)}
                    active={p.idx + 1 === currentPage}
                  >
                    {p.idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Col>
          </Row>
        </Col>
      </Row>
      <AddStudent show={showAddStudent} hide={() => setShowAddStudent(false)} />
    </div>
  );
}

function Links(props) {
  if (props.link === "link-0") {
    return (
      <ContactParent
        studentId={props.student ? props.student.StudentId : 1}
        isParents={props.isParents}
      />
    );
  } else if (props.link === "link-1") {
    return <GeneralInformation student={props.student} />;
  } else if (props.link === "link-2") {
    return <Payment />;
  } else if (props.link === "link-3") {
    return <StudentPresence />;
  } else {
    return <div>nothin</div>;
  }
}
