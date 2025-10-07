import moment from "moment";
import { useState } from "react";
import { Card, ListGroup, Col, Row, Tabs, Tab, Badge, Button } from "react-bootstrap";

const vehiculesData = [
    {
        id: 1,
        busNumber: 1,
        name: "Bus 1",
        brand: "TOYOTA",
        modele: "COASTER",
        numberPlace: 28,
        fuel: "DIESEL",
        PlateNumber: "RAC519N",
        historyRefuellment: [
            { id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-09-30" },
            { id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-09-29" },
            { id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-10-01" },
            { id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-10-03" }
        ],
        employees: {
            Driver: { EmployeeId: 0, Firstname: "JEAN-PAUL", Lastname: "" },
            Assistant: { EmployeeId: 0, Firstname: "ORPA", Lastname: "" }
        },
        busLines: { Tour1: { LineId: 1, Name: "Beretware - Karuruma - Kinyinya" } },
    },
    {
        id: 2,
        busNumber: 2,
        name: "Bus 2",
        brand: "TOYOTA",
        modele: "HIACE",
        numberPlace: 15,
        fuel: "PETROL",
        PlateNumber: "RAI726U",
        historyRefuellment: [{ id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-02-01" }],
        employees: {
            Driver: { EmployeeId: 0, Firstname: "SALEH", Lastname: "" },
            Assistant: { EmployeeId: 0, Firstname: "ROSINE", Lastname: "" }
        },
        busLines: { Tour1: { LineId: 2, Name: "Gikondo - Kicukiro" }, Tour2: { LineId: 5, Name: "Campus Gisozi" }, Tour3: { LineId: 6, Name: "Campus Kiyovu" } },
    },
    {
        id: 3,
        busNumber: 3,
        name: "Bus 3",
        brand: "HYUNDAI",
        modele: "H-1",
        numberPlace: 9,
        fuel: "PETROL",
        PlateNumber: "RAE883M",
        historyRefuellment: [{ id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-01-01" }],
        employees: {
            Driver: { EmployeeId: 0, Firstname: "", Lastname: "" },
            Assistant: { EmployeeId: 0, Firstname: "", Lastname: "" }
        },
        busLines: { Tour1: { LineId: 3, Name: "Kacyiru - Kinyinya - Kanombe" } },
    },
    {
        id: 4,
        busNumber: 4,
        name: "Bus 4",
        brand: "TOYOTA",
        modele: "COASTER",
        numberPlace: 28,
        fuel: "DIESEL",
        PlateNumber: "RAG152W",
        historyRefuellment: [{ id: 0, km: 0, litre: 0, unitPriceFuel: 0, totalPrice: 0, date: "2025-01-02" }],
        employees: {
            Driver: { EmployeeId: 0, Firstname: "", Lastname: "" },
            Assistant: { EmployeeId: 0, Firstname: "", Lastname: "" }
        },
        busLines: { Tour1: { LineId: 4, Name: "Nyamirambo - Ruyenzi" } },
    },
];

const Vehicule = () => {
    const [vehicules, setVehicules] = useState(vehiculesData);
    const [selectedVehicule, setSelectedVehicule] = useState(vehiculesData[0]);

    return (
        <div className="mt-3">
            <Row className="g-4">
                {/* Liste des véhicules */}
                <Col xs={3}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="fw-bold bg-primary text-white">
                            Véhicules{" "}
                            <Button variant="success" size="sm" className="float-end">
                                + Ajouter
                            </Button>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {vehicules.map((vehicule) => (
                                <ListGroup.Item
                                    key={vehicule.id}
                                    action
                                    onClick={() => setSelectedVehicule(vehicule)}
                                    className={`py-2 ${selectedVehicule?.id === vehicule.id
                                            ? "bg-light bg-opacity-10 border-start border-4"
                                            : ""
                                        }`}
                                >
                                    <div className="fw-semibold">{vehicule.name}</div>
                                    <small className="text-muted">
                                        <i>{vehicule.PlateNumber}</i> —{" "}
                                        {vehicule.employees?.Driver?.Firstname}{" "}
                                        {vehicule.employees?.Driver?.Lastname}
                                    </small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                {/* Détails du véhicule sélectionné */}
                <Col xs={9}>
                    {selectedVehicule && (
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-light">
                                <Card.Title className="mb-0">
                                    {selectedVehicule.name}
                                </Card.Title>
                                <p className="text-muted mb-0">
                                    <strong>{selectedVehicule.brand}</strong> —{" "}
                                    {selectedVehicule.modele}
                                </p>
                            </Card.Header>

                            <Card.Body>
                                <Row>
                                    <Col>
                                        <ul className="list-unstyled mb-0">
                                            <li>
                                                <strong>Immatriculation :</strong>{" "}
                                                {selectedVehicule.PlateNumber}
                                            </li>
                                            <li>
                                                <strong>Places :</strong>{" "}
                                                {selectedVehicule.numberPlace}
                                            </li>
                                            <li>
                                                <strong>Carburant :</strong>{" "}
                                                {selectedVehicule.fuel}
                                            </li>
                                        </ul>
                                    </Col>
                                    <Col>
                                        <ul className="list-unstyled mb-0 mt-3">
                                            <li>
                                                <strong>Chauffeur :</strong>{" "}
                                                {selectedVehicule.employees?.Driver?.Firstname}{" "}
                                                {selectedVehicule.employees?.Driver?.Lastname}
                                            </li>
                                            <li>
                                                <strong>Assistant :</strong>{" "}
                                                {selectedVehicule.employees?.Assistant?.Firstname}{" "}
                                                {selectedVehicule.employees?.Assistant?.Lastname}
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Card.Body>

                            <Tabs
                                defaultActiveKey="busLines"
                                id="vehicule-tabs"
                                className="px-3"
                                justify
                            >
                                {/* Lignes */}
                                <Tab eventKey="busLines" title="Lignes">
                                    <ListGroup variant="flush" className="mt-2">
                                        {Object.values(selectedVehicule.busLines || {}).map(
                                            (line, idx) => (
                                                <ListGroup.Item key={line.LineId}>
                                                    <div className="fw-bold mb-1">
                                                        Tour {idx + 1}
                                                    </div>
                                                    <div>
                                                        Ligne {line.LineId} — {line.Name}
                                                    </div>
                                                </ListGroup.Item>
                                            )
                                        )}
                                    </ListGroup>
                                </Tab>

                                {/* Historique */}
                                <Tab eventKey="history" title="Historique de ravitaillement">
                                    <ListGroup variant="flush" className="mt-2">
                                        {selectedVehicule.historyRefuellment?.map(
                                            (entry, index) => (
                                                <ListGroup.Item key={index}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold">
                                                            Ravitaillement {index + 1}
                                                        </span>
                                                        <Badge bg="info" text="dark">
                                                            {moment(entry.date).format("DD/MM/YYYY")}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-muted small mt-1">
                                                        Km: {entry.km} • {entry.litre} L •{" "}
                                                        {entry.unitPriceFuel} RWF/L
                                                    </div>
                                                    <div>
                                                        <strong>Total:</strong>{" "}
                                                        {entry.totalPrice} RWF
                                                    </div>
                                                </ListGroup.Item>
                                            )
                                        )}
                                    </ListGroup>
                                </Tab>
                            </Tabs>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Vehicule;