import { Modal } from "react-bootstrap";
import { useState } from "react";
import ScreenRecorder from "./ScreenRecorder";
import PreviewRecording from "./PreviewRecording";


const renderCurrentScreen = ({view,setView , show , close}) => {
    switch(view){
        case "recorder":
            return <ScreenRecorder close={close} setView={setView} />
        case "preview":
            return <PreviewRecording show={show} close={close} view={view} setView={setView} />
        case "upload" : 
            return <></> //upload component.
        default:
            return <div>{"Nothing to show."}</div>
    }
}

const ScreenRecorderModal = ({show , close}) => {

    const [view, setView] = useState("recorder");

    return (<Modal  show={show} dialogClassName={'modal-dialog'} animation={false} onHide={close} centered>
               {renderCurrentScreen({view , setView , show , close})} 
          </Modal>)

}
export default ScreenRecorderModal;