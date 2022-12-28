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
  
    function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
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

        const Webcam_WIDTH = 400;
        const Webcam_HEIGHT = 300;



        canvasRef.current.setAttribute("width", `${WIDTH}px`);
        canvasRef.current.setAttribute("height", `${HEIGHT}px`);
        //canvasContext.
        canvasContextRef.current = canvasRef.current.getContext("2d",  { willReadFrequently: true });
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
          //creating a 20px rounded canvas border.
          roundedImage(canvasContextRef.current, WIDTH - (Webcam_WIDTH + 50),HEIGHT -  (Webcam_HEIGHT + 50),Webcam_WIDTH,Webcam_HEIGHT ,20);
          canvasContextRef.current.strokeStyle = 'transparent'
          canvasContextRef.current.stroke()
          canvasContextRef.current.clip();
          canvasContextRef.current.drawImage(
            webcamPreviewRef.current,
            WIDTH - (Webcam_WIDTH + 50),
            HEIGHT - (Webcam_HEIGHT + 50),
            Webcam_WIDTH,
            Webcam_HEIGHT
          );
          canvasContextRef.current.restore();

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
        <video ref={webcamPreviewRef} style={{borderRadius : "10px"}} autoPlay hidden playsInline muted />
        <video ref={screenSharePreviewRef} autoPlay hidden playsInline muted />
       <canvas ref={canvasRef} style={{ width:'100%' , height: "100%", borderRadius : "10px"}} />
      </>
    );
  }
  