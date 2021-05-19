import { Image, Modal } from "react-bootstrap";

export default function ShowBill(props) {
  return (
    <Modal show={props.show} onHide={props.hide} centered size="xl">
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Image src={props.image} />
    </Modal>
  );
}
