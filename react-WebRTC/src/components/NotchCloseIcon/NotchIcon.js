import styles from "./styles/notchclose.module.css";
import {IoCloseSharp } from "react-icons/io5";
import React from "react";

class NotchCloseIcon extends React.Component {
    constructor(props) {
        super(props);
        }
    render() {
        return (
            <div className={styles.notch} role="button" onClick={this.props.handleClose}>
                <IoCloseSharp className={styles.crossIcon} />
            </div>
        )
    }
}

export default NotchCloseIcon;