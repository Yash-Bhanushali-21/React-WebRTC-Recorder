import React from "react";
import styles from "./styles/styles.module.css";
import NotchCloseIcon from "../NotchCloseIcon";


 class AudioAnalyzer extends React.Component {

  recorderRef;
  audioStreamRef;
  chunksRef;
  analyserCanvas;
  analyserRef;
  dataRef;
  rafIdRef;

  constructor(props) {
    super(props);
    this.state = {
      recorderState : "Idle"
    }


    //initializing variables.
    this.recorderRef =  null;
    this.audioStreamRef = null;
    this.chunksRef = [];
    this.analyserCanvas = React.createRef(null);
    this.dataRef = [];
    this.rafIdRef = null;

    //binding methods.
    this.toggleRecording = this.toggleRecording.bind(this);
    this.loopingFunction = this.loopingFunction.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.onStop = this.onStop.bind(this);
    this.draw = this.draw.bind(this);
    this.onDataAvailable = this.onDataAvailable.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.getAudioMedia = this.getAudioMedia.bind(this);

  }

  draw(dataParm, ctx) {
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
  }

   clearCanvas(){
    const ctx = this.analyserCanvas.current.getContext("2d" ,  { willReadFrequently: true });
    ctx.clearRect(
        0,
        0,
        this.analyserCanvas.current.width,
        this.analyserCanvas.current.height
      );
  }
  loopingFunction() {
    this.rafIdRef = requestAnimationFrame(this.loopingFunction);
    this.analyserRef.getByteFrequencyData(this.dataRef);
    this.clearCanvas();
    const ctx = this.analyserCanvas.current.getContext("2d");
    this.draw(this.dataRef, ctx);
};
  onDataAvailable  = (event) =>  {
  if (event.data.size > 0) {
      this.chunksRef.push(event.data);
    }
  }

  onStop()  {
    const blob = new Blob(this.chunksRef, {
      type: "audio/mp3",
    });
    this.chunksRef = [];
    const url = URL.createObjectURL(blob);
    this.props.setPreviewState(url);
  };

  
   startRecording() {
    if(this.audioStreamRef ) {
        this.recorderRef = new MediaRecorder(this.audioStreamRef);
        this.recorderRef.start();
        this.recorderRef.ondataavailable = this.onDataAvailable;
        this.recorderRef.onstop = this.onStop;
        this.setState({
          recorderState : "Recording"
        });
      }
  }
stopRecording() {
    if(this.recorderRef) {
        //stop the loop of canvas.
        cancelAnimationFrame(this.rafIdRef);

        this.clearCanvas();       

        //stop the recorder.
        this.recorderRef.stop();

        //stop the stream.
        if(this.audioStreamRef) this.audioStreamRef.getTracks().forEach(track => track.stop());

        //empty the refs.
        this.recorderRef = null;
        this.chunksRef = [];
        this.audioStreamRef = null;
        this.setState({
          recorderState : "Recorded"
        })

    }
}

async getAudioMedia()  {
    if (navigator.mediaDevices.getUserMedia !== null) {
      const options = {
        video: false,
        audio: true
      };
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia(options);
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();

        this.audioStreamRef = audioStream;

        analyser.fftSize = 2048;
        this.analyserRef = analyser;

        const audioSrc = audioCtx.createMediaStreamSource(audioStream);
        audioSrc.connect(analyser);
        this.dataRef = new Uint8Array(analyser.frequencyBinCount);
        this.loopingFunction();
      } catch (err) {
        // error handling
        console.log("Something Went wrong: " + err);
      }
    }
  };

   async toggleRecording() {

    if(this.recorderRef !== null) {
        this.stopRecording();
    }
    else {
        await this.getAudioMedia();
        this.startRecording();
    }
  }

  render() {
    return (
          <>
            <NotchCloseIcon handleClose={this.props.close} />
            <div className="modalBody">
                <div className="previewContainer">
                      <canvas ref={this.analyserCanvas} width={"430"} height={"250"}  />
                </div>
            </div>
            <div className="modalFooter">
              <div className={styles.footerContainer}>
                <div className={styles.recordButton} onClick={this.toggleRecording}>
                  {this.state.recorderState === "Idle" ? "Record" : "Stop"}
                </div>
              </div>
            </div>
        </>);
  }




}


export default AudioAnalyzer;

