import { Modal } from "antd";

import HandoffForm from "./handoff-form";

const HandoffConfirmation = (props: {isOpen: boolean, onClose: () => void, option: any, room: any, owner?: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {675}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
            destroyOnClose  =   {true}
            closable        =   {false}
        >
            {isOpen && <HandoffForm {...props}/>}
        </Modal>
    )
}

export default HandoffConfirmation