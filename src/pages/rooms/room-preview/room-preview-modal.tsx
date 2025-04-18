import { Modal, Space } from 'antd';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const RoomPreviewModal = (props: {isOpen: boolean, onClose: () => void, children: any, room: any}) => {

    const { isOpen, onClose, children, room }   =   props;

    return (
        <Modal 
            centered
            destroyOnClose
            className       =   "j-room-preview-modal cm-full-screen-modal"
            open            =   {isOpen} 
            footer          =   {null}
            closable        =   {false}
        >
            <div className='cm-height100'>
                <div className='j-room-preview-header cm-flex-space-between'>
                    <Space>
                        <MaterialSymbolsRounded font='wysiwyg' size='22'/> 
                        <div className='cm-font-fam500'>{room.title} - Preview</div>
                    </Space>
                    <Space className='cm-cursor-pointer' onClick={() => onClose()}>
                        <MaterialSymbolsRounded font='exit_to_app' size='22'/> 
                        <div className='cm-font-fam500'>Exit Preview</div>
                    </Space>
                </div>
                {children}
            </div>
        </Modal>
    )
}

export default RoomPreviewModal