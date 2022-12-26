import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import AudioAnalyzer from "./AudioAnalyzer";
import PreviewRecording from "./PreviewRecording";

const renderCurrentScreen = ({view, setView , close, recordedMedia, setRecordedMedia}) => {
    switch(view){
        case "record":
            return <AudioAnalyzer close={close} setRecordedMedia={setRecordedMedia} setView={setView} />
        case "preview":
            return <PreviewRecording setView={setView} close={close} recordedMedia={recordedMedia} />

        default:
            return <div>{"Nothing to show."}</div>
    }
}

const AudioAnalyzerModal = ({show , close}) => {


    const [view, setView] = useState("record");
    const [recordedMedia , setRecordedMedia] = useState({
        url : null,
    });

    return (<Modal  show={show} dialogClassName={'modal-dialog'} animation={false} onHide={close} centered>
                {renderCurrentScreen({view , setView ,recordedMedia, setRecordedMedia , close})} 
            </Modal>)

}

export default AudioAnalyzerModal;