import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import swal from "sweetalert";
import { ENDPOINT, postAuthRequestFormData } from "../../links/links";
import { FrmGroupText } from "./editEmployee";

export default function EditParent(props) {
  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const theParent = props.parent;
  const [parent, setParent] = useState(theParent);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phoneNumb, setPhoneNumb] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [linkChild, setLinkChild] = useState("");
  const [languages, setLanguages] = useState([]);

  const editParent = () => {
    let data = new FormData();
    data.append("ParentId", parent.ParentId);
    data.append("Lastname", lastname);
    data.append("Firstname", firstname);
    data.append("PhoneNumb", phoneNumb);
    data.append("Address", address);
    data.append("Email", email);
    data.append("LinkChild", linkChild);
    data.append("languages", JSON.stringify(languages));
    fetch(ENDPOINT("editparent"), postAuthRequestFormData(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", "Parent mis à jour", "success").then(() =>
            window.location.reload()
          );
      });
  };

  useEffect(() => {
    setParent(props.parent);
    setLanguages([
      props.parent.French ? "Français" : null,
      props.parent.English ? "Anglais" : null,
      props.parent.Kinyarwanda ? "Kinyarwanda" : null
    ].filter(Boolean));
  }, [props.parent]);

  return (
    <Modal show={props.show} onHide={props.hide} size="lg" centered>
      <Modal.Header>
        <Modal.Title>
          Modifier {parent.Firstname} {parent.Lastname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FrmGroupText
            controlId="formLastname"
            label="Nom de famille"
            placeholder={parent.Lastname}
            change={(e) => setLastname(e.target.value)}
          />
          <FrmGroupText
            controlId="formFirstname"
            label="Prénom"
            placeholder={parent.Firstname}
            change={(e) => setFirstname(e.target.value)}
          />
          <FrmGroupText
            controlId="formPhoneNumb"
            label="Numéro de téléphone"
            placeholder={parent.PhoneNumb}
            change={(e) => setPhoneNumb(e.target.value)}
          />
          <FrmGroupText
            controlId="formAddress"
            label="Adresse Domicile"
            placeholder={parent.Address}
            change={(e) => setAddress(e.target.value)}
          />
          <FrmGroupText
            controlId="formEmail"
            label="E-mail"
            placeholder={parent.Email}
            change={(e) => setEmail(e.target.value)}
          />
          <FrmGroupText
            controlId="formLinkChild"
            label="Lien avec enfant"
            placeholder={parent.LinkChild}
            change={(e) => setLinkChild(e.target.value)}
          />
          <Form.Group as={Row}>
            <Form.Label column sm="2">Langues Parlées</Form.Label>
            <Col sm="10">
            {["Français", "Anglais", "Kinyarwanda"].map((lang) => (
              <Form.Check
                key={lang}
                type="checkbox"
                label={lang}
                checked={languages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLanguages((prev) => [...prev, lang]);
                  } else {
                    setLanguages((prev) => prev.filter((l) => l !== lang));
                  }
                }}
              />
            ))}
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => editParent()}>Enregistrer</Button>
      </Modal.Footer>
    </Modal>
  );
}
