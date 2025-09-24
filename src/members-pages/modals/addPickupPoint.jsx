import { Modal, Form, Button, Row, Col } from "react-bootstrap"
import { ENDPOINT, postAuthRequest } from "../../links/links"
import { Line } from "react-chartjs-2"
import { useState } from "react"
import { Tab, Tabs } from "react-bootstrap";
import swal from "sweetalert";

export const AddPickupPoint = ({ showModal, selectedLine, handleCloseModal, pickups }) => {
    const [pickupName, setPickupName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [GoTime, setGoTime] = useState("");
    const [ReturnTime, setReturnTime] = useState("");
    const [ReturnTimeHalfDay, setReturnTimeHalfDay] = useState("");
    const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

    const storePickupPoint = () => {
        // logique d’enregistrement ici (à implémenter)
        // const data = {
        //     Name: pickupName,
        //     LineId: selectedLine.id,
        //     Latitude: latitude,
        //     Longitude: longitude,
        //     ArrivalGo: GoTime,       // ⚠ correspond à la colonne DB
        //     ArrivalReturn: ReturnTime, // ⚠ correspond à la colonne DB
        // };

        const data = new FormData();
        data.append("Name", pickupName);
        data.append("LineId", selectedLine.id);
        data.append("Latitude", latitude);
        data.append("Longitude", longitude);
        data.append("ArrivalGo", GoTime);
        data.append("ArrivalReturn", ReturnTime);
        data.append("ArrivalReturnHalfDay", ReturnTimeHalfDay);

        fetch(ENDPOINT("pickup"), postAuthRequest(data, "Bearer " + token))
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    console.log("Point de ramassage ajouté:", data);
                    handleCloseModal();
                } else {
                    swal("Erreur", "Échec de l'ajout du point de ramassage", "error");
                    return;
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du point de ramassage:", error);
            });
    }

    const updatePickupPoint = () => {
        fetch(ENDPOINT("pickup/" + selectedPickupPoint), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                LineId: selectedLine.id
            })
        })
            .then(response => response.json())
            .then(data => {
                swal("Succès", "Point de ramassage mis à jour avec succès", "success").then(() => {
                    console.log("Point de ramassage mis à jour:", data);
                    handleCloseModal();
                });
            })
            .catch(error => {
                swal("Erreur", "Échec de la mise à jour du point de ramassage", "error").then(() => {
                    console.error("Erreur lors de la mise à jour du point de ramassage:", error);
                });
            });
    };
    return (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Gestion des points de ramassage</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="add" id="pickupPointTabs" className="mb-3">
                    {/* Onglet Ajouter */}
                    <Tab eventKey="add" title="Ajouter" onClick={() => setIsEditing(false)}>
                        <Form>
                            {/* Nom du point */}
                            <Form.Group controlId="pickupName">
                                <Form.Label>Nom du point</Form.Label>
                                <Form.Control
                                    onChange={(e) => setPickupName(e.target.value)}
                                    type="text"
                                    placeholder="Ex: Gisozi - Zuba Residence"
                                />
                            </Form.Group>

                            {/* Ligne prédéfinie */}
                            <Form.Group controlId="busLine" className="mt-3">
                                <Form.Label>Ligne de bus</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedLine?.name || "Non défini"}
                                    disabled
                                />
                            </Form.Group>

                            {/* Heures */}
                            <Row>
                                <Col>
                                    <Form.Group controlId="pickupGoTime" className="mt-3">
                                        <Form.Label>Heure d'aller</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setGoTime(e.target.value)}
                                            type="time"
                                            min="05:00"
                                            max="10:00"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="pickupReturnTime" className="mt-3">
                                        <Form.Label>Heure de retour</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setReturnTime(e.target.value)}
                                            type="time"
                                            min="11:00"
                                            max="20:00"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="pickupReturnTime" className="mt-3">
                                        <Form.Label>Heure de retour (demi-journée)</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setReturnTimeHalfDay(e.target.value)}
                                            type="time"
                                            min="11:00"
                                            max="20:00"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Coordonnées GPS */}
                            <Row>
                                <Col>
                                    <Form.Group controlId="pickupLatitude" className="mt-3">
                                        <Form.Label>Latitude</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setLatitude(e.target.value)}
                                            type="text"
                                            placeholder="Ex: -1.9441"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="pickupLongitude" className="mt-3">
                                        <Form.Label>Longitude</Form.Label>
                                        <Form.Control
                                            onChange={(e) => setLongitude(e.target.value)}
                                            type="text"
                                            placeholder="Ex: 30.0619"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Tab>

                    {/* Onglet Mettre à jour */}
                    <Tab eventKey="update" title="Mettre à jour" onClick={() => setIsEditing(true)}>
                        <Form>
                            <Form.Group controlId="selectPickupPoint">
                                <Form.Label>Sélectionner un point de ramassage</Form.Label>
                                <Form.Control as="select" onChange={(e) => { setSelectedPickupPoint(e.target.value); console.log(e.target.value) }}>
                                    <option value="0">Sélectionner un point de ramassage</option>
                                    {
                                        pickups.map((point) => {
                                            if (point.LineId !== selectedLine.id) {
                                                return (
                                                    <option key={point.PickupId} value={point.PickupId}>
                                                        {point.Name} - Ligne {point.LineId} ({point.line.Name})
                                                    </option>
                                                );
                                            }
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Annuler
                </Button>
                {isEditing ?
                    (
                        <Button variant="warning" onClick={() => { updatePickupPoint() }}>
                            Mettre à jour
                        </Button>
                    )
                    : (
                        <Button
                            variant="success"
                            onClick={() => { storePickupPoint() }}
                        >
                            Ajouter
                        </Button>
                    )}
            </Modal.Footer>
        </Modal>
    );
}