import { useEffect, useState, useRef } from "react";
import {
  Container, Row, Col, Card, Badge, ListGroup,
  Button, Alert, Form
} from "react-bootstrap";
import AddEditFee from "../modals/addEditFee";
import { ENDPOINT, getAuthRequest } from "../../links/links";

export default function StudentRate({ student, parents, selectedParent, onSelectParent }) {
  const [copied, setCopied] = useState(null);
  const [selectedLang, setSelectedLang] = useState("fr");
  const [showModal, setShowModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [studentPosition, setStudentPosition] = useState(null);
  const [loadingSiblings, setLoadingSiblings] = useState(false);

  const timerRef = useRef(null);

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const token = userData?.token?.Api_token;

  const [charges, setCharges] = useState([]); // pour pouvoir modifier dynamiquement
  const [selectedTerm, setSelectedTerm] = useState('T1');

  // Utiliser directement la réduction calculée par le backend pour le parent sélectionné
  const ReductionPourcentage = selectedParent?.ReductionPourcentage || 0;

  const eleve = {
    ...student,
    ReductionPourcentage,
    PositionFamille: studentPosition?.PositionLabel || "",
    Parrain: null,
    Charges: student.fees || [],
  };

  const minervaleNet = eleve.Tuition * (1 - eleve.ReductionPourcentage / 100);
  const totalCharges = eleve.Charges.reduce((t, c) => t + c.Amount, 0);
  const totalAPayer = minervaleNet + totalCharges;
  eleve.TotalAnnuel = totalAPayer;

  const messages = {
    fr: `Instructions de paiement Urubuto pour ${eleve.Firstname} ${eleve.Lastname}
Code Urubuto : ${eleve.Urubuto}
Montant total à payer : ${totalAPayer} RWF

Pour payer les frais de scolarité via USSD, composez *775# et suivez les étapes :
1. Sélectionnez 'Urubuto School Fees'
2. Choisissez la langue
3. Sélectionnez 'Minervale'
4. Entrez le code Urubuto de l'élève
5. Choisissez 'Payer Minervale'
6. Sélectionnez le trimestre
7. Sélectionnez le type de frais à payer
8. Entrez le montant
9. Vérifiez le nom de l'enfant et confirmez le montant (Yego/Oya)
10. Vous recevrez une demande de paiement Mobile Money MTN (*182*7#).`,

    en: `Urubuto Payment Instructions for ${eleve.Firstname} ${eleve.Lastname}
Urubuto Code: ${eleve.Urubuto}
Total amount to pay: ${eleve.TotalAnnuel.toLocaleString()} RWF

To pay school fees via USSD, dial *775# and follow these steps:
1. Select 'Urubuto School Fees'
2. Choose your preferred language
3. Select 'Minervale'
4. Enter the student's Urubuto code
5. Select 'Pay Minervale'
6. Choose the trimester
7. Select the type of fees to pay
8. Enter the amount
9. Confirm your child's name and the amount (Yego/Oya)
10. You will receive a prompt from MTN Mobile Money (*182*7#) to finalize the payment.`,

    rw: `Amabwiriza yo kwishyura Urubuto ya ${eleve.Firstname} ${eleve.Lastname}
Kode ya Urubuto: ${eleve.Urubuto}
Amafaranga yose yo kwishyura: ${eleve.TotalAnnuel.toLocaleString()} RWF

Kwishyura amafaranga y'ishuri ukoresheje USSD, andika *775# hanyuma ukurikize ibi bikurikira:
1. Hitamo 'Urubuto School Fees'
2. Hitamo ururimi ushaka
3. Hitamo 'Minervale'
4. Andika kode ya Urubuto y'umunyeshuri
5. Hitamo 'Kwishyura Minervale'
6. Hitamo igihembwe
7. Hitamo ubwoko bw'amafaranga ushaka kwishyura
8. Andika amafaranga
9. Emeza izina ry'umwana n'amafaranga (Yego/Oya)
10. Uzabona ubutumwa bwa MTN Mobile Money (*182*7#) bwo kurangiza kwishyura.`
  };

  const handleCopy = () => {
    if (!selectedParent?.PhoneNumb) return;

    const rawNumber = selectedParent.PhoneNumb.replace(/\s+/g, '');
    const number = rawNumber.startsWith("+250") ? rawNumber.replace("+", "") :
      rawNumber.startsWith("250") ? rawNumber :
        "250" + rawNumber;

    const rawMessage = messages[selectedLang];
    const message = encodeURIComponent(rawMessage || "Bonjour, ceci est un test");
    const url = `https://wa.me/${number}?text=${message}`;

    window.open(url, '_blank');
    setCopied(selectedLang);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 4000);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!student?.StudentId || !student?.FamilyId) {
      setSiblings([]);
      setStudentPosition(null);
      return;
    }
    setLoadingSiblings(true);
    fetch(ENDPOINT(`students/${student.StudentId}/siblings`), getAuthRequest(token))
      .then(res => res.json())
      .then(data => {
        const resp = data.response || {};
        setSiblings(resp.siblings || []);
        setStudentPosition(resp.studentPosition || null);
      })
      .catch(() => {
        setSiblings([]);
        setStudentPosition(null);
      })
      .finally(() => setLoadingSiblings(false));
  }, [student.StudentId, token]);

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Minervale brut</div>
                <sub><i>Classe de <strong>{eleve.Classe}</strong></i></sub>
              </div>
              <Badge bg="primary" pill>{parseInt(eleve.Tuition).toLocaleString()} RWF</Badge>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div className="ms-4 me-auto">
                <div className="fw-bold">Famille</div>
                <u>Parents :</u>
                <ul>
                  {parents.map((p) => (
                    <li key={p.ParentId}>
                      <sub><i>{p.Firstname} {p.Lastname}</i></sub>
                    </li>
                  ))}
                </ul>

                <u>Frères / soeurs :</u>
                {siblings.length > 0 ? (
                  <ul>
                    {siblings.map((sibling) => (
                      <li key={sibling.StudentId}>
                        <sub><i>{sibling.Firstname} {sibling.Lastname}</i></sub>
                        {sibling.PositionLabel && <small> — {sibling.PositionLabel}</small>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-2"><em>Aucun frère ni soeur</em></p>
                )}
              </div>

              <div className="ms-2 me-auto">
                <div className="fw-bold">Réduction appliquée</div>
                {eleve.PositionFamille && (
                  <sub><i>Position : <strong>{eleve.PositionFamille}</strong></i></sub>
                )}
                {selectedParent?.SponsoredChildren.length > 0 ? (
                  <div>
                    <sub><i>{selectedParent.Firstname} {selectedParent.Lastname} a parrainé :</i></sub>
                    <ul>
                      {selectedParent.SponsoredChildren.map((child) => (
                        <li key={child.StudentId}>
                          <sub><i>{child.Firstname} {child.Lastname}</i></sub>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted mb-2"><em>Aucun parrainage</em></p>
                )}
              </div>

              <Badge bg="primary" pill>
                {eleve.ReductionPourcentage}%
                <br />
                - <i>{(eleve.Tuition * (eleve.ReductionPourcentage / 100)).toLocaleString()} RWF</i>
              </Badge>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i className="bi bi-cash-coin me-2 text-success"></i>
                <span className="fw-bold">Minervale net</span>
              </div>
              <Badge bg="primary" pill>{minervaleNet.toLocaleString()} RWF</Badge>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-start">
              <div className="ms-3 me-auto w-100">

                <Row className="mb-2">
                  <Col xs={6} className="d-flex align-items-center">
                    <h6 className="fw-bold mb-0">Autres frais</h6>
                  </Col>
                  <Col xs={6} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditingCharge(null);
                        setShowModal(true);
                      }}
                      disabled
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Ajouter / Modifier
                    </Button>
                  </Col>
                </Row>

                <Form.Group as={Row} controlId="selectTerm" className="mb-3">
                  <Col xs={2}>
                    <Form.Label className="fw-semibold">Trimestre</Form.Label>
                  </Col>
                  <Col xs={10}>
                    {["T1", "T2", "T3"].map(term => (
                      <Form.Check
                        key={term}
                        inline
                        label={term}
                        name="term"
                        type="radio"
                        id={`term-${term.toLowerCase()}`}
                        value={term}
                        checked={selectedTerm === term}
                        onChange={e => setSelectedTerm(e.target.value)}
                      />
                    ))}
                  </Col>
                </Form.Group>

                <ul className="mb-0" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {eleve.Charges.filter(c => c.Term === selectedTerm).map((c, i) => (
                    <li key={i} style={{ fontSize: '0.8em' }}>
                      <i><u>{c.Name}</u> : {c.Amount.toLocaleString()} RWF</i>
                    </li>
                  ))}
                </ul>

              </div>
              <Badge bg="primary" pill className="align-self-center ms-2">
                {totalCharges.toLocaleString()} RWF
              </Badge>
            </ListGroup.Item>
          </ListGroup>

          <h5 className="text-primary mt-4">Total à payer : {totalAPayer.toLocaleString()} RWF</h5>

          <Button variant="outline-primary" size="sm" disabled>Rapport Excel</Button>

          <hr />

          <Form.Group as={Row} className="my-3">
            <Col xs={2}><Form.Label>Langue</Form.Label></Col>
            <Col xs={10}>
              <Form.Control
                as="select"
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Col xs={2}><Form.Label>Parent</Form.Label></Col>
            <Col xs={10}>
              <Form.Control
                as="select"
                value={selectedParent?.ParentId || ""}
                onChange={(e) =>
                  onSelectParent(parents.find(p => String(p.ParentId) === e.target.value))
                }
              >
                {parents.map((p) => (
                  <option key={p.ParentId} value={p.ParentId}>
                    {p.Firstname} {p.Lastname}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Card className="bg-light p-3 mb-3">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{messages[selectedLang]}</pre>
          </Card>

          <Button onClick={handleCopy} variant="outline-success" size="sm">
            Envoyer sur WhatsApp – <i>{selectedParent?.PhoneNumb || "..."}</i>
          </Button>

          {copied === selectedLang && (
            <Alert variant="success" className="mt-2 py-1 px-2">
              ✅ Message envoyé
            </Alert>
          )}
        </Col>
      </Row>

      <AddEditFee
        showModal={showModal}
        setShowModal={setShowModal}
        charges={charges}
        setCharges={setCharges}
        editingCharge={editingCharge}
        setEditingCharge={setEditingCharge}
        selectedTerm={selectedTerm}
      />
    </Container>
  );
}
