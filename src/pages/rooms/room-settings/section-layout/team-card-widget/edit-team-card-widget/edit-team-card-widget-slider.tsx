import { Drawer } from 'antd'
import EditTeamCardWidget from './edit-team-card-widget';

const EditTeamCardWidgetSlider = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

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
                editWidgetProps.visibility && <EditTeamCardWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditTeamCardWidgetSlider