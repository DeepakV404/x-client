import { Modal } from 'antd';

import ManageRoomSellers from '.';

const ManageSellerModal = (props: {isOpen: boolean, onClose: () => void, sellers: any, owner: any, previewLink: string, room: any}) => {

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
            {isOpen && <ManageRoomSellers {...props}/>}
        </Modal>
    )
}

export default ManageSellerModal