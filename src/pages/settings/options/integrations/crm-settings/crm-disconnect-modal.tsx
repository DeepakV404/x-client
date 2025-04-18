
import { Modal } from "antd";
import CRMDisconnectContent from "./crm-disconnect-content";

const CRMDisconnectModal = (props: {isOpen: boolean, onOk: () => void, onCancel: () => void, header?: string, body? : string, okText?: string}) => {

    const { isOpen, onOk, onCancel, okText="Disconnect" }    =   props;

    return(
        <Modal
            destroyOnClose
            className           =   'cm-bs-custom-modal'
            width               =   {450}
            open                =   {isOpen}
            footer              =   {null}
            onCancel            =   {(event) => {event.stopPropagation(); onCancel()}}
            onOk                =   {(event) => {event.stopPropagation(); onOk()}}
            okText              =   {okText}
            okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F"}}}
            cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC"}, ghost: true}}
        >
            { isOpen && <CRMDisconnectContent {...props}/>}
        </Modal>
    )
}

export default CRMDisconnectModal