import { Modal } from "antd"
import DeckCopyLinkForm from "../deck-copy-link-form"

const DeckCopyLink = (props: {isInProduct: boolean, isOpen: boolean, baseLink: string, onClose: () => void}) => {

    const { isOpen, onClose }  =   props

    return (
        <Modal 
            centered
            className       =   'cm-bs-custom-modal'
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose
        >
            <DeckCopyLinkForm {...props}/>
        </Modal>
    )
}

export default DeckCopyLink