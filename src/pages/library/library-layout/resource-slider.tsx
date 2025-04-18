import { Drawer } from 'antd';

import ResourceType from './resource-type';

const ResourceSlider = (props: {isOpen: boolean; onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Drawer
            destroyOnClose
            className   =   'j-demo-creation-slider'
            width       =   {600}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
        >
            {isOpen && <ResourceType {...props}/>}
        </Drawer>
    )
}

export default ResourceSlider