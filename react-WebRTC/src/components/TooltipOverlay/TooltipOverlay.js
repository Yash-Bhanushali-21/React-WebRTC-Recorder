import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from "./tooltipoverlay.module.css";


export const TooltipOverlay = ({tooltipLabel , content , show , placement="bottom" }) => {
   
  if(show) {
    return(
      <OverlayTrigger       
        delay={{ show: 500, hide: 200 }}
        offset={[0,10]}
        rootClose
        placement={placement} 
        trigger={["hover","focus"]} 
        overlay={<Tooltip style={{position : "absolute"}}>{tooltipLabel}</Tooltip>}>
           {content}
      </OverlayTrigger>
      )
  }
  return content;   
}