import { Modal } from "antd";
// import ResourseForm from './content-modal';
import UploadOption from "./upload-option";

const OpenModal = (props: { isModalOpen: any; handleOk: any; handleCancel: any; }) => {

  const { isModalOpen, handleOk, handleCancel }  = props;
    return (
          <Modal 
            width    =  {700}
            open     =  {isModalOpen} 
            onOk     =  {handleOk} 
            onCancel =  {handleCancel} 
            footer   =  {null}
          >
              {/*<ResourseForm/>*/}
              <UploadOption/>
          </Modal>
    );
}

export default OpenModal;