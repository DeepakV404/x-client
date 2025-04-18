import {  useState } from "react";
import { Button, Divider, Form, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import Dragger from "antd/es/upload/Dragger";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UploadedResourceCard from "./uploaded-resource-card";
import Loading from "../../../utils/loading";

const BlobResourceForm = (props: {onClose: () => void, onSubmit: (arg0: any) => void, maxCount: number, fileType?: any}) => {

    const { onClose, onSubmit, maxCount, fileType }  =   props;
    
    const [form]                =   useForm();

    const [fileList, setFileList]           =   useState<any>([]);
    const [submitState, setSubmitState]     =   useState({
        text: "Upload",
        loading: false
    });

    const handleChange = ({fileList}: any) => {
        setFileList(fileList)
    };

    const handleRemove = (fileId: string) => {
        setFileList((prevFileList: any) => prevFileList.filter((_file: any) => _file.uid !== fileId))
    }

    const onFinish = (formData: any) => {

        if(fileList.length > 0) {
            setSubmitState({
                loading :   true,
                text    :   "Uploading..."
            })
        }

        const resources = fileList.map((_file: any) => {
            return {
                uuid: _file.uid,
                title: _file.name, 
                imgSource: URL.createObjectURL(_file.originFileObj),
                originFileObj: _file.originFileObj,
                formData: formData[_file.uid]
            };
        });
        onSubmit(resources);
        onClose();
    }

    return (
        <div className='cm-height100'>
        <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
            <Space className='cm-width100 cm-flex-space-between'>
                <Space>
                    <MaterialSymbolsRounded font={'unarchive'} />
                    Upload File
                </Space>
                <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
            </Space>
        </div>
        <div className='j-add-res-form-body'>    
            <Form layout="vertical" form={form} onFinish={onFinish} className="cm-margin-top15 cm-padding15 j-resource-upload-form" >
                <Dragger beforeUpload={()=> {return false}} showUploadList={false} multiple={true} onChange={handleChange} maxCount={maxCount} fileList={fileList} accept={fileType}>
                    <Space direction="vertical">
                        <Button>Choose a File</Button>
                        <div className="cm-font-size12">Click or drag file to this area to upload. (Max {maxCount} files)</div>
                    </Space>
                </Dragger>
                <Divider className="cm-unset-divider cm-margin-top20" dashed />
                <Space direction="vertical" className="cm-margin-top20 cm-width100" size={15}>
                    {
                        fileList.map((_file: any) => (
                            <UploadedResourceCard _file={_file} handleRemove={handleRemove} fileType={fileType}/>
                        ))
                    }
                </Space>
            </Form>
        </div>
        <div className='j-add-res-form-footer'>
            <Space>
                <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                <Button type="primary" className="cm-flex-center" onClick={() => form.submit()} disabled={submitState.loading}>
                    <Space size={10}>
                        {submitState.text}
                        {submitState.loading && <Loading color="#fff" size='small' />}
                    </Space>
                </Button>
            </Space>
        </div>
    </div>
    )
}

export default BlobResourceForm