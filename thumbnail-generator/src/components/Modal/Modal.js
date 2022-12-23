import { Modal } from "react-bootstrap"
import "./modal.css";


<<<<<<< Updated upstream
export const CustomModal = ({ onHide, show , modalContent}) => {
=======
const renderIfComponentProvided = (Component , props = {}) => Component ? <Component {...props} /> : null;


const CustomFooterComponent = ({footerConfig}) => {

    const {leftButtonConfig , rightButtonConfig} = footerConfig;

    if(footerConfig.content) {
        return (
            <div className={footerConfig.className}>
                {footerConfig.content}
            </div>
        )
    }
    return (
        <div className={"modalFooter"}>
            <div className={"footerButtonContainer"}>
                <div  className={leftButtonConfig.className} onClick={leftButtonConfig.onClick}>
                    {renderIfComponentProvided(leftButtonConfig.icon)}
                    {leftButtonConfig.label}
                 </div>
                 <div  className={rightButtonConfig.className}  onClick={rightButtonConfig.onClick} >
                     {renderIfComponentProvided(rightButtonConfig.icon)} 
                    {rightButtonConfig.label}
                </div>
            </div>
      </div>
    )
    
}

const CustomHeaderComponent = ({headerConfig , onHide}) => {

    const iconComponentProps = {
        onClick : onHide
    }

    if(headerConfig.content) {
        return (
            <div className={headerConfig.className}>
                {headerConfig.content}
            </div>
        )
    }
    return (
        <div className={"modalHeader"}>
             <div className="modalHeaderContent">
                <span>{headerConfig.label}</span>
                {renderIfComponentProvided(headerConfig.icon , iconComponentProps)}
              </div>
        </div>
    )
    
}

export const CustomModalWrapper = ({triggerConfig, modalHeaderConfig, modalBodyConfig , modalFooterConfig}) => {
>>>>>>> Stashed changes

    return (
        <Modal  show={show} onHide={onHide} rootClose centered>
            <Modal.Title>{modalContent.title}</Modal.Title>
            <Modal.Body>{modalContent.body}</Modal.Body>
            <Modal.Footer>{modalContent.footer}</Modal.Footer>
        </Modal>
    )
}



/*

headerConfig : {
    label : ,
    className : ,
    icon : 
}

bodyConfig : {
    content : ,
    className,
}
,
footerConfig : {
    content : ,
    className :
    leftButtonConfig : {{
        className: 
        icon : ,
        label : ,
        onClick : ,
        disabled : 
    }}
    rightButtonConfig : {{
        className: 
         icon : ,
        label : ,
        onClick : ,
        disabled : 
    }}
    
}
triggerConfig : {
    show : ,
    onHide ,
}
*/
