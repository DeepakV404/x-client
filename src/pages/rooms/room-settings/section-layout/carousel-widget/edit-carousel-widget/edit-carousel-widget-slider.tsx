import { Drawer } from 'antd';

import EditCarouselWidget from './edit-carousel-widget';

const EditCarouselWidgetSlider = (props: {editWidgetProps: any, onClose: any, sectionId: any, widget: any, module: any }) => {

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
                editWidgetProps?.visibility && <EditCarouselWidget {...props}/>
            }
        </Drawer>
    )
}

export default EditCarouselWidgetSlider