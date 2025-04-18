import { Modal } from 'antd';

import AddVendorForm from './add-vendor-form';

const AddVendorModal = (props: {isOpen: boolean, onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal
            centered
            width           =   {550}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {isOpen && <AddVendorForm {...props}/>}
        </Modal>
    )
}

export default AddVendorModal