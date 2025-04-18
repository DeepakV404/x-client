import { Modal } from 'antd';

import SectionAccessManager from '.';

const SectionAccessManagerModal = (props: {isOpen: boolean, onClose: () => void, entityData: any, sectionData: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal
            centered
            width           =   {550}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {isOpen && <SectionAccessManager {...props}/>}
        </Modal>
    )
}

export default SectionAccessManagerModal