import { Drawer } from "antd"

import RoomStageAddResource from "./room-edit-resource";

const EditResourceSlider = (props: {isOpen: boolean; onClose: () => void}) => {

    const {isOpen, onClose} = props;

    return(
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {650}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            destroyOnClose
        >
            <RoomStageAddResource {...props}/>
        </Drawer>
    )   
}

 export default EditResourceSlider