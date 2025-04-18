import { Drawer } from "antd"
import EditActionItem from "./edit-action-item";


const ActionItemSlider = (props: {isOpen: boolean; onClose: () => void, stage: any}) => {

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
            <EditActionItem {...props}/>
        </Drawer>
    )   
}

 export default ActionItemSlider