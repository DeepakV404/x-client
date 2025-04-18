import { Modal } from "antd";

import ResourceDeleteConfirmation from "./resource-delete-confirmation";


const ResourceDeleteModal = (props: {isOpen: boolean, onCancel: () => void, resource: any, folder?: boolean}) => {

    const { isOpen, onCancel }    =   props;

    return(
        <Modal
            destroyOnClose
            className           =   'cm-bs-custom-modal'
            onCancel            =   {() => onCancel()}
            width               =   {450}
            open                =   {isOpen}
            footer              =   {null}
        >
            {isOpen && <ResourceDeleteConfirmation {...props}/>}
        </Modal>
    )
}

export default ResourceDeleteModal