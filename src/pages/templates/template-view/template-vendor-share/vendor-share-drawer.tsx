import { Drawer } from "antd"
import VendorShareForm from "./vendor-share-form";

const VendorShareDrawer = (props: {isOpen: boolean; onClose: () => void, sharableLink: string, isGated: boolean, templateId: any}) => {

    const {isOpen, onClose} = props;

    return(
        <Drawer
            className   =   'j-demo-creation-slider'
            width       =   {650}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            destroyOnClose
        >
            { isOpen && <VendorShareForm {...props}/>}
        </Drawer>
    )   
}

 export default VendorShareDrawer