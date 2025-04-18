import { Modal } from 'antd';

import SelectContact from './select-contact';

const AddContactModal = (props: {isOpen: boolean, onClose: () => void, contacts: any, availableContacts: any, roomId: string}) => {

    const { isOpen, onClose, contacts, availableContacts, roomId }   =   props;

    return (
        <Modal 
            centered  
            width           =   {400}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {isOpen && <SelectContact contacts={contacts} contactsInRoom={availableContacts} roomId={roomId}/>}
        </Modal>
    )
}

export default AddContactModal