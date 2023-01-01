import styles from "./styles/notchclose.module.css";
import {IoCloseSharp } from "react-icons/io5";


const NotchCloseIcon = ({handleClose}) => {
    return (
        <div className={styles.notch} role="button" onClick={handleClose}>
            <IoCloseSharp className={styles.crossIcon} />
        </div>
    )
}

export default NotchCloseIcon;