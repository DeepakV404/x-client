import { Modal } from "antd";
import RoomTemplates from "./room-create-modal";

const CreateRoom = (props: {isOpen: boolean, onClose: () => void, accountId?: string}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            className       =   "j-create-room-modal cm-full-screen-modal"
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            closable        =   {false}
        >
            {isOpen && <RoomTemplates {...props}/>}
        </Modal>
    )
}

export default CreateRoom