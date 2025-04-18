import { Modal } from "antd";

import RoomForm from "./room-form";

const RoomModal = (props: {isOpen: boolean, onClose: () => void, accountId?: string}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {800}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <RoomForm {...props}/>}
        </Modal>
    )
}

export default RoomModal