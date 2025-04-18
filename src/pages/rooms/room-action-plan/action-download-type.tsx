import { debounce } from 'lodash';
import { useContext, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Button,  Checkbox,  Col, Divider, Form, Input, Row, Space, Typography, message } from 'antd';

import { PASTE_LINK, SELECT_FROM_LIBRARY, UPLOAD_FROM_DEVICE } from '../room-settings/demo-creation-form';
import { VIEW_DOCUMENT } from '../../../buyer-view/pages/journey/config/action-point-type-config';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { REQUEST_BLOB_URLS } from '../../library/api/library-query';
import { checkPermission } from '../../../config/role-permission';
import { CHUNK_SIZE } from '../../../constants/module-constants';
import { DOCS} from '../../library/config/resource-type-config';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';
import { RoomsAgent } from '../api/rooms-agent';
import { ActionPointViewContext } from '.';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import LibraryModal from '../library/library-modal/library-modal';
import ActionEditResource from './action-edit-resource';
import Loading from '../../../utils/loading';
import Dragger from 'antd/es/upload/Dragger';
import UploadedFile from '../library/resource-form/uploaded-file';
import { ORG_INTEGRATIONS } from '../../settings/api/settings-query';

const { Text }      =   Typography

const { useForm }   =   Form;

const ActionDownloadType = (props: {actionType: string}) => {

    const { data }  =   useQuery(ORG_INTEGRATIONS, {
        fetchPolicy: 'network-only'
    })

    const { actionType }    =   props;

    const { $fileListProps, $user }     =   useContext<any>(GlobalContext);
    const { room }                      =   useOutletContext<any>()

    const { setFileListForMultipleUpload } = $fileListProps

    const [form]                        =   useForm();

    const [_getBlobUrls]                =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const { actionPoint, refetch }      =   useContext(ActionPointViewContext);
    const { roomId }                    =   useParams();

    const [fileList, setFileList]                   =   useState<any[]>([]);
    const [pastedLink, setPastedLink]               =   useState<any>(null);
    const [showLibraryModal, setShowLibraryModal]   =   useState<boolean>(false);
    const [uploadingType, setUploadingType]         =   useState("");
    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
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

    const onUpload = async () => {
        if (fileList.length > 0) {
            setUploadingType("")
            const isChecked = document.querySelector('#myCheckbox') as HTMLInputElement
            const updatedFileListForMultipleUpload = fileList.map((item: any) => ({
                ...item,
                status: 'uploading',
            }));
    
            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => [
                ...(prevFileListForMultipleUpload || []),
                ...updatedFileListForMultipleUpload,
            ]);
    
            for (const file of fileList) {
                const currentFile = file.originFileObj;
                                
                if (currentFile) {
                    const { urls, contentId, uploadId } = await getPresignedUrls(currentFile);
                    
                    setFileList((prevFileList: any) => 
                        prevFileList.filter((item: any) => item.originFileObj.uid !== currentFile.uid)
                    );  

                    try {
                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                            prevFileListForMultipleUpload.map((item: any) =>
                                item.uid === currentFile.uid ? { ...item, contentId } : item
                            )
                        );
                        
                        CommonUtil.__uploadToS3(
                            currentFile,
                            urls,
                            contentId,
                            uploadId,
                            () => {
                                RoomsAgent.updateUploadBlobResourceInActionPointV2({
                                    variables: {
                                        roomUuid        :   roomId,
                                        actionPointUuid :   actionPoint.uuid,
                                        type            :   actionType,
                                        title           :   file.name.split(".").slice(0, -1).join("."),
                                        input           :   {
                                            contentUuid : contentId,
                                            contentType : file.type,
                                            fileName    : file.name
                                        },
                                        uploadToCrm     : data.orgIntegrations.CRM.settings.addResourcesBySellerToCRM ? undefined : isChecked?.checked  
                                    },
                                    onCompletion: () => {
                                        setFileList([])
                                        setPastedLink(null)
                                        form.resetFields()
                                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                            prevFileListForMultipleUpload.map((item: any) =>
                                                item.contentId === contentId
                                                    ? { ...item, status: 'completed' }
                                                    : item
                                            )
                                        );
                                    },
                                    errorCallBack: (error: any) => {
                                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                    }
                                })  
                            },
                        );
                    } catch  {}
                }
            }
        }
    };

    const handlePasteLinkChange = debounce((event: any) => {
        setPastedLink(event.target.value);
        setFileList([]);
    }, 500);

    const onSave = () => {
        const messageLoading = message.loading("Updating action point", 0)
        setSubmitState({
            loading :   true,
        })
       if(pastedLink){
            RoomsAgent.updateUploadLinkResourceInActionPoint({
                variables: {
                    roomUuid        :   roomId, 
                    actionPointUuid :   actionPoint.uuid, 
                    type            :   actionType, 
                    url             :   pastedLink
                },
                onCompletion: () => {
                    setUploadingType("")
                    setFileList([])
                    setPastedLink(null)
                    form.resetFields()
                    messageLoading()
                    setSubmitState({
                        loading :   false,
                    })
                    CommonUtil.__showSuccess("Action point updated successfully")
                },
                errorCallBack: (error: any) => {
                    messageLoading()
                    setSubmitState({
                        loading :   false,
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else {
            messageLoading()
            setSubmitState({
                loading :   false,
            })
            CommonUtil.__showError("Upload or select resources.")
        }
    }

    const handleSelectResource = (resources: any) => {
        const messageLoading = message.loading("Updating action point", 0)
        RoomsAgent.updateResourceInActionPoint({
            variables: {
                roomUuid        :   roomId, 
                actionPointUuid :   actionPoint.uuid, 
                type            :   actionType, 
                resourcesUuid   :   resources.map((_resource: any) => _resource.uuid)
            },
            onCompletion: () => {
                messageLoading()
                setUploadingType("")
                setFileList([])
                setPastedLink(null)
                form.resetFields()
                setShowLibraryModal(false)
                setSubmitState({
                    loading :   false,
                })
                refetch()
                CommonUtil.__showSuccess("Action point updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                setSubmitState({
                    loading :   false,
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }    
    
    return (
        <div className='cm-padding15 cm-width100 cm-height100'>
            {
                checkPermission($user.role, FEATURE_ROOMS, 'create') && (
                    <div 
                        className       =   {`${uploadingType === UPLOAD_FROM_DEVICE ? "cm-flex-justify-center" : "cm-flex-center"} cm-position-relative cm-space-inherit cm-padding15`} 
                        style           =   {{height: uploadingType === UPLOAD_FROM_DEVICE ? "100%" : "200px", backgroundColor: "#F5F7F9", borderRadius: "6px"}}
                    >
                        {uploadingType === PASTE_LINK && <div className='cm-cursor-pointer cm-position-absolute' style={{top: "8px", right: "10px"}}>
                            <MaterialSymbolsRounded font='close' onClick={() => setUploadingType("")} size='21'/>
                        </div>}
                        {
                            uploadingType === PASTE_LINK ? (
                                <Form form={form} onChange={handlePasteLinkChange} className='cm-width100'>
                                    <Form.Item name={"pastedLink"} style={{marginBottom: "10px"}}>
                                        <Input 
                                            required 
                                            className   =   'cm-width100'
                                            value       =   {pastedLink} 
                                            size        =   'large' 
                                            placeholder =   'Paste a link' 
                                            prefix      =   {<MaterialSymbolsRounded font='link' size='20' className='cm-margin-right5'/>}
                                            suffix      =   {submitState.loading ? <Loading /> : null}
                                            disabled    =   {fileList.length > 0}
                                        />
                                    </Form.Item>
                                    <div className='cm-float-right'>
                                            <Form.Item noStyle>
                                                <Button loading={submitState.loading} disabled={submitState.loading} className='cm-font-size13' type='primary' onClick={() => onSave()}>Add Link</Button>
                                            </Form.Item>
                                        </div>
                                </Form>
                            ) : uploadingType === UPLOAD_FROM_DEVICE ? (
                                <div className='cm-width100 cm-height100' style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div style={{height: "calc(100% - 80px)", overflow: "auto"}}>
                                        <Dragger className={`j-demo-file-dragger ${fileList.length > 0 && "j-ap-dragger-vertical-align-baseline"} cm-margin-top15`} beforeUpload={() => {return false}} onChange={handleChange} showUploadList={false} multiple maxCount={5} style={{height: "calc(100% - 300px)", overflow: "auto"}}>
                                        {
                                            fileList.length > 0 
                                                ?
                                                    fileList.map((_file: any) => (
                                                        <div className='cm-margin-bottom10'>
                                                            <UploadedFile key={_file.uid} _file={_file} onRemove={(fileId) => handleRemove(fileId)} />
                                                        </div>
                                                    ))
                                                :   <Space direction='vertical'>
                                                        <Button>Choose File</Button>
                                                        <div className='cm-font-size12'>Click or drag file to this area to upload</div>
                                                    </Space>
                                        }
                                        </Dragger>
                                    </div>
                                    {uploadingType === UPLOAD_FROM_DEVICE && 
                                        <Space direction='vertical' className='cm-margin-top15 cm-flex-space-between'>
                                            <Divider style={{marginBlock: "5px"}}/>
                                            {
                                                data?.orgIntegrations?.CRM?.serviceName === "HUBSPOT" && !data.orgIntegrations.CRM.settings.addResourcesBySellerToCRM && room?.crmInfo?.url &&
                                                    <Space size={6} className='cm-flex-align-center cm-margin-block10'>
                                                        <Checkbox id="myCheckbox"/> 
                                                        <Text className = "cm-font-fam500 cm-font-size13">Add these files to HubSpot attachments</Text>
                                                    </Space>
                                            }
                                            <Space>
                                                <Button type='primary' onClick={onUpload}>Upload</Button>
                                                <Button onClick={() => {setUploadingType(""); setFileList([])}}>Cancel</Button>
                                            </Space>
                                        </Space>
                                    }
                                </div>
                            ) : <>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" key={PASTE_LINK} onClick={() => setUploadingType(PASTE_LINK)} style={{marginRight: "20px"}}>
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="link"/>
                                            <div>Paste Link</div>
                                        </Space>
                                    </div>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" key={SELECT_FROM_LIBRARY} onClick={() => {setShowLibraryModal(true)}} style={{marginRight: "20px"}}>
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="home_storage"/>
                                            <div>From Library</div>
                                        </Space>
                                    </div>
                                    <div className="j-marketplace-res-upload-card cm-flex-center" key={UPLOAD_FROM_DEVICE} onClick={() => setUploadingType(UPLOAD_FROM_DEVICE)} >
                                        <Space direction="vertical" className="cm-flex-center">
                                            <MaterialSymbolsRounded font="upload" />
                                            <div>From Device</div>
                                        </Space>
                                    </div>
                                </>
                        }
                    </div>
                )
            }
            {!uploadingType && actionPoint.resources.length > 0 && (
                <div className='cm-margin-top15'>
                    <Text className="cm-font-size16 cm-font-fam500">
                        {`Uploaded Files (${actionPoint.resources.length})`}
                    </Text>
                    {actionPoint.resources && actionPoint.resources.length > 0 && (
                        <Row className="cm-margin-block20">
                            {actionPoint.resources.map((_resource: any) => (
                                <Col key={_resource.uuid} span={24} className="cm-width100 cm-margin-bottom15" >
                                    <Loading className="j-resource-loading" loading={_resource.content.uploadStatus !== "COMPLETED"} >
                                        <ActionEditResource {..._resource} />
                                    </Loading>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            )}
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resources: any) => handleSelectResource(resources)}   
                initialFilter           =   {actionType === VIEW_DOCUMENT ? [DOCS] : []}
                multipleResource        =   {true}
            />
        </div>
    )
}

export default ActionDownloadType