import classNames from "classnames";
import {  useEffect, useRef, useState } from "react";
import CombinedPreview from "./CombinedPreview";
import styles from "./screenrecorder.module.css";
import { v4 as uuidv4 } from 'uuid';
 import { CustomModalWrapper } from "../Modal/Modal";
 import {IoCloseSharp} from "react-icons/io5";
 import {FiUploadCloud} from "react-icons/fi";
 import {HiOutlineVideoCamera , HiOutlineVideoCameraSlash} from "react-icons/hi2";
 import {AiOutlineAudioMuted , AiOutlineAudio , AiOutlineCloudUpload} from "react-icons/ai";
import {TbScreenShare , TbScreenShareOff} from "react-icons/tb";


const displayMediaOptions = {
  video: {
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
  },
  audio: true,
};
export default  function ScreenRecorder({show , close}) {
  const screenShareStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const webCamTracks = useRef([]);
  const screenRecordTracks = useRef([]);
  const combinedStreamRef = useRef(null);
  const finalPreview = useRef(null);

  const [canvasRef, getCanvasRef] = useState(null);
  const [webCamStream, setWebCamStream] = useState(null);
  const [screenShareStream, setScreenShareStream] = useState(null);


  const [recordedVideo, setRecordedVideo] = useState("");

  const keyDownEvent = (event) => {
  
    if(event.key === "Escape") {
      close();
    }
    // Alert the key name and key code on keydown
  }

  useEffect(() => {

    document.addEventListener('keydown', keyDownEvent, false);

    return () => {
      document.removeEventListener('keydown', keyDownEvent, false);

    }

  }, [])


  



  const toggleWebcamStream = async () => {
    if (!webcamStreamRef.current) {
      webcamStreamRef.current = await navigator.mediaDevices.getUserMedia(displayMediaOptions);
      webCamTracks.current = webcamStreamRef.current.getTracks();
      setWebCamStream(webcamStreamRef.current);
    } else if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      webcamStreamRef.current = null;
      setWebCamStream(null);
      }
    
  };



  const getAudioDestination = (webCamStreamRef, screenStreamRef) => {
    const audioContext = new AudioContext();
    const audioDestination = audioContext.createMediaStreamDestination();
    let existingAudioStreams = [
      ...webCamStreamRef?.current?.getAudioTracks(),
      ...screenStreamRef?.current?.getAudioTracks(),
    ];
    const audioTracks = [];
    audioTracks.push(
      audioContext.createMediaStreamSource(
        new MediaStream([existingAudioStreams[0]])
      )
    );
    if (existingAudioStreams.length > 1) {
      audioTracks.push(
        audioContext.createMediaStreamSource(
          new MediaStream([existingAudioStreams[1]])
        )
      );
    }
    audioTracks.forEach((track) => track.connect(audioDestination));
    return audioDestination;
  };

  const onScreenShareStreamEnd = () => {
    setScreenShareStream(null);
    screenShareStreamRef.current.getTracks().forEach((track) => track.stop());
    screenShareStreamRef.current = null;
  };
  const toggleScreenShareStream = async () => {
    if (!screenShareStreamRef.current) {
      screenShareStreamRef.current =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      screenShareStreamRef.current.oninactive = onScreenShareStreamEnd;
      screenRecordTracks.current = screenShareStreamRef.current.getTracks();
      setScreenShareStream(screenShareStreamRef.current);
    } else if (screenShareStreamRef.current) {
        screenShareStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        screenShareStreamRef.current = null;
        setScreenShareStream(null);
      }
    
  };
  const onDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };
  const onStop = () => {
    const blob = new Blob(chunksRef.current, {
      type: "video/webm",
    });
    chunksRef.current = [];
    const url = URL.createObjectURL(blob);
    setRecordedVideo(url);

   
  };
  const startRecording = async () => {
    if (canvasRef) {
      combinedStreamRef.current = await canvasRef.captureStream();

      let audioDestinationStream = null;
      let mediaTracks = [];

      if (
        screenShareStreamRef.current?.getAudioTracks() &&
        webcamStreamRef?.current?.getAudioTracks()
      ) {
        audioDestinationStream =  getAudioDestination(
          webcamStreamRef,
          screenShareStreamRef
        );
        mediaTracks = [
          ...combinedStreamRef.current.getVideoTracks(),
          ...audioDestinationStream.stream.getTracks(),
        ];
      } else {
        if (webcamStreamRef?.current?.getAudioTracks()) {
          audioDestinationStream = webcamStreamRef.current.getAudioTracks();
        } else
          audioDestinationStream =
            screenShareStreamRef.current.getAudioTracks();

        mediaTracks = [
          ...combinedStreamRef.current.getVideoTracks(),
          ...audioDestinationStream,
        ];
      }

      combinedStreamRef.current =  new MediaStream(mediaTracks);
      recorderRef.current = new MediaRecorder(combinedStreamRef.current);
      recorderRef.current.start();
      recorderRef.current.ondataavailable = onDataAvailable;
      recorderRef.current.onstop = onStop;
    }
  };
  const stopRecording = () => {
    if (combinedStreamRef.current && recorderRef.current) {
      combinedStreamRef.current.getTracks().forEach((track) => track.stop());
      combinedStreamRef.current = null;
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
        webcamStreamRef.current = null;
        setWebCamStream(null);
      }
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach((track) => track.stop());
        screenShareStreamRef.current = null;
        setScreenShareStream(null);
      }
      recorderRef.current.stop();
    }
  };

  const download = () => {

    const aTag= document.createElement("a");
    aTag.href = recordedVideo;
    document.body.appendChild(aTag);
    aTag.download = uuidv4().toString();
    aTag.click();
    aTag.remove();


  }
  const toggleMediaRecording = () => {
    if(!recorderRef.current || recorderRef.current && recorderRef.current.state === "inactive") {
      startRecording();
    }
    else if(recorderRef.current && recorderRef.current.state === "recording") {
      stopRecording();
    }
  }

  const previewVideoClasses = classNames(styles.previewVideo , {
    [styles.show] : recordedVideo.length
  })

  const activeWebcamClasses = classNames(styles.webcamIcon,{
    [styles.show] : webCamStream !== null
  });
  const inactiveWebcamClasses = classNames(styles.webcamIcon,{
    [styles.show] : webCamStream === null
  })

  const activeScreenShareClasses = classNames(styles.screenShareIcon , {
    [styles.show] : screenShareStream !== null
  })
  
  const inactiveScreenShareClasses = classNames(styles.screenShareIcon , {
    [styles.show] : screenShareStream === null
  })

  return (<CustomModalWrapper
              triggerConfig={{
                show,
                onHide: close
              }}
              modalHeaderConfig={{
                content : null,
                label : "Record Video Clip",
                icon : IoCloseSharp,
                className : ""
              }}
              modalBodyConfig = {{
                custom : false,
                className : "",
                content : (
                  <div className={"modalBody"}>
                  <div className="previewContainer">
                    <div className={styles.containerBody}>
                      <div className={previewVideoClasses}>
                        <video ref={finalPreview} autoPlay src={recordedVideo} />
                      </div>
                      <CombinedPreview
                          webCamStream={webCamStream}
                          screenShareStream={screenShareStream}
                          getCanvasRef={getCanvasRef}
                        />
                        <div className="previewContainerFooter">
                             <div className="rightSection">
                              <HiOutlineVideoCamera className={activeWebcamClasses} onClick={toggleWebcamStream} />
                              <HiOutlineVideoCameraSlash className={inactiveWebcamClasses} onClick={toggleWebcamStream} />
                                <AiOutlineAudio />
                            </div>
                             <div className="leftSection">
                               <TbScreenShareOff className={activeScreenShareClasses} onClick={toggleScreenShareStream} />
                               <TbScreenShare  className={inactiveScreenShareClasses} onClick={toggleScreenShareStream} />
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
              modalFooterConfig = {{
                className : "",
                content: null,
                leftButtonConfig : {
                  icon : FiUploadCloud,
                  label : "Upload Video",
                  onClick : null,
                  disabled : false
                },
                rightButtonConfig : {
                  icon : null,
                  label : "Record",
                  onClick : toggleMediaRecording,
                  disabled: false
                },
              }}        
          />)





  
 
  return (
        <div className={styles.containerBody}>
          <div className={previewVideoClasses}>
          <video ref={finalPreview} autoPlay src={recordedVideo} />
          </div>
            <CombinedPreview
              webCamStream={webCamStream}
              screenShareStream={screenShareStream}
              getCanvasRef={getCanvasRef}
            />
    </div>

  );
}

/*
      </div>
       {/**
        *  <div className={styles.containerFooter}>
          <button onClick={toggleWebcamStream}>toggle webcamstream</button>
          <button onClick={toggleScreenShareStream}>
            toggle ScreenShareStream
          </button>
          <button onClick={startRecording}>start record</button>
          <button onClick={stopRecording}>stop record</button>
          <button onClick={download}>Download</button>

        </div>
}

*/


/*

headerConfig : {
    label : ,
    className : ,
    icon : 
}
bodyConfig : {
    content : ,
    className,
}
footerConfig : {
    content : ,
    className :
    leftButtonConfig : {{
        icon : ,
        label : ,
        onClick : ,
        disabled : 
    }}
    rightButtonConfig : {{
         icon : ,
        label : ,
        onClick : ,
        disabled : 
    }}
}
triggerConfig : {
    show : ,
    onHide ,
}
*/