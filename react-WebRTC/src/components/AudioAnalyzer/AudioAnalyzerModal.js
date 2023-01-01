import Modal from "react-bootstrap/Modal";
import React from "react";
import AudioAnalyzer from "./AudioAnalyzer";
import PreviewRecording from "./PreviewRecording";

export default class AudioAnalyzerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            view : "record",
            url : ""
        }

        this.setPreviewState = this.setPreviewState.bind(this);
        this.renderCurrentScreen = this.renderCurrentScreen.bind(this);
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    setPreviewState(url) {
        this.setState({
            url,
            view : "preview"
        })
    }

    renderCurrentScreen() {
        switch(this.state.view){
            case "record":
                return <AudioAnalyzer close={this.props.close}   setPreviewState={this.setPreviewState} />
            case "preview":
                return <PreviewRecording setView={this.setView} close={this.props.close} recordedMedia={this.state.url} />
            default:
                return <div>{"Nothing to show."}</div>
        }
    }

    render() {
        return (<Modal  show={this.props.show} dialogClassName={'modal-dialog'} animation={false} onHide={this.props.close} centered>
        {this.renderCurrentScreen()} 
    </Modal>)

}
    }



/*

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

*/