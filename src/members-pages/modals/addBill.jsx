import moment from "moment";
import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import swal from "sweetalert";
import {
  ENDPOINT,
  getAuthRequest,
  postAuthRequestFormData,
} from "../../links/links";

export default function AddBill(props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [datePayment, setDatePayment] = useState("");
  const [description, setDescription] = useState("");
  const [copyInvoice, setCopyInvoice] = useState("");

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  const data = new FormData();
  data.append("title", title);
  data.append("amount", amount);
  data.append("paymentMethod", paymentMethod);
  data.append("datePayment", datePayment);
  data.append("description", description);
  data.append("copyInvoice", copyInvoice);

  const addInvoice = () => {
    fetch(ENDPOINT("addinvoices"), postAuthRequestFormData(data, token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status)
          swal("Parfait!", "Une facture a été ajouté", "success").then(() =>
            window.location.reload()
          );
        else swal("Erreur", r.response, "warning");
      });
    //console.log(JSON.parse(data));
  };
  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>Ajouter une facture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Titre
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={(e) => setTitle(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Montant
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Paiement par
            </Form.Label>
            <Col sm="10">
              <div
                key={`inline-radio`}
                className="mb-3"
                style={{ width: "100%" }}
              >
                <Form.Check
                  label="Cash / Liquide"
                  name="payment"
                  type="radio"
                  id={`Cash / Liquide`}
                  onChange={(e) => setPaymentMethod(e.target.id)}
                />
                <Form.Check
                  label="MTN Mobile Money"
                  name="payment"
                  type="radio"
                  id={`MTN Mobile Money`}
                  onChange={(e) => setPaymentMethod(e.target.id)}
                />
                <Form.Check
                  label="Airtel Mobile Money"
                  name="payment"
                  type="radio"
                  id={`Airtel Mobile Money`}
                  onChange={(e) => setPaymentMethod(e.target.id)}
                />
                <Form.Check
                  label="Carte de crédit"
                  name="payment"
                  type="radio"
                  id={`Carte de crédit`}
                  onChange={(e) => setPaymentMethod(e.target.id)}
                />
                <Form.Check
                  label="Virement bancaire"
                  name="payment"
                  type="radio"
                  id={`Virement bancaire`}
                  onChange={(e) => setPaymentMethod(e.target.id)}
                />
              </div>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Date de paiement
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="date"
                onChange={(e) => setDatePayment(e.target.value)}
                max={moment().format("Y-MM-Do")}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Description
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Copie Facture
            </Form.Label>
            <Col sm="10">
              <FileBase64 onDone={(e) => setCopyInvoice(JSON.stringify(e))} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => addInvoice()}>Ajouter</Button>
      </Modal.Footer>
    </Modal>
  );
}
