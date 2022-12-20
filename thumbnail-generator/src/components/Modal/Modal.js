import { Modal } from "react-bootstrap"
import "./modal.css";





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
        icon : ,
        label : ,
        onClick : ,
        disabled : 
    }}
    rightButtonConfig : {{
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
                <div  className={"leftIconContainer"} onClick={leftButtonConfig.onClick}>
                    {renderIfComponentProvided(leftButtonConfig.icon )}
                    {leftButtonConfig.label}
                 </div>
                 <div  className={"rightIconContainer"}  onClick={rightButtonConfig.onClick} >
                     {  renderIfComponentProvided(rightButtonConfig.icon)} 
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

    return (
        <Modal  show={triggerConfig.show} dialogClassName={'modal-dialog'} 
         animation={false}
         onHide={triggerConfig.onHide}
          centered>
           <CustomHeaderComponent headerConfig={modalHeaderConfig} onHide={triggerConfig.onHide} />
            <div className={modalBodyConfig.className}>
                {modalBodyConfig.content}
            </div>   
            <CustomFooterComponent footerConfig={modalFooterConfig} onHide={triggerConfig.onHide} />
        </Modal>
    )
}

