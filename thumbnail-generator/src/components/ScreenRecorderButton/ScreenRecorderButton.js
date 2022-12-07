import styles from "./popover.module.css";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ScreenRecorder } from "../ScreenRecorder/ScreenRecorder";
import { CustomModal } from "../Modal";

export const ScreenRecorderButton = () => {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const customFooterContent =(<>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button variant="primary">Record</Button>
                              </>)
  

  return (
    <>
      <Button variant="primary" className={styles.recordButton} onClick={handleShow}>
        Or Record A Video!
      </Button>

      <CustomModal
          onHide={handleClose}
          show = {show}
          modalContent = {{
            body :  <ScreenRecorder />,
            footer : customFooterContent
          }}
      />
      
    </>
  );
}
