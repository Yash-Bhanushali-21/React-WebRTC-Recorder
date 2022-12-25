import { Modal } from "react-bootstrap";
import { useState } from "react";
import ScreenRecorder from "./ScreenRecorder";
import PreviewRecording from "./PreviewRecording";


const renderCurrentScreen = ({view, setView , close, recordedMedia, setRecordedMedia}) => {
    switch(view){
        case "recorder":
            return <ScreenRecorder close={close} setRecordedMedia={setRecordedMedia} setView={setView} />
        case "preview":
            return <PreviewRecording close={close} recordedMedia={recordedMedia}  setView={setView} />
        case "upload" : 
            return <></> //upload component.
        default:
            return <div>{"Nothing to show."}</div>
    }
}

const ScreenRecorderModal = ({show , close}) => {

    const [view, setView] = useState("recorder");
    const [recordedMedia , setRecordedMedia] = useState(null);

    return (<Modal  show={show} dialogClassName={'modal-dialog'} animation={false} onHide={close} centered>
               {renderCurrentScreen({view , setView ,recordedMedia, setRecordedMedia , close})} 
          </Modal>)

}
export default ScreenRecorderModal;