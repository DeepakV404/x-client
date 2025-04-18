import { FC } from "react";
import { Modal } from "antd";

import FaqModalContent from "./faq-content";

interface FaqModalProps
{
    isOpen  : boolean;
    onClose : () => void;
}

const FaqModal: FC<FaqModalProps> = (props) => {

    const { isOpen, onClose }  = props;

    return(
       <Modal
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
            centered
        >
            <FaqModalContent {...props}/>
       </Modal>
    );
}

export default FaqModal