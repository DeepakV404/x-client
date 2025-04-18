import { Modal } from 'antd';

import RoomResourceViewerLayout from '.';

const RoomResourceViewerModal = (props: {inProduct? :boolean, isOpen: boolean, onClose: () => void, roomId: any, resourceId: any}) => {

    const { isOpen, onClose, inProduct=true }    =   props;

    return (
        <Modal 
            centered
            className       =   {`j-${inProduct ? "room-" : "sfdc-room-"}resource-metric-modal`}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
        >
            {isOpen && <RoomResourceViewerLayout {...props}/>}
        </Modal>
    )
}

export default RoomResourceViewerModal