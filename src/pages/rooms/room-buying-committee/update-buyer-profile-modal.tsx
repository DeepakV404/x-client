import { Modal } from "antd";
import UpdateBuyerProfile from "./update-buyer-profile";

const UpdateBuyerProfileModal = (props: {isOpen: any, onClose: any, buyer: any, onUpdateBuyer: any}) => {

    const { isOpen, onClose, onUpdateBuyer }   =   props;

    return (
        <Modal 
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {
                isOpen 
                && 
                    <UpdateBuyerProfile {...props} onUpdateBuyer={onUpdateBuyer} />
            }
        </Modal>
    )
}
export default UpdateBuyerProfileModal