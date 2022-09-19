import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Nav,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";
import ContactParent from "../containers/contactParent";
import GeneralInformation from "../containers/generalInformation";
import AddStudent from "../modals/addStudent";
import DownloadDocuments from "../modals/downloadDocuments";
import Payment from "../containers/studentPayment";

library.add(faPlus, faArrowCircleDown, faArrowCircleUp);

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
  const [showDownloadDocuments, setShowDownloadDocuments] = useState(false);
  const [nameClicked, setNameClicked] = useState(false);
  const [nameSearched, setNameSearched] = useState("");
  const [nameToSearch, setNameToSearch] = useState("");

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
    if (nameSearched.length < 1)
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
    else searchStudent(nameSearched);
  }, [currentPage, nameSearched]);

  const searchStudent = (name) => {
    fetch(ENDPOINT("searchstudent?name=" + name), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setStudents(r.response);
      });
  };

  return (
    <div>
      <Row>
        <Col xs="8">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Rechercher prénom ..."
              onChange={(e) => setNameToSearch(e.target.value)}
            />
            <Button
              onClick={() => setNameSearched(nameToSearch)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') setNameSearched(nameToSearch);
              }}
              variant="outline-primary"
              id="button-addon2"
            >
              <FontAwesomeIcon icon={["fas", "search"]} />
            </Button>
          </InputGroup>
        </Col>
        <Col>
          <Button
            variant="outline-success"
            style={{ width: "100%" }}
            onClick={() => setShowAddStudent(true)}
          >
            Ajouter des élèves <FontAwesomeIcon icon={["fas", "plus"]} />
          </Button>
        </Col>
        <Col xs="1">
          <OverlayTrigger
            placement="auto"
            overlay={<Tooltip>Télécharger documents</Tooltip>}
          >
            <Button
              variant="outline-secondary"
              style={{ width: "100%" }}
              onClick={() => setShowDownloadDocuments(true)}
            >
              <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} />
            </Button>
          </OverlayTrigger>
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
                  variant={
                    s.Registered
                      ? s.InternalRulesSigned &&
                        s.RegistrationFileFilled &&
                        s.Picture
                        ? "success"
                        : "warning"
                      : "danger"
                  }
                  key={students.indexOf(s)}
                  onClick={() => {
                    setOneStudent(s);
                    setIsParents(true);
                    //console.log(s);
                  }}
                >
                  <div>
                    <strong>{s.Firstname}</strong> {s.Lastname}
                  </div>
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
                {/*
                <Nav.Item>
                  <Nav.Link eventKey="link-3">Présences</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="link-2">Paiement</Nav.Link>
                </Nav.Item>
*/}
              </Nav>
            </Card.Header>
            <Card.Body>
              {loadingLink ? (
                <div>Chargement...</div>
              ) : (
                <div>
                  {oneStudent ? (
                    <h6>{oneStudent.Firstname + " " + oneStudent.Lastname}</h6>
                  ) : (
                    <div>...</div>
                  )}
                  <Links
                    link={link}
                    student={oneStudent}
                    isParents={isParents}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
          <br />
          <Row>
            <Col md="auto">
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
      <DownloadDocuments
        show={showDownloadDocuments}
        hide={() => setShowDownloadDocuments(false)}
      />
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
  } /*else if (props.link === "link-2") {
    return <Payment />;
  } else if (props.link === "link-3") {
    return <StudentPresence />;
  } */ else return <div>nothin</div>;
}
