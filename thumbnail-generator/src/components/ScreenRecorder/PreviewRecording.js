

import {IoCloseSharp , IoReload} from "react-icons/io5";
import styles from "./previewrecording.module.css";
import { ProgressBar } from "react-bootstrap";
import { useEffect, useRef  , useState} from "react";

const PreviewContainer = ({recordedMedia , replay}) => {
    const [progress , setProgress] = useState(0);
    const videoRef=  useRef(null);

    useEffect(() => {
        if(replay) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    },[replay])

    const onTimeUpdate = (e) => {
        setProgress(Math.floor((videoRef.current.currentTime * 100)/videoRef.current.duration))
    }
    const onLoadedMetadataHandle = () => {
        if (videoRef.current.duration == Infinity) {
            videoRef.current.currentTime = 1e101;
            videoRef.current.ontimeupdate = function () {
            this.ontimeupdate = () => {
              return;
            };
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            return;
          };
        }
      };

    return (
        <div className={styles.previewContainer}>
            <video ref={videoRef} onTimeUpdate={onTimeUpdate} src={recordedMedia} onLoadedMetadata={onLoadedMetadataHandle} width="100%" />
            <ProgressBar className={styles.progressBar} now={progress} />
        </div>
    );
}



const PreviewRecording = ({ setView , close , recordedMedia}) => {

    const [play , setPlay] = useState(1);


    return (
        <>
        <div className="modalHeader">
            <div className="modalHeaderContent">
                Preview <IoCloseSharp onClick={close} />
            </div>
        </div>
        <div className="modalBody">
            <div className={styles.modalBodyContainer}>
                <IoReload onClick={() => setView("record")} />
                <PreviewContainer recordedMedia={recordedMedia} replay={play} />
            </div>
        </div>
        <div className="modalFooter">
          <div className={styles.footerContainer}>
            <div className={styles.leftSection} onClick={() => setPlay(play++)}>
                play
            </div>
            <div className={styles.rightSection}></div>
          </div>
        </div>
        </>
    )
}

export default PreviewRecording;