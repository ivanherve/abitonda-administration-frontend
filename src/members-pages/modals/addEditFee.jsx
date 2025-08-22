import React, { useEffect, useState } from "react";
import { Modal, Button, Form, ListGroup, Row, Col, Badge } from "react-bootstrap";
import swal from "sweetalert";
import { ENDPOINT, postAuthRequest, getAuthRequest, Loading } from "../../links/links"; // adapte le chemin
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function AddEditFee({
    showModal,
    setShowModal,
    charges,
    setCharges,
    editingCharge,
    setEditingCharge
}) {
    const [formCharge, setFormCharge] = useState({ Name: "", Amount: 0, Term: "T1" });
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
    useEffect(() => {
        if (editingCharge) {
            setFormCharge({
                Name: editingCharge.Name,
                Amount: editingCharge.Amount,
                Term: editingCharge.Term || "T1",
            });
        } else {
            setFormCharge({ Name: "", Amount: 0, Term: "T1" });
        }
    }, [editingCharge, showModal]);

    const handleClose = () => {
        setShowModal(false);
        setEditingCharge(null);
        setFormCharge({ Name: "", Amount: 0, Term: "T1" });
    };

    // --- Fonctions backend ---
    const saveChargeToBackend = async (charge) => {
        setLoading(true);
        try {
            const url = editingCharge ? ENDPOINT(`fees/${editingCharge.FeesId}`) : ENDPOINT("fees");
            const response = await fetch(
                url,
                postAuthRequest(JSON.stringify(charge), token)
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erreur lors de l'enregistrement");
            return data;
        } finally {
            setLoading(false);
        }
    };

    // Suppression
    const deleteChargeFromBackend = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(
                ENDPOINT(`fees/${id}`),
                { ...getAuthRequest(token), method: "DELETE" }
            );
            if (!response.ok) throw new Error("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---
    const handleSubmit = async () => {
        if (!formCharge.Name.trim()) {
            swal("Erreur", "Veuillez saisir un nom de charge.", "error");
            return;
        }
        if (formCharge.Amount <= 0) {
            swal("Erreur", "Le montant doit être supérieur à 0.", "error");
            return;
        }

        try {
            const savedCharge = await saveChargeToBackend({
                ...formCharge,
                IsActive: 1,
                FeesId: editingCharge ? editingCharge.FeesId : undefined
            });

            if (editingCharge) {
                setCharges((prev) =>
                    prev.map((c) =>
                        c.FeesId === editingCharge.FeesId ? savedCharge : c
                    )
                );
            } else {
                setCharges((prev) => [...prev, savedCharge]);
            }

            handleClose();
            swal("Succès", editingCharge ? "Charge mise à jour" : "Charge ajoutée", "success");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        swal({
            title: "Êtes-vous sûr ?",
            text: "Supprimer cette charge ?",
            icon: "warning",
            buttons: ["Annuler", "Supprimer"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    await deleteChargeFromBackend(id);
                    setCharges((prev) => prev.filter((c) => c.FeesId !== id));
                    swal("Supprimé", "La charge a été supprimée.", "success");
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };

    // --- Gestion formulaire ---
    const handleNameChange = (e) => setFormCharge({ ...formCharge, Name: e.target.value });
    const handleAmountChange = (e) => {
        const value = Number(e.target.value);
        setFormCharge({ ...formCharge, Amount: isNaN(value) ? 0 : value });
    };
    const handleTermChange = (e) => setFormCharge({ ...formCharge, Term: e.target.value });
    const handleEditClick = (charge) => {
        setEditingCharge(charge);
        setShowModal(true);
    };
    const handleSwitchToAdd = () => {
        setEditingCharge(null);
        setFormCharge({ Name: "", Amount: 0, Term: "T1" });
    };

    const totalAmount = charges.reduce((sum, c) => sum + c.Amount, 0);
    const sortedCharges = [...charges].sort((a, b) => b.Amount - a.Amount);

    const getTermBadgeColor = (term) => {
        switch (term) {
            case "T1": return "primary";
            case "T2": return "success";
            case "T3": return "warning";
            default: return "secondary";
        }
    };

    if (loading) return <Loading />;

    return (
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
            {/* Header */}
            <Modal.Header
                closeButton
                className={`d-flex align-items-center justify-content-between p-3 rounded-top ${editingCharge ? "bg-warning text-dark" : "bg-success text-white"}`}
            >
                <Modal.Title className="mb-0 fs-5 fw-bold">
                    {editingCharge ? <><FontAwesomeIcon icon={faPen} /> Modifier une charge</>
                        : <><FontAwesomeIcon icon={faPlus} /> Ajouter une charge</>}
                </Modal.Title>
                {editingCharge && (
                    <Button variant="outline-dark" size="sm" onClick={handleSwitchToAdd} className="ms-3 fw-bold">
                        Passer à l'ajout
                    </Button>
                )}
            </Modal.Header>

            {/* Formulaire */}
            <Modal.Body>
                <Row className="g-3 align-items-end">
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Nom de la charge</Form.Label>
                            <Form.Control
                                as="select"
                                value={formCharge.Name}
                                onChange={(e) => {
                                    const selectedCharge = charges.find(c => c.Name === e.target.value);
                                    setFormCharge({
                                        ...formCharge,
                                        Name: e.target.value,
                                        Amount: selectedCharge ? selectedCharge.Amount : 0, // valeur par défaut
                                    });
                                }}
                                autoFocus
                                required
                                className="shadow-sm rounded"
                            >
                                <option value="">-- Sélectionnez une charge --</option>
                                {charges.map((charge) => (
                                    <option key={charge.FeesId} value={charge.Name}>
                                        {charge.Name} ({charge.Amount.toLocaleString()} RWF)
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Montant (RWF)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formCharge.Amount}
                                disabled
                                placeholder="Ex. 20 000"
                                min={0}
                                className="shadow-sm rounded text-end"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Trimestre</Form.Label>
                            <Form.Control as="select" value={formCharge.Term} onChange={handleTermChange} required className="shadow-sm rounded">
                                <option value="T1">1er trimestre</option>
                                <option value="T2">2e trimestre</option>
                                <option value="T3">3e trimestre</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={2} className="d-flex align-items-end">
                        <Button variant={editingCharge ? "warning" : "success"} className="w-100 fw-bold shadow-sm" size="lg" onClick={handleSubmit}>
                            {editingCharge ? "Mettre à jour" : <><FontAwesomeIcon icon={faPlus} /> Ajouter</>}
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>

            {/* Liste des charges */}
            {sortedCharges.length > 0 && (
                <>
                    <Modal.Header className="bg-light">
                        <Modal.Title>Charges existantes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            {sortedCharges.map((charge) => (
                                <ListGroup.Item key={charge.FeesId} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{charge.Name}</strong>{" "}
                                        <Badge bg={getTermBadgeColor(charge.Term)} className="me-2">{charge.Term}</Badge>
                                        {charge.IsActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>}
                                    </div>
                                    <div>
                                        <Badge bg="info" className="me-3">{charge.Amount.toLocaleString()} RWF</Badge>
                                        {/* <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(charge)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </Button> */}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(charge.FeesId)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item className="fw-bold text-end bg-light">
                                Total : <Badge bg="dark">{totalAmount.toLocaleString()} RWF</Badge>
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                </>
            )}

            {/* Footer */}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fermer</Button>
                <Button variant={editingCharge ? "warning" : "success"} onClick={handleSubmit}>
                    {editingCharge ? "Enregistrer" : "Ajouter la charge"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
