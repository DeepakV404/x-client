import { Card, Space } from "antd";
import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import React from "react";

const UploadCard = () =>{
    return(
        <Card>
            <Space direction="vertical" className="j-upload-category">
                <MaterialSymbolsRounded font={'upload_file'} size={'20'}/>  
                <div className="cm-font-size12 cm-font-fam500">File Upload</div>  
            </Space>
        </Card>
    );
}


const UploadOption: React.FC = () => (
   
        <div className="j-modal-upload-options">
           <div className="j-modal-upload-title">
                <h3 className='cm-font-fam600'>Choose a format</h3>
            </div>
            <div className="j-modal-upload-card">
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
                <UploadCard/>
            </div>
        </div>
    );

export default UploadOption;