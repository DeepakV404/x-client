import { FC } from 'react';
import { Drawer } from 'antd';

import UploadLayout from './add-resource-layout';

interface ResourceModalProps
{
    isOpen      :   boolean;
    onClose     :   () => void;
    type?       :   string;
    uploadKey?  :   string;
    displayName :   string
    domain      :   string
    imageIcon   :   string
}

const ResourceModal: FC<ResourceModalProps> = (props) => {

    const { isOpen, onClose }  = props;

    return (
        <Drawer 
            destroyOnClose
            className   =   'j-demo-creation-slider'
            width       =   {600}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            zIndex      =   {999}
        >
            <UploadLayout {...props}/>
        </Drawer>
    );
}

export default ResourceModal