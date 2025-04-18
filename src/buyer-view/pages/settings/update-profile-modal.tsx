import { FC } from "react";
import { Modal } from "antd";
import UpdateProfileForm from ".";

interface UpdateProfileProps
{
    isOpen  :   boolean;
    onClose :   () => void;
}
const UpdateProfileModal: FC <UpdateProfileProps> = (props) => {

    const { isOpen, onClose }   =   props;

    return(
        <Modal 
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {
                isOpen && 
                    <UpdateProfileForm {...props}/>
            }
        </Modal>
    )
}

export default UpdateProfileModal