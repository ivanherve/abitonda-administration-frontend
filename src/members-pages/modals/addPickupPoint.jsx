import { Modal, Form, Button, Row, Col } from "react-bootstrap"
import { ENDPOINT, postAuthRequest } from "../../links/links"
import { Line } from "react-chartjs-2"
import { useState } from "react"

export const AddPickupPoint = ({ showModal, selectedLine, handleCloseModal }) => {
    const [pickupName, setPickupName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [GoTime, setGoTime] = useState("");
    const [ReturnTime, setReturnTime] = useState("");
    const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

    const storePickupPoint = () => {
        // logique d’enregistrement ici (à implémenter)
        const data = {
            Name: pickupName,
            LineId: selectedLine.id,
            Latitude: latitude,
            Longitude: longitude,
            ArrivalGo: GoTime,       // ⚠ correspond à la colonne DB
            ArrivalReturn: ReturnTime, // ⚠ correspond à la colonne DB
        };

        fetch(ENDPOINT("pickup"), postAuthRequest(JSON.stringify(data), token))
            .then(response => response.json())
            .then(data => {
                console.log("Point de ramassage ajouté:", data);
                handleCloseModal();
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout du point de ramassage:", error);
            });
    }
    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un point de ramassage</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Annuler
                </Button>
                <Button
                    variant="success"
                    onClick={() => { storePickupPoint() }}
                >
                    Ajouter
                </Button>
            </Modal.Footer>
        </Modal>
    )
}