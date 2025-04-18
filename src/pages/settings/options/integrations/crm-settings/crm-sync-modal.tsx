import { Modal } from 'antd';

import CRMSyncOptions from './crm-sync-options';


const CRMSyncModal = (props: { isOpen: boolean, onClose: () => void, crmType: string, settings: any}) => {

    const {isOpen, onClose} = props;
   
    return (
        <Modal  
			centered
            destroyOnClose
			open        = 	{isOpen}  
			footer 	    = 	{null}
			onCancel    =   {onClose}
        >
            <CRMSyncOptions {...props}/>
        </Modal>
    )
}

export default CRMSyncModal