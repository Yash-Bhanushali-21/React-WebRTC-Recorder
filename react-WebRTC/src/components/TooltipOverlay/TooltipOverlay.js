import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from "./styles/tooltipoverlay.module.css";

export class TooltipOverlay extends React.Component {

  constructor(props) {
    super(props);
    
  }

  render() {

    const {tooltipLabel , content , show , placement="bottom" } = this.props;
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
}

