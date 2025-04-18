import { Drawer } from "antd";

import UploadProfileForm from "./upload-profile-form";

const UploadProfileSlider = (props: {profileFormProps: any, onClose: any, module: any}) => {

    const { profileFormProps, onClose }   =   props;
    
    return (
        <Drawer
            width       =   {700}
            onClose     =   {onClose}
            open        =   {profileFormProps.visibility}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
        >
            {
                profileFormProps.visibility && <UploadProfileForm {...props}/>
            }
        </Drawer>
    )
}

export default UploadProfileSlider