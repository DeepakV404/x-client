import { FC } from 'react';
import { Modal } from 'antd';

import InviteStakeHolderForm from '.';

interface InviteProps
{
    isOpen  :   boolean;
    onClose :   () => void;
}

const InviteModal: FC<InviteProps> = (props) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
            centered
        >
            <InviteStakeHolderForm {...props}/>
        </Modal>
    )
}

export default InviteModal