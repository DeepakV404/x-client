import { Modal } from "antd"
import UserModal from "./user-role"

const UserRoleModal = (props: {user: any, isOpen: boolean, onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            className="j-user-role-modal"
            centered
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose
        >
            <UserModal {...props}/>
        </Modal>
    )
}

export default UserRoleModal