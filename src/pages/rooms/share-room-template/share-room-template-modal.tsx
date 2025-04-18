import { Modal } from 'antd';

import ShareRoomTemplate from '.';

const ShareRoomTemplateModal = (props: {isOpen: boolean, onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal
            centered
            width       =   {750}
            open        =   {isOpen}
            onCancel    =   {onClose}
            footer      =   {null}
        >
            {isOpen && <ShareRoomTemplate/>}
        </Modal>
    )
}

export default ShareRoomTemplateModal