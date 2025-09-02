import { Col, Form, Modal, Row } from "react-bootstrap";

const AddBus = ({ show, handleCloseAddBus }) => {
    return (
        <Modal show={show} onHide={handleCloseAddBus} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un bus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBusNumber">
                                <Form.Label>Marque & Modèle du véhicule</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le numéro du bus" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBusNumber">
                                <Form.Label>Numéro de plaque</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le numéro du bus" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBusLines">
                                <Form.Label>Lignes</Form.Label>
                                <Form.Control as="select" multiple>
                                    <option value="line1">Ligne 1</option>
                                    <option value="line2">Ligne 2</option>
                                    <option value="line3">Ligne 3</option>
                                    <option value="line4">Ligne 4</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddBus;