import { Modal } from 'antd';

import ShareRoom from '.';

const ShareRoomModal = (props: {isOpen: boolean, onClose: () => void, inviteType: string, roomData: any}) => {

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
            <ShareRoom {...props}/>              
        </Modal>
    )
}

export default ShareRoomModal