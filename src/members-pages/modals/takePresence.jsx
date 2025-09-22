import moment from "moment";
import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const TakePresence = ({ show, handleClose, students }) => {
    const [presence, setPresence] = useState(
        students.reduce((acc, student) => {
            acc[student.id] = false;
            return acc;
        }, {})
    );

    const handleCheckboxChange = (id) => {
        setPresence((prevPresence) => ({
            ...prevPresence,
            [id]: !prevPresence[id],
        }));
    };

    const handleSubmit = () => {
        console.log("Presence data:", presence);
        handleClose();
    };

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const isToday = (date) => date === new Date().toISOString().split("T")[0];

    return (
        <Modal show={show} onHide={handleClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Prise de présence</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <Form>
                    <Form.Group controlId="presence-date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            max={new Date().toISOString().split("T")[0]} // Lock future dates
                            defaultValue={new Date().toISOString().split("T")[0]} // Default to today's date
                            onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Row>
                <Col>
                    <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <Form>
                            {students.map((student) => (
                                <Form.Group key={student.id} controlId={`presence-${student.id}`}>
                                    <Form.Check
                                        type="checkbox"
                                        label={student.name}
                                        checked={presence[student.id]}
                                        onChange={() => handleCheckboxChange(student.id)}
                                        disabled={!isToday(selectedDate)} // Disable if not today's date
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    </Modal.Body>
                </Col>
                <Col>
                    <Modal.Body style={{ maxHeight: "100vh", overflowY: "auto" }}>
                        <Form.Group controlId="presence-summary">
                            <Form.Label>Résumé des présences</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                readOnly
                                value={Object.entries(
                                    groupByStop(students.filter((s) => presence[s.id]))
                                )
                                    .map(([stop, group]) => messaging(stop, group))
                                    .join("\n\n")}
                            />
                        </Form.Group>
                        <Button
                            variant="success"
                            onClick={() => {
                                const message = Object.entries(
                                    groupByStop(students.filter((s) => presence[s.id]))
                                )
                                    .map(([stop, group]) => messaging(stop, group))
                                    .join("\n\n");

                                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, "_blank");
                            }}
                        >
                            Envoyer sur Whatsapp
                        </Button>
                    </Modal.Body>
                </Col>
            </Row>
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

const messaging = (stop, students) => {
    let stopText = stop || "Arrêt inconnu";
    return `🚏 ${stopText} - ${moment().format("HH:mm")}\n` + students
        .map(student => `👉 ${student.name.toUpperCase()}`)
        .join("\n");
};

const groupByStop = (students) => {
    return students.reduce((acc, student) => {
        const stop = student.stop || "Arrêt inconnu";
        if (!acc[stop]) acc[stop] = [];
        acc[stop].push(student);
        return acc;
    }, {});
};

export default TakePresence;