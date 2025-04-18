import { FC, useRef } from 'react';
import { Modal } from 'antd';

import SellerResourceViewLayout from '.';

interface ResourceViewerModalProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    fileInfo        :   any;
    track?          :   any;
}

const SellerResourceViewerModal: FC<ResourceViewerModalProps> = (props) => {

    const { isOpen }   =   props;

    const resourceViewRef: any  =   useRef();

    const handleClose = () => {
        resourceViewRef.current.closeViewer()
    }

    return (
        <Modal 
            centered
            className       =   {`j-buyer-resource-modal`}
            open            =   {isOpen} 
            onCancel        =   {handleClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            closable        =   {false}
        >
            {
                isOpen &&
                    <SellerResourceViewLayout {...props} resourceViewRef={resourceViewRef}/>
            }
        </Modal>
    )
}

export default SellerResourceViewerModal