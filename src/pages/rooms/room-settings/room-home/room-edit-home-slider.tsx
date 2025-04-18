import { Drawer } from 'antd';

import RoomEditHomeForm from './room-edit-home-form';

const RoomEditHomeSlider = (props: {isOpen: boolean; onClose: () => void, room: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {650}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            destroyOnClose
        >
            <RoomEditHomeForm {...props}/>
        </Drawer>
    )
}

export default RoomEditHomeSlider