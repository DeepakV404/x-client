import { Drawer } from "antd";

import AddResourceToComponent from "./add-resource-to-component";

const AddResourceToComponentSlider = (props: {isDrawerOpen: boolean, widget: any, setIsDrawerOpen: any, carousel?: boolean, template?: boolean, addResource? : boolean, sectionId? : any, component: any }) => {

    const { isDrawerOpen, setIsDrawerOpen }   =   props;
    
    return (
        <Drawer
            width       =   {700}
            onClose     =   {() => setIsDrawerOpen(false)}
            open        =   {isDrawerOpen}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
            destroyOnClose
        >
                {isDrawerOpen && <AddResourceToComponent {...props}/>}
        </Drawer>
    )
}

export default AddResourceToComponentSlider