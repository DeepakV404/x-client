import { Drawer } from 'antd'
import EditContactCardWidget from './edit-contact-card-widget';

const EditContactCardWidgetSlider = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

    const { editWidgetProps, onClose }  =   props;
    
    return (
        <Drawer
            width       =   {700}
            onClose     =   {onClose}
            open        =   {editWidgetProps.visibility}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
        >
            {
                editWidgetProps.visibility && <EditContactCardWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditContactCardWidgetSlider