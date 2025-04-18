import { Modal } from 'antd';

import CRMAddContactForm from './crm-add-contact-form';

const CRMAddContactModal = (props: { isOpen: boolean, onClose: () => void, room: any}) => {

    const { isOpen, onClose } = props;
   
    return (
        <Modal  
			centered
            destroyOnClose
            className   =   'cm-bs-custom-modal'
			open        = 	{isOpen}  
			footer 	    = 	{null}
			onCancel    =   {onClose}
        >
            <CRMAddContactForm {...props}/>
        </Modal>
    )
}

export default CRMAddContactModal