import { IoReload} from "react-icons/io5";
import styles from "./styles/audiopreview.module.css";
import {  useRef  , useState , useImperativeHandle} from "react";
import {   FiDownloadCloud } from "react-icons/fi";
import {MdReplay} from "react-icons/md";
import NotchCloseIcon from "../NotchCloseIcon";
const PreviewContainer = ({recordedMedia , recordedAudioRef, canvasLoopingFnRef }) => {

    const [progress , setProgress] = useState(0);
    const analyserRef = useRef(null);
    const dataRef = useRef(null);
    const analyserCanvas = useRef(null);
    const rafIdRef = useRef(null);

    useImperativeHandle(canvasLoopingFnRef , () => {
        return {
            canvasPlayBack(){
                onLoadedData()
            }
        }
    } , [])

    const onLoadedData = () => {
        const audioStream = recordedAudioRef.current.captureStream ? recordedAudioRef.current.captureStream() :recordedAudioRef.current.mozCaptureStream ?recordedAudioRef.current.mozCaptureStream() :null;
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();

        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        try {
        const audioSrc = audioCtx.createMediaStreamSource(audioStream);
        audioSrc.connect(analyser);
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
       // fitCanvasToContainer();
        recordedAudioRef.current.play().then(() =>  loopingFunction());
        }
        catch(e) {
            console.log("error" + e);
        }
    }

    const clearCanvas = () => {
        const ctx = analyserCanvas.current.getContext("2d",  { willReadFrequently: true });
        ctx.clearRect(
            0,
            0,
            analyserCanvas.current.width,
            analyserCanvas.current.height
          );
    }

    
    function fitCanvasToContainer(){
     if(analyserCanvas.current) {
           // Make it visually fill the positioned parent
           analyserCanvas.current.style.width =analyserCanvas.current.offsetWidth;
           analyserCanvas.current.style.height=analyserCanvas.current.offsetHeight;
           // ...then set the internal size to match
           analyserCanvas.current.width  =  analyserCanvas.current.offsetWidth;
           analyserCanvas.current.height =  analyserCanvas.current.offsetHeight;
     }
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

    const loopingFunction = () => {
        rafIdRef.current = requestAnimationFrame(loopingFunction);
        analyserRef.current.getByteFrequencyData(dataRef.current);
        clearCanvas();
        const ctx = analyserCanvas.current.getContext("2d");
        draw(dataRef.current, ctx);
    };

    const onPlayBackEnd = () => {
        cancelAnimationFrame(rafIdRef.current);
    }

    const onTimeUpdate = () => {
        setProgress(Math.floor((recordedAudioRef.current.currentTime * 100)/recordedAudioRef.current.duration))
    }
   

    return (
        <div className={"previewContainer"}>
            <canvas ref={analyserCanvas} width={"430"} height={"250"}/>
            <audio ref={recordedAudioRef} src={recordedMedia.url} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedData}  onEnded={onPlayBackEnd} />
        </div>
    );
}



const PreviewRecording = ({ setView , close , recordedMedia}) => {

    const recordedAudioRef=  useRef(null);
    const canvasLoopingFnRef = useRef(null);


    const onPlayClick = () => {
        if(recordedAudioRef.current) {
            recordedAudioRef.current.currentTime = 0;
            recordedAudioRef.current.play().then(() => canvasLoopingFnRef.current.canvasPlayBack());
        }
    }
    const onReloadClick = () => {
        setView("record");
    }
    const onDoneClick = () => {
        close();
    }
    const onDownloadClick = () => {
        const anchorTag = document.createElement('a');
        anchorTag.href = recordedMedia.url;
        anchorTag.target = '_blank';
        anchorTag.download = 'recording.mp3';
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
    }

   
    return (
        <>
        <NotchCloseIcon handleClose={close}/>
        <div className="modalBody">
            <div className={styles.modalBodyContainer}>
                <IoReload onClick={onReloadClick} />
                <PreviewContainer recordedMedia={recordedMedia} canvasLoopingFnRef={canvasLoopingFnRef} recordedAudioRef={recordedAudioRef}  />
            </div>
        </div>
        <div className="modalFooter">
          <div className={styles.footerContainer}>
            <div className={styles.leftSection} >
                <MdReplay className={styles.playIcon} onClick={onPlayClick}  />
                <div className={styles.downloadContainer} onClick={onDownloadClick}>
                    <FiDownloadCloud />
                    <span>Download</span>
                </div>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.doneButton} onClick={onDoneClick}>Done</button>
            </div>
          </div>
        </div>
        </>
    )
}

export default PreviewRecording;