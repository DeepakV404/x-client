import { Drawer } from "antd"

import EditButtonWidget from "./edit-button-widget";

const EditButtonWidgetSlider = (props: {editWidgetProps: any, onClose: any, sectionId: any, widget: any, module: any }) => {

    const { editWidgetProps, onClose }  =   props;
    
    return (
        <Drawer
            width       =   {700}
            onClose     =   {onClose}
            open        =   {editWidgetProps?.visibility}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
        >
            {
                editWidgetProps?.visibility && <EditButtonWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditButtonWidgetSlider