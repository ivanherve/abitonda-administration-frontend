import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import { useState } from "react";
import { Button, Col, Form, Image, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import pic from '../../img/ppx.jpg';


library.add(
    faEdit,
    faTimes,
    faArrowCircleDown
)

export default function GeneralInformation(props) {
    const [toEdit, setToEdit] = useState(false);
    const [showBirthDayAlert, setShowBirthDayAlert] = useState(false);

    const student = props.student;

    return (
        <div>
            <Row>
                <Col xs='3'>
                    {
                        student.Picture
                            ?
                            <Image src={student.Picture} rounded />
                            :
                            <Image src={pic} rounded />
                    }

                    <hr />
                    <h4>{student.Lastname}</h4>
                    <h6><i>{student.Firstname}</i></h6>
                    <Row>
                        <Col>
                            {
                                toEdit
                                    ?
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={
                                            <Tooltip>
                                                Annuler
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{ width: '100%' }} variant="outline-info" onClick={() => setToEdit(false)}>
                                            <FontAwesomeIcon icon={["fas", "times"]} />
                                        </Button>
                                    </OverlayTrigger>
                                    :
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={
                                            <Tooltip>
                                                Modifier
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{ width: '100%' }} variant="light" onClick={() => setToEdit(true)}>
                                            <FontAwesomeIcon icon={["far", "edit"]} />
                                        </Button>
                                    </OverlayTrigger>
                            }
                        </Col>
                        <Col>
                            {
                                !toEdit
                                &&
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={
                                        <Tooltip>
                                            Supprimer
                                        </Tooltip>
                                    }
                                >
                                    <Button style={{ width: '100%' }} variant="light">
                                        <FontAwesomeIcon icon={["fas", "times"]} />
                                    </Button>
                                </OverlayTrigger>
                            }

                        </Col>
                    </Row>
                    <br />
                    {
                        !toEdit
                        &&
                        <Button variant='light' style={{ width: '100%' }}>
                            Fiche d'inscription <FontAwesomeIcon icon={['fas','arrow-circle-down']} />
                        </Button>
                    }
                </Col>
                <Col>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextNom">
                            <Form.Label column sm="2">
                                Nom
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control disabled={!toEdit} placeholder={student.Lastname} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextPrenom">
                            <Form.Label column sm="2">
                                Prénom
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control disabled={!toEdit} placeholder={student.Firstname} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextBirthday">
                            <Form.Label column sm="2">
                                Date de naissance
                            </Form.Label>
                            <Col sm="10">
                                {
                                    !toEdit
                                        ?
                                        <Form.Control disabled placeholder={moment(student.Birthdate).format('Do MMMM YYYY')} />
                                        :
                                        <Form.Control type="date" />
                                }
                            </Col>
                        </Form.Group>
                        <hr />
                        <Form.Group as={Row} controlId="formPlaintextClass">
                            <Form.Label column sm="2">
                                Classe
                            </Form.Label>
                            <Col sm="10">
                                {
                                    !toEdit
                                        ?
                                        <Form.Control disabled placeholder={student.Classe} />
                                        :
                                        <Form.Control as='select' disabled={!toEdit} placeholder="CP">
                                            <option>TPS</option>
                                            <option>PS</option>
                                            <option>MS</option>
                                            <option>GS</option>
                                            <option>CP</option>
                                            <option>CE1</option>
                                        </Form.Control>
                                }
                            </Col>
                        </Form.Group>
                        <hr />
                        <Form.Group as={Row} controlId="formPlaintextCantine">
                            <Form.Label column sm="2">
                                Cantine
                            </Form.Label>
                            <Col sm="1">
                                <Form.Check type="checkbox" disabled={!toEdit} checked={student.Canteen} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextTransport">
                            <Form.Label column sm="2">
                                Transport
                            </Form.Label>
                            <Col sm="1">
                                <Form.Check type="checkbox" disabled={!toEdit} checked={student.Transport} />
                            </Col>
                        </Form.Group>
                        <hr />
                        <Form.Group as={Row} controlId="formPlaintextActivities">
                            <Form.Label column sm="4">
                                Activités Parascolaires
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control as="select" disabled={!toEdit}>
                                    <option>Aucun</option>
                                    <option>Karaté</option>
                                    <option>Piscine</option>
                                    <option>Dance Traditionelle</option>
                                    <option>Musique</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <hr />
                        <Form.Group as={Row} controlId="formPlaintextActivities">
                            <Form.Label column sm="4">
                                Mode de garde *
                            </Form.Label>
                            <Col sm="8">
                                <Form.Check
                                    type="radio"
                                    label="Journée"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    disabled={!toEdit}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Demi-journée"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    disabled={!toEdit}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextActivities">
                            <Form.Label column sm="4">
                                Allergies
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control as="textarea" disabled={!toEdit} />
                            </Col>
                        </Form.Group>
                        <hr />
                        {
                            toEdit
                            &&
                            <Button variant='outline-primary'>
                                Sauvegarder
                            </Button>
                        }

                    </Form>
                </Col>
            </Row>
        </div>
    )
}