import { Modal } from "antd"
import UpgradeAnalytics from ".";


const AnalyticsUpgradeModal = (props: {isOpen: any, onClose: any}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Modal 
            centered
            width           =   {800}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            destroyOnClose  =   {true}
            footer          =   {null}
            closable        =   {false}
            className       =   "cm-bs-custom-modal"
        >
            {isOpen && <UpgradeAnalytics/>}
        </Modal>
    )
}

export default AnalyticsUpgradeModal