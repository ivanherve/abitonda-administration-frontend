import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function AddParent(props) {
    return (
        <Modal show={props.show} onHide={props.hide} centered size='xl'>
            <Modal.Header>
                <Modal.Title>Ajouter un parent / tuteur</Modal.Title>
            </Modal.Header>
            <Alert variant='warning'>Tous les champs sont obligatoires</Alert>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row} controlId='addparentfirstname'>
                        <Form.Label column sm='2'>
                            Prénom
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentlastname'>
                        <Form.Label column sm='2'>
                            Nom
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentphone'>
                        <Form.Label column sm='2'>
                            Téléphone
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentemail'>
                        <Form.Label column sm='2'>
                            E-mail
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control type="email" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentaddress'>
                        <Form.Label column sm='2'>
                            Adresse
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentprofession'>
                        <Form.Label column sm='2'>
                            Profession
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='addparentlink'>
                        <Form.Label column sm='2'>
                            Lien avec l'enfant
                        </Form.Label>
                        <Col sm='10'>
                            <Form.Control as='textarea' />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='light'>Ajouter</Button>
            </Modal.Footer>
        </Modal>
    )
}