import { Modal } from "antd";
import Templates from "./room-create-modal";

const CreateTemplate = (props: {isOpen: boolean, onClose: () => void, accountId?: string}) => {

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
            {isOpen && <Templates {...props}/>}
        </Modal>
    )
}

export default CreateTemplate