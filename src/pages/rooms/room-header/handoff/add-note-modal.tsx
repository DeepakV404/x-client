import { Modal } from "antd";

import AddNoteForm from "./add-note-form";

const AddNoteModal = (props: {isOpen: boolean, onClose: () => void, blankNote: boolean}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {675}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
            destroyOnClose  =   {true}
        >
            {isOpen && <AddNoteForm {...props}/>}
        </Modal>
    )
}

export default AddNoteModal