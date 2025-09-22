import React, { useState, useEffect, use } from "react";
import { Container, Row, Col, ListGroup, Card, Tabs, Tab, Badge, Button, Form } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading, postAuthRequest } from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileExcel, faLocationArrow, faMap, faMapMarked, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AddPickupPoint } from "../modals/addPickupPoint";
import * as XLSX from "xlsx-js-style";
import moment from "moment";
import { EditBusLine } from "../modals/editBusLine";
import AddBus from "../modals/addBus";
import AddBusLine from "../modals/addBusLine";
import TakePresence from "../modals/takePresence";
import EditPickupPoint from "../modals/editPickupPoint";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Transport = () => {
  const [busData, setBusData] = useState([]);
  const [studentPickups, setStudentPickups] = useState([]);
  const [stops, setStops] = useState([]);
  const [busStudents, setBusStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [directionId, setDirectionId] = useState(1); // 1 pour aller, 2 pour retour
  const [showModalEditTeam, setShowModalEditTeam] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [gps, setGps] = useState([]);
  const [showAddBus, setShowAddBus] = useState(false);
  const [showAddBusLine, setShowAddBusLine] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenModalEditTeam = () => setShowModalEditTeam(true);
  const handleCloseModalEditTeam = () => setShowModalEditTeam(false);

  const handleOpenAddBus = () => setShowAddBus(true);
  const handleCloseAddBus = () => setShowAddBus(false);

  const handleOpenAddBusLine = () => setShowAddBusLine(true);
  const handleCloseAddBusLine = () => setShowAddBusLine(false);

  const handleSaveAddBusLine = (newBusLine) => {
    setBusData((prev) => [...prev, newBusLine]);
    console.log("New bus line added:", newBusLine);
  };

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
            // Charger les élèves pour cette ligne
            const students = busStudents;

            // Filtrer les arrêts par direction
            const stopsList = stops; // les arrêts sont les mêmes pour toutes les directions

            return {
              id: line.LineId,
              name: line.Name,
              driverName: line.driverName,
              assistantName: line.assistantName,
              stops: stopsList,
              nbStudents: line.nbStudents,
              students: students,
              arrival: line.Arrival
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
        if (r.status) { setEmployees(r.response); console.log(r.response) }
      })
  }, []);

  useEffect(() => {
    fetch(ENDPOINT("pickup"), getAuthRequest(token))
      .then(res => res.json())
      .then(r => {
        if (r.status) {
          setPickupPoints(r.response);
          console.log(r.response);
        }
      });
  }, [token]);

  const fetchBusData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        ENDPOINT(`bus/${selectedLine.id || 1}/students?directionId=${directionId}&date=${date}`)
      );
      const data = await response.json();

      // Vérifie qu'on a bien la structure attendue
      if (data.status) {
        const res = data.response;
        console.log("API response for bus data:", res);
        if (res.pickups.length > 0) {
          console.log("Fetched pickups data:", res.pickups);
        }
        if (res.students.length > 0) {
          console.log("Fetched students data:", res.students);
        } else {
          console.log("No students data found with fetchBusData");
        }

        // Stops avec élèves
        const stopsData = res.pickups.map(stop => ({
          PickupId: stop.PickupId,
          stop: stop.Name,
          students: stop.students.map(s => ({
            id: s.StudentId,
            name: `${s.Firstname} ${s.Lastname}`,
            classe: s.Classe,
            stop: s.PickupPoint
          })),
          nbStudents: stop.nbStudents,
          time: stop.Arrival,
          Latitude: stop.Latitude,
          Longitude: stop.Longitude,
          busLine: selectedLine.id
        }));

        // Liste globale des élèves
        const studentsData = res.students.map(s => ({
          id: s.StudentId,
          name: `${s.Firstname} ${s.Lastname}`,
          classe: s.Classe,
          stop: s.PickupPoint,
          Direction: Number(s.DirectionId) === 1 ? "go" : "return",
          DaysOfWeek: s.DaysOfWeek
        }));

        setStops(stopsData);
        setSelectedStop(null);
        setBusStudents(studentsData);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (err) {
      console.error("Error fetching bus data:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSVGoogleMyMaps = (lineId) => {
    console.log("Downloading CSV for Google My Maps for line:", lineId);
    if (!lineId) return;
    fetch(ENDPOINT(`line/${lineId}/google-mymaps`), getAuthRequest(token))
      .then(res => res.json())
      .then(r => {
        if (r.status) {
          const data = r.response;

          // Colonnes que tu veux exporter
          const headers = ["PickupId", "LineId", "WKT", "name", "ligne", "nbEleve", "eleves"];

          // Construire le CSV
          const csvRows = [];
          csvRows.push(headers.join(",")); // entêtes
          data.forEach(obj => {
            const values = headers.map(h => {
              let val = obj[h] ?? "";
              // échapper les virgules, guillemets et retours à la ligne
              val = String(val).replace(/"/g, '""');
              return `"${val}"`;
            });
            csvRows.push(values.join(","));
          });

          const csvData = csvRows.join("\n");

          // Télécharger
          const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `line_${lineId}_google_mymaps.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });
  }

  // Charger les élèves pour la ligne sélectionnée
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedLine) return;
      fetchBusData();
      setLoading(true);
      try {
        const students = busStudents;
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

  if (loading || !selectedLine) return <Loading />;

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        {/* Menu gauche : lignes de bus */}
        <Col md={3}>
          <Button variant="info" onClick={handleOpenAddBus} disabled style={{ width: "100%" }}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un bus
          </Button>
          <Card className="shadow-sm rounded-3" style={{ marginTop: "10px" }}>
            <Card.Header className="bg-secondary text-white">
              <Row>
                <Col xs={8}>
                  Lignes de bus
                </Col>
                <Col className="text-end" xs={4}>
                  <Button variant="success" onClick={handleOpenAddBusLine} size="sm">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Col>
              </Row>
            </Card.Header>
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
                <Col md={7} className="mb-3 mb-md-0">
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                    <div>
                      <h5 className="mb-1 fw-bold text-secondary">{selectedLine.name}</h5>
                      <div className="text-muted small lh-sm">
                        <div><h6><i>Ligne {selectedLine.id}</i></h6></div>
                        <div><span className="fw-semibold"><u>Chauffeur</u> :</span> {selectedLine.driverName}</div>
                        <div><span className="fw-semibold"><u>Assistant</u> :</span> {selectedLine.assistantName}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Actions */}
                <Col md={5} className="d-flex flex-column gap-2">
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
                      <FontAwesomeIcon icon={faPen} />{" "}
                      Modifier la ligne
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      style={{ width: "100%" }}
                      onClick={() => downloadCSVGoogleMyMaps(selectedLine.id)}
                    >
                      <FontAwesomeIcon icon={faMapMarked} />{" "}
                      Google My Maps
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

                  // Pas besoin de fetch ici : le useEffect ci-dessus va se déclencher automatiquement
                }}
              >
                <Tab eventKey="go" title="Aller">
                  <StopTab
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    stops={stops}
                    busStudents={busStudents}
                    selectedLine={selectedLine}
                    directionId={directionId}
                    date={date}
                    gps={gps}
                    setGps={setGps}
                    busLines={busData}
                  />
                </Tab>

                <Tab eventKey="return" title="Retour">
                  <StopTab
                    selectedStop={selectedStop}
                    setSelectedStop={setSelectedStop}
                    stops={stops}
                    busStudents={busStudents}
                    selectedLine={selectedLine}
                    directionId={directionId}
                    date={date}
                    gps={gps}
                    setGps={setGps}
                    busLines={busData}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
            <AddPickupPoint
              showModal={showModal}
              selectedLine={selectedLine}
              handleCloseModal={handleCloseModal}
              pickups={pickupPoints}
            />
            <EditBusLine
              show={showModalEditTeam}
              handleCloseModal={handleCloseModalEditTeam}
              line={selectedLine}
              employees={employees}
              onSave
            />
            <AddBus
              show={showAddBus}
              handleCloseAddBus={handleCloseAddBus}
            />
            <AddBusLine
              show={showAddBusLine}
              handleClose={handleCloseAddBusLine}
              handleSave={handleSaveAddBusLine}
              employees={employees}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Composant StopTab
const StopTab = ({ selectedStop, setSelectedStop, stops, busStudents, selectedLine, directionId, date, gps, setGps, busLines }) => {
  const activeStop = selectedStop || "Tous";
  const [showTakePresence, setShowTakePresence] = useState(false);
  const [showEditPickupPoint, setShowEditPickupPoint] = useState(false);

  const handleOpenEditPickupPoint = () => setShowEditPickupPoint(true);
  const handleCloseEditPickupPoint = () => setShowEditPickupPoint(false);

  const studentsToShow =
    activeStop === "Tous"
      ? busStudents
      : (stops.find(s => s.PickupId === activeStop)?.students || []);

  const downloadStudentList = (stopName) => {
    let students = [];

    if (stopName === "Tous") {
      students = busStudents;
      console.log(busStudents)
    } else {
      const stopObj = stops.find(s => s.PickupId === stopName);
      if (!stopObj) return;
      students = stopObj.students.map(s => ({
        name: s.name,
        classe: s.classe,
        stop: s.stop,
        DaysOfWeek: s.DaysOfWeek
      }));
    }

    if (students.length === 0) return;

    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateHeaders = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const day = dateObj.getDay();
      if (day !== 0 && day !== 6) dateHeaders.push(d.toString().padStart(2, "0"));
    }

    const moisNom = currentDate.toLocaleString("fr-FR", { month: "long" });
    const moisEtAnnee = `${moisNom.charAt(0).toUpperCase() + moisNom.slice(1)} ${year}`;

    const directionText = directionId === 1 ? "Aller" : "Retour";
    const data = [
      [`LIGNE ${selectedLine.id} - (${selectedLine.name}) - ${directionText.toUpperCase()}`],
      [`Chauffeur : ${selectedLine.driverName}`, `Assistant : ${selectedLine.assistantName}`, "", moisEtAnnee],
      ["Nom", "Classe", "Arrêt", "Heures", ...dateHeaders],
      ...students.map(s => [
        s.name,
        s.classe,
        s.stop,
        moment(stops.find(stop => stop.stop === s.stop)?.time || "", "HH:mm:ss").format("HH:mm"),
        ...dateHeaders.map((day) => {
          const dayOfWeek = new Date(year, month, parseInt(day)).toLocaleString("fr-FR", { weekday: "long" });
          const dayKey = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

          // Vérifie d’abord si DaysOfWeek existe et contient bien la clé
          if (!s.DaysOfWeek || !(dayKey in s.DaysOfWeek)) {
            return ""; // ou une valeur par défaut
          }

          return s.DaysOfWeek[dayKey] === null ? "__NOIR__" : "";
        })
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 + dateHeaders.length } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
    ];

    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    ws["A1"].s = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E90FF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    ws["A2"].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    const assistantCell = XLSX.utils.encode_cell({ r: 1, c: 1 });
    if (ws[assistantCell]) {
      ws[assistantCell].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: borderStyle
      };
    }

    for (let c = 0; c < 4 + dateHeaders.length; c++) {
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

    for (let r = 3; r < students.length + 3; r++) {
      for (let c = 0; c < 4 + dateHeaders.length; c++) {
        const cell = XLSX.utils.encode_cell({ r, c });
        if (ws[cell]) {
          if (ws[cell].v === "__NOIR__") {
            ws[cell].v = ""; // enlever le texte
            ws[cell].s = {
              fill: { fgColor: { rgb: "000000" } },
              border: borderStyle
            };
          } else {
            ws[cell].s = {
              alignment: { horizontal: "left", vertical: "left" },
              border: borderStyle
            };
          }
        }
      }
    }

    const colWidths = [];
    for (let c = 0; c < 3; c++) {
      let maxLen = 3;
      data.forEach(row => {
        const val = row[c];
        const len = val ? val.toString().length : 0;
        maxLen = Math.max(maxLen, len);
      });
      colWidths[c] = { wch: maxLen };
    }

    colWidths[3] = { wch: 10 };
    colWidths[1] = { wch: 8 };
    for (let c = 4; c < 4 + dateHeaders.length; c++) {
      colWidths[c] = { wch: 4 };
    }
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Élèves");

    const fileName =
      stopName === "Tous"
        ? `Liste Transport - Ligne_${selectedLine.id}_(${selectedLine.name.toUpperCase()}) - ${directionId === 1 ? "ALLER" : "RETOUR"} - ${moisEtAnnee}.xlsx`
        : `Liste_Transport_${stopName}_${directionId === 1 ? "ALLER" : "RETOUR"}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const handleOpenTakePresence = () => setShowTakePresence(true);
  const handleCloseTakePresence = () => setShowTakePresence(false);

  const sendMessage = () => {
    let message = "🚌 Planning du ramassage de la Ligne " + selectedLine.id + " (" + selectedLine.name + ") :\n\n";
    // console.log("Stops for message:", stops);
    stops.forEach(p => {
      // Générer le lien Google Maps
      const mapsUrl = `https://www.google.com/maps?q=${p.Latitude},${p.Longitude}`;

      message += `🚏 ${p.stop} - ${p.time.slice(0, 5)}\n`;
      message += `   📍 ${mapsUrl}\n`; // lien cliquable vers l'arrêt

      p.students.forEach(s => {
        message += ` - ${s.name} (${s.classe})\n`;
      });

      message += "\n";
    });

    // 3. Ouvrir WhatsApp avec le texte
    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
    // console.log(message);
  };

  useEffect(() => {
    console.log("Stop selected:", selectedStop);
  }, [selectedStop]);

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card className="shadow-sm rounded-3" style={{ height: "616px", overflowY: "auto" }}>
          <Card.Header className="fw-bold d-flex align-items-center">
            <FontAwesomeIcon icon={faLocationArrow} className="me-2" />
            Arrêts
          </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item
              key="Tous"
              action
              active={activeStop === "Tous"}
              onClick={() => setSelectedStop("Tous")}
              className="d-flex justify-content-between align-items-center"
            >
              Tous
              {activeStop === "Tous" && <Badge bg="success">✓</Badge>}
            </ListGroup.Item>

            {/* Arrêts de bus */}
            {(stops || []).map(stopObj => (
              <ListGroup.Item
                key={stopObj.PickupId}
                action
                active={activeStop === stopObj.PickupId}
                onClick={() => { setSelectedStop(Number(stopObj.PickupId)); setGps([stopObj.Latitude, stopObj.Longitude]) }}
                className="d-flex flex-column"
              >
                <strong>{stopObj.stop}</strong>
                <small className={activeStop === stopObj.PickupId ? "" : "text-muted"}>
                  {moment(stopObj.time, "HH:mm:ss").format('HH:mm')}
                </small>
                <small className=""><i>({stopObj.nbStudents} élèves)</i></small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>

      <Col md={8}>
        <Card className="shadow-sm rounded-3 mb-3" style={{ height: "400px" }}>
          <Card.Header className="fw-bold bg-light d-flex justify-content-between align-items-center">
            <div>
              {activeStop === "Tous"
                ? "Tous les élèves"
                : `Arrêt : ${stops.find(s => s.PickupId === activeStop)?.stop || ""}`}
              <br />
              <span
                className="text-muted"
                style={{ fontWeight: "normal", fontStyle: "italic", fontSize: "0.9em" }}
              >
                ({studentsToShow.length} élèves)
              </span>
            </div>
          </Card.Header>
          <div style={{ overflowY: "auto", height: "100%" }}>
            <ListGroup variant="flush">
              {stops.length > 0 ? (
                studentsToShow.map(student => (
                  <ListGroup.Item
                    key={student.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{student.name}</span>
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
          <Card.Footer className="bg-light">
            <Row className="g-2">
              <Col xs="3">
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => downloadStudentList(activeStop)}
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faFileExcel} className="me-2" /> Télécharger
                </Button>
              </Col>
              <Col xs="3">
                <Button
                  size="sm"
                  variant="light"
                  onClick={handleOpenTakePresence}
                  // disabled={directionId === 1}
                  disabled
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faPen} className="me-2" /> Présences
                </Button>
              </Col>
              <Col xs="3">
                <Button
                  size="sm"
                  variant="light"
                  onClick={handleOpenEditPickupPoint}
                  className="w-100"
                  disabled={activeStop === "Tous"}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" /> Modifier Arrêt
                </Button>
              </Col>
              <Col xs="3">
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => sendMessage()}
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="me-2" /> Message
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>

        <Card className="shadow-sm rounded-3" style={{ height: "200px" }}>
          <Card.Header className="fw-bold bg-light">
            <FontAwesomeIcon icon={faLocationArrow} className="me-2" />
            Carte Map
          </Card.Header>
          <div className="d-flex justify-content-center align-items-center h-100 text-muted">
            {gps.length > 0 ? (
              <a
                href={`https://www.google.com/maps/@${gps[0]},${gps[1]},15z`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                {`${gps[0]}, ${gps[1]}`}
              </a>
            ) : (
              <span className="text-muted">Coordonnées non disponibles</span>
            )}
          </div>
        </Card>
        <TakePresence
          show={showTakePresence}
          handleClose={handleCloseTakePresence}
          students={busStudents}
        />
        <EditPickupPoint
          show={showEditPickupPoint}
          handleClose={handleCloseEditPickupPoint}
          onSave
          pickupPoint={stops.find(s => s.PickupId === activeStop)}
          busLines={busLines}
          directionId={directionId}
        />
      </Col>
    </Row>
  );
};

export default Transport;
