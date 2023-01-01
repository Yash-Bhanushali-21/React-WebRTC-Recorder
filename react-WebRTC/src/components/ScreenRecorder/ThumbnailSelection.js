import React, { useRef, useEffect, useState } from "react";
import styles from "./thumbnailselection.module.css";
import classNames from "classnames";
import {IoCloseSharp } from "react-icons/io5";
import {AiFillLeftCircle , AiFillRightCircle} from "react-icons/ai";
import {BiChevronLeft, BiChevronRight} from "react-icons/bi";
import { useNavigationScroll } from "../../utils/hooks/useNavigationScroll";
import NotchCloseIcon from "../NotchCloseIcon";
import {FaChevronLeft , FaChevronRight} from "react-icons/fa";

const ThumbnailSelection = ({close ,setRecordedMedia ,  recordedMedia , setView}) => {

    const [loaded, setLoaded] = useState(false);
    const [showChevrons, setShowChevrons] = useState(false);

    const thumbnailImagesRef = useRef([]);
    

    const thumbnailImgRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const thumbnailContainerRef = useRef(null);


    const { scrollLeft, scrollRight, elementRef, navigationVisibility } = useNavigationScroll({
      show: showChevrons
    });


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

          //trigger a state update for canvas images render.
          setShowChevrons(true);
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
    
          if (
            videoRef.current.currentTime + videoRef.current.duration / 5 <
            videoRef.current.duration
          ) {
                ///images are appended here.
                if(thumbnailImagesRef.current) {
                  thumbnailImagesRef.current = [...thumbnailImagesRef.current , imageObject];
                }
            
            videoRef.current.currentTime += videoRef.current.duration / 5;
          } else {
            //last frame of the video
                    ///images are appended here.
                    if(thumbnailImagesRef.current) {
                      thumbnailImagesRef.current = [...thumbnailImagesRef.current , imageObject];
                    }

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
          setRecordedMedia(prevState => ({
            ...prevState,
            thumbnail : dataURL
          }))
          setView("preview")

        }
      };

      
    
    
    const leftChevronClasses = classNames(styles.leftChevron , {
      [styles.show] : navigationVisibility.left
      
    })
    
    const rightChevronClasses = classNames(styles.rightChevron , {
      [styles.show] : navigationVisibility.right
      
    })
    


    return (
        <>
       <NotchCloseIcon handleClose={close} />
        <div className={`modalBody ${styles.customBody}`}>
        <div className={styles.thumbnailContainer}>
                <img
                ref={thumbnailImgRef}
                className={styles.thumbnailImg}
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
                src={recordedMedia.url}
                preload="auto"
                />
                <div className={styles.thumbsContainer} ref={thumbnailContainerRef}>
                    <ul className={styles.imagesContainer} ref={elementRef}>
                      {thumbnailImagesRef.current.length > 0 ? 
                      thumbnailImagesRef.current.map(({url , currentTime}  , index) => 
                        (<img 
                          key={index.toString().concat(currentTime)} 
                          src={url} 
                          width={125} 
                          height={64}
                          onClick={handleThumbnailClick} 
                          //custom attribute.
                          data-timestamp={currentTime} 
                        />
                        )) : <></>}
                    </ul>
                    <div className={leftChevronClasses} onClick={scrollLeft}>
                      <FaChevronLeft />
                    </div>
                    <div className={rightChevronClasses} onClick={scrollRight}>
                    <FaChevronRight />
                    </div>
                   
                </div>
            </div>
        </div>
        <div className="modalFooter">
          <button className={styles.selectButton} onClick={getThumbnailFile} >
              Select
          </button>
        </div>
        </>
    );
}

export default ThumbnailSelection;
