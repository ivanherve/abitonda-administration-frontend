import { Modal, Form, Button, Row, Col } from "react-bootstrap";

export default function EditExemptionTuitionModal({
  showExemptionModal,
  setShowExemptionModal,
  tuitionExemption,
  setTuitionExemption
}) {
  return (
    <Modal
      size="lg"
      centered
      show={showExemptionModal}
      onHide={() => setShowExemptionModal(false)}
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Modifier l'exonération</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Col>
              <Form.Check
                type="radio"
                label="Non exonéré"
                name="tuitionExemption"
                value="none"
                checked={tuitionExemption === "none"}
                onChange={e => setTuitionExemption(e.target.value)}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Parent employé de l'école"
                name="tuitionExemption"
                value="parentEmployee"
                checked={tuitionExemption === "parentEmployee"}
                onChange={e => setTuitionExemption(e.target.value)}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Parrainé par l'école"
                name="tuitionExemption"
                value="schoolSponsored"
                checked={tuitionExemption === "schoolSponsored"}
                onChange={e => setTuitionExemption(e.target.value)}
                className="mb-2"
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={() => setShowExemptionModal(false)}
          className="px-4"
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={() => setShowExemptionModal(false)}
          className="px-4"
        >
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
