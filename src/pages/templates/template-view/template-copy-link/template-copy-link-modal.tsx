import { Modal } from 'antd'
import TemplateCopyLink from '.';

const TemplateCopyLinkModal = (props: {isOpen: boolean, onClose: () => void, sharableLink: string, isGated: boolean}) => {

    const { isOpen, onClose, sharableLink, isGated }   =   props;

    return (
        <Modal 
            centered
            width           =   {550}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            <TemplateCopyLink sharableLink={sharableLink} isGated={isGated}/>
        </Modal>
    )
}

export default TemplateCopyLinkModal