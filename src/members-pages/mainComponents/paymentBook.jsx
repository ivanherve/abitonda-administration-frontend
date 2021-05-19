import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { ENDPOINT, getAuthRequest } from "../../links/links";
import AddBill from "../modals/addBill";
import ShowBill from "../modals/showBill";

const tab = [
  {
    InvoiceId: 1,
    Title: "Bougie Gâteau d'anniversaire Dania",
    Amount: 5000,
    DatePayment: "2021-05-17",
    Description: "Bougie Gâteau d'annif de Dania, payé avec le momo de Ivan",
    PaymentMethodId: 2,
    created_at: null,
    updated_at: null,
    BillPicture: require("../../img/logo-removebg.png"),
  },
];

export default function PaymentBook(props) {
  const [showAddBill, setShowAddBill] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState(tab[0]);
  const [payments, setPayments] = useState(tab);
  const [showMainBill, setShowMainBill] = useState(false);

  const token = JSON.parse(sessionStorage.getItem("userData")).token.Api_token;
  useEffect(() => {
    fetch(ENDPOINT("invoices"), getAuthRequest(token))
      .then((r) => r.json())
      .then((r) => {
        if (r.status) setPayments(r.response);
      });
  }, []);

  const formatRWF = (amount) => {
    // Create our number formatter.
    var formatter = new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "RWF",
    });

    return formatter.format(amount);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Livret de caisse</Card.Title>
      </Card.Header>
      <Card.Body>
        <Button
          style={{ width: "100%" }}
          variant="outline-success"
          onClick={() => setShowAddBill(true)}
        >
          Ajouter une facture
        </Button>
      </Card.Body>
      <Row>
        <Col sm="4">
          <ListGroup variant="flush">
            {payments.map((t) => (
              <ListGroup.Item
                key={payments.indexOf(t)}
                action
                onClick={() => setPaymentSelected(t)}
              >
                {t.Title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col sm="8">
          <Card.Body>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th style={styles.th}>Titre</th>
                  <td>{paymentSelected.Title}</td>
                </tr>
                <tr>
                  <th style={styles.th}>Montant</th>
                  <td>{formatRWF(paymentSelected.Amount)}</td>
                </tr>
                <tr>
                  <th style={styles.th}>Paiement</th>
                  <td>{paymentSelected.PaymentMethod}</td>
                </tr>
                <tr>
                  <th style={styles.th}>Date de paiement</th>
                  <td>
                    {moment(paymentSelected.DatePayment).format("Do MMMM YYYY")}
                  </td>
                </tr>
                <tr>
                  <th style={styles.th}>Description</th>
                  <td>{paymentSelected.Description}</td>
                </tr>
              </tbody>
            </Table>
            <Button onClick={() => setShowMainBill(true)}>
              Voir la facture
            </Button>
          </Card.Body>
        </Col>
      </Row>
      <AddBill show={showAddBill} hide={() => setShowAddBill(false)} />
      <ShowBill
        show={showMainBill}
        hide={() => setShowMainBill(false)}
        title={paymentSelected.Title}
        image={paymentSelected.BillPicture}
      />
    </Card>
  );
}

const styles = {
  th: { width: "50px" },
};
