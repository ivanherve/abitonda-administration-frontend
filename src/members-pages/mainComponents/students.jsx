import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faPlus,
  faSearch, faCheckCircle, faExclamationTriangle, faTimesCircle
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
import StudentRate from "../containers/studentRate";
import StudentCanteenPage from "../containers/StudentCanteenPage";
import StudentTransport from "../containers/studentTransport";


library.add(faPlus, faArrowCircleDown, faArrowCircleUp, faSearch, faCheckCircle, faExclamationTriangle, faTimesCircle);

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
          console.log(r.response.data[0])
          //if (r.response.data !== students)
          setStudents(r.response.data);
          setTotalPages(r.response.last_page);
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
      <Row className="align-items-center mb-3 g-2">
        {/* Champ de recherche */}
        <Col xs={8}>
          <InputGroup>
            <Form.Control
              placeholder="Rechercher prénom ..."
              value={nameToSearch}
              onChange={(e) => setNameToSearch(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && setNameSearched(e.target.value)}
              className="shadow-sm"
            />
            <Button
              variant="outline-primary"
              onClick={() => setNameSearched(nameToSearch)}
              className="border-start-0"
            >
              <FontAwesomeIcon icon={["fas", "search"]} />
            </Button>
          </InputGroup>
        </Col>

        {/* Bouton Ajouter des élèves */}
        <Col xs>
          <Button
            variant="outline-success"
            className="w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowAddStudent(true)}
          >
            <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter des élèves
          </Button>
        </Col>

        {/* Bouton Télécharger documents */}
        <Col xs="auto">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Télécharger documents</Tooltip>}
          >
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center justify-content-center shadow-sm"
              onClick={() => setShowDownloadDocuments(true)}
            >
              <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} size="lg" />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs="2">
          <ListGroup className="shadow-sm rounded">
            {loading ? (
              <Loading />
            ) : (
              students.map((s) => {
                const status = s.Registered
                  ? s.InternalRulesSigned && s.RegistrationFileFilled && s.Picture
                    ? "success"
                    : "warning"
                  : "danger";

                return (
                  <ListGroup.Item
                    action
                    variant={status}
                    key={s.id || `${s.Firstname}-${s.Lastname}`}
                    onClick={() => {
                      setOneStudent(s);
                      setIsParents(true);
                    }}
                    className="py-3 px-3 mb-2 rounded d-flex align-items-center"
                    style={{
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <div>
                      <strong>{s.Firstname}</strong> <br /> <small><i>{s.Lastname}</i></small>
                    </div>
                  </ListGroup.Item>
                );
              })
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
                  <Nav.Link eventKey="link-1">Informations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-0">Contact Parents</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-2">Facturation</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-3">Cantine</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-4">Transport</Nav.Link>
                </Nav.Item>
                {/*
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
                    students={students}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
          <br />
          <Row>
            <Col md="auto">
              <Pagination>
                {currentPage > 1 && (
                  <>
                    <Pagination.First onClick={() => setCurrentPage(1)} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
                  </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) =>
                    page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    if (prevPage && page - prevPage > 1) {
                      return <Pagination.Ellipsis key={`ellipsis-${page}`} disabled />;
                    }
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    );
                  })}

                {currentPage < totalPages && (
                  <>
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                  </>
                )}
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
  const student = props.student;
  const students = props.students || [];
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const token = JSON.parse(sessionStorage.getItem("userData"))?.token?.Api_token;

  useEffect(() => {
    if (!student?.StudentId || !token) return;

    const controller = new AbortController();
    const fallbackParent = [{
      ParentId: 0,
      Firstname: "",
      Lastname: "",
      Email: "",
      PhoneNumb: "",
      Address: "",
      StudentId: student.StudentId,
      SponsoredChildren: [{ StudentId: 0, Firstname: "", Lastname: "" }]
    }];

    fetch(ENDPOINT(`parents?studentid=${student.StudentId}`), {
      ...getAuthRequest(token),
      signal: controller.signal
    })
      .then(res => res.json())
      .then(r => {
        if (controller.signal.aborted) return;

        if (r.status && r.response?.length > 0) {
          setParents(r.response);
          setSelectedParent(r.response[0]);
          console.log("✅ Parents trouvés :", r.response);
        } else {
          setParents(fallbackParent);
          setSelectedParent(fallbackParent[0]);
          console.warn("⚠️ Aucun parent trouvé pour StudentId :", student.StudentId);
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("❌ Erreur lors du chargement des parents :", err);
        }
      });

    return () => controller.abort();
  }, [student?.StudentId, token]);

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
    return <StudentRate student={props.student}
      parents={parents}
      selectedParent={selectedParent}
      onSelectParent={setSelectedParent} />;
  } else if (props.link === "link-3") {
    return <StudentCanteenPage student={props.student} />;
  } else if (props.link === "link-4") {
    return <StudentTransport student={props.student} />;
  } /**/ else return <div>nothin</div>;
}
