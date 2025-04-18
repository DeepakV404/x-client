import { Drawer } from "antd";
import EditResourceWidget from "./edit-resource-widget";

const EditResourceWidgetSlider = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any }) => {

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
                editWidgetProps?.visibility && <EditResourceWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditResourceWidgetSlider