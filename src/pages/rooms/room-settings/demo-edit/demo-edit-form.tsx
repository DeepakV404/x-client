import { useContext, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Button, Divider, Form, Input, Select, Space } from 'antd';

import { CHUNK_SIZE, Length_Input } from '../../../../constants/module-constants';
import { ALL_USECASE_CATEGORIES, RT_USECASE } from '../../../templates/api/room-templates-query';
import { RoomTemplateAgent } from '../../../templates/api/room-template-agent';
import { REQUEST_BLOB_URLS } from '../../../library/api/library-query';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { RoomsAgent } from '../../api/rooms-agent';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import DemoEditResourceForm from './demo-edit-resource-form';
import Loading from '../../../../utils/loading';
import { R_USECASE } from '../../api/rooms-query';

const { useForm }   =   Form;
const { TextArea }  =   Input;
const { Option }    =   Select

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice"

const DemoEditForm = (props: {onClose: () => void, entityId: string, page: string, usecase: any}) => {

    const { onClose, page, usecase }   =   props;

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const [form]        =   useForm();

    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
        text            :   "Update"
    });

    const videoRef: any =   useRef();
    const tourRef: any  =   useRef();  
    
    const QUERY = page === "TEMPLATES" ? RT_USECASE : R_USECASE;

    const { data: useCaseData, loading: usecaseLoading } = useQuery(QUERY, {
        fetchPolicy: "network-only",
        variables: {
            usecaseUuid: usecase.uuid
        }
    });

    const { data, loading, error }  =   useQuery(ALL_USECASE_CATEGORIES, {
        fetchPolicy: "network-only"
    });

    const [_getBlobUrls]        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const onFinish = async (values: any) => {
        
        let usecaseInput: any = {
            usecaseUuid: usecase.uuid,
            input : {
                title: values.title,
                description: values.description,
                categoryUuids: values.category ? [values.category] : []
            }
        }

        let videoUploadType     =   null;
        let tourUploadType      =   null;

        if(videoRef.current && videoRef.current.hasData){
            if(videoRef.current.currentUploadType === PASTE_LINK){
                usecaseInput.input["videoInput"] = {
                    "link"  : videoRef.current.pastedLink
                }
            }else if(videoRef.current.currentUploadType === SELECT_FROM_LIBRARY){
                usecaseInput.input["videoInput"] = {
                    "uuid"  : videoRef.current.selectedResource.uuid
                }
            }else if(videoRef.current.currentUploadType === UPLOAD_FROM_DEVICE){
                videoUploadType                         =   "uploadFromDevice"
            }
        }

        if(tourRef.current && tourRef.current.hasData){
            if(tourRef.current.currentUploadType === PASTE_LINK){
                usecaseInput.input["walkthroughInput"] = {
                    "link"  : tourRef.current.pastedLink
                }
            }else if(tourRef.current.currentUploadType === SELECT_FROM_LIBRARY){
                usecaseInput.input["walkthroughInput"] = {
                    "uuid"  : tourRef.current.selectedResource.uuid
                }
            }else if(tourRef.current.currentUploadType === UPLOAD_FROM_DEVICE){
                tourUploadType                         =   "uploadFromDevice"
            }
        }

        // Upload Functions

        const requestBlobURLs = async (parts: number, file: string) => {
            const urls = await _getBlobUrls({
                variables: {
                    numberOfParts: parts,
                    contentType: file,
                },
            });
            return urls.data.requestBlobUrls;
        };


        const getPresignedUrls = async (file: any) => {
            const numberOfParts = Math.ceil(file.size / CHUNK_SIZE);
            const response = await requestBlobURLs(numberOfParts, file.type);
            return { urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId };
        };

        // Update the file loader
        const updateFileList = (file: any, contentId: string) => {
            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                prevFileListForMultipleUpload.map((item: any) =>
                    item.uid === file.uid ? { ...item, contentId, status: 'completed' } : item
                )
            );
        };
        // Update the file loader

        const handleFileUpload = async (fileRef: any, inputKey: string) => {

            const { uid, name, lastModified, lastModifiedDate, size, type } = fileRef?.current?.updatedFile;
    
            const updatedFile = {
                uid,
                name,
                lastModified,
                lastModifiedDate,
                size,
                type,
                status: 'uploading',
            };
    
            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => [
                ...(prevFileListForMultipleUpload || []),
                updatedFile,
            ]);
    
            try {

                const uplodableFileObject = fileRef?.current?.updatedFile;

                if(uplodableFileObject){

                    const { urls, contentId, uploadId } = await getPresignedUrls(uplodableFileObject);
    
                    usecaseInput.input[inputKey] = {
                        blobInput: {
                            contentUuid     :   await contentId,
                            contentType     :   uplodableFileObject.type,
                            fileName        :   uplodableFileObject.name,
                        },
                    };
        
                    await CommonUtil.__uploadToS3(
                        uplodableFileObject,
                        urls,
                        contentId,
                        uploadId
                    );

                    updateFileList(uplodableFileObject, contentId);
        
                    return true; 
                }
    
            } catch (error: any) {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error);
                return false; 
            }
        };

        // Upload Functions

        if(page === "ROOM"){
            if(!videoUploadType && !tourUploadType){
                setSubmitState({
                    loading :   true,
                    text    :   "Updating..."
                })
                RoomsAgent.updateUsecase({
                    variables: usecaseInput,
                    onCompletion: () => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Update"
                        })
                        form.resetFields()
                        onClose()
                        CommonUtil.__showSuccess(`Usecase updated successfully`);
                    },
                    errorCallBack: (error: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Update"
                        })
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
            else if(videoUploadType || tourUploadType){

                // close the slider
                onClose();
                // close the slider
            
                const uploadTasks = [];

                if (tourUploadType) {
                    uploadTasks.push(handleFileUpload(tourRef, "walkthroughInput"));
                }
            
                if (videoUploadType) {
                    uploadTasks.push(handleFileUpload(videoRef, "videoInput"));
                }
            
                const results = await Promise.all(uploadTasks);
            
                if (results.every((result) => result === true)) {
                    RoomsAgent.updateUsecase({
                        variables: usecaseInput,
                        onCompletion: () => {
                            RoomsAgent.updateUsecase({
                                variables: usecaseInput,
                                onCompletion: () => {
                                    videoUploadType = null;
                                    tourUploadType = null;
                                },
                                errorCallBack: (error: any) => {
                                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                }
                            })
                        },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
                }
            }
        }

        if(page === "TEMPLATES"){
            if(!videoUploadType && !tourUploadType){
                setSubmitState({
                    loading :   true,
                    text    :   "Updating..."
                })
                RoomTemplateAgent.updateUsecase({
                    variables: usecaseInput,
                    onCompletion: () => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Update"
                        })
                        form.resetFields()
                        onClose()
                        CommonUtil.__showSuccess(`Usecase updated successfully`);
                    },
                    errorCallBack: (error: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Update"
                        })
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            } 
            else if(videoUploadType || tourUploadType){

                // close the slider
                onClose();
                // close the slider
            
                const uploadTasks = [];
            
                if (tourUploadType) {
                    uploadTasks.push(handleFileUpload(tourRef, "walkthroughInput"));
                }
            
                if (videoUploadType) {
                    uploadTasks.push(handleFileUpload(videoRef, "videoInput"));
                }
            
                const results = await Promise.all(uploadTasks);
            
                if (results.every((result) => result === true)) {
                    RoomTemplateAgent.updateUsecase({
                        variables: usecaseInput,
                        onCompletion: () => {
                            videoUploadType = null;
                            tourUploadType = null;
                        },
                        errorCallBack: (error: any) => {
                            setSubmitState({
                                loading :   false,
                                text    :   "Update"
                            })
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
                }
            }
        }
    }

    const navigateToNew = (key: string) => {
        let categoryUrl = window.location.origin + "#/settings/" + key;        
        window.open(categoryUrl, "_blank")
    }

    if(usecaseLoading) return <Loading />
    if(error) return <SomethingWentWrong/>

    const useCase = page === "TEMPLATES" ? useCaseData?._rtUsecase : useCaseData?._rUsecase;

    return (
        <div className='cm-height100'>
            <div className='j-demo-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Usecase
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-demo-form-body'>
                <div className='cm-padding15'>
                    <Form className='cm-form' form={form} layout='vertical' onFinish={onFinish}>
                        <Form.Item name={"title"} label={"Usecase"} rules={[{required: true, message: "Enter a usecase"}]} initialValue={useCase?.title}>
                            <Input maxLength={Length_Input} placeholder="eg: Lead to Close" allowClear size='large'/>
                        </Form.Item>
                        <Form.Item name={"description"} label={"Description"} initialValue={useCase?.description}>
                            <TextArea showCount placeholder="Usecase description" rows={4} allowClear size='large'/>
                        </Form.Item>
                        <Form.Item name={"category"} className='j-fi-has-extra' initialValue={(useCase?.categories && useCase?.categories.length > 0) ? useCase?.categories[0].uuid : undefined}
                            label       =   {
                                <Space>
                                        Category
                                    <div className="j-fi-extra j-hyperlink-text cm-cursor-pointer" onClick={() => navigateToNew("options")}>Create Category</div>
                                </Space>
                            }
                        >
                            <Select className="cm-width100" placeholder="Category" allowClear size='large' suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} loading={loading} disabled={loading}>
                                {
                                    data && data.allUsecaseCategories.map((_category: any) => (
                                        <Option value={_category.uuid}>{_category.name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                    <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                    {/* Video */}
                    <DemoEditResourceForm demoRef={videoRef} type='video' usecase={useCase}/>
                    {/* Video */}
                    <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                    {/* Tour */}
                    <DemoEditResourceForm demoRef={tourRef} type='tour' usecase={useCase}/>
                    {/* Tour */}
                </div>
            </div>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                        <Space size={10}>
                            <div className="cm-font-size14">{submitState.text}</div>
                            {
                                submitState.loading && <Loading color="#fff" size='small'/>
                            }
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default DemoEditForm