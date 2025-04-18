import { Modal } from "antd";

import ButtonConfigurationForm from "./button-configuration-form";

const ButtonConfigurationModal = (props: {editButtonProps: any, onClose: () => void, module: any}) => {

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
            {editButtonProps?.visibility && <ButtonConfigurationForm {...props}/>}
        </Modal>
    )
}

export default ButtonConfigurationModal