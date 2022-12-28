import { useState ,useRef } from "react";
import {IoCloseSharp} from "react-icons/io5";
import styles from "./styles.module.css";
import classNames from "classnames";



const AudioAnalyzer = ({setView , setRecordedMedia, close}) => {
   
    const recorderRef = useRef(null);
    const audioStreamRef = useRef(null);
    const chunksRef = useRef([]);

    const [recorderState, setRecorderState] = useState("Idle");

    //anaylizing refs.
    const analyserCanvas = useRef(null);
    const analyserRef = useRef(null);
    const dataRef = useRef([]);
    const rafIdRef = useRef(null);


    
    function fitCanvasToContainer(){
        // Make it visually fill the positioned parent
        analyserCanvas.current.style.width ='100%';
        analyserCanvas.current.style.height='100%';
        // ...then set the internal size to match
        analyserCanvas.current.width  =  analyserCanvas.current.offsetWidth;
        analyserCanvas.current.height =  analyserCanvas.current.offsetHeight;
  }

    const draw = (dataParm, ctx) => {
        ctx.fillStyle = "white"; //white bg
         ctx.lineWidth = 3; //width of candle/bar
         ctx.strokeStyle = "#d5d4d5"; //color of candle/bar
         const space = analyserCanvas.current.width / dataParm.length;
         dataParm.forEach((value, i) => {
           ctx.beginPath();
           ctx.moveTo(space * i, analyserCanvas.current.height); //x,y
           ctx.lineTo(space * i, analyserCanvas.current.height - value); //x,y
           ctx.stroke();
         });
    };

    const clearCanvas = () => {
        const ctx = analyserCanvas.current.getContext("2d" ,  { willReadFrequently: true });
        ctx.clearRect(
            0,
            0,
            analyserCanvas.current.width,
            analyserCanvas.current.height
          );
    }

    const loopingFunction = () => {
        rafIdRef.current = requestAnimationFrame(loopingFunction);
        analyserRef.current.getByteFrequencyData(dataRef.current);
        clearCanvas();
        const ctx = analyserCanvas.current.getContext("2d");
        draw(dataRef.current, ctx);
    };

    const onDataAvailable = (event) => {
        if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
    }
    const onStop = () => {
        clearCanvas();       
        const blob = new Blob(chunksRef.current, {
          type: "audio/mp3",
        });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        setRecordedMedia({url});
        setView("preview");
      };

    const startRecording =  () => {
        if(audioStreamRef.current ) {
            recorderRef.current = new MediaRecorder(audioStreamRef.current);
            recorderRef.current.start();
            recorderRef.current.ondataavailable = onDataAvailable;
            recorderRef.current.onstop = onStop;
            setRecorderState("Recording");
        }
    }
    const stopRecording = () => {
        if(recorderRef.current) {
            //stop the loop of canvas.
            cancelAnimationFrame(rafIdRef.current);

            //stop the recorder.
            recorderRef.current.stop();

            //stop the stream.
            if(audioStreamRef.current) audioStreamRef.current.getTracks().forEach(track => track.stop());

            //empty the refs.
            recorderRef.current = null;
            chunksRef.current = [];
            audioStreamRef.current = null;
            setRecorderState("Recorded");

        }
    }

    const getAudioMedia = async () => {
        if (navigator.mediaDevices.getUserMedia !== null) {
          const options = {
            video: false,
            audio: true
          };
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia(options);
            const audioCtx = new AudioContext();
            const analyser = audioCtx.createAnalyser();

            audioStreamRef.current = audioStream;

            analyser.fftSize = 2048;
            analyserRef.current = analyser;
    
            const audioSrc = audioCtx.createMediaStreamSource(audioStream);
            audioSrc.connect(analyser);
            dataRef.current = new Uint8Array(analyser.frequencyBinCount);
            fitCanvasToContainer();
            loopingFunction();
          } catch (err) {
            // error handling
            console.log("Something Went wrong: " + err);
          }
        }
      };

      const toggleRecording = async () => {
        if(recorderRef.current) {
            stopRecording();
        }
        else {
            await getAudioMedia();
            startRecording();
        }
      }

      const recordButtonClasses = classNames(styles.recordButton, {
      })



      return (
        <>
        <div className="modalHeader">
          <div className="modalHeaderContent">
            Record Audio <IoCloseSharp onClick={close} />
          </div>
        </div>
        <div className="modalBody">
            <div className="previewContainer">
                  <canvas ref={analyserCanvas}  />
            </div>
        </div>
        <div className="modalFooter">
          <div className={styles.footerContainer}>
            <div className={recordButtonClasses} onClick={toggleRecording}>
              {recorderState === "Idle" ? "Record" : "Recording"}
            </div>
          </div>
        </div>
        </>
      )

      


   



}

export default AudioAnalyzer;

