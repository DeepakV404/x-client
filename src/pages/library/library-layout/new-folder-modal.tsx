import { Modal } from "antd";

import NewFolderForm from "./new-folder-form";

const NewFolderModal = (props: {isOpen: boolean, onClose: () => void, parentFolderId?: string}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {500}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <NewFolderForm {...props}/>}
        </Modal>
    )
}

export default NewFolderModal