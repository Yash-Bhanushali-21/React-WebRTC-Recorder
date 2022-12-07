import { Modal } from "react-bootstrap"
import "./modal.css";


export const CustomModal = ({ onHide, show , modalContent}) => {

    return (
        <Modal  show={show} onHide={onHide} rootClose centered>
            <Modal.Title>{modalContent.title}</Modal.Title>
            <Modal.Body>{modalContent.body}</Modal.Body>
            <Modal.Footer>{modalContent.footer}</Modal.Footer>
        </Modal>
    )
}

