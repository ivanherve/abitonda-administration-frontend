import { useState, useMemo } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";

export default function StudentCanteenPage({ student }) {
  // Surcharge avec currentSubscription
  const [subscription, setSubscription] = useState(student.currentSubscription || "Mensuel");

  // Données statiques d'abonnement
  const subscriptionOptions = [
    { type: "Journalier", price: 2500, note: "Pas de facturation si absent" },
    { type: "Mensuel", price: 50000, note: "Facturé même si absent" },
    { type: "Trimestriel", price: 120000, note: "Facturé même si absent" },
  ];

  // Repas du jour (statique pour le prototype)
  const todayMeal = "Riz + Poulet + Légumes";

  // Suivi de présence
  const [attendance, setAttendance] = useState([
    { date: "15/08/2025", present: true },
    { date: "16/08/2025", present: false },
  ]);
  const [newDate, setNewDate] = useState("");

  const handleAddAttendance = () => {
    if (!newDate) return;
    const formatted = new Date(newDate).toLocaleDateString("fr-FR");
    setAttendance([...attendance, { date: formatted, present: true }]);
    setNewDate("");
  };

  // Calcul total à payer du trimestre (réactif)
  const totalToPay = useMemo(() => {
    if (subscription === "Journalier") {
      const daysPresent = attendance.filter((a) => a.present).length;
      return daysPresent * 2500;
    } else if (subscription === "Mensuel") {
      return 50000 * 3;
    } else if (subscription === "Trimestriel") {
      return 120000;
    }
    return 0;
  }, [subscription, attendance]);

  return (
    <Container className="mt-4">
      <h2>Gestion de la cantine</h2>

      {/* Info élève */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{student.firstname} {student.lastname}</h4>
              <p><strong>Allergies :</strong> {student.allergies || "Aucune"}</p>
              <p><strong>Repas du jour :</strong> {todayMeal}</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p><strong>Abonnement actuel :</strong> {subscription}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Gestion abonnement */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Choix de l'abonnement</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Table bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Type</th>
                  <th>Tarif</th>
                  <th>Remarque</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionOptions.map((option, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="radio"
                        name="subscription"
                        checked={subscription === option.type}
                        onChange={() => setSubscription(option.type)}
                      />
                    </td>
                    <td>{option.type}</td>
                    <td>{option.price.toLocaleString()} RWF</td>
                    <td>{option.note}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form>
        </Card.Body>
      </Card>

      {/* Suivi journalier */}
      <Card>
        <Card.Header>
          <h5>Suivi de présence</h5>
        </Card.Header>
        <Card.Body>
          {/* Ajout date + total à payer */}
          <Row className="mb-3 align-items-center">
            <Col md={4}>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </Col>
            <Col md="auto">
              <Button onClick={handleAddAttendance}>Ajouter</Button>
            </Col>
            <Col className="text-md-end">
            <div>Total trimestrielle</div>
              <h4>{totalToPay.toLocaleString()} RWF</h4>
            </Col>
          </Row>

          <Table bordered>
            <thead>
              <tr>
                <th>Date</th>
                <th>Présent</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={entry.present}
                      onChange={(e) => {
                        const updated = [...attendance];
                        updated[index].present = e.target.checked;
                        setAttendance(updated);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
