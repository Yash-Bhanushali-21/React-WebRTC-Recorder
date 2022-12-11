import  {  useState } from "react";
import { FilePicker } from "../FilePicker";
import { ThumbnailGenerator } from "../ThumbnailGenerator";
import classNames from "classnames";

import styles from "./styles.module.css";
import thumbnailStyles from "../ThumbnailGenerator/thumbnail.module.css";

export const PickerThumbnailGenerator = ({ show , close }) => {

    const [showThumbnaiPicker, setShowThumbnaiPicker] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");


    const onFileSelected = (selectedFile) => {
      setFile(selectedFile);
      setShowThumbnaiPicker(true);
    }
    
  
    const onSelect = (imgUrl) => {
        setShowThumbnaiPicker(false)
        setSelectedFile(imgUrl);
    }
    const onCancel = () => {
        setSelectedFile("");
        setFile(null);
        setShowThumbnaiPicker(false);
        close();
    }

    

  const filePickerClasses= classNames({
    [styles.disablePointerEvents] : !show ,
    [styles["show-flex"]] : show && !showThumbnaiPicker,
    [styles.hide] : (show && showThumbnaiPicker) || (selectedFile && selectedFile.length)
  })

  const thumbnailGeneratorClasses = classNames({
    [thumbnailStyles.show] : showThumbnaiPicker
  })

  const imgClasses = classNames(styles.image , {
    [styles.show] : selectedFile && selectedFile.length
  })

    return (<>
                <div className={filePickerClasses}> <FilePicker files={file} setFile={onFileSelected} /></div>
                <ThumbnailGenerator
                    mediaBlobUrl =  {file ? URL.createObjectURL(file) : ""}
                    onSelect = {onSelect}
                    onCancel = {onCancel}
                    className={thumbnailGeneratorClasses}
                  />
              <img className={imgClasses} src ={selectedFile} alt="fallback-text" />

            </>)

}