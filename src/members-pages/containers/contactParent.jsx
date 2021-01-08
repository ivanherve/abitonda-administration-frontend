import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ENDPOINT, getAuthRequest, Loading, usePrevious } from "../../links/links";
import AddParent from "../modals/addParent";
import AddStudent from "../modals/addStudent";

const { Row, Col, Alert, Button } = require("react-bootstrap");

library.add(
    faPlus,
    faEdit
)

export default function ContactParent(props) {
    const [showAddParent, setShowAddParent] = useState(false);
    const [parents, setParents] = useState([]);

    const token = JSON.parse(sessionStorage.getItem('userData')).token.Api_token;

    useEffect(() => {
        fetch(ENDPOINT(`parents?studentid=${props.studentId}`), getAuthRequest(token))
            .then(r => r.json())
            .then(r => {
                if (r.status) setParents(r.response)
            })
    }, [parents]);

    return (
        <div>
            <Button style={{ width: '100%' }} variant='light' onClick={() => setShowAddParent(true)}>
                <FontAwesomeIcon icon={['fas', "plus"]} /> Ajouter un Parent
            </Button>
            {
                parents.length < 1
                    ?
                    <div>
                        Il n'y a pas de parents
                    </div>
                    :
                    parents.map(p =>
                        <div key={parents.indexOf(p)}>
                            <hr />
                            <Row>
                                <Col xs='5'>
                                    <h2>{p.Firstname + ' ' + p.Lastname}</h2>
                                    <p>
                                        <i>{p.Link}</i>
                                    </p>
                                </Col>
                                <Col xs='5'>
                                    <ul>
                                        {
                                            p.Address
                                            &&
                                            <li><u>Adresse</u>: {p.Address}</li>
                                        }
                                        {
                                            p.Email
                                            &&
                                            <li><u>E-mail</u>: <a href={p.Email}>{p.Email}</a></li>
                                        }
                                        {
                                            p.Telephone
                                            &&
                                            <li><u>Téléphone</u>: {p.Telephone}</li>
                                        }
                                        {
                                            p.Profession
                                            &&
                                            <li><u>Profession</u>: {p.Profession}</li>
                                        }
                                    </ul>
                                </Col>
                                <Col xs='2'>
                                    <Button variant='light' style={{ width: '100%' }}>
                                        <FontAwesomeIcon icon={["far", "edit"]} />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
            }
            <AddParent
                show={showAddParent}
                hide={() => setShowAddParent(false)}
            />
        </div>
    )
}