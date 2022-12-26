import { Modal } from "react-bootstrap";
import { useState } from "react";
import ScreenRecorder from "./ScreenRecorder";
import PreviewRecording from "./PreviewRecording";
import ThumbnailSelection from "./ThumbnailSelection";

const renderCurrentScreen = ({view, setView , close, recordedMedia, setRecordedMedia}) => {
    switch(view){
        case "record":
            return <ScreenRecorder close={close} setRecordedMedia={setRecordedMedia} setView={setView} />
        case "preview":
            return <PreviewRecording close={close} recordedMedia={recordedMedia}  setView={setView} />
        case "thumbnail":
            return <ThumbnailSelection close={close} setRecordedMedia={setRecordedMedia} recordedMedia={recordedMedia} setView={setView} />
        default:
            return <div>{"Nothing to show."}</div>
    }
}

const ScreenRecorderModal = ({show , close}) => {

    const [view, setView] = useState("record");
    const [recordedMedia , setRecordedMedia] = useState({
        url : null,
        thumbnail : null
    });

    return (<Modal  show={show} dialogClassName={'modal-dialog'} animation={false} onHide={close} centered>
               {renderCurrentScreen({view , setView ,recordedMedia, setRecordedMedia , close})} 
          </Modal>)

}
export default ScreenRecorderModal;