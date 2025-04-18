import { Modal } from 'antd';

import ResourceViewerLayout from '.';

const ResourceViewerModal = (props: {inProduct? : boolean, resourceId: string, isOpen: boolean, onClose: () => void, fileInfo: any}) => {

    const { isOpen, onClose, inProduct=true }   =   props;

    return (
        <Modal 
            centered
            className       =   {`j-${inProduct ? "" : "sfdc-"}resource-metric-modal`}
            open            =   {isOpen}  
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
        >
            { isOpen && <ResourceViewerLayout {...props}/> }
        </Modal>
    )
}

export default ResourceViewerModal