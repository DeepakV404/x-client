import { Modal } from "antd";

import LeadRoomForm from "./lead-room-form";

const LeadRoomModal = (props: { isOpen: boolean, onClose: any }) => {
        
    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {700}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <LeadRoomForm {...props}/>}
        </Modal>
    )
}

export default LeadRoomModal