import { Drawer } from 'antd';

import DemoCreationForm from './demo-creation-form';

const DemoSlider = (props: {isOpen: boolean; onClose: () => void, entityId: string, page: string, onCreate?: (createdUsecase: any) => void}) => {

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
            <DemoCreationForm {...props}/>
        </Drawer>
    )
}

export default DemoSlider