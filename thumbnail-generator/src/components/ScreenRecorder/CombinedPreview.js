import { useEffect, useRef } from "react";

export default function CombinedPreview({ screenShareStream, webCamStream, getCanvasRef }) {
    const canvasRef = useRef(null);
    const canvasContextRef = useRef(null);
    const webcamPreviewRef = useRef(null);
    const screenSharePreviewRef = useRef(null);
    const videosFramesId = useRef(null);
  
  
    const clearTimerIfExisting = () => {
       if (videosFramesId.current) clearTimeout(videosFramesId.current);
       createCombinedPreview();
    }
  
  
    const toggleWebcamAndScreenShare = () => {
      webcamPreviewRef.current.srcObject = webCamStream;
      screenSharePreviewRef.current.srcObject = screenShareStream;
      screenSharePreviewRef.current.play();
      webcamPreviewRef.current.play();
      clearTimerIfExisting();
      
    }
  
    const toggleWebcam = () => {
      webcamPreviewRef.current.srcObject = webCamStream;
      webcamPreviewRef.current.play();
      clearTimerIfExisting();
  
    }
  
    const toggleScreenShare = () => {
      screenSharePreviewRef.current.srcObject = screenShareStream;
      screenSharePreviewRef.current.play();
      clearTimerIfExisting();
    }
  
  
  
  
    useEffect(() => {
      if (webcamPreviewRef.current && screenSharePreviewRef.current) {
        if (webCamStream && screenShareStream) {
          toggleWebcamAndScreenShare();
        } else if (webCamStream && !screenShareStream) {
          toggleWebcam();
        } else if (screenShareStream && !webCamStream) {
          toggleScreenShare();
        }
        if (canvasRef.current) getCanvasRef(canvasRef.current);
      }
    }, [
      canvasRef,
      webCamStream,
      screenShareStream,
    ]);
  
    //Increase the video framing if required
    const requestVideoFrame = function (callback) {
      return window.setTimeout(function () {
        callback();
      }, 1000 / 60);
    };
  
    const createCombinedPreview = () => {
      if (
        canvasRef.current &&
        screenSharePreviewRef.current &&
        webcamPreviewRef.current
      ) {
        const WIDTH = 1920;
        const HEIGHT = 1080;
        canvasRef.current.setAttribute("width", `${WIDTH}px`);
        canvasRef.current.setAttribute("height", `${HEIGHT}px`);
        //canvasContext.
        canvasContextRef.current = canvasRef.current.getContext("2d");
        canvasContextRef.current.clearRect(0, 0, WIDTH, HEIGHT);
        canvasContextRef.current.save();
        // Drawing screen recording on canvas
  
        if (webCamStream && screenShareStream) {
          canvasContextRef.current.drawImage(
            screenSharePreviewRef.current,
            0,
            0,
            WIDTH,
            HEIGHT
          );
  
          //Add cam video to bottom right
          canvasContextRef.current.drawImage(
            webcamPreviewRef.current,
            WIDTH - 450,
            HEIGHT - 550,
            400,
            500
          );
        } else if (screenShareStream && !webCamStream) {
          canvasContextRef.current.drawImage(
            screenSharePreviewRef.current,
            0,
            0,
            WIDTH,
            HEIGHT
          );
        } else if (webCamStream && !screenShareStream) {
          //Add cam video to bottom right
          canvasContextRef.current.drawImage(
            webcamPreviewRef.current,
            0,
            0,
            WIDTH,
            HEIGHT
          );
        }
  
        let imageData = canvasContextRef.current.getImageData(
          0,
          0,
          WIDTH,
          HEIGHT
        );
        canvasContextRef.current.putImageData(imageData, 0, 0);
        canvasContextRef.current.restore();
      }
      videosFramesId.current = requestVideoFrame(createCombinedPreview);
    };
  
    if (!webCamStream && !screenShareStream) return;
  
    return (
      <>
        <video ref={webcamPreviewRef} autoPlay hidden playsInline muted />
        <video ref={screenSharePreviewRef} autoPlay hidden playsInline muted />
       <canvas ref={canvasRef} style={{ width:'100%' , height: "100%", borderRadius : "10px"}} />
      </>
    );
  }
  