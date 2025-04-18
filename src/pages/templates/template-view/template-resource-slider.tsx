import { Drawer } from "antd"

import TemplateStageAddResource from "./template-edit-resource";

const TemplateEditResourceSlider = (props: {isOpen: boolean; onClose: () => void, currentStage: string}) => {

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
            <TemplateStageAddResource {...props}/>
        </Drawer>
    )   
}

 export default TemplateEditResourceSlider