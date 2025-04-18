import { Modal } from "antd";
import { FC } from "react"
import EditForm from "./edit-form";
import UserForm from "./user-form";

interface UserModalProps
{
    isOpen  : boolean;
    onClose : () => void;
    isEdit  :   boolean;
}

const UserModal: FC<UserModalProps> = (props) => {

    const { isOpen, onClose, isEdit }  = props;

    return(
        <Modal
            width           =   {500}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
            centered
        >
            {
                isEdit
                ?
                    <EditForm {...props}/>
                :
                    <UserForm {...props}/>
            }
        </Modal>
    )
}

export default UserModal