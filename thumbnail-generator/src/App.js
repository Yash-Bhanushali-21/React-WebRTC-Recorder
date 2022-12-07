import { ScreenRecorderButton } from "./components/ScreenRecorderButton";
import { ThumbnailCaptureButton } from "./components/ThumbnailCaptureButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {

  return (
    <div className="appContainer">
      <ScreenRecorderButton />
      <ThumbnailCaptureButton />
    </div>
  
  );
}

export default App;
