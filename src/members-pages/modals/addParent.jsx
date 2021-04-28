import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Modal,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import swal from "sweetalert";
import { ENDPOINT, getAuthRequest, postAuthRequest } from "../../links/links";

export default function AddParent(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [linkChild, setLinkChild] = useState("");
  const [listParent, setListParent] = useState([]);
  const [parentId, setParentId] = useState(0);
  const [parentSelected, setParentSelected] = useState("");

  const addParent = () => {
    let data;
    if (parentSelected.length > 0) {
      //console.log("Ajout d'un parent existant");
      data = JSON.stringify({
        StudentId: props.studentId,
        ParentId: parentId,
        Name: parentSelected,
      });
    } else {
      data = JSON.stringify({
        StudentId: props.studentId,
        firstname: firstname.toUpperCase(),
        lastname: lastname.toUpperCase(),
        telephone: telephone,
        email: email,
        address: address,
        linkChild: linkChild,
      });
    }

    fetch(ENDPOINT("parents/create"), postAuthRequest(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", r.response, "success").then(() =>
            window.location.reload()
          );
        else console.log(r.response, props);
      });
  };

  const selectParent = (parent) => {
    if (listParent.length > 0)
      listParent.map((p) => {
        if (p.Name === parent) {
          setParentId(p.ParentId);
          setParentSelected(parent);
        }
      });
  };

  useEffect(() => {
    fetch(ENDPOINT("listparents"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) {
          setListParent(r.response);
          //setParentId(r.response[0].ParentId);
        }
      });
  }, []);

  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter un parent / tuteur</Modal.Title>
      </Modal.Header>
      {/*
      <Alert variant="warning">Tous les champs sont obligatoires</Alert>
      */}

      <Modal.Body>
        <Tab.Container id="left-tabs-example" defaultActiveKey="old">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="old">Ajouter un parent existant</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="new">Ajouter un nouveau parent</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm="9">
              <Tab.Content>
                <Tab.Pane eventKey="old">
                  <Form>
                    <Form.Group as={Row} controlId="addAnExistingParent">
                      <Form.Label column sm="2">
                        Parent / Tuteur
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="select"
                          onChange={(e) => selectParent(e.target.value)}
                        >
                          {listParent.length > 0 &&
                            listParent.map((p) => (
                              <option key={p.ParentId}>{p.Name}</option>
                            ))}
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="selectExistingParent">
                      <Col sm="12">
                        <Form.Control
                          readOnly
                          value={
                            parentSelected.length < 1
                              ? "Aucun parent selectionné ..."
                              : parentSelected
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="new">
                  <Form>
                    <Form.Group as={Row} controlId="addparentfirstname">
                      <Form.Label column sm="2">
                        Prénom*
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          onChange={(e) => {
                            setFirstname(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentlastname">
                      <Form.Label column sm="2">
                        Nom*
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          onChange={(e) => {
                            setLastname(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentphone">
                      <Form.Label column sm="2">
                        Téléphone*
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="number"
                          onChange={(e) => {
                            setTelephone(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentemail">
                      <Form.Label column sm="2">
                        E-mail
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentaddress">
                      <Form.Label column sm="2">
                        Adresse*
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          onChange={(e) => {
                            setAddress(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentprofession">
                      <Form.Label column sm="2">
                        Profession
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="addparentlink">
                      <Form.Label column sm="2">
                        Lien avec l'enfant*
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="textarea"
                          onChange={(e) => {
                            setLinkChild(e.target.value);
                            setParentSelected("");
                          }}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => addParent()}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
