import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileExcel, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListGroup, Modal } from "react-bootstrap";

library.add(faFileWord, faFileExcel);

export default function DownloadDocuments(props) {
  return (
    <Modal centered show={props.show} onHide={props.hide}>
      <Modal.Header closeButton>
        <Modal.Title>Documents à télécharger</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item variant="primary" action>
            <FontAwesomeIcon icon={["fas", "file-word"]} /> Liste SORAS
          </ListGroup.Item>
          <ListGroup.Item variant="success" action>
            <FontAwesomeIcon icon={["fas", "file-excel"]} /> Liste des classes
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
