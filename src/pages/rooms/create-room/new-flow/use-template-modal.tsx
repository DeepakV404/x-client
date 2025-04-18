import { Modal } from "antd";
import UseRoomTemplateForm from "./use-template-form";

const UseRoomTemplates = (props: {isOpen: boolean, onClose: () => void, accountId?: string, isTemplateSelected: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <UseRoomTemplateForm {...props}/>}
        </Modal>
    )
}

export default UseRoomTemplates