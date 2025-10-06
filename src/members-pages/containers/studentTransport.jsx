import React, { useState, useEffect } from "react";
import { Nav, Form, Row, Col, Button, Card, Badge, ListGroup } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading, postAuthRequest } from "../../links/links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faBus, faTimes } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";

import moment from "moment/moment";

const daysOfWeek = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
];

const defaultReturnTimes = {
    1: "16:30",
    2: "16:30",
    3: "16:30",
    4: "16:30",
    5: "12:30",
    6: "16:30",
    7: "16:30"
};

const StudentTransport = ({ student }) => {
    const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

    const [loading, setLoading] = useState(true);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [toEdit, setToEdit] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const [transportSettings, setTransportSettings] = useState({});
    const [defaultSettings, setDefaultSettings] = useState({ goPoint: "", goTime: "", returnPoint: "" });
    const [studentPickups, setStudentPickups] = useState({
        goPickups: [],
        returnPickups: []
    });
    const [day, setDay] = useState(0);

    useEffect(() => {
        const fetchPickupPoints = async () => {
            try {
                const res = await fetch(ENDPOINT(`pickup`), getAuthRequest(token));
                const data = await res.json();
                if (data.status === 0) return;
                console.log("Student pickup points:", data);
                setPickupPoints(data.response);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPickupPoints();
    }, [token]);

    useEffect(() => {
        const fetchStudentPickups = async () => {
            try {
                const res = await fetch(ENDPOINT(`student/${student.StudentId}/pickups?day=${day}`), getAuthRequest(token));
                const data = await res.json();
                if (data.status === 1) {
                    console.log("Student pickups:", data.response);
                    setStudentPickups(data.response);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudentPickups();
    }, [student, token, day]);

    const handleChange = (dayValue, field, value) => {
        setTransportSettings(prev => ({
            ...prev,
            [dayValue]: { ...prev[dayValue], [field]: value }
        }));
    };

    const handleSave = async () => {
        try {
            console.log("student", student);

            let payload;

            if (activeTab === "all") {
                // Cas : "Tous les jours"
                payload = daysOfWeek.map(day => ({
                    day: day.value,
                    goPoint: defaultSettings.goPoint || "",
                    goTime: defaultSettings.goTime || "",
                    returnPoint: defaultSettings.returnPoint || "",
                    returnTime: defaultReturnTimes[day.value] || "16:30"
                }));
            } else {
                // Cas : un seul jour sélectionné
                const dayValue = parseInt(activeTab);
                payload = [{
                    day: dayValue,
                    goPoint: transportSettings[dayValue]?.goPoint || defaultSettings.goPoint,
                    goTime: transportSettings[dayValue]?.goTime || defaultSettings.goTime,
                    returnPoint: transportSettings[dayValue]?.returnPoint || defaultSettings.returnPoint,
                    returnTime: transportSettings[dayValue]?.returnTime || defaultReturnTimes[dayValue],
                    returnPointHalfDay: transportSettings[dayValue]?.returnPointHalfDay || "",
                    returnTimeHalfDay: transportSettings[dayValue]?.returnTimeHalfDay || "12:30"
                }];
            }

            const dataToSend = { studentId: student.StudentId, settings: payload };
            console.log("Payload to send:", JSON.stringify(dataToSend));

            const res = await fetch(ENDPOINT("student/update-transport"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthRequest(token).headers
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await res.json();
            if (data.status === 1) {
                swal("✅ Mise à jour réussie !");
            } else {
                swal("Erreur : " + data.response);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la connexion au serveur.");
        }
    };

    const handleDeletePickup = async (pickupId, dayValue, directionId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet arrêt ?")) return;

        const data = {
            studentId: student.StudentId,
            pickupId,
            day: dayValue,      // 0 = tous les jours
            directionId         // 1 = Aller, 2 = Retour
        };

        try {
            console.log("Delete pickup:", data);
            fetch(ENDPOINT("student/unset-pickup-point"), postAuthRequest(JSON.stringify(data), token))
                .then(res => res.json())
                .then(data => {
                    if (data.status === 1) {
                        swal("Arrêt supprimé avec succès !", {
                            icon: "success",
                        }).then(() => console.log(data.response));
                    } else {
                        swal("Erreur : " + data.response);
                    }
                });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la connexion au serveur.");
        }
    };

    // Trouver les arrêts sélectionnés (par défaut ou par jour)
    const selectedGoPoint = pickupPoints.find(p => p.Name === defaultSettings.goPoint);
    const selectedReturnPoint = pickupPoints.find(p => p.Name === defaultSettings.returnPoint);

    // Ligne associée (celle de l'arrêt d'aller par exemple)
    const selectedLine = selectedGoPoint?.line || selectedReturnPoint?.line;

    if (loading) return <Loading />;

    return (
        <>
            <Nav
                variant="pills"
                fill
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-4 shadow-sm rounded"
            >
                <Nav.Item>
                    <Nav.Link
                        eventKey="all"
                        onClick={() => setDay(0)}
                        className="fw-bold"
                    >
                        Tous les jours
                    </Nav.Link>
                </Nav.Item>

                {daysOfWeek.map((day) => (
                    <Nav.Item key={day.value}>
                        <Nav.Link
                            eventKey={String(day.value)}
                            onClick={() => setDay(day.value)}
                            className="fw-bold"
                        >
                            {day.label}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            {/* Formulaire pour "Tous les jours" */}
            {activeTab === "all" && (
                <TransportForm
                    pickupPoints={pickupPoints}
                    toEdit={toEdit}
                    settings={defaultSettings}
                    days={daysOfWeek}
                    autoReturnTimes={defaultReturnTimes}
                    isDefault
                    onChange={(field, value) =>
                        setDefaultSettings((prev) => ({ ...prev, [field]: value }))
                    }
                />
            )}

            {/* Formulaire pour chaque jour spécifique */}
            {daysOfWeek.map(
                (day) =>
                    activeTab === String(day.value) && (
                        <TransportForm
                            key={day.value}
                            pickupPoints={pickupPoints}
                            toEdit={toEdit}
                            settings={transportSettings[day.value] || {}}
                            dayValue={day.value}
                            autoReturnTimes={defaultReturnTimes}
                            onChange={(field, value) =>
                                handleChange(day.value, field, value)
                            }
                        />
                    )
            )}

            <div className="mt-4 text-end">
                <Button
                    onClick={handleSave}
                    variant="success"
                    className="px-4 shadow-sm"
                >
                    Enregistrer
                </Button>
            </div>

            <Card className="mt-4 shadow-sm">
                <Card.Header>
                    <Card.Title className="mb-3">
                        <FontAwesomeIcon icon={faBus} className="me-2 text-secondary" />{" "}
                        Informations de transport
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <>
                        {
                            Object.keys(studentPickups.goPickups).length === 0 ? (
                                <p className="text-muted">🚫 Aucun arrêt d'aller assigné pour cet élève.</p>
                            ) : (
                                <div>
                                    <p className="fw-bold">Arrêts assignés pour l'<strong>Aller</strong> :</p>
                                    <ListGroup variant="flush">
                                        {studentPickups.goPickups?.map((sp, i) => (
                                            <ListGroup.Item key={`go-${i}`} className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    {<h6>
                                                        <i>{sp.days.map((d, idx) => (moment().day(d).format("dddd").charAt(0).toUpperCase() + moment().day(d).format("dddd").slice(1))).join(", ")}</i>
                                                    </h6>}
                                                    <div className="mt-1 fw-bold">
                                                        {/* <h4>
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${sp.latitude},${sp.longitude}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ms-2">
                                                                {sp.name}
                                                            </a>
                                                        </h4> */}
                                                        <h4>{sp.name}</h4>
                                                        <h6>
                                                            <i style={{ color: "green" }}>
                                                                ({moment(sp.ArrivalGo, "HH:mm:ss").format("HH:mm")})
                                                            </i>
                                                        </h6>
                                                    </div>
                                                    <small className="text-muted">
                                                        {sp.line ? `(Ligne ${sp.line.LineId} - ${sp.line.Name})` : ""}
                                                    </small>
                                                </div>
                                                <Button variant="outline-danger" onClick={() => handleDeletePickup(sp.id, sp.days, 1)}>
                                                    <FontAwesomeIcon icon={faTimes} /> Supprimer
                                                </Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )
                        }
                        <hr />
                        {/* Retour */}
                        {
                            (() => {
                                // Inclure les retours demi-journée du vendredi si tous les jours
                                const pickupsToShow = activeTab === "all"
                                    ? [...(studentPickups.returnPickups || []), ...(studentPickups.returnPickupsHalfDay || [])]
                                    : day === 5
                                        ? studentPickups.returnPickupsHalfDay || []
                                        : studentPickups.returnPickups || [];

                                if (pickupsToShow.length === 0) {
                                    return <p className="text-muted mt-3">🚫 Aucun arrêt de retour assigné pour cet élève.</p>;
                                }

                                return (
                                    <div>
                                        <p className="fw-bold">Arrêts assignés pour le <strong>{activeTab === "all" && studentPickups.returnPickupsHalfDay?.length ? "Retour" : (day === 5 ? "Retour demi-journée" : "Retour")}</strong> :</p>
                                        <ListGroup variant="flush">
                                            {pickupsToShow.map((sp, i) => (
                                                <ListGroup.Item key={`return-${i}`} className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h6>
                                                            <i>{sp.days.map(d => (moment().day(d).format("dddd").charAt(0).toUpperCase() + moment().day(d).format("dddd").slice(1))).join(", ")}</i>
                                                        </h6>
                                                        <div className="mt-1 fw-bold">
                                                            <h4>{sp.name}</h4>
                                                            <h6>
                                                                <i style={{ color: "green" }}>
                                                                    {sp.ArrivalReturnHalfDay
                                                                        ? `(${moment(sp.ArrivalReturnHalfDay, "HH:mm:ss").format("HH:mm")})`
                                                                        : sp.ArrivalReturn
                                                                            ? `(${moment(sp.ArrivalReturn, "HH:mm:ss").format("HH:mm")})`
                                                                            : ""}
                                                                </i>
                                                            </h6>
                                                        </div>
                                                        <small className="text-muted">
                                                            {sp.line ? `(Ligne ${sp.line.LineId} - ${sp.line.Name})` : ""}
                                                        </small>
                                                    </div>
                                                    <Button variant="outline-danger" onClick={() => handleDeletePickup(sp.id, sp.days, sp.isHalfDay ? 3 : 2)}>
                                                        <FontAwesomeIcon icon={faTimes} /> Supprimer
                                                    </Button>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                );
                            })()
                        }
                    </>
                </Card.Body>

                <Card.Footer className="small text-muted">
                    <ul className="mb-0 ps-3">
                        <li>Si un jour n'a pas de réglages spécifiques, les réglages par défaut seront utilisés.</li>
                        <li>Les heures de retour sont automatiquement définies : 16h30 (lun-jeu) et 12h30 (ven).</li>
                        <li>Les points d'arrêt disponibles sont ceux définis par l'administration.</li>
                        <li>Sans point d'arrêt, l'élève ne sera pas pris en charge par le transport scolaire.</li>
                    </ul>
                </Card.Footer>
            </Card>
        </>
    );
};

const TransportForm = ({ pickupPoints, toEdit, settings, onChange, dayValue, autoReturnTimes, isDefault }) => {
    const returnTime = isDefault
        ? (settings.returnTime || "16:30")
        : (settings.returnTime || autoReturnTimes[dayValue]);

    const selectedGoPoint = pickupPoints.find(p => p.Name === settings.goPoint);
    const selectedReturnPoint = pickupPoints.find(p => p.Name === settings.returnPoint);
    const selectedReturnHalfDayPoint = pickupPoints.find(p => p.Name === settings.returnPointHalfDay);

    const RenderRow = ({ label, field, point, time, onPointChange, onTimeChange, defaultTime, readOnly }) => (
        <Form.Group as={Row} className="align-items-center mb-3">
            <Form.Label column sm="2" className="fw-bold">
                {label}
            </Form.Label>
            <Col sm="5">
                <Form.Control
                    as="select"
                    disabled={!toEdit}
                    value={settings[field] || ""}
                    onChange={e => onPointChange(e.target.value)}
                >
                    <option value="">Sélectionnez un point d'arrêt</option>
                    {pickupPoints.map(p => (
                        <option key={p.PickupId} value={p.Name}>
                            {p.Name} → {p.line ? `Ligne ${p.line.LineId} : ${p.line.Name}` : "Aucune ligne"}
                        </option>
                    ))}
                </Form.Control>
            </Col>
            <Col sm="5">
                <Row className="align-items-center">
                    <Col xs="4">
                        <Form.Label className="mb-0">Heure</Form.Label>
                    </Col>
                    <Col xs="8">
                        <Form.Control
                            type="time"
                            disabled
                            value={time || defaultTime}
                            onChange={e => onTimeChange?.(e.target.value)}
                            readOnly={readOnly}
                        />
                    </Col>
                </Row>
            </Col>
        </Form.Group>
    );

    return (
        <>
            {/* Aller */}
            <RenderRow
                label="Aller"
                field="goPoint"
                point={selectedGoPoint}
                time={selectedGoPoint?.ArrivalGo}
                defaultTime=""
                onPointChange={val => {
                    onChange("goPoint", val);
                }}
                onTimeChange={val => onChange("goTime", val)}
            />

            {/* Retour */}
            <RenderRow
                label="Retour"
                field="returnPoint"
                point={selectedReturnPoint}
                time={selectedReturnPoint?.ArrivalReturn}
                defaultTime=""
                onPointChange={val => onChange("returnPoint", val)}
                readOnly={isDefault}
            />

            {/* Retour demi-journée */}
            <RenderRow
                label="Retour (demi-journée)"
                field="returnPointHalfDay"
                point={selectedReturnHalfDayPoint}
                time={selectedReturnHalfDayPoint?.ArrivalReturnHalfDay}
                defaultTime=""
                onPointChange={val => onChange("returnPointHalfDay", val)}
                readOnly={isDefault}
            />
        </>
    );
};

export default StudentTransport;