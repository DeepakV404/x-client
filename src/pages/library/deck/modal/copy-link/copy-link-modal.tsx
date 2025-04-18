import { Modal } from 'antd';
import DeckCopyLinkForm from './deck-copy-link-crm';

interface DeckLinkModalProps {
    isInProduct :   boolean
    isOpen      :   boolean;
    onClose     :   () => void;
    link        :   string;
}

const CopyLinkModal = (props: DeckLinkModalProps) => {

    const { isOpen, onClose } = props;

    return (
        <Modal
            width           =   {550}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <DeckCopyLinkForm {...props}/>}
        </Modal>
    )
}

export default CopyLinkModal