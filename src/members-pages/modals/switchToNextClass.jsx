
import { ListGroup, Modal, Button } from "react-bootstrap";

export default function SwitchToNextClass(props) {
  return (
    <Modal show={props.show} onHide={props.hide} centered>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <ListGroup variant='flush'>
          {
              props.students.map(s =>
                <ListGroup.Item>
                    <strong>{s.Lastname}</strong> <i>{s.Firstname}</i>
                </ListGroup.Item>
              )
          }
      </ListGroup>
      <Modal.Footer>
        <Button>Enregistrer</Button>
      </Modal.Footer>
    </Modal>
  );
}
