import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ENDPOINT, postAuthRequest, putAuthRequest } from "../../links/links";

const EditPickupPoint = ({ show, handleClose, onSave, pickupPoint, busLines, directionId }) => {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
    const [formData, setFormData] = useState({
        name: pickupPoint?.stop || "",
        latitude: pickupPoint?.Latitude || "",
        longitude: pickupPoint?.Longitude || "",
        time: pickupPoint?.time || "",
        busLine: parseInt(pickupPoint?.busLine) || "",
        directionId: directionId || 1,
        coordinates: pickupPoint?.Latitude && pickupPoint?.Longitude
            ? `${pickupPoint.Latitude}, ${pickupPoint.Longitude}`
            : ""
    });

    useEffect(() => {
        if (pickupPoint) {
            setFormData({
                name: pickupPoint.stop || "",
                latitude: pickupPoint.Latitude || "",
                longitude: pickupPoint.Longitude || "",
                time: pickupPoint?.time || "",
                directionId: directionId || 1,
                busLine: parseInt(pickupPoint.busLine) || "",
                coordinates: pickupPoint.Latitude && pickupPoint.Longitude
                    ? `${pickupPoint.Latitude}, ${pickupPoint.Longitude}`
                    : ""
            });
        }
    }, [pickupPoint]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "coordinates") {
            const [lat, lng] = value.split(",").map(v => v.trim());
            setFormData({
                ...formData,
                coordinates: value,
                latitude: lat || "",
                longitude: lng || ""
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = () => {
        console.log("Saved Data:", formData);
        fetch(ENDPOINT(`pickup/${pickupPoint.PickupId}`), putAuthRequest(JSON.stringify(formData), "Bearer "+token))
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    console.log("Pickup point updated successfully:", data.response);
                    //onSave(data.response);
                } else {
                    console.error("Error updating pickup point:", data);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifier un arrêt de bus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="pickupPointName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nom de l'arrêt"
                        />
                    </Form.Group>

                    <Form.Group controlId="pickupPointCoordinates">
                        <Form.Label>Coordonnées (Latitude, Longitude)</Form.Label>
                        <Form.Control
                            type="text"
                            name="coordinates"
                            value={formData.coordinates || ""}
                            onChange={handleChange}
                            placeholder="-1.9752915937195084, 30.07707954608123"
                        />
                    </Form.Group>

                    <Form.Group controlId="pickupPointDepartureTime">
                        <Form.Label>Heure {directionId === 1 ? "d'aller" : "de retour"}</Form.Label>
                        <Form.Control
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="pickupPointBusLine">
                        <Form.Label>Ligne de bus</Form.Label>
                        <Form.Control
                            as="select"
                            name="busLine"
                            value={parseInt(formData.busLine)}
                            onChange={handleChange}
                        >
                            <option value="">Sélectionner une ligne</option>
                            {busLines.map((line) => (
                                <option key={line.id} value={line.id}>
                                    Ligne {line.id} {"->"} {line.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Enregistrer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditPickupPoint;