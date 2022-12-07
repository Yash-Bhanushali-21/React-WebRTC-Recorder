
import React, { useRef, useEffect, useState } from "react";
import styles from "./thumbnail.module.css";
import {Button} from "react-bootstrap";
 // this to handle the video duration bug


export  function ThumbnailGenerator({
  mediaBlobUrl,
  onSelect,
  onCancel,
}) {
 

  const [loaded, setLoaded] = useState(false);

  const imagesContainerRef = useRef(null);
  const thumbnailImgRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  

  useEffect(() => {
    if (videoRef.current && loaded) {
      makeThumbnailSelection(1);


      videoRef.current.addEventListener("timeupdate", getVideoSnapShot);
      drawThumbnailPreview(); //invoke once.
    }
    return () => {
      if (videoRef.current) {
        //incase the event handlers were not removed.
        videoRef.current.removeEventListener("timeupdate", getVideoSnapShot);
        videoRef.current.removeEventListener("timeupdate", drawThumbnailPreview);
      }
    };
  }, [loaded]);



  const onThumbnailsGenerated = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.removeEventListener("timeupdate", getVideoSnapShot);
      videoRef.current.addEventListener("timeupdate", drawThumbnailPreview);
    }
  };

  //returns img src of drawn  video.
  const drawImageOfVideo = () => {
    if (videoRef.current) {
      let thumbnailCanvas = canvasRef.current;
      let context = thumbnailCanvas.getContext("2d");

      //draw the image.
      videoRef.current && context && context.drawImage(videoRef.current, 0, 0, 1024, 576);
      //return the url.
      return {
        url : thumbnailCanvas.toDataURL("image/png"),
        currentTime  : videoRef.current.currentTime
      };
    }
  };

  const drawThumbnailPreview = () => {
    if (thumbnailImgRef.current) thumbnailImgRef.current.src = drawImageOfVideo().url;
  };

  const getVideoSnapShot = async () => {
    if (videoRef.current) {
      let imageObject = drawImageOfVideo();
      //give the src to new Image.
      let img = new Image();
      img.setAttribute("src" , imageObject.url);
      img.setAttribute("crossorigin" , "anonymous");
      img.setAttribute("height" , "64");
      img.setAttribute("width" , "125");
      img.setAttribute("data-timestamp" ,imageObject.currentTime )

      if (
        videoRef.current.currentTime + videoRef.current.duration / 5 <
        videoRef.current.duration
      ) {
        if (imagesContainerRef.current) {
            ///images are appended here.
            imagesContainerRef.current.appendChild(img);
        }
        videoRef.current.currentTime += videoRef.current.duration / 5;
      } else {
        //last frame of the video
        if (imagesContainerRef.current) {
                ///images are appended here.
            imagesContainerRef.current.appendChild(img)
        }

        //remove "getVideoSnapShot" after all thumbnails at different time generated
        onThumbnailsGenerated();
      }
    }
  };

  const onLoadedMetadataHandle = (e) => {
    const vid = e.target;
    if (vid.duration == Infinity) {
      vid.currentTime = 1e101;
      vid.ontimeupdate = function () {
        this.ontimeupdate = () => {
          setLoaded(true);
          return;
        };
        vid.currentTime = 0;
      };
    } else {
      setLoaded(true);
    }
  };

  // select a thumbnail for a particular time
  const makeThumbnailSelection = async (sliderPositionFromLeft) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = sliderPositionFromLeft;
      drawThumbnailPreview();
    }
  };

  const handleThumbnailClick = (e) => {
    const selectedImage = e.target;
    makeThumbnailSelection(selectedImage.getAttribute("data-timestamp"));
  };

  const getThumbnailFile = async () => {
    if (thumbnailImgRef?.current) {
      const dataURL = thumbnailImgRef.current.src;
      onSelect(dataURL);
    }
  };


  return (
    <div>
      <img
        height={296}
        width={300}
        ref={thumbnailImgRef}
        className={styles.thumbnailImg}
        style={{ width: "100%" }}
      />
      <canvas width="1024" height="576" hidden ref={canvasRef} />
      <video
        id="video"
        className={styles.videoPlayer}
        onLoadedData={onLoadedMetadataHandle}
        ref={videoRef}
        width="100%"
        height="296"
        crossOrigin="anonymous"
        muted
        hidden
        src={mediaBlobUrl}
        preload="auto"
      />
      <div className={styles.thumbnailContainer} onClick={handleThumbnailClick} ref={thumbnailContainerRef}>
        <ul className={styles.imagesContainer} ref={imagesContainerRef} />
      </div>
      <div className={styles.thumbnailPreviewContainer}>
        <Button variant="danger" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={getThumbnailFile} >
          Select
        </Button>
      </div>
    </div>
  );
}

