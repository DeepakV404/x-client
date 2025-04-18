import { Drawer } from "antd";
import EditHeaderWidget from "./edit-header-widget";


const EditHeaderWidgetSlider = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

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
                editWidgetProps?.visibility && <EditHeaderWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditHeaderWidgetSlider