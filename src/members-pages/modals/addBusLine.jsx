import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { ENDPOINT, postAuthRequest } from '../../links/links';
import { post } from 'jquery';

const AddBusLine = ({ show, handleClose, handleSave, employees }) => {
    const [busLineName, setBusLineName] = useState('');
    const [driver, setDriver] = useState('');
    const [assistant, setAssistant] = useState('');

    const token = JSON.parse(sessionStorage.getItem("userData"))?.token?.Api_token;

    const handleSubmit = () => {
        const newBusLine = new FormData();
        newBusLine.append('Name', busLineName);
        newBusLine.append('DriverId', driver);
        newBusLine.append('AssistantId', assistant);

        fetch(ENDPOINT('bus'), postAuthRequest(newBusLine, token))
            .then(res => res.json())
            .then(r => {
                if (r.status) {
                    swal("Success", "Bus line added successfully", "success").then(() => {
                        handleSave(newBusLine);
                        handleClose();
                    });
                } else {
                    swal("Error", "Failed to add bus line", "error").then(() => {
                        console.log([r.response, JSON.stringify(newBusLine)]);
                    });
                }
            });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Ajouter une ligne de bus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBusLineName">
                        <Form.Label>Nom de la ligne</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom de la ligne"
                            value={busLineName}
                            onChange={(e) => setBusLineName(e.target.value)}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formDriver">
                                <Form.Label>Chauffeur</Form.Label>
                                <Form.Control
                                    as="select"
                                    placeholder="Entrez le nom du chauffeur"
                                    value={driver}
                                    onChange={(e) => {setDriver(e.target.value); if (e.target.value === assistant) setAssistant('');}}
                                >
                                    <option value="">Sélectionnez un chauffeur</option>
                                    {employees.map((emp) => (
                                        <option key={emp.EmployeeId} value={emp.EmployeeId}>
                                            {`${emp.Firstname} ${emp.Lastname}`}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formAssistant">
                                <Form.Label>Assistant</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={assistant}
                                    onChange={(e) => {setAssistant(e.target.value); if (e.target.value === driver) setDriver('');}}
                                >
                                    <option value="">Sélectionnez un assistant</option>
                                    {employees.map((emp) => (
                                        <option key={emp.EmployeeId} value={emp.EmployeeId}>
                                            {`${emp.Firstname} ${emp.Lastname}`}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
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
        </Modal >
    );
};

export default AddBusLine;