import { Modal } from 'antd'
import TemplateSettingsForm from './template-settings-form';


const TemplateSettingsModal = (props: {isOpen: boolean, onClose: () => void, roomTemplate: any}) => {

    const { isOpen, onClose}   =   props;

    return (
        <Modal 
            centered
            width           =   {550}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            <TemplateSettingsForm {...props}/>
        </Modal>
    )
}

export default TemplateSettingsModal