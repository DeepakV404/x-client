import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Button, Space, Select, Input, Upload, Divider, Form } from "antd";

import { ACCEPTED_FILE_TYPES, CHUNK_SIZE } from "../../../../constants/module-constants";
import { GET_LINK_META_DATA, REQUEST_BLOB_URLS } from "../../../library/api/library-query";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { RoomsAgent } from "../../api/rooms-agent";
import { useForm } from "antd/es/form/Form";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import StageResourceCard from "./stage-resource-card";
import { GlobalContext } from "../../../../globals";
import Loading from "../../../../utils/loading";
import LibraryModal from "../../library/library-modal/library-modal";

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice"

const { Dragger }       =   Upload;
const { Option }        =   Select

const RoomStageAddResource = (props: {onClose: () => void}) => {

    const { onClose }   =    props;

    const [form]               =   useForm();

    const { $dictionary }      =    useContext(GlobalContext)
    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const { roomId, stageId }   =   useParams();

    const [_getBlobUrls]            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const [showLibrary, setShowLibrary]             =   useState<boolean>(false);
    const [currentUploadType, setCurrentUploadType] =   useState(PASTE_LINK);

    const [updatedFile, setUpdatedFile]             =   useState<any>(null);
    const [selectedResource, setSeletedResource]    =   useState<any>([]);
    const [pastedLink, setPastedLink]               =   useState<any>();
    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
        text            :   "Update"
    });

    const [_getMetaData, { data, loading }]         =   useLazyQuery(GET_LINK_META_DATA, {
        fetchPolicy: "network-only"
    });

    const resetAll = () => {
        setUpdatedFile(null)
        setSeletedResource([])
        setPastedLink(null)
    }

    const handleUploadOptionChange = (_selectedKey: string) => {
        setCurrentUploadType(_selectedKey)
        resetAll()
    }

    const handleFileUpload = (_file: any) => {
        setUpdatedFile(_file.file)
    }

    const handlePasteLinkChange = () => {
        const link = form.getFieldsValue().pastedLink
        setPastedLink(link)
        if(link.trim()){
            _getMetaData({
                variables: {
                    link : link
                }
            })
        }
    }

    const removeSelectedResource = (toRemove: any) => {
        setSeletedResource((prevSelectedResources: any) => prevSelectedResources.filter((_resource: any) => _resource.uuid !== toRemove.uuid))
    }

    const removeUploadedResource = () => {
        setUpdatedFile(null)
    }

    const handleSubmit = async () => {
              
        const updateResource = (resource: any, contentId?: any) => {
            RoomsAgent.addStageResources({
                variables: {
                    roomUuid        :   roomId,
                    stageUuid       :   stageId,
                    resourcesUuid   :   typeof(resource) === "string" ? [resource] : resource.map((_resource: any) => _resource.uuid)
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Resource added successfully");
                    onClose()
                    if(currentUploadType === UPLOAD_FROM_DEVICE){
                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                            prevFileListForMultipleUpload.map((item: any) =>
                                item.contentId === contentId
                                    ? { ...item, status: 'completed' }
                                    : item
                            )
                        );
                    }
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }

        if(currentUploadType === PASTE_LINK){
            RoomsAgent.createRoomLinkResource({
                variables: {
                    roomUuid        :   roomId,
                    url             :   pastedLink,
                },
                onCompletion: (data: any) => {
                    updateResource(data.createRoomLinkResource._id)
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        text    :   "Update",
                        loading :   false
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else if(currentUploadType === UPLOAD_FROM_DEVICE){
            onClose()
            const { uid, name, lastModified, lastModifiedDate, size, type }: any = updatedFile;

            const file = {
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
                file,
            ]);

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

            const { urls, contentId, uploadId } = await getPresignedUrls(updatedFile);
            
            try {
                
                setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                    prevFileListForMultipleUpload.map((item: any) =>
                        item.uid === updatedFile.uid ? { ...item, contentId } : item
                    )
                );

                CommonUtil.__uploadToS3(
                    updatedFile,
                    urls,
                    contentId,
                    uploadId,
                    () => {
                        RoomsAgent.createRoomStageResource({
                            variables: {
                                roomUuid    :   roomId,
                                stageUuid   :   stageId,
                                title       :   updatedFile.name.split(".").slice(0, -1).join("."), 
                                input       :   {
                                    blobInput   :   {
                                        contentUuid: contentId,
                                        contentType: file.type,
                                        fileName: file.name
                                    }
                                }
                            },
                            onCompletion: () => {
                                onClose()
                                if(currentUploadType === UPLOAD_FROM_DEVICE){
                                    setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                        prevFileListForMultipleUpload.map((item: any) =>
                                            item.contentId === contentId ? { ...item, status: 'completed' } : item
                                        )
                                    );
                                }
                            },
                            errorCallBack: (error: any) => {
                                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                            },
                        });
                    },
                );
            } catch  {}  
        }else if(currentUploadType === SELECT_FROM_LIBRARY){
            updateResource(selectedResource)
        }
    }

    const getUploadComponent = () => {
        switch (currentUploadType) {
            case PASTE_LINK:
                return (
                    <Space direction='vertical' className='cm-width100'>
                        <Space className='cm-width100 cm-space-inherit' direction='vertical'>
                            <div className='cm-flex-center cm-font-fam500 cm-font-size16'>Paste a Link</div>
                            <Form form={form}>
                            <Form.Item name={"pastedLink"}>
                                <Input value={pastedLink} size='large' placeholder='Paste a link' prefix={<MaterialSymbolsRounded font='link' size='20' onClick={handlePasteLinkChange} className='cm-margin-right5'/>} suffix = {loading ? <Loading /> : <MaterialSymbolsRounded font='arrow_forward' className='cm-cursor-pointer' onClick={handlePasteLinkChange}/>}/>
                            </Form.Item>
                            </Form>
                        </Space>
                    </Space>
                )
        
            case SELECT_FROM_LIBRARY:
                return (
                    <Space direction='vertical' className='cm-width100'>
                         <div className='cm-flex-center'>
                            <Button className='cm-flex-center'  onClick={() => setShowLibrary(true)}>
                                Select from {$dictionary.library.title}
                            </Button>
                        </div>
                    </Space>
                )

            case UPLOAD_FROM_DEVICE:
                return (
                    <Space direction='vertical' className='cm-width100 '>
                        <Dragger className='j-demo-file-dragger' beforeUpload={()=> {return false}} onChange={handleFileUpload} showUploadList={false} accept={ACCEPTED_FILE_TYPES}>
                            <Space direction='vertical'>
                                <Button>Choose File</Button>
                                <div className='cm-font-size12'>Click or drag file to this area to upload</div>
                            </Space>
                        </Dragger>
                    </Space>
                )
        }       
    }

    const getFiles = () => {
        switch (currentUploadType) {
            case PASTE_LINK:
                if(pastedLink){
                    return (
                        <>
                            <span className="cm-font-fam500">Pasted link</span>
                            <StageResourceCard title={data?._pGetLinkMetadata.ogTitle ? data?._pGetLinkMetadata.ogTitle : pastedLink} imgSource={data?._pGetLinkMetadata.ogImage ? data._pGetLinkMetadata.ogImage : CommonUtil.__getResourceFallbackImage(updatedFile?.type)} handleRemove={() => setPastedLink(null)}/>
                        </>
                    )
                }
                return null
        
            case SELECT_FROM_LIBRARY:
                if(selectedResource.length > 0){
                    return (
                        <>
                            <span className="cm-font-fam500">Selected Files</span>
                            {
                                selectedResource.map((_selectedResource: any) => {
                                    return (
                                        <StageResourceCard title={_selectedResource.title} imgSource={_selectedResource.content.thumbnailUrl ? _selectedResource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(updatedFile?.type)} handleRemove={() => removeSelectedResource(_selectedResource)}/>
                                    )
                                })
                            }
                        </>
                    )
                }
                return null

            case UPLOAD_FROM_DEVICE:
                if(updatedFile){
                    return (
                        <>
                            <span className="cm-font-fam500">Uploaded Files</span>
                            <StageResourceCard title={updatedFile.name.split(".").slice(0, -1).join(".")} imgSource={CommonUtil.__getResourceFallbackImage(updatedFile?.type)} handleRemove={() => removeUploadedResource()}/>
                        </>
                    )
                }
                return null
        }
    }
    
    return(
        <>
            <div className='cm-height100'>
                <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                    <Space className='cm-width100 cm-flex-space-between'>
                        Add Resource
                        <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                    </Space>
                </div>
                <div className='j-add-res-form-body'>
                    <div className='cm-padding15'>
                    <Space direction='vertical' className='cm-width100' size={15}>
                        <Space className='cm-flex-space-between'>
                            <div className='cm-font-fam500 cm-font-size16'>Upload</div>
                            <Space size={10}>
                                <div className='cm-font-size12'>Upload Options</div>
                                <Select style={{width: "175px"}} suffixIcon={<MaterialSymbolsRounded font='expand_more' size='16'/>} defaultValue={currentUploadType} onChange={(selectedKey: string) => handleUploadOptionChange(selectedKey)}>
                                    <Option key={PASTE_LINK}>Paste Link</Option>
                                    <Option key={SELECT_FROM_LIBRARY}>Select from {$dictionary.library.title}</Option>
                                    <Option key={UPLOAD_FROM_DEVICE}>Upload from Device</Option>
                                </Select>
                            </Space>
                        </Space>
                        <div className='j-add-res-content-wrapper cm-flex-center'>
                            {getUploadComponent()}
                        </div>
                    </Space>
                        <Divider dashed={true} style={{borderColor: "#E8E8EC"}}/>
                        <div className="cm-margin-top20">
                            {getFiles()}
                        </div>
                    </div>
                </div>
                <div className='j-add-res-form-footer'>
                    <Space>
                        <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                        <Button type="primary" className="cm-flex-center" onClick={handleSubmit} disabled={submitState.loading}>
                            <Space size={10}>
                                {submitState.text}
                                {submitState.loading && <Loading color="#fff" size='small' />}
                            </Space>
                        </Button>
                    </Space>
                </div>
            </div>
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resources: any) => {setSeletedResource(resources); setShowLibrary(false)}}
                multipleResource        =   {true}
            />
        </>
    )
}

export default RoomStageAddResource