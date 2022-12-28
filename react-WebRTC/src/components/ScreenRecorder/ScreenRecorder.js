import classNames from "classnames";
import {  useEffect, useRef, useState } from "react";
import CombinedPreview from "./CombinedPreview";
import styles from "./screenrecorder.module.css";
 import {IoCloseSharp } from "react-icons/io5";
 import {FiUploadCloud} from "react-icons/fi";
 import {HiOutlineVideoCamera , HiOutlineVideoCameraSlash} from "react-icons/hi2";
 import {AiOutlineAudioMuted , AiOutlineAudio} from "react-icons/ai";
import {TbScreenShare , TbScreenShareOff} from "react-icons/tb";

//configs and utils.
const displayMediaOptions = {
  video: {
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
  },
  audio: true,
};

const getActiveClassForStream = (stream) => ({
  [styles.show] : stream !== null
})
const getInActiveClassForStream = (stream) => ({
  [styles.show] : stream === null
})

const getInvertCondition = ({recordedVideo , webCamStream , screenShareStream}) => ({
  [styles.hide] : recordedVideo.length !== 0,
  ["invert"] : webCamStream || screenShareStream

})

const ScreenSharingAndWebCam = ({screenShareStream , webCamStream , isMicMuted ,toggleAudioStream , recordedVideo , toggleScreenShareStream , toggleWebcamStream , getCanvasRef }) => {

  const iconWrapperClasses = classNames("iconWrapper", {
    ["preStream"] : !webCamStream && !screenShareStream,
    ["postStream"] : webCamStream || screenShareStream
  })

  const activeWebcamClasses = classNames(iconWrapperClasses,getActiveClassForStream(webCamStream));
  const inactiveWebcamClasses = classNames(iconWrapperClasses,getInActiveClassForStream(webCamStream));

  const activeScreenShareClasses = classNames(iconWrapperClasses , getActiveClassForStream(screenShareStream));
  const inactiveScreenShareClasses = classNames(iconWrapperClasses ,getInActiveClassForStream(screenShareStream));

 
  const leftSectionClasses = classNames("leftSection",getInvertCondition({recordedVideo, webCamStream , screenShareStream}))
  const rightSectionClasses = classNames("rightSection", getInvertCondition({recordedVideo, webCamStream, screenShareStream}))

  const activeAudioClasses = classNames(iconWrapperClasses,{
    [styles.show] : !isMicMuted,
  });
  const inactiveAudioClasses = classNames(iconWrapperClasses,{
    [styles.show] : isMicMuted,   
  })
  const previewContainerFooterClasses = classNames("previewContainerFooter", {
    ["previewContainerFooterBg"] : webCamStream || screenShareStream
  })

  return (
    <>
    <div className="previewContainer">
      <div className={styles.containerBody}>
        <CombinedPreview
        screenShareStream={screenShareStream}
        webCamStream={webCamStream}
        getCanvasRef ={getCanvasRef}
         />
          <div className={previewContainerFooterClasses}>
              <div className={rightSectionClasses}>
                  <div className={activeWebcamClasses} onClick={toggleWebcamStream}>                              
                    <HiOutlineVideoCamera className={styles.webcamIcon} />
                  </div>
                  <div className={inactiveWebcamClasses} onClick={toggleWebcamStream} >
                    <HiOutlineVideoCameraSlash  className={styles.webcamIcon}/>
                  </div>
                  <div className={activeAudioClasses} onClick={toggleAudioStream}>
                    <AiOutlineAudio />
                  </div>
                  <div className={inactiveAudioClasses} onClick={toggleAudioStream}>
                    <AiOutlineAudioMuted />
                  </div>
              </div>
              <div className={leftSectionClasses}>
                <div className={activeScreenShareClasses} onClick={toggleScreenShareStream} ><TbScreenShareOff className={styles.screenShareIcon} /> </div>
                <div className={inactiveScreenShareClasses} onClick={toggleScreenShareStream}><TbScreenShare  className={styles.screenShareIcon}  /></div>
              </div>
          </div>
        </div>
  </div>             
  </>
  )
}

const ScreenSharingAndWebCamHeader = ({handleClose}) => {
 
  return (
    <>
        <span>Record Video Clip</span>
        <IoCloseSharp onClick={handleClose} />
     </>
  )
}


const ScreenSharingAndWebCamFooter = ({webCamStream , screenShareStream , recorderState, recordedVideo , onUploadVideoClick , toggleMediaRecording}) => {

  const submitButtonClasses = classNames(styles.recordButton , {
    [styles.doneButton] : recordedVideo.length,
    [styles.disabled] : !(webCamStream || screenShareStream)
  });


  return (
    <div className={"footerButtonContainer"}>
        <div  className={styles.uploadVideoIconContainer} onClick={onUploadVideoClick}>
            <FiUploadCloud />
            {"Upload Video"}
         </div>
         <div  className={submitButtonClasses}  onClick={toggleMediaRecording} >
            {recorderState==="Idle" ? "Record" : (recorderState === "Recording" ? "Stop" : "Done")}
        </div>
    </div>
  )
}



export default  function ScreenRecorder({ close , setView , setRecordedMedia}) {


  const screenShareStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const webCamTracks = useRef([]);
  const screenRecordTracks = useRef([]);
  const combinedStreamRef = useRef(null);

  const [canvasRef, getCanvasRef] = useState(null);
  const [webCamStream, setWebCamStream] = useState(null);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [isMicMuted , setIsMicMuted] = useState(false);
  const [recorderState, setRecorderState] = useState("Idle");


  const [recordedVideo, setRecordedVideo] = useState("");

  const keyDownEvent = (event) => {
    if(event.key === "Escape") {
      close();
    }
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

  const closeScreenShareStream = () => {
    setScreenShareStream(null);
    screenShareStreamRef.current?.getTracks()?.forEach((track) => track.stop());
    screenShareStreamRef.current = null;  
    
  }

  const toggleScreenShareStream = async () => {
    if (!screenShareStreamRef.current) {
      screenShareStreamRef.current =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      screenRecordTracks.current = screenShareStreamRef.current.getTracks();
      //oninactive to listen to stop sharing event on system tray.
      screenShareStreamRef.current.oninactive = closeScreenShareStream;
      setScreenShareStream(screenShareStreamRef.current);
    } else if (screenShareStreamRef.current) {
      closeScreenShareStream();
      }
    
  };
  const onDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };
  const onStop = () => {
    const current_blob = new Blob(chunksRef.current, {
      type: "video/webm",
    });
    chunksRef.current = [];
    const url = URL.createObjectURL(current_blob);
    setRecordedVideo(url);
    setRecordedMedia(prevState => ({
      ...prevState , 
      url
    }));


   
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
      setRecorderState("Recording");

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
      setRecorderState("Recorded");
      setView("preview");

    }
  };

 
  const toggleMediaRecording = () => {
    if(!recorderRef.current || recorderRef.current && recorderRef.current.state === "inactive") {
      startRecording();
    }
    else if(recorderRef.current && recorderRef.current.state === "recording") {
      stopRecording();
    }
  }


  const toggleAudioStream = () => {
    const webCamAudioTracks = webCamStream ? webCamStream.getAudioTracks() : null;
    const screenShareAudioTracks = screenShareStream ? screenShareStream.getAudioTracks() : null;

    if(screenShareAudioTracks || webCamAudioTracks) {
      //do the toggle only if streams exists.
      if(isMicMuted) {
        //do something.
        if(webCamAudioTracks && webCamAudioTracks.length) webCamAudioTracks.at(0).enabled = true;
        if(screenShareAudioTracks && screenShareAudioTracks.length) screenShareAudioTracks.at(0).enabled = true;
        setIsMicMuted(false);
      }
      else {
        if(webCamAudioTracks && webCamAudioTracks.length) webCamAudioTracks.at(0).enabled = false;
        if(screenShareAudioTracks && screenShareAudioTracks.length) screenShareAudioTracks.at(0).enabled = false;
        setIsMicMuted(true);
      }
    }
 
  }
 
  const onUploadVideoClick = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept="video/*";
    input.onchange = _ => {
              let files = Array.from(input.files);
              setRecordedMedia(prevState => ({
                ...prevState , 
                url : URL.createObjectURL(files[0])
              }));
              setView("preview")
          };
    input.click();
  }

  return ( <>
              <div className={"modalHeader"}>
                    <div className="modalHeaderContent">
                     <ScreenSharingAndWebCamHeader handleClose = {close} />
                    </div>
              </div>
              <div className="modalBody">
                 <ScreenSharingAndWebCam 
                    screenShareStream={screenShareStream}
                    webCamStream={webCamStream}
                    isMicMuted={isMicMuted}
                    toggleScreenShareStream={toggleScreenShareStream}
                    toggleWebcamStream={toggleWebcamStream}
                    getCanvasRef={getCanvasRef}
                    toggleAudioStream={toggleAudioStream}
                    recordedVideo={recordedVideo}
                  />
              </div>
              <div className="modalFooter">
                 <ScreenSharingAndWebCamFooter
                    webCamStream={webCamStream}
                    screenShareStream={screenShareStream}
                    recorderState={recorderState}
                    recordedVideo={recordedVideo}
                    onUploadVideoClick={onUploadVideoClick}
                    toggleMediaRecording={toggleMediaRecording}
                  />       
              </div>                  
                    
         </>)

  
}

