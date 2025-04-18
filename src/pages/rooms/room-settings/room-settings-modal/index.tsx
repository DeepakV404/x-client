import { Modal } from 'antd';

import RoomSettings from './room-settings';

export interface DefaultModalProps{
    isOpen  :   boolean,
    onClose :   () => void
}

export interface RoomSettingsProps extends DefaultModalProps {
    roomId  :   string,
    roomSettings: {
        protection              :   boolean,
        messages                :   boolean,
        emailNotifications      :   boolean,
        inProductNotifications  :   boolean
        actionPointComments     :   boolean,
        discovery               :   boolean,
        language                :   "en" | "fr" | "de" | "es"
    }
}

const RoomSettingsModal = (props: RoomSettingsProps) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {520}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <RoomSettings {...props}/>}
        </Modal>
    )
}

export default RoomSettingsModal