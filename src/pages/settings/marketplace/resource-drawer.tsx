import { Drawer } from 'antd';

import LinkResourceForm from './link-resource-form';
import BlobResourceForm from './blob-resource-form';

const ResourceDrawer = (props: {isOpen: boolean, onClose: () => void, uploadType: any, onSubmit: (arg0: any) => void, maxCount: number, fileType?: any}) => {

    const { isOpen, onClose, uploadType }  = props;

    return (
        <Drawer 
            destroyOnClose
            className   =   'j-demo-creation-slider'
            width       =   {600}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
        >
            {uploadType === "link" ? 
                <LinkResourceForm {...props}/>
            : 
                <BlobResourceForm {...props} /> 
            }
        </Drawer>
    );
}

export default ResourceDrawer