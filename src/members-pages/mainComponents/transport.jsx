import React, { useState, useEffect, use } from "react";
import { Container, Row, Col, ListGroup, Card, Tabs, Tab, Badge, Button } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { AddPickupPoint } from "../modals/addPickupPoint";
import moment from "moment";

const Transport = () => {
  const [busData, setBusData] = useState([]);
  const [studentPickups, setStudentPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [directionId, setDirectionId] = useState(1); // 1 pour aller, 2 pour retour

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const currentLine = busData.find(l => l.id === selectedLine?.id);
  // Charger les lignes de bus
  useEffect(() => {
    const loadBusLines = async () => {
      try {
        const res = await fetch(ENDPOINT("bus"), getAuthRequest(token));
        const data = await res.json();
        if (data.status === 0) {
          console.error("Erreur lors du chargement des lignes de bus");
          setLoading(false);
          return;
        }

        const lines = data.response;
        const formattedLines = await Promise.all(
          lines.map(async (line) => {
            // Charger les arrêts
            const stops = await fetchStops(line.LineId);

            // Charger les élèves pour cette ligne
            const students = await fetchBusStudents(line.LineId);

            // Filtrer les arrêts par direction
            const stopsList = stops; // les arrêts sont les mêmes pour toutes les directions

            return {
              id: line.LineId,
              name: line.Name,
              driver: line.DriverId,
              assistant: line.AssistantId,
              stops: stopsList,
              nbStudents: line.nbStudents
            };
          })
        );

        setBusData(formattedLines);
        setSelectedLine(formattedLines[0] || null);
        console.log("Fetched bus lines 62:", selectedLine);
      } catch (err) {
        console.error("Erreur fetch bus lines:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBusLines();
  }, [token]);

  useEffect(() => {
    const loadStops = async () => {
      if (!selectedLine) return;
      const stops = await fetchStops(selectedLine.id);
      setBusData(prev =>
        prev.map(line =>
          line.id === selectedLine.id ? { ...line, stops } : line
        )
      );
    };
    loadStops();
  }, [selectedLine?.id]);

  // Fetch stops
  const fetchStops = async (lineId) => {
    try {
      const res = await fetch(ENDPOINT(`pickup?lineId=${lineId}&directionId=${directionId}&date=${date}`), getAuthRequest(token));
      const data = await res.json();
      if (data.status === 0) return [];
      console.log("Stops for line", lineId, data);
      // Associer une direction par défaut si elle existe dans la réponse
      return data.response.map(stop => ({
        stop: stop.Name,
        latitude: stop.Latitude,
        longitude: stop.Longitude,
        timeGo: stop.ArrivalGo || "",
        timeReturn: stop.ArrivalReturn || "",
        Direction: stop.Direction || "go",
        nbStudents: stop.nbStudents || 0
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Fetch students for a bus line
  const fetchBusStudents = async (lineId) => {
    try {
      const res = await fetch(ENDPOINT(`bus/${lineId}/students?date=${date}&directionId=${directionId}`), getAuthRequest(token));
      const data = await res.json();
      console.log("Students for line", lineId, data);
      if (data.status === 0) return [];

      return data.response.students.map(s => ({
        StudentId: s.StudentId,
        name: `${s.Firstname} ${s.Lastname}`,
        classe: s.Classe || "N/A",
        stop: s.PickupPoint || "N/A",
        Direction: s.pivot.DirectionId === 1 ? "go" : "return" // doit correspondre à "go" ou "return"
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Charger les élèves pour la ligne sélectionnée
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedLine) return;
      setLoading(true);
      try {
        const students = await fetchBusStudents(selectedLine.id);
        console.log("Fetched students for selected line:", students);
        setStudentPickups(students);
      } catch (err) {
        console.error("Erreur fetch students:", err);
        setStudentPickups([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedLine, directionId, date]);

  // Obtenir les élèves par arrêt et direction
  const getStudentsAtStop = (stopName, period = "go") => {
    if (!studentPickups) return [];
    const direction = period === "go" ? "go" : "return";
    return studentPickups
      .filter(s => s.Direction === direction)
      .filter(s => stopName === "Tous" || s.stop === stopName);
  };

  if (loading || !selectedLine) return <Loading />;

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        {/* Menu gauche : lignes de bus */}
        <Col md={3}>
          <Card className="shadow-sm rounded-3">
            <Card.Header className="fw-bold bg-secondary text-white">Lignes de bus</Card.Header>
            <ListGroup variant="flush">
              {busData.map(line => (
                <ListGroup.Item
                  key={line.id}
                  action
                  active={selectedLine.id === line.id}
                  onClick={() => { setSelectedLine(line); setSelectedStop(null); }}
                >
                  {line.id}. <strong>{line.name}</strong>
                  <br />
                  <small><i>{line.nbStudents} élèves</i></small>                  
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Détails droite */}
        <Col md={9}>
          <Card className="shadow-sm rounded-3">
            <Card.Header id="BusLineHeader" className="bg-light d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div>
                  <h5 className="mb-1">{selectedLine.name}</h5>
                  <div className="text-muted small">
                    Ligne {selectedLine.id} <br />
                    Chauffeur : {selectedLine.driver} <br />
                    Assistant : {selectedLine.assistant}
                  </div>
                </div>

                {/* Sélecteur de date */}
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <Button
                variant="outline-success"
                size="sm"
                onClick={handleOpenModal}
              >
                Ajouter un point de ramassage
              </Button>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={directionId === 1 ? "go" : "return"}
                id="transport-tabs"
                className="mb-3"
                variant="pills"
                fill
                onSelect={(key) => {
                  if (key === "go") setDirectionId(1);
                  else if (key === "return") setDirectionId(2);

                  setSelectedStop(null);
                  // Pas besoin de fetch ici : le useEffect ci-dessus va se déclencher automatiquement
                }}
              >
                <Tab eventKey="go" title="Aller">
                  <StopTab
                    stops={currentLine?.stops || []}
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    getStudentsAtStop={getStudentsAtStop}
                    period="go"
                  />
                </Tab>

                <Tab eventKey="return" title="Retour">
                  <StopTab
                    stops={selectedLine.stops}
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    getStudentsAtStop={getStudentsAtStop}
                    period="return"
                  />
                </Tab>
              </Tabs>
            </Card.Body>
            <AddPickupPoint
              showModal={showModal}
              selectedLine={selectedLine}
              handleCloseModal={handleCloseModal}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Composant StopTab
const StopTab = ({ stops, selectedStop, setSelectedStop, getStudentsAtStop, period }) => {
  const activeStop = selectedStop || "Tous";

  const downloadStudentList = (stopName) => {
    const students = getStudentsAtStop(stopName, period);
    if (students.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," +
      ["Nom,Classe,Arrêt"]
        .concat(students.map(s => `${s.name},${s.classe},${s.stop}`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eleves_${stopName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm rounded-3" style={{ height: "616px", overflowY: "auto" }}>
          <Card.Header className="fw-bold bg-secondary text-white">Arrêts</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item
              key="Tous"
              action
              active={activeStop === "Tous"}
              onClick={() => setSelectedStop("Tous")}
              className="d-flex justify-content-between align-items-center"
            >
              Tous
              {activeStop === "Tous" && <Badge bg="light" text="dark">✓</Badge>}
            </ListGroup.Item>

            {/* Arrêts de bus */}
            {(stops || []).map(stopObj => (
              <ListGroup.Item
                key={stopObj.stop}
                action
                active={activeStop === stopObj.stop}
                onClick={() => setSelectedStop(stopObj.stop)}
              >
                <div className="d-flex flex-column">
                  <strong>{stopObj.stop}</strong>
                  <small className={activeStop === stopObj.stop ? "" : "text-muted"}>
                    {period === 'go' ? moment(stopObj.timeGo, "HH:mm:ss").format('HH:mm') : moment(stopObj.timeReturn, "HH:mm:ss").format('HH:mm')}
                  </small>
                  <small><i>({stopObj.nbStudents} élèves)</i></small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>

      <Col md={8}>
        <Card className="shadow-sm rounded-3 mb-3" style={{ height: "300px" }}>
          <Card.Header className="fw-bold bg-light d-flex justify-content-between align-items-center">
            <div>
              {activeStop === "Tous" ? "Tous les élèves" : `Arrêt : ${activeStop}`}{" "}
              <span className="text-muted" style={{ fontWeight: 'normal', marginLeft: '8px' }}>
                ({getStudentsAtStop(activeStop, period).length} élèves)
              </span>
            </div>
            <Button size="sm" variant="success" onClick={() => downloadStudentList(activeStop)}>
              <FontAwesomeIcon icon={faFileExcel} className="me-2" />
              Télécharger
            </Button>
          </Card.Header>

          <div style={{ overflowY: "auto", height: "100%" }}>
            <ListGroup variant="flush">
              {getStudentsAtStop(activeStop, period).length > 0 ? (
                getStudentsAtStop(activeStop, period).map(student => (
                  <ListGroup.Item
                    key={student.StudentId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {student.name}
                    <small className="text-muted">{student.classe}</small>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted">
                  Aucun élève à cet arrêt
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </Card>

        <Card className="shadow-sm rounded-3" style={{ height: "300px" }}>
          <Card.Header className="fw-bold bg-light">Carte Map</Card.Header>
          <div className="d-flex justify-content-center align-items-center h-100 text-muted">
            Ici pourrait apparaître une carte interactive
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Transport;
