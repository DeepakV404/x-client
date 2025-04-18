import { Modal } from "antd";
import DeleteConfirmationApiHitting from "./delete-confirmation-api-hitting";

const DeleteConfirmationInput = (props: {isOpen: boolean, content: any, apiDetails?: any, onOk: any, onCancel: any, otherReqInfo?: any}) => {

    const { isOpen, onOk, onCancel}    =   props

    return (

        <Modal
            destroyOnClose
            className           =   "j-delete-confirmation-modal"
            width               =   {450}
            open                =   {isOpen}
            onCancel            =   {(event) => {event.stopPropagation(); onCancel()}}
            onOk                =   {(event) => {event.stopPropagation(); onOk()}}
            okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F"}}}
            cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC"}, ghost: true}}
            footer              =   {false}
        >
            {isOpen && <DeleteConfirmationApiHitting {...props}/>}
        </Modal>
    )
}

export default DeleteConfirmationInput