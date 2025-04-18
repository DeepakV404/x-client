import { FC, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Button, Divider, Form, Space, Typography } from "antd";
import { useForm } from "antd/es/form/Form";

import { ACCEPTED_FILE_TYPES, CHUNK_SIZE } from "../../../constants/module-constants";
import { ADD_RESOURCE_CONFIG } from "../config/add-resource-config";
import { LIBRARY_RESOURCE_ADDED } from "../../../tracker-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { REQUEST_BLOB_URLS } from "../api/library-query";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Dragger from "antd/es/upload/Dragger";
import Loading from "../../../utils/loading";
import UploadedFile from "./uploaded-file";

const { Text } = Typography
interface BlobResourceFormProps
{
    setView     :   (arg0: string) => void;
    onClose     :   () => void;
    type?       :   string;
    uploadKey?  :   string;
    goBack?     :   any
}

const BlobResourceForm: FC<BlobResourceFormProps> = (props) => {

    const { onClose, uploadKey, goBack }    =   props;

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const { folderId }  =   useParams();

    const [_getBlobUrls]            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});
    const [form]                    =   useForm();

    const acceptedFileTypes         =   (uploadKey && ADD_RESOURCE_CONFIG[uploadKey].acceptedFiles) ? ADD_RESOURCE_CONFIG[uploadKey].acceptedFiles : ACCEPTED_FILE_TYPES;
    
    const [fileList, setFileList]           =   useState<any>([]);
    const [submitState]     =   useState({
        text: "Upload",
        loading: false
    });

    const handleChange = ({fileList}: any) => {
        setFileList(fileList)
    };

    const handleRemove = (fileId: string) => {
        setFileList((prevFileList: any) => prevFileList.filter((_file: any) => _file.uid !== fileId))
    }
    
    const requestBlobURLs: any = async (parts: number, file: string) => {
        
        const urls = await _getBlobUrls({
            variables: {
                numberOfParts: parts,
                contentType: file
            }
        })
        
        return urls.data.requestBlobUrls
    }
    
    const getPresignedUrls = async (file: any) => {
        const numberOfParts = Math.ceil(file.size / CHUNK_SIZE);
        const response =  await requestBlobURLs(numberOfParts, file.type)
        return {urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId}
    }
    
    const getMKVFileType = (type: any) => {
        if(type === "mkv"){
            return `video/x-matroska`
        }else return type
    }

    const onFinish = async (formData: any) => {  
        console.log(fileList)      
        if (fileList.length > 0) {
            onClose();
    
            const updatedFileListForMultipleUpload = fileList.map((item: any) => ({
                ...item,
                status: 'uploading',
                name: formData[item.uid]?.title || item.name,
            }));
    
            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => [
                ...(prevFileListForMultipleUpload || []),
                ...updatedFileListForMultipleUpload,
            ]);
    
            for (const _fileId of Object.keys(formData)) {
                const currentFile = fileList.find((_file: any) => _file.uid === _fileId)?.originFileObj;
    
                if (currentFile) {
                    const { urls, contentId, uploadId } = await getPresignedUrls(currentFile);
                    try {
                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => prevFileListForMultipleUpload.map((item: any) => item.uid === currentFile.uid ? { ...item, contentId } : item));
    
                        CommonUtil.__uploadToS3(
                            currentFile,
                            urls,
                            contentId,
                            uploadId,
                            () => {
                                LibraryAgent.createResource({
                                    variables: {
                                        title: formData[_fileId].title,
                                        categories: formData[_fileId].categories,
                                        thumbnail: formData[_fileId].thumbnail.file ?? null,
                                        folderUuid: folderId === "home" ? undefined : folderId,
                                        input: {
                                            contentUuid: contentId,
                                            contentType: (currentFile.type && currentFile.type !== "") ? currentFile.type : getMKVFileType(currentFile.name.split('.').pop()),
                                            fileName: currentFile.name,
                                        },
                                    },
                                    onCompletion: () => {
                                        AppTracker.trackEvent(LIBRARY_RESOURCE_ADDED, {});
                                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => prevFileListForMultipleUpload.map((item: any) => item.contentId === contentId ? { ...item, status: 'completed' } : item));
                                    },
                                    errorCallBack: (error: any) => {
                                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                    },
                                });
                            },
                        );
                    } catch  {}
                }
            }
        }
    };
    
    return (
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-align-center' size={15}>
                    <MaterialSymbolsRounded font={"arrow_back"} size="20" className="cm-cursor-pointer" weight="400" onClick={() => goBack() && goBack()}/>
                    <Space className="cm-flex">
                        <MaterialSymbolsRounded font={'unarchive'} />
                        Upload File
                    </Space>
                </Space>
            </div>
            <div className='j-add-res-form-body'>    
                <Form layout="vertical" form={form} onFinish={onFinish} className="cm-margin-top15 cm-padding15 j-resource-upload-form" >
                    <Dragger beforeUpload={()=> {return false}} showUploadList={false} multiple={true} onChange={handleChange} maxCount={5} accept={acceptedFileTypes} fileList={fileList}>
                        <Space direction="vertical">
                            <Button>Choose a File</Button>
                            <div className="cm-font-size12">Click or drag file to this area to upload. (Max 5 files)</div>
                        </Space>
                    </Dragger>
                    <Divider className="cm-unset-divider cm-margin-top20" dashed />
                    <div className="cm-margin-block10">
                        {fileList.length > 0 && <Text className='cm-font-fam500 cm-font-size16'>Uploaded Files <span>({fileList.length})</span></Text> }
                    </div>
                    <Space direction="vertical" className="cm-width100" size={15}>
                        {
                            fileList.map((_file: any) => (
                                <UploadedFile key={_file.uid} _file={_file} onRemove={(fileId) => handleRemove(fileId)} />
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