import React, { useState, useEffect, use } from "react";
import { Container, Row, Col, ListGroup, Card, Tabs, Tab, Badge, Button, Form } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faLocationArrow, faPen } from "@fortawesome/free-solid-svg-icons";
import { AddPickupPoint } from "../modals/addPickupPoint";
import * as XLSX from "xlsx-js-style";
import moment from "moment";
import { EditDriverAssistant } from "../modals/editDriverAssistant";

const Transport = () => {
  const [busData, setBusData] = useState([]);
  const [studentPickups, setStudentPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [directionId, setDirectionId] = useState(1); // 1 pour aller, 2 pour retour
  const [showModalEditTeam, setShowModalEditTeam] = useState(false);
  const [employees, setEmployees] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenModalEditTeam = () => setShowModalEditTeam(true);
  const handleCloseModalEditTeam = () => setShowModalEditTeam(false);

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
              driver: line.driver,
              assistant: line.assistant,
              stops: stopsList,
              nbStudents: line.nbStudents
            };
          })
        );

        setBusData(formattedLines);
        setSelectedLine(formattedLines[0] || null);
        console.log("Fetched bus lines 62:", formattedLines[0]);
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

  useEffect(() => {
    fetch(ENDPOINT("employees"), getAuthRequest(token))
      .then(res => res.json())
      .then(r => {
        if(r.status) {setEmployees(r.response); console.log(r.response)}
      })
  }, []);

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
            <Card.Header id="BusLineHeader" className="bg-light border-0 shadow-sm py-3">
              <Row className="align-items-center">
                {/* Infos ligne */}
                <Col md={8} className="mb-3 mb-md-0">
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                    <div>
                      <h5 className="mb-1 fw-bold text-secondary">{selectedLine.name}</h5>
                      <div className="text-muted small lh-sm">
                        <div><h6><i>Ligne {selectedLine.id}</i></h6></div>
                        <div><span className="fw-semibold"><u>Chauffeur</u> :</span> {`${selectedLine.driverName}`}</div>
                        <div><span className="fw-semibold"><u>Assistant</u> :</span> {`${selectedLine.assistantName}`}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Actions */}
                <Col md={4} className="d-flex flex-column gap-2">
                  {/* Sélecteur de date */}
                  <Form.Group controlId="datePicker" className="w-100">
                    <Form.Label className="form-label small text-muted fw-semibold mb-1">
                      Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="shadow-sm"
                    />
                  </Form.Group>

                  {/* Boutons */}
                  <div className="d-flex gap-2">
                    <Button
                      variant="light"
                      size="sm"
                      // className="fw-semibold shadow-sm d-flex align-items-center gap-2 flex-grow-1"
                      onClick={handleOpenModal}
                      style={{ width: "100%" }}
                    >
                      <FontAwesomeIcon icon={faLocationArrow} />
                      Ajouter arrêt de bus
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      // className="fw-semibold shadow-sm d-flex align-items-center gap-2 flex-grow-1"
                      style={{ width: "100%" }}
                      onClick={handleOpenModalEditTeam}
                    >
                      <FontAwesomeIcon icon={faPen} />
                      Modifier équipe
                    </Button>
                  </div>
                </Col>
              </Row>
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
                    selectedLine={selectedLine}
                    directionId={directionId}
                    date={date}
                  />
                </Tab>

                <Tab eventKey="return" title="Retour">
                  <StopTab
                    stops={selectedLine.stops}
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    getStudentsAtStop={getStudentsAtStop}
                    period="return"
                    selectedLine={selectedLine}
                    directionId={directionId}
                    date={date}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
            <AddPickupPoint
              showModal={showModal}
              selectedLine={selectedLine}
              handleCloseModal={handleCloseModal}
            />
            <EditDriverAssistant
              show={showModalEditTeam}
              handleCloseModal={handleCloseModalEditTeam}
              line={selectedLine}
              employees={employees}
              onSave
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Composant StopTab
const StopTab = ({ stops, selectedStop, setSelectedStop, getStudentsAtStop, period, selectedLine, directionId, date }) => {
  const activeStop = selectedStop || "Tous";

  const downloadStudentList = (stopName) => {
    const students = getStudentsAtStop(stopName, period);
    if (students.length === 0) return;

    // ➝ Générer les dates du mois sélectionné
    const currentDate = new Date(date); // variable date sélectionnée
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // ➝ Liste des dates sans weekends
    const dateHeaders = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const day = dateObj.getDay(); // 0=Dimanche, 6=Samedi
      if (day !== 0 && day !== 6) dateHeaders.push(d.toString().padStart(2, "0"));
    }

    // ➝ Texte du mois et année (ex: "Août 2025")
    const moisNom = currentDate.toLocaleString("fr-FR", { month: "long" });
    const moisEtAnnee = `${moisNom.charAt(0).toUpperCase() + moisNom.slice(1)} ${year}`;

    // ➝ Construire les données
    const directionText = directionId === 1 ? "Aller" : "Retour";
    const data = [
      [`LIGNE ${selectedLine.id} - (${selectedLine.name}) - ${directionText.toUpperCase()}`], // ligne 1 : titre
      [`Chauffeur : ${selectedLine.driverName}`, `Assistant : ${selectedLine.assistantName}`, "", moisEtAnnee], // ligne 2 : IDs + Mois/Année
      ["Nom", "Classe", "Arrêt", ...dateHeaders], // ligne 3 : en-tête
      ...students.map(s => [s.name, s.classe, s.stop, ...Array(dateHeaders.length).fill("")])
    ];

    // ➝ Transformer en worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // ➝ Fusionner le titre, l'assistant et le mois/année
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 + dateHeaders.length } }, // ligne 1 : titre fusionné
      { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },                       // ligne 2 : fusion B2:C2 (assistant)
      { s: { r: 1, c: 3 }, e: { r: 1, c: 2 + dateHeaders.length } }   // ligne 2 : mois + année
    ];

    // ➝ Définir les bordures
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    // ➝ Style du titre
    ws["A1"].s = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E90FF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    // ➝ Style ligne 2 : Chauffeur
    ws["A2"].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    // ➝ Style ligne 2 : Assistant (fusion B2:C2)
    const assistantCell = XLSX.utils.encode_cell({ r: 1, c: 1 });
    if (ws[assistantCell]) {
      ws[assistantCell].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: borderStyle
      };
    }

    // ➝ Style ligne 2 : Mois + année
    const moisCell = XLSX.utils.encode_cell({ r: 1, c: 3 });
    if (ws[moisCell]) {
      ws[moisCell].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // ➝ Style des en-têtes (ligne 3)
    for (let c = 0; c < 3 + dateHeaders.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "228B22" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: borderStyle
        };
      }
    }

    // ➝ Style et bordures pour toutes les cellules élèves
    for (let r = 3; r < students.length + 3; r++) {
      for (let c = 0; c < 3 + dateHeaders.length; c++) {
        const cell = XLSX.utils.encode_cell({ r, c });
        if (ws[cell]) {
          ws[cell].s = {
            alignment: { horizontal: "left", vertical: "left" },
            border: borderStyle
          };
        }
      }
    }

    // ➝ Largeur des colonnes
    const colWidths = [];

    // Largeur auto pour Nom, Classe, Arrêt
    for (let c = 0; c < 3; c++) {
      let maxLen = 3;
      data.forEach(row => {
        const val = row[c];
        const len = val ? val.toString().length : 0;
        maxLen = Math.max(maxLen, len + 2);
      });
      colWidths[c] = { wch: maxLen };
    }

    // Largeur fixe pour les colonnes des dates
    for (let c = 3; c < 3 + dateHeaders.length; c++) {
      colWidths[c] = { wch: 5 };
    }

    ws["!cols"] = colWidths;

    // ➝ Créer un workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Élèves");

    // ➝ Nom du fichier
    const fileName =
      stopName === "Tous"
        ? `Liste Transport - Ligne_${selectedLine.id}_(${selectedLine.name.toUpperCase()}) - ${directionId === 1 ? "ALLER" : "RETOUR"} - ${moisEtAnnee}.xlsx`
        : `Liste_Transport_${stopName}_${directionId === 1 ? "ALLER" : "RETOUR"}.xlsx`;

    XLSX.writeFile(wb, fileName);
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
              <FontAwesomeIcon icon={faFileExcel} className="me-2" />{" "}Télécharger
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
