import React, { useState, useEffect } from "react";
import { Nav, Form, Row, Col, Button } from "react-bootstrap";
import { ENDPOINT, getAuthRequest, Loading } from "../../links/links";

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

    useEffect(() => {
        const fetchPickupPoints = async () => {
            try {
                const res = await fetch(ENDPOINT("pickup"), getAuthRequest(token));
                const data = await res.json();
                if (data.status === 0) return;
                console.log("Fetched pickup points:", data.response);
                setPickupPoints(data.response);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPickupPoints();
    }, [token]);

    const handleChange = (dayValue, field, value) => {
        setTransportSettings(prev => ({
            ...prev,
            [dayValue]: { ...prev[dayValue], [field]: value }
        }));
    };

    const handleSave = async () => {
        try {
            console.log("student", student);
        
            const payload = daysOfWeek.map(day => ({
                day: day.value,
                goPoint: transportSettings[day.value]?.goPoint || defaultSettings.goPoint,
                goTime: transportSettings[day.value]?.goTime || defaultSettings.goTime,
                returnPoint: transportSettings[day.value]?.returnPoint || defaultSettings.returnPoint,
                returnTime: transportSettings[day.value]?.returnTime || defaultReturnTimes[day.value]
            }));

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
                alert("Mise à jour réussie !");
            } else {
                alert("Erreur : " + data.response);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la connexion au serveur.");
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Nav variant="pills" fill activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Nav.Item>
                    <Nav.Link eventKey="all">Tous les jours</Nav.Link>
                </Nav.Item>
                {daysOfWeek.map(day => (
                    <Nav.Item key={day.value}>
                        <Nav.Link eventKey={String(day.value)}>{day.label}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            {activeTab === "all" && (
                <TransportForm
                    pickupPoints={pickupPoints}
                    toEdit={toEdit}
                    settings={defaultSettings}
                    onChange={(field, value) => setDefaultSettings(prev => ({ ...prev, [field]: value }))}
                    days={daysOfWeek}
                    autoReturnTimes={defaultReturnTimes}
                    isDefault={true}
                />
            )}

            {daysOfWeek.map(day => activeTab === String(day.value) && (
                <TransportForm
                    key={day.value}
                    pickupPoints={pickupPoints}
                    toEdit={toEdit}
                    settings={transportSettings[day.value] || {}}
                    onChange={(field, value) => handleChange(day.value, field, value)}
                    dayValue={day.value}
                    autoReturnTimes={defaultReturnTimes}
                />
            ))}

            <div className="mt-3">
                <Button onClick={handleSave} variant="success">Enregistrer</Button>
            </div>
        </>
    );
};

const TransportForm = ({ pickupPoints, toEdit, settings, onChange, dayValue, autoReturnTimes, isDefault }) => {
    const returnTime = isDefault
        ? (settings.returnTime || "16:30")
        : (settings.returnTime || autoReturnTimes[dayValue]);
        
    // Trouver les arrêts sélectionnés
    const selectedGoPoint = pickupPoints.find(p => p.Name === settings.goPoint);
    const selectedReturnPoint = pickupPoints.find(p => p.Name === settings.returnPoint);

    return (
        <>
            {/* Aller */}
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Aller</Form.Label>
                <Col sm="5">
                    <Form.Control
                        as="select"
                        disabled={!toEdit}
                        value={settings.goPoint || ""}
                        onChange={e => {onChange("goPoint", e.target.value); onChange("returnPoint", e.target.value);}}
                    >
                        <option value="">Sélectionnez un point d'arrêt</option>
                        {pickupPoints.map(p => (
                            <option key={p.PickupId} value={p.Name}>
                                {p.Name} → {p.line ? `Ligne ${p.line.LineId} : ${p.line.Name}` : "Aucune ligne associée"}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col sm="4">
                    <Form.Group as={Row} className="mb-3">
                        <Col xs="2">
                            <Form.Label>Heure</Form.Label>
                        </Col>
                        <Col xs="10">
                            <Form.Control
                                type="time"
                                disabled
                                value={selectedGoPoint?.ArrivalGo || ""}
                                onChange={e => onChange("goTime", e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                </Col>
            </Form.Group>

            {/* Retour */}
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Retour</Form.Label>
                <Col sm="5">
                    <Form.Control
                        as="select"
                        disabled={!toEdit}
                        value={settings.returnPoint || ""}
                        onChange={e => onChange("returnPoint", e.target.value)}
                    >
                        <option value="">Sélectionnez un point d'arrêt</option>
                        {pickupPoints.map(p => (
                            <option key={p.PickupId} value={p.Name}>
                                {p.Name} → {p.line ? `Ligne ${p.line.LineId} : ${p.line.Name}` : "Aucune ligne associée"}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col sm="4">
                    <Form.Group as={Row} className="mb-3">
                        <Col xs="2">
                            <Form.Label>Heure</Form.Label>
                        </Col>
                        <Col xs="10">
                            <Form.Control
                                type="time"
                                disabled
                                value={selectedReturnPoint?.ArrivalReturn || returnTime}
                                readOnly={isDefault}
                            />
                        </Col>
                    </Form.Group>
                </Col>
            </Form.Group>
        </>
    );
};

export default StudentTransport;