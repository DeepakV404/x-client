import { Modal } from 'antd';
import Pricing from '.';

const PricingModal = (props: {isOpen: boolean, onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            className       =   "j-library-modal cm-full-screen-modal"
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose
        >
            <Pricing/>
        </Modal>
    )
}

export default PricingModal