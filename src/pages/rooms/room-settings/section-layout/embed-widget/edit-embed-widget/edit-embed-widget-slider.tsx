import { Drawer } from "antd"
import EditEmbedWidget from "./edit-embed-widget";

const EditEmbedWidgetSlider = (props: {editWidgetProps: any, onClose: any, sectionId: any, widget: any, module: any }) => {

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
                editWidgetProps?.visibility && <EditEmbedWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditEmbedWidgetSlider