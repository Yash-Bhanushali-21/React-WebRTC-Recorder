import React, { useRef, useEffect, useState, MutableRefObject } from "react";
import styles from "./videorecorder.module.css";

const dataURLtoBlob = (dataURL: string) => fetch(dataURL).then((res) => res.blob());

export default function Thumbnail({
  mediaBlobUrl,
  onSelect,
  onCancel,
}: {
  mediaBlobUrl: string;
  onSelect: any;
  onCancel: any;
}) {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const sliderRef = useRef<HTMLElement>(null);
  const sliderTimeRef = useRef<HTMLElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailImgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoProgressRef = useRef<number>(0);
  const thumbnailContainerRef = useRef<any>(null);

  useEffect(() => {
    if (loaded && videoRef?.current) {
      makeThumbnailSelection(1);
      setThumbnailLoaded(true);
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
      let thumbnailCanvas = canvasRef.current as HTMLCanvasElement;
      //@ts-ignore
      let context = thumbnailCanvas.getContext("2d");
      //draw the image.
      videoRef.current && context && context.drawImage(videoRef.current, 0, 0, 1024, 576);
      //return the url.
      return thumbnailCanvas.toDataURL("image/png");
    }
  };

  const drawThumbnailPreview = () => {
    //@ts-ignore
    if (thumbnailImgRef.current) thumbnailImgRef.current.src = drawImageOfVideo();
  };

  const getVideoSnapShot = async () => {
    if (videoRef.current && videoProgressRef.current >= 0) {
      let drawnImageUrl = drawImageOfVideo();
      //give the src to new Image.
      let img = new Image();
      let url = drawnImageUrl;
      img.crossOrigin = "anonymous";
      img.height = 64;
      img.width = 125;
      //@ts-ignore
      img.src = url;

      if (
        videoRef.current.currentTime + videoRef.current.duration / 5 <
        videoRef.current.duration
      ) {
        if (imagesContainerRef.current) imagesContainerRef.current.appendChild(img);
        videoRef.current.currentTime += videoRef.current.duration / 5;
      } else {
        //last frame of the video
        if (imagesContainerRef.current) imagesContainerRef.current.appendChild(img);

        //remove "getVideoSnapShot" after all thumbnails at different time generated
        onThumbnailsGenerated();
      }
    }
  };

  // select a thumbnail for a particular time
  const makeThumbnailSelection = async (sliderPositionFromLeft: number) => {
    if (videoRef?.current) {
      //520 is the actual width of the div
      let factor = 520 / videoRef.current.duration;
      let val = sliderPositionFromLeft / factor;
      videoRef.current.currentTime = val;

      const secondsToMinutes = (time: number) => {
        if (time <= 0) return "0:00";
        return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
      };
      (sliderTimeRef as MutableRefObject<HTMLElement>).current.textContent = secondsToMinutes(val);

      drawThumbnailPreview();
    }
  };

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    //@ts-ignore
    const rect = e.currentTarget.getBoundingClientRect();
    const left = e.clientX - rect.left;

    if (sliderRef.current) {
      (sliderRef as MutableRefObject<HTMLElement>).current.style.left = `${left - 1}px`;
      (sliderTimeRef as MutableRefObject<HTMLElement>).current.style.left = `${left + 27}px`;
    }

    makeThumbnailSelection(left - 1);
  };

  const getThumbnailFile = async () => {
    if (thumbnailImgRef?.current) {
      const dataURL = thumbnailImgRef.current.src;
      const blob = await dataURLtoBlob(dataURL);
      onSelect(blob);
    }
  };

  // this to handle the video duration bug
  const onLoadedMetadataHandle = (e: any) => {
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

  return (
    <div>
      <img
        height={296}
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
      <span className={styles.thumbnailSliderTime} ref={sliderTimeRef}></span>
      <div className={styles.thumbnailContainer} onClick={handleSlider} ref={thumbnailContainerRef}>
        <span
          className={styles.thumbnailSlider}
          style={{ visibility: thumbnailLoaded ? "visible" : "hidden" }}
          ref={sliderRef}
        ></span>

        <div className={styles.imagesContainer} ref={imagesContainerRef} />
      </div>
      <div className={styles.thumbnailPreviewContainer}>
        <button onClick={onCancel}>
          Cancel
        </Button>
        <button onClick={getThumbnailFile} >
          Select
        </button>
      </div>
    </div>
  );
}
