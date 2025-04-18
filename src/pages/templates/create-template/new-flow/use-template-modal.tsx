import { Modal } from "antd";
import UseTemplateForm from "./use-template-form";

const UseTemplates = (props: {isOpen: boolean, onClose: () => void, accountId?: string, isTemplateSelected: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <UseTemplateForm {...props}/>}
        </Modal>
    )
}

export default UseTemplates