import { Modal } from "antd";

import TemplateDeleteConfirmation from "./template-delete-confirmation";

const TemplateDeleteModal = (props: {isOpen: boolean, onCancel: () => void, template: any, navigateToListing? : boolean}) => {

    const { isOpen, onCancel }    =   props;

    return(
        <Modal
            destroyOnClose
            className           =   'cm-bs-custom-modal'
            onCancel            =   {() => {onCancel()}}
            width               =   {450}
            open                =   {isOpen}
            footer              =   {null}
        >
            { isOpen && <TemplateDeleteConfirmation {...props}/>}
        </Modal>
    )
}

export default TemplateDeleteModal