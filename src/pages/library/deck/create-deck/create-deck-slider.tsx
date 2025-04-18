import { Drawer } from 'antd';
import CreateDeckForm from './create-deck-form';

const CreateDeckSlider = (props: { onClose: any, isOpen: any, action: any, resources?: any}) => {

    const { onClose, isOpen }   =   props;

    return (
        <Drawer
            width           =   {600}
            onClose         =   {onClose}
            open            =   {isOpen}
            headerStyle     =   {{display:'none'}}
            className       =   'j-slider-padding0'
            destroyOnClose
        >
            <CreateDeckForm {...props}/>
        </Drawer>
    )
}

export default CreateDeckSlider