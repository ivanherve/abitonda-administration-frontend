import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Card, Tabs, Tab, Badge, Button } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const Transport = () => {
  const [busData, setBusData] = useState([]);
  const [studentPickups, setStudentPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

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
            const goStops = stops.filter(s => s.Direction === "go");
            const returnStops = stops.filter(s => s.Direction === "return");

            return {
              id: line.LineId,
              name: line.Name,
              driver: line.DriverId,
              assistant: line.AssistantId,
              goStops,
              returnStops,
              students
            };
          })
        );

        setBusData(formattedLines);
        setSelectedLine(formattedLines[0] || null);
      } catch (err) {
        console.error("Erreur fetch bus lines:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBusLines();
  }, [token]);

  // Fetch stops
  const fetchStops = async (lineId) => {
    try {
      const res = await fetch(ENDPOINT(`pickup?lineId=${lineId}`), getAuthRequest(token));
      const data = await res.json();
      if (data.status === 0) return [];

      // Associer une direction par défaut si elle existe dans la réponse
      return data.response.map(stop => ({
        stop: stop.Name,
        latitude: stop.Latitude,
        longitude: stop.Longitude,
        arrival: stop.Arrival || "",
        departure: stop.Departure || "",
        Direction: stop.Direction || "go"
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Fetch students for a bus line
  const fetchBusStudents = async (lineId) => {
    try {
      const res = await fetch(ENDPOINT(`bus/${lineId}/students`), getAuthRequest(token));
      const data = await res.json();
      if (data.status === 0) return [];

      return data.response.map(s => ({
        StudentId: s.StudentId,
        name: `${s.Firstname} ${s.Lastname}`,
        classe: s.Classe || "N/A",
        stop: s.pickup_point?.Name || "N/A",
        Direction: s.Direction // doit correspondre à "go" ou "return"
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Obtenir les élèves par arrêt et direction
  const getStudentsAtStop = (stopName, period = "go") => {
    if (!selectedLine) return [];
    const direction = period === "go" ? "go" : "return";

    return selectedLine.students
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
                  className="d-flex justify-content-between align-items-center"
                >
                  {line.id}. {line.name}
                  {selectedLine.id === line.id && <Badge bg="success">Sélectionnée</Badge>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Détails droite */}
        <Col md={9}>
          <Card className="shadow-sm rounded-3">
            <Card.Header className="bg-light">
              <h5 className="mb-1">{selectedLine.name}</h5>
              <div className="text-muted small">
                Ligne {selectedLine.id} <br />
                Chauffeur : {selectedLine.driver} <br />
                Assistant : {selectedLine.assistant}
              </div>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="go" id="transport-tabs" className="mb-3" variant="pills" fill>
                <Tab eventKey="go" title="Aller">
                  <StopTab
                    stops={selectedLine.goStops}
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    getStudentsAtStop={getStudentsAtStop}
                    period="go"
                  />
                </Tab>

                <Tab eventKey="return" title="Retour">
                  <StopTab
                    stops={selectedLine.returnStops}
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    getStudentsAtStop={getStudentsAtStop}
                    period="return"
                  />
                </Tab>
              </Tabs>
            </Card.Body>
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

            {stops.map(stopObj => (
              <ListGroup.Item
                key={stopObj.stop}
                action
                active={activeStop === stopObj.stop}
                onClick={() => setSelectedStop(stopObj.stop)}
              >
                <div className="d-flex flex-column">
                  <strong>{stopObj.stop}</strong>
                  <small className={activeStop === stopObj.stop ? "" : "text-muted"}>
                    {stopObj.arrival} → {stopObj.departure}
                  </small>
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
                    <small className="text-muted">({student.classe})</small>
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
