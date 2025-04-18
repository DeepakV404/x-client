import { Drawer } from "antd";
import EditFileUploadWidget from "./edit-file-upload-widget";

const EditFileUploadWidgetSlider = (props: {editWidgetProps: any, onClose: any, sectionId: any, widget: any, module: any }) => {

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
                editWidgetProps?.visibility && <EditFileUploadWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditFileUploadWidgetSlider