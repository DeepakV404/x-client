import { Drawer } from "antd";

import EditTextWidget from "./edit-text-widget";

const EditTextWidgetSlider = (props: {editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any}) => {

    const { editWidgetProps, onClose }   =   props;
    
    return (
        <Drawer
            width       =   {700}
            onClose     =   {onClose}
            open        =   {editWidgetProps?.visibility}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
        >
            {
                editWidgetProps?.visibility && <EditTextWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditTextWidgetSlider