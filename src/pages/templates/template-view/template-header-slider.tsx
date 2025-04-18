import { Drawer } from "antd"

import TemplateEditHeader from "./template-edit-header";

const TemplateStageSlider = (props: {isOpen: boolean; onClose: () => void, stage: any, currentStage: string}) => {

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
            <TemplateEditHeader {...props}/>
        </Drawer>
    )   
}

 export default TemplateStageSlider