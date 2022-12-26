import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from "./tooltipoverlay.module.css";


export const TooltipOverlay = ({children , show}) => {
    return(
        <OverlayTrigger trigger={["hover","focus"]} overlay={<Tooltip show={show} >This is tooltip</Tooltip>}>
        {children}
    </OverlayTrigger>
    )
}