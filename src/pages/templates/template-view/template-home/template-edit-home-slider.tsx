import { Drawer } from 'antd';

import TemplateEditHomeForm from './template-edit-home-form';

const TemplateEditHomeSlider = (props: {isOpen: boolean; onClose: () => void, roomTemplate: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {650}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
        >
            <TemplateEditHomeForm {...props}/>
        </Drawer>
    )
}

export default TemplateEditHomeSlider