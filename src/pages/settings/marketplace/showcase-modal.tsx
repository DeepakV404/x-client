import { Modal } from 'antd';

import AddTargetAudience from './add-target-audience';

const ShowcaseModal = (props: {isOpen: boolean, onClose: () => void, template: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
            centered
        >
           {isOpen && <AddTargetAudience {...props}/>}
        </Modal>
    )
}

export default ShowcaseModal