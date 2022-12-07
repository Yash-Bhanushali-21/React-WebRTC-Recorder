import { Button , Image } from "react-bootstrap";
import { CustomModal } from "../Modal"
import styles from "./styles.module.css";
import  { useState } from "react";
import { FilePicker } from "../FilePicker";
import { ThumbnailGenerator } from "../ThumbnailGenerator";
export const ThumbnailCaptureButton = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");


    const onSelect = (imgUrl) => {
        setSelectedFile(imgUrl);
    }
    const onCancel = () => {
        setSelectedFile("");
        setFile(null);
      // handleClose();
    }



    const customBody = (
        <>
        {!file && <FilePicker files={file} setFile={setFile}  />}
        {file && !selectedFile && <ThumbnailGenerator mediaBlobUrl={URL.createObjectURL(file)}
         onSelect={onSelect} onCancel={onCancel} />}
        {file && selectedFile && (
            <div style={{display : "flex" , flexDirection : "column"}}>
                <span>Selected Image</span>
                <Image src={selectedFile} crossOrigin={"anonymous"} />
            </div>
        )}

        </>
    )

    const customFooter = (
        <>
        </>
    )

    return (<>
            <Button variant="primary" className={styles.recordButton} onClick={handleShow}>
                Upload A Video!
            </Button>
            <CustomModal 
            show={show}
            onHide={handleClose}
            modalContent = {{
                title : 'Generate Thumbnail',
                body : customBody,
                footer : customFooter
            }}
            
            />

    </>)

}