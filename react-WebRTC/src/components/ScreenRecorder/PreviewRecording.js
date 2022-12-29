import {IoCloseSharp , IoReload} from "react-icons/io5";
import styles from "./previewrecording.module.css";
import { ProgressBar } from "react-bootstrap";
import {  useRef  , useState} from "react";
import {FiPlay  , FiDownloadCloud , FiImage} from "react-icons/fi";
import {MdReplay} from "react-icons/md";
import NotchCloseIcon from "../NotchCloseIcon";

const PreviewContainer = ({recordedMedia , recordedVideoRef }) => {
    const [progress , setProgress] = useState(0);


    const onTimeUpdate = (e) => {
        setProgress(Math.floor((recordedVideoRef.current.currentTime * 100)/recordedVideoRef.current.duration))
    }
    const onLoadedMetadataHandle = () => {
        if (recordedVideoRef.current.duration == Infinity) {
            recordedVideoRef.current.currentTime = 1e101;
            recordedVideoRef.current.ontimeupdate = function () {
            this.ontimeupdate = () => {
              return;
            };
            recordedVideoRef.current.currentTime = 0;
            recordedVideoRef.current.play();
            return;
          };
        }
      };

    return (
        <div className={styles.previewContainer}>
            <video ref={recordedVideoRef} onTimeUpdate={onTimeUpdate} src={recordedMedia.url} onLoadedMetadata={onLoadedMetadataHandle} width="100%" />
            <ProgressBar className={styles.progressBar} now={progress} />
        </div>
    );
}



const PreviewRecording = ({ setView , close , recordedMedia}) => {

    const recordedVideoRef=  useRef(null);

    const onPlayClick = () => {
        if(recordedVideoRef.current) {
            recordedVideoRef.current.currentTime = 0;
            recordedVideoRef.current.play();
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
        anchorTag.download = 'recording.mp4';
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
    }

    const onSelectThumbnailClick = () => {
        setView("thumbnail");
    }

    return (
        <>
       
         <NotchCloseIcon handleClose={close}/>
        <div className="modalBody">
            <div className={styles.modalBodyContainer}>
                <IoReload onClick={onReloadClick} />
                <PreviewContainer recordedMedia={recordedMedia} recordedVideoRef={recordedVideoRef}  />
            </div>
        </div>
        <div className="modalFooter">
          <div className={styles.footerContainer}>
            <div className={styles.leftSection} >
                <MdReplay className={styles.playIcon} onClick={onPlayClick}  />
                <div className={styles.thumbnailContainer} onClick={onSelectThumbnailClick}>
                    <FiImage />
                    <span>Select Thumbnail</span>
                </div>
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