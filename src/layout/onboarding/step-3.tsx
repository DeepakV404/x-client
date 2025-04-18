import { useState } from 'react';
import { Button, Form, Input, Space, Upload } from 'antd';

import { ACCEPTED_FILE_TYPES, CHUNK_SIZE} from '../../constants/module-constants';
import { REQUEST_BLOB_URLS } from '../../pages/library/api/library-query';
import { OnboardingAgent } from './api/onboarding-agent';
import { useLazyQuery } from '@apollo/client';
import { ERROR_CONFIG } from '../../config/error-config';
import { CommonUtil } from '../../utils/common-util';

import LinkPageCard from './link-page-card';
import LinkLoading from './link-loading';

const { useForm }   =   Form;

interface ComponentProps{
    onNext      :   () => void;
    onPrevious  :   () => void;
    setLinkData :   (linkData: {uuid: string, title: string, copyLink: string}) => void;
    fileList    :   any;
    setFileList :   (fileList: any) => void;
    sampleFileUpload : any;
    setSampleFileUpload : (sampleFileUpload: any) => void;
}

const OnboardingStep3 = (props: ComponentProps) => {

    const { onNext, onPrevious, setLinkData, setFileList, fileList, sampleFileUpload, setSampleFileUpload }    =   props;
    
    const [ form ]     =   useForm();
    
    const [loading, setLoading]         =   useState<boolean>(false);

    const handleChange = ({fileList}: any) => {
        setFileList(fileList)
        setSampleFileUpload([])
    };

    const SampleFile = {
        name: 'Collateral Management.pdf',
        originFileObj: {
            type: 'application/pdf',
        },
    };

    const handleSampleFileUpload = () => {
        setSampleFileUpload([SampleFile])
        setFileList([])
    }

    const [_getBlobUrls]            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

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
        const numberOfParts     =   Math.ceil(file.size / CHUNK_SIZE);
        const response          =   await requestBlobURLs(numberOfParts, file.type)
        return {urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId}
    }

    const onFinish =  async () => {   
        
        setLoading(true)

        if(sampleFileUpload.length > 0){
            OnboardingAgent.createDeck({
                variables: {
                    input: {
                        title                   :   form.getFieldValue("name"),
                        type                    :   "PUBLIC",
                        includeSampleReport     :   true,
                        includeSampleResource   :   true,
                        settings                :   {
                            allowDownloads  : true
                        }
                    }
                },
                onCompletion: (data: any) => {
                    setLinkData({uuid: data.createDeck.uuid, copyLink: data.createDeck.copyLink, title: data.createDeck.title})
                    setLoading(false)
                    onNext()
                },
                errorCallBack: (error: any) => {
                    setLoading(false)
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            }) 
        }else{
            let requestedBlobs: any[] = [];
            if (fileList.length > 0) {    
                for (const _file of fileList) {
                    const currentFile = _file.originFileObj
                    if (currentFile) {
                        const { urls, contentId, uploadId } = await getPresignedUrls(currentFile);
                        try {
                            CommonUtil.__uploadToS3(
                                currentFile,
                                urls,
                                contentId,
                                uploadId,
                                () => {
                                    requestedBlobs.push({
                                        blobInput   :   {
                                            contentUuid :   contentId,
                                            contentType :   _file.type,
                                            fileName    :   _file.name
                                        }
                                    })

                                    if(requestedBlobs.length === fileList.length){
                                        OnboardingAgent.createDeck({
                                            variables: {
                                                input: {
                                                    title           :   form.getFieldValue("name"),
                                                    type            :   "PUBLIC",
                                                    resourceInputs  :   requestedBlobs,
                                                    settings        :   {
                                                        allowDownloads  : true
                                                    }
                                                }
                                            },
                                            onCompletion: (data: any) => {
                                                setLinkData({uuid: data.createDeck.uuid, copyLink: data.createDeck.copyLink, title: data.createDeck.title})
                                                setLoading(false)
                                                onNext()
                                            },
                                            errorCallBack: (error: any) => {
                                                setLoading(false)
                                                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                            }
                                        }) 
                                    }
                                },
                            );
                        } catch  {
                            setLoading(false)
                            CommonUtil.__showError("Something went wrong!")
                        }
                    }
                }
            }
        }
    };

    const handleNext = () => {
        form.submit();
    }

    const handlePrevious = () => {
        onPrevious()
    }

    return (
        <div className="cm-flex cm-width100" style={{height: "calc(100% - 61px)"}}>
            {
                loading ? 
                    <div className='cm-height100 cm-flex-center j-onboarding-loading-wrapper'>
                        <Space direction='vertical' className='cm-flex' style={{width: "400px"}} size={20}>
                            <div className='cm-font-size18 cm-font-fam500 cm-text-align-center'>Uploading Your Files</div>
                            <LinkLoading/>
                            <div className='cm-font-opacity-black-65 cm-text-align-center'>This may take few seconds...</div>
                        </Space>
                    </div>
                :
                    <div className="j-onboarding-step-1-left-bg">
                        <Space direction="vertical" className="cm-height100 cm-flex-center">
                            <Space direction="vertical" style={{width: "400px"}}>
                                <div className="cm-font-fam600 j-onboarding-step-title" >It all starts with "Links"</div>
                                <div className='cm-font-size14 cm-font-opacity-black-65 cm-font-fam500' style={{lineHeight: "23px"}}>Share your assets via a link and track their engagement.</div>
                                <Form form={form} layout="vertical" className="j-onboarding-form" onFinish={onFinish}>   
                                    <Form.Item label="Name your Link" name="name" className='cm-width100 cm-margin-top20' rules={[{required: true, message: "Name for your Link is required", whitespace: true}]}>
                                        <Input autoFocus placeholder="e.g., Marketing Collaterals" size="large"/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Upload 
                                            name                    =   "avatar"
                                            listType                =   "picture-card"
                                            showUploadList          =   {false}
                                            onChange                =   {handleChange}
                                            accept                  =   {ACCEPTED_FILE_TYPES}
                                            className               =   "j-onboarding-upload cm-margin-top15 cm-margin-bottom0"
                                            multiple                =   {true}
                                            maxCount                =   {5}
                                            fileList                =   {fileList} 
                                        >
                                            <div className='cm-width100'>
                                                {
                                                    fileList?.length > 0 ?
                                                        `${fileList?.length + sampleFileUpload?.length} file(s) selected`
                                                    : 
                                                            sampleFileUpload?.length > 0 ?
                                                            `${sampleFileUpload?.length} file(s) selected`
                                                        :
                                                            "Upload Files"
                                                }
                                            </div>    
                                        </Upload>
                                    </Form.Item>
                                </Form>
                                <div className='cm-flex-center cm-secondary-text cm-font-size12' style={{marginTop: "-15px"}}>use our <a style={{paddingLeft: "3px"}} onClick={handleSampleFileUpload}>sample document</a></div>
                            </Space>
                        </Space>
                        <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                            <div className="cm-secondary-text" style={{paddingLeft: "60px"}}>3 of 4</div>
                            <Space style={{paddingRight: "60px"}} size={10}>
                                <Button size="large" onClick={handlePrevious}>Previous</Button>
                                <Button size="large" disabled={!(fileList.length > 0 || sampleFileUpload.length > 0)} type="primary" onClick={handleNext} className={!(fileList.length > 0 || sampleFileUpload.length > 0) ? "cm-button-disabled cm-cursor-disabled" : ""}>Next</Button>
                            </Space>
                        </div>
                    </div>
            }
            <div className="j-onboarding-step-1-right-bg">
                <div className="j-onboarding-step-3-element-1 anim"></div>
                <div className="j-onboarding-step-3-element-2 anim"></div>
                <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                    <LinkPageCard stepClass={"step3"} uploadedFiles={fileList} sampleFile={sampleFileUpload}/>
                </div>
            </div>
        </div>
    )
}

export default OnboardingStep3