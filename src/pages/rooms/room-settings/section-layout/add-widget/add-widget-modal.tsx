import { Modal } from "antd";

import WidgetCard from "./widget-cards";

const AddWidgetModal = (props: {isOpen: boolean, onClose: () => void, sectionId: any, currentOrder: number, setNewWidgetId?: any}) => {

    const { isOpen, onClose }    =   props;

    return (
        <Modal 
            centered
            open            =   {isOpen} 
            onCancel        =   {onClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
        >
            {isOpen && <WidgetCard {...props}/>}
        </Modal>
    )
}

export default AddWidgetModal