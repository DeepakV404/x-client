import { Drawer } from 'antd'

import EditFeatureWidget from './edit-feature-widget';

const EditFeatureWidgetSlider = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

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
                editWidgetProps.visibility && <EditFeatureWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditFeatureWidgetSlider