import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';

export default function AddEditFee({
    showModal,
    setShowModal,
    charges,
    setCharges,
    editingCharge,
    setEditingCharge,
    selectedTerm,
}) {
    const [formCharge, setFormCharge] = useState({ name: '', amount: 0 });

    // Met à jour les champs si on modifie une charge
    useEffect(() => {
        if (editingCharge) {
            setFormCharge(editingCharge);
        } else {
            setFormCharge({ name: '', amount: 0 });
        }
    }, [editingCharge, showModal]);

    const handleClose = () => {
        setShowModal(false);
        setEditingCharge(null);
        setFormCharge({ name: '', amount: 0 });
    };

    const handleSubmit = () => {
        if (!formCharge.Name.trim()) {
            alert('Veuillez saisir un nom de charge.');
            return;
        }
        if (formCharge.Amount <= 0) {
            alert('Le montant doit être supérieur à 0.');
            return;
        }

        if (editingCharge) {
            setCharges(prev =>
                prev.map(c =>
                    c.id === editingCharge.id ? {
                        ...formCharge, id: editingCharge.id,
                        term: selectedTerm
                    } : c
                )
            );
        } else {
            setCharges(prev => [...prev, {
                ...formCharge, id: Date.now(),
                term: selectedTerm
            }]);
        }

        handleClose();
    };

    const handleNameChange = (e) =>
        setFormCharge({ ...formCharge, name: e.target.value });

    const handleAmountChange = (e) => {
        const value = Number(e.target.value);
        setFormCharge({ ...formCharge, amount: isNaN(value) ? 0 : value });
    };

    const handleEditClick = (charge) => {
        setEditingCharge(charge);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Supprimer cette charge ?')) {
            setCharges(prev => prev.filter(c => c.id !== id));
        }
    };

    const totalAmount = charges.reduce((sum, c) => sum + c.Amount, 0);

    return (
        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingCharge ? 'Modifier une charge' : 'Ajouter une charge'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Formulaire */}
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom de la charge</Form.Label>
                            <Form.Control
                                type="text"
                                value={formCharge.Name}
                                onChange={handleNameChange}
                                placeholder="Ex. Fournitures scolaires"
                                autoFocus
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Montant (RWF)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formCharge.Amount}
                                onChange={handleAmountChange}
                                placeholder="Ex. 20000"
                                required
                                min={0}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-end">
                        <Button variant="success" onClick={handleSubmit}>
                            Ajouter
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Header className="mt-4">
                <Modal.Title>Charges existantes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Liste des charges */}
                {charges.length > 0 && (
                    <>
                        <ListGroup>
                            {charges.map((charge) => (
                                <ListGroup.Item key={charge.id}>
                                    <Row>
                                        <Col>{charge.Name}</Col>
                                        <Col>{charge.Amount.toLocaleString()} RWF</Col>
                                        <Col className="text-end">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEditClick(charge)}
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(charge.id)}
                                            >
                                                🗑️
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item className="fw-bold text-end">
                                Total : {totalAmount.toLocaleString()} RWF
                            </ListGroup.Item>
                        </ListGroup>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Enregistrer les modifications
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
