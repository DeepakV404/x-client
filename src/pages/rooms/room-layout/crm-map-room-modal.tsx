import { Modal } from 'antd';

import CRMMapDeal from './crm-map-deal-form';

const CRMMapRoomModal = (props: {isOpen: boolean, onClose: () => void}) => {
    
    const { isOpen, onClose }   =   props;

    return (
        <Modal  
			centered
            destroyOnClose
            className   =   'cm-bs-custom-modal'
			open        = 	{isOpen}  
			footer 	    = 	{null}
			onCancel    =   {onClose}
        >
            <CRMMapDeal {...props}/>
        </Modal>
    )
}

export default CRMMapRoomModal