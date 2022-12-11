import { ScreenRecorder } from "./components/ScreenRecorder";
import { PickerThumbnailGenerator } from "./components/PickerThumbnailGenerator";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import {useEffect, useState} from "react";
import classNames from "classnames";


function App() {


  const [selectedScreen , setSelectedScreen] = useState(-1);


  const recorderClasses = classNames("recorderContainer" , {
    ["show"] : selectedScreen === 0,
    ["hide"] : selectedScreen === 1
  })
  const thumbnailClasses = classNames("thumbnailContainer" , {
    ["show"] : selectedScreen === 1,
    ["hide"] : selectedScreen === 0

  })
  const lineContainerClasses = classNames("container" , {
    ["hide"] : selectedScreen !== -1
  })
  const outerContainerClasses = classNames("outerContainer" , {
    ["no-padding"] : selectedScreen !== -1,
  })

  const recordTitleClasses = classNames({
    ["hide"] : selectedScreen === 0
  })

  useEffect(() => {
    if(selectedScreen === -1 && document.body.style.background === "none" ) {
      document.body.style.background = "linear-gradient(to right, transparent calc(50% + 1px), #fff calc(50% + 1px)), linear-gradient(to right, #fff calc(50% - 1px), lightgrey calc(50% - 1px))"

    }
    else if(selectedScreen !== -1 && document.body.style.background !== "none") {
      document.body.style.background = "none"
    }

  } , [selectedScreen])


  const onClick = (screenIndex) => {
    setSelectedScreen(screenIndex);
  }

 
  const reset = () => setSelectedScreen(-1);


  
   return (<div className={outerContainerClasses}>
            <div className={recorderClasses} onClick={() => onClick(0)}>
            <span className={recordTitleClasses}>Record A Video!</span>
              <ScreenRecorder show={selectedScreen === 0} close = {reset} />
            </div>
            <div class={lineContainerClasses}>
              <div class="text"> OR </div>
            </div>
            <div className={thumbnailClasses} onClick={() => onClick(1)}>
              <PickerThumbnailGenerator show={selectedScreen === 1} close = {reset} />
            </div>
   </div> )

}

export default App;
