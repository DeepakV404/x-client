import { Modal } from "antd"
import ResourceCopyLinkForm from "./resource-copy-link-form"

const ResourceLinkCopyModal = (props: {isOpen: boolean, onClose: any, link: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            className       =   'cm-bs-custom-modal'
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose
        >
            {isOpen && <ResourceCopyLinkForm {...props}/>}
        </Modal>
    )
}

export default ResourceLinkCopyModal