import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPickupPoint = ({ show, handleClose, onSave, pickupPoint }) => {
    const [formData, setFormData] = useState({
        name: pickupPoint?.name || "",
        latitude: pickupPoint?.latitude || "",
        longitude: pickupPoint?.longitude || "",
        departureTime: pickupPoint?.departureTime || "",
        returnTime: pickupPoint?.returnTime || "",
        busLine: pickupPoint?.busLine || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSave(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
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
                    <Form.Group controlId="pickupPointLatitude">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="Latitude"
                        />
                    </Form.Group>
                    <Form.Group controlId="pickupPointLongitude">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="Longitude"
                        />
                    </Form.Group>
                    <Form.Group controlId="pickupPointDepartureTime">
                        <Form.Label>Heure d'aller</Form.Label>
                        <Form.Control
                            type="time"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="pickupPointReturnTime">
                        <Form.Label>Heure de retour</Form.Label>
                        <Form.Control
                            type="time"
                            name="returnTime"
                            value={formData.returnTime}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="pickupPointBusLine">
                        <Form.Label>Ligne de bus</Form.Label>
                        <Form.Control
                            type="text"
                            name="busLine"
                            value={formData.busLine}
                            onChange={handleChange}
                            placeholder="Ligne de bus"
                        />
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