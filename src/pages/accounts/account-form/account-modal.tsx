import { Modal } from 'antd';

import AccountForm from '.';

const AccountModal = (props: {isOpen: boolean, onClose: () => void, getCreatedAccount? : any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered  
            width           =   {650}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            {isOpen && <AccountForm {...props}/>}
        </Modal>
    )
}

export default AccountModal