import { FC, useRef } from 'react';
import { Modal } from 'antd';

import BuyerResourceViewLayout from '.';

interface ResourceViewerModalProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    fileInfo        :   any;
    track?          :   any;
}

const BuyerResourceViewerModal: FC<ResourceViewerModalProps> = (props) => {

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
                    <BuyerResourceViewLayout {...props} resourceViewRef={resourceViewRef} shouldAutoPlay={true}/>
            }
        </Modal>
    )
}

export default BuyerResourceViewerModal