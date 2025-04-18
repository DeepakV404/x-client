import { Drawer } from 'antd';
import EditDeckForm from './edit-deck-form';

const EditDeckSlider = (props: { onClose: any, isOpen: any, editDeck: any}) => {

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
            <EditDeckForm {...props}/>
        </Drawer>
    )
}

export default EditDeckSlider