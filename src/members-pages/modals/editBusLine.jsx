import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap"
import { useState, useEffect } from "react"
import { ENDPOINT, postAuthRequest, putAuthRequest } from "../../links/links"
import swal from "sweetalert"

export const EditBusLine = ({
    show,
    handleCloseModal,
    line,
    employees,
    onSave
}) => {
    const [driverId, setDriverId] = useState("")
    const [assistantId, setAssistantId] = useState("")
    const [lineName, setLineName] = useState(line ? line.name : "")
    const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token

    // Préremplir avec les valeurs actuelles de la ligne
    useEffect(() => {
        if (line) {
            setDriverId(line.driver ? line.driver.EmployeeId : "")
            setAssistantId(line.assistant ? line.assistant.EmployeeId : "")
        }
    }, [line])

    // Détecte si employees est chargé
    const isLoading = !Array.isArray(employees)

    // Sauvegarde via POST
    const handleSave = async () => {
        try {
            const payload = {}
            if (driverId) payload.DriverId = driverId
            if (assistantId) payload.AssistantId = assistantId
            if (lineName) payload.LineName = lineName
            payload.LineId = line.id

            const data = JSON.stringify(payload);
            console.log(data)

            // POST vers l’API
            fetch(ENDPOINT(`bus/${line.id}`), putAuthRequest(data, token))
                .then(res => res.json())
                .then((updatedLine) => {
                    if (updatedLine.status) {
                        swal("Mise à jour effectuée").then(() => {
                            handleCloseModal()
                            // Optionnel : callback vers le parent
                            if (onSave) onSave(updatedLine)
                        })
                    } else {
                        swal("Erreur lors de la mise à jour")
                    }
                })
        } catch (err) {
            console.error("Erreur update driver/assistant", err)
            swal("Erreur lors de la mise à jour")
        }
    }

    return (
        <Modal show={show} size="lg" centered onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier équipe – {line?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center py-4">
                        <Spinner animation="border" role="status" />
                        <span className="ms-2">Chargement des employés...</span>
                    </div>
                ) : (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom de la ligne</Form.Label>
                            <Form.Control type="text" value={lineName} onChange={e => setLineName(e.target.value)} />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chauffeur</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={driverId}
                                        onChange={e => setDriverId(e.target.value)}
                                    >
                                        <option value="">-- Sélectionner un chauffeur --</option>
                                        {(employees || [])
                                            .filter(emp => emp.isEmployed)
                                            .map(emp => (
                                                <option key={emp.EmployeeId} value={emp.EmployeeId}>
                                                    {emp.Firstname} {emp.Lastname}
                                                </option>
                                            ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assistant</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={assistantId}
                                        onChange={e => setAssistantId(e.target.value)}
                                    >
                                        <option value="">-- Sélectionner un assistant --</option>
                                        {(employees || [])
                                            .filter(emp => emp.isEmployed)
                                            .map(emp => (
                                                <option key={emp.EmployeeId} value={emp.EmployeeId}>
                                                    {emp.Firstname} {emp.Lastname}
                                                </option>
                                            ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                    </Form>
                )}
            </Modal.Body>
            {!isLoading && (
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    )
}
