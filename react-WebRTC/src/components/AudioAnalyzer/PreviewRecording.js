import { IoReload} from "react-icons/io5";
import styles from "./styles/audiopreview.module.css";
import React from "react";
import {   FiDownloadCloud } from "react-icons/fi";
import {MdReplay} from "react-icons/md";
import NotchCloseIcon from "../NotchCloseIcon";


export default class PreviewRecording extends React.Component {

    recorderAudioRef;
    canvasLoopingFnRef;
    analyserCanvas;

    constructor(props) {
        super(props);

        this.state = {
            loading:  0,
        }
        this.recorderAudioRef = React.createRef(null);
        this.analyserCanvas = React.createRef(null);
        this.canvasLoopingFnRef = null;

        this.onPlayClick = this.onPlayClick.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
        this.onDoneClick = this.onDoneClick.bind(this);
        this.onDownloadClick = this.onDownloadClick.bind(this);

    }
    
    onPlayClick(){
        this.recorderAudioRef.current.currentTime = 0;
        this.recorderAudioRef.current.play();
    }
    onReloadClick() {
        this.props.setView("record");
    }
    onDoneClick() {
        this.props.close();
    }
    onDownloadClick() {
        const anchorTag = document.createElement('a');
        anchorTag.href = this.props.recordedMedia.url;
        anchorTag.target = '_blank';
        anchorTag.download = 'recording.mp3';
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
    }

    render() {
        return (<>
        <NotchCloseIcon handleClose={this.props.close}/>
        <div className="modalBody">
            <div className={styles.modalBodyContainer}>
                <IoReload onClick={this.onReloadClick} />
                <PreviewContainer recordedMedia={this.props.recordedMedia} canvasLoopingFnRef={this.canvasLoopingFnRef} recordedAudioRef={this.recorderAudioRef}  />
            </div>
        </div>
        <div className="modalFooter">
          <div className={styles.footerContainer}>
            <div className={styles.leftSection} >
                <MdReplay className={styles.playIcon} onClick={this.onPlayClick}  />
                <div className={styles.downloadContainer} onClick={this.onDownloadClick}>
                    <FiDownloadCloud />
                    <span>Download</span>
                </div>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.doneButton} onClick={this.onDoneClick}>Done</button>
            </div>
          </div>
        </div>
        </>)
    }
}



class PreviewContainer extends PreviewRecording {
    dataRef;
    rafIdRef;
    analyserRef;

    constructor(props) {
        super(props);

       

        this.dataRef = null;
        this.rafIdRef=  null;
        this.analyserRef = null;


        this.onLoadedData = this.onLoadedData.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.draw = this.draw.bind(this);
        this.loopingFunction = this.loopingFunction.bind(this);
        this.onPlayBackEnd = this.onPlayBackEnd.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);


    }

    componentWillUnmount() {
        //clean up code.
        if(this.rafIdRef) cancelAnimationFrame(this.rafIdRef);
    }

 
    onLoadedData() {
        const audioStream = this.props.recordedAudioRef.current.captureStream ?  this.props.recordedAudioRef.current.captureStream() : this.props.recordedAudioRef.current.mozCaptureStream ?  this.props.recordedAudioRef.current.mozCaptureStream() :null;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();

        analyser.fftSize = 2048;
        this.analyserRef = analyser;

        try {
            const audioSrc = audioCtx.createMediaStreamSource(audioStream);
            audioSrc.connect(analyser);
            this.dataRef = new Uint8Array(analyser.frequencyBinCount);
            this.props.recordedAudioRef.current.play().then(() => this.loopingFunction());
        }
        catch(e) {
            console.log("error" + e);
        }
    }

    clearCanvas(){
        const ctx = this.analyserCanvas.current.getContext("2d",  { willReadFrequently: true });
        ctx.clearRect(
            0,
            0,
            this.analyserCanvas.current.width,
            this.analyserCanvas.current.height
          );
    }

    draw(dataParm, ctx)  {
        ctx.fillStyle = "white"; //white bg
         ctx.lineWidth = 3; //width of candle/bar
         ctx.strokeStyle = "#d5d4d5"; //color of candle/bar
         const space = this.analyserCanvas.current.width / dataParm.length;
         dataParm.forEach((value, i) => {
           ctx.beginPath();
           ctx.moveTo(space * i, this.analyserCanvas.current.height); //x,y
           ctx.lineTo(space * i, this.analyserCanvas.current.height - value); //x,y
           ctx.stroke();
         });
    };

    loopingFunction() {
        this.rafIdRef = requestAnimationFrame(this.loopingFunction);
        this.analyserRef.getByteFrequencyData(this.dataRef);
        this.clearCanvas();
        const ctx = this.analyserCanvas.current.getContext("2d");
        this.draw(this.dataRef, ctx);
    };

    onPlayBackEnd() {
        cancelAnimationFrame(this.rafIdRef);
    }

    onTimeUpdate() {
        this.setState({
            progress:  Math.floor((this.props.recordedAudioRef.current.currentTime * 100)/this.props.recordedAudioRef.current.duration)
        });
    }
   
    render() {
        return (
            <div className={"previewContainer"}>
                <canvas ref={this.analyserCanvas} width={"430"} height={"250"}/>
                <audio ref={this.props.recordedAudioRef} 
                    src={this.props.recordedMedia} 
                    //executes after each play.
                    onPlay={this.onLoadedData}
                    onTimeUpdate={this.onTimeUpdate} 
                    //executes only once when first loaded.
                    onLoadedMetadata={this.onLoadedData}  
                    onEnded={this.onPlayBackEnd}
                 />
            </div>
        );
    }

}

