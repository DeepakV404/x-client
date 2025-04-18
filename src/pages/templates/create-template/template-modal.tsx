import { Modal } from "antd";

import TemplateForm from "./template-form";

const TemplateModal = (props: {isOpen: boolean, onClose: () => void, templates: any[] }) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'j-template-modal cm-full-screen-modal cm-bs-custom-modal'
        >
            {isOpen && <TemplateForm {...props}/>}
        </Modal>
    )
}

export default TemplateModal