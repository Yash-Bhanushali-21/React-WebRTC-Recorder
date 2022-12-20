import  ScreenRecorder  from "./components/ScreenRecorder/ScreenRecorder";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import React ,{ useState} from "react";

import {IoCloseSharp} from "react-icons/io5";
import {FiUploadCloud} from "react-icons/fi";
import {HiOutlineVideoCamera , HiOutlineVideoCameraSlash} from "react-icons/hi2";
import {AiOutlineAudioMuted , AiOutlineAudio , AiOutlineCloudUpload} from "react-icons/ai";
import Modal from "react-bootstrap/Modal";

function App() {

  const [selectedScreen , setSelectedScreen] = useState(-1);

  const onClick = (screenIndex) => {
    setSelectedScreen(screenIndex);
  }
 
  function resetState() {
        setSelectedScreen(-2); 
  }


  
   return (<div className={"outerContainer"}>
            <div className={"recorderContainer"} onClick={() => onClick(0)}>
              <div className={"iconContainer"}><HiOutlineVideoCamera /></div>
              <div className="lineSeperator"></div>
              <div className={"titleContainer"}>Record</div>
              <div className={"textContainer"}>let's you record a video for generating thumbnails </div>
              <div className="waveContainer"></div>
            </div>
            
            <div className={"thumbnailContainer"} onClick={() => onClick(1)}>
              <div className={"iconContainer"}><AiOutlineCloudUpload /></div>
              <div className="lineSeperator"></div>
              <div className={"titleContainer"}>Upload</div>
              <div className={"textContainer"}>let's you upload a video for generating thumbnails</div>
              <div className="waveContainer"></div>
              {/**               <PickerThumbnailGenerator show={true} close = {resetState} />
 */}
            </div>
            <ScreenRecorder show={selectedScreen === 0} close={resetState} />

   </div> )

}


/*

headerConfig : {
    custom : 
    content : ,
    className : ,
}

bodyConfig : {
    content : ,
    className,
    icon
}
,
footerConfig : {
    custom : 
    content : ,
    className :
    leftButtonIcon,
    leftButtonLabel,
    leftButtonOnClick,
    rightButtonIcon,
    rightButtonLabel,
    rightButtonOnClick
}
triggerConfig : {
    show : ,
    onHide ,
}
*/



const RecorderModal = ({show , reset}) => {
  return (
      <Modal 
        show={show}
         onHide={reset} 
         animation={false}
         dialogClassName={"modal-dialog"}
         >
            <div className={"modalHeader"}>
              <div className="modalHeaderContent">
                <span>Record Video Clip</span>
                <IoCloseSharp onClick={reset} />
              </div>
            </div>
            <div className={"modalBody"}>
              <div className="previewContainer">
                <ScreenRecorder show={show} close={reset} />
                <div className="previewContainerFooter">
                 <HiOutlineVideoCamera />
                 <AiOutlineAudio />
                </div>
              </div>
            </div>
            <div className={"modalFooter"}>
              <div className={"footerButtonContainer"}>
                <div  className={"uploadIconContainer"}> 
                  <FiUploadCloud /> Upload Video
                </div>
                <div  className={"recordIconContainer"}  onClick={reset} >
                  Record
                </div>
              </div>
            </div>
     </Modal>
  )
}

export default App;
