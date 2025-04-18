import { useContext, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Button, Checkbox, Divider, Form, Input, Select, Space } from 'antd';

import { CHUNK_SIZE, Length_Input } from '../../../constants/module-constants';
import { ALL_USECASE_CATEGORIES } from '../../templates/api/room-templates-query';
import { ROOM_DEMO_USECASE_ADDED, TEMPLATE_DEMO_USECASE_ADDED } from '../../../tracker-constants';
import { AppTracker } from '../../../app-tracker';
import { RoomTemplateAgent } from '../../templates/api/room-template-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { RoomsAgent } from '../api/rooms-agent';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import DemoResourceForm from './demo-resource-form';
import Loading from '../../../utils/loading';
import { GlobalContext } from '../../../globals';
import { REQUEST_BLOB_URLS } from '../../library/api/library-query';

const { useForm }   =   Form;
const { TextArea }  =   Input;
const { Option }    =   Select

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice"

const DemoCreationForm = (props: {onClose: () => void, entityId: string, page: string, onCreate?: (createdUsecase: any) => void}) => {

    const { onClose, entityId, page, onCreate }   =   props;

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const [form]        =   useForm();

    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
        text            :   "Add"
    });

    const videoRef: any =   useRef();
    const tourRef: any  =   useRef();    

    const { data, loading, error }  =   useQuery(ALL_USECASE_CATEGORIES, {
        fetchPolicy: "network-only"
    });

    const [_getBlobUrls]        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const onFinish = async (values: any) => {
        setSubmitState({
            loading :   true,
            text    :   "Adding..."
        })

        let videoUploadType     =   null
        let tourUploadType      =   null

        let usecaseInput: any = {
            input : {
                title: values.title,
                description: values.description,
                categoryUuids: values.category ? [values.category] : undefined
            }
        }

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
                videoUploadType                     =   "uploadFromDevice"
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
                tourUploadType                          =   "uploadFromDevice"
            }
        }

        // Blob request URLS
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
    
        const updateFileList = (file: any, contentId: string) => {
            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                prevFileListForMultipleUpload.map((item: any) =>
                    item.uid === file.uid ? { ...item, contentId, status: 'completed' } : item
                )
            );
        };

        const handleFileUpload = async (fileRef: any, inputKey: string) => {

            const { uid, name, lastModified, lastModifiedDate, size, type } = fileRef.current.updatedFile;
    
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
                const uploadableFileObject = fileRef?.current?.updatedFile;

                if(uploadableFileObject){

                    const { urls, contentId, uploadId } = await getPresignedUrls(uploadableFileObject);
    
                    usecaseInput.input[inputKey] = {
                        blobInput: {
                            contentUuid :   await contentId,
                            contentType :   uploadableFileObject.type,
                            fileName    :   uploadableFileObject.name,
                        },
                    };
        
                    await CommonUtil.__uploadToS3(
                        uploadableFileObject,
                        urls,
                        contentId,
                        uploadId
                    );

                    updateFileList(uploadableFileObject, contentId);
        
                    return true; 
                }
    
            } catch (error: any) {
                CommonUtil.__showError(
                    ERROR_CONFIG[error?.graphQLErrors[0]?.code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                );
                return false; 
            }
        };

        // Blob request URLS

        if(page === "ROOM"){
            usecaseInput["roomUuid"]    =   entityId;
            if(!videoUploadType && !tourUploadType){
                RoomsAgent.addUseCase({
                    variables: usecaseInput,
                    onCompletion: (data: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Save"
                        })
                        onCreate && onCreate(data)
                        form.resetFields()
                        onClose()
                        CommonUtil.__showSuccess(`Usecase added successfully`);
                        AppTracker.trackEvent(ROOM_DEMO_USECASE_ADDED, {"Usecase name": values.title});
                    },
                    errorCallBack: (error: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Save"
                        })
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
            else if(videoUploadType || tourUploadType){

                onClose();
            
                const uploadTasks = [];

            
                if (tourUploadType) {
                    uploadTasks.push(handleFileUpload(tourRef, "walkthroughInput"));
                }
            
                if (videoUploadType) {
                    uploadTasks.push(handleFileUpload(videoRef, "videoInput"));
                }
            
                const results = await Promise.all(uploadTasks);
            
                if (results.every((result) => result === true)) {
                    RoomsAgent.addUseCase({
                        variables       :   usecaseInput,
                        onCompletion: (data: any) => {
                            onCreate && onCreate(data);
                            form.resetFields();
                            onClose();
                            CommonUtil.__showSuccess(`Usecase added successfully`);
                            AppTracker.trackEvent(ROOM_DEMO_USECASE_ADDED, { "Usecase name": values.title });
                            videoUploadType =   null;
                            tourUploadType  =   null;
                        },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(
                                ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                            );
                        },
                    });
                }
            }
        }
        else if(page === "TEMPLATES" ){
            usecaseInput["templateUuid"]        =   entityId;
            usecaseInput["updateInAllRooms"]    =   values.addUsecaseToMappedRooms ?? false;

            if(!videoUploadType && !tourUploadType){
                RoomTemplateAgent.addUsecase({
                    variables: usecaseInput,
                    onCompletion: (data: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Save"
                        })
                        onCreate && onCreate(data)
                        form.resetFields()
                        onClose()
                        CommonUtil.__showSuccess(`Usecase added successfully`);
                        AppTracker.trackEvent(TEMPLATE_DEMO_USECASE_ADDED, {});
                    },
                    errorCallBack: (error: any) => {
                        setSubmitState({
                            loading :   false,
                            text    :   "Save"
                        })
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
            else if(videoUploadType || tourUploadType) {

                onClose();
            
                const uploadTasks = [];
            
                if (tourUploadType) {
                    uploadTasks.push(handleFileUpload(tourRef, "walkthroughInput"));
                }
            
                if (videoUploadType) {
                    uploadTasks.push(handleFileUpload(videoRef, "videoInput"));
                }
            
                const results = await Promise.all(uploadTasks);
            
                if (results.every((result) => result === true)) {
                    RoomTemplateAgent.addUsecase({
                        variables   :   usecaseInput,
                        onCompletion:   (data: any) => {
                            onCreate && onCreate(data)
                            form.resetFields()
                            onClose()
                            CommonUtil.__showSuccess(`Usecase added successfully`);
                            AppTracker.trackEvent(TEMPLATE_DEMO_USECASE_ADDED, {});
                        },
                        errorCallBack: (error: any) => {
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

    if(error) return <SomethingWentWrong/>

    return (
        <div className='cm-height100'>
            <div className='j-demo-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Add Use Case
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-demo-form-body'>
                <div className='cm-padding15'>
                    <Form className='cm-form' form={form} layout='vertical' onFinish={onFinish}>
                        <Form.Item name={"title"} label={"Usecase"} rules={[{required: true, message: "Enter a usecase"}]}>
                            <Input maxLength={Length_Input} placeholder="eg: Lead to Close" allowClear size='large'/>
                        </Form.Item>
                        <Form.Item name={"description"} label={"Description"}>
                            <TextArea placeholder="Usecase description" rows={4} allowClear size='large'/>
                        </Form.Item>
                        <Form.Item name={"category"}
                            className='j-fi-has-extra'
                            label       =   {
                                <Space>
                                    Category
                                    {
                                        !(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") &&
                                            <div className="j-fi-extra j-hyperlink-text cm-cursor-pointer" onClick={() => navigateToNew("options")}>Create Category</div>
                                    }
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
                        {
                            page === "TEMPLATES" &&
                                <Form.Item
                                    name            =   "addUsecaseToMappedRooms"
                                    valuePropName   =   "checked"
                                    className       =   "cm-margin-top20"
                                >
                                    <Checkbox>Add this usecase to all the rooms created using this template</Checkbox>
                                </Form.Item>
                        }
                    </Form>
                    <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                    {/* Video */}
                    <DemoResourceForm demoRef={videoRef} type='video'/>
                    {/* Video */}
                    <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                    {/* Tour */}
                    <DemoResourceForm demoRef={tourRef} type='tour'/>
                    {/* Tour */}
                </div>
            </div>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className='cm-modal-footer-cancel-btn' onClick={() => onClose()}>
                        <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                    </Button>
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

export default DemoCreationForm