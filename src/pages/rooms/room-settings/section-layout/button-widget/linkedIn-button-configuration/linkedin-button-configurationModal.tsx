import { Modal } from "antd";
import LinkedinButtonConfigurationForm from "./linkedin-button-configuration-form";

const LinkedinButtonConfigurationModal = (props: {editButtonProps: any, onClose: () => void, module: any}) => {

    const { editButtonProps, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {600}
            open            =   {editButtonProps?.visibility} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {editButtonProps?.visibility && <LinkedinButtonConfigurationForm {...props}/>}
        </Modal>
    )
}

export default LinkedinButtonConfigurationModal