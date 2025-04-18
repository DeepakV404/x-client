import { Modal } from 'antd';

import CreateRoomForm from './create-room-form';

const CreateRoomModal = (props: {isOpen: boolean; onClose: () => void;}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered  
            className       =   'cm-bs-custom-modal j-sfdc-create-room-modal'
            width           =   {500}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
        >
            {isOpen && <CreateRoomForm {...props}/>}
        </Modal>
    )
}

export default CreateRoomModal