import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from "./tooltipoverlay.module.css";


export const TooltipOverlay = ({tooltipLabel , content , show }) => {
   if(show) {
    return(
        <OverlayTrigger       
        delay={{ show: 500, hide: 200 }}
        offset={[0,10]}
        rootClose
         placement={"bottom"} trigger={["hover","focus"]} overlay={<Tooltip show={show} >{tooltipLabel}</Tooltip>}>
          {content}
        </OverlayTrigger>
        )
   }
   return content;
}