import { Modal } from "antd";

import EditFolderForm from "./folder-edit-form";

const EditFolderModal = (props: {isOpen: boolean, onClose: () => void, currentFolder: any}) => {

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
            {isOpen && <EditFolderForm {...props}/>}
        </Modal>
    )
}

export default EditFolderModal