import { Drawer } from 'antd';

import DemoEditForm from './demo-edit-form';

const DemoEditSlider = (props: {isOpen: boolean; onClose: () => void, entityId: string, page: string, usecase: any}) => {

    const { isOpen, onClose, usecase }   =   props;

    return (
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {600}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
        >
            {isOpen && usecase ? <DemoEditForm {...props}/> : null}
        </Drawer>
    )
}

export default DemoEditSlider