
import React ,{ useState} from "react";


//custom component import.
import {AudioAnalyzer} from "./components/AudioAnalyzer";
import {ScreenRecorderModal} from "./components/ScreenRecorder";
//icon imports
import {HiOutlineVideoCamera } from "react-icons/hi2";
import {  AiOutlineAudio } from "react-icons/ai";

//css imports.
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";



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
              <div className={"iconContainer"}><AiOutlineAudio /></div>
              <div className="lineSeperator"></div>
              <div className={"titleContainer"}>Audio</div>
              <div className={"textContainer"}>let's you record an audio with visualizations</div>
              <div className="waveContainer"></div>
              {/**               <PickerThumbnailGenerator show={true} close = {resetState} />
 */}
            </div>
           {selectedScreen === 0 &&  <ScreenRecorderModal show={selectedScreen === 0} close={resetState} />}
           {selectedScreen === 1 && <AudioAnalyzer show = {selectedScreen === 1} close={resetState} />}

   </div> )

}

export default App;
