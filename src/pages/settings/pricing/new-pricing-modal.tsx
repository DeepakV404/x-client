import { Modal } from "antd"
import NewPricing from "./new-pricing";

const NewPricingModal = (props: {isOpen: any, onClose: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <NewPricing {...props}/>}
        </Modal>
    )
}

export default NewPricingModal