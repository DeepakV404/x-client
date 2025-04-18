import { Modal } from "antd";

import MoveResourceForm from "./move-resource-form";

const MoveResourceModal = (props: {isOpen: boolean, onClose: () => void, resourceId: string[], handleResetAllSelectedRes: () => void}) => {

    const { isOpen, onClose } = props

    return (
        <Modal 
            centered
            width           =   {450}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <MoveResourceForm {...props}/>}
        </Modal>
    )
}

export default MoveResourceModal