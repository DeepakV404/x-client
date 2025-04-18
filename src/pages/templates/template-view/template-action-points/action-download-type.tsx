import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Button, Col, Dropdown, Form, Input, MenuProps, Row, Space, Upload, message } from 'antd';

import { ACCEPTED_DOC_TYPES, ACCEPTED_VIDEO_TYPES, ACCEPTED_FILE_TYPES, CHUNK_SIZE } from '../../../../constants/module-constants';
import { VIEW_DOCUMENT, WATCH_VIDEO } from '../../../../buyer-view/pages/journey/config/action-point-type-config';
import { useBuyerResourceViewer } from '../../../../custom-hooks/resource-viewer-hook';
import { FEATURE_TEMPLATES } from '../../../../config/role-permission-config';
import { checkPermission } from '../../../../config/role-permission';
import { REQUEST_BLOB_URLS } from '../../../library/api/library-query';
import { TemplateActionPointContext } from './template-action-point';
import { DOCS } from '../../../library/config/resource-type-config';
import { RoomTemplateAgent } from '../../api/room-template-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';

import SellerResourceViewerModal from '../../../resource-viewer/seller-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import LibraryModal from '../../../rooms/library/library-modal/library-modal';
import EditActionPointResource from './edit-action-point-resource';
import Loading from '../../../../utils/loading';

const { useForm }   =   Form;

const ActionDownloadType = (props: {actionType: string}) => {

    const { actionType }    =   props;

    const { $user, $fileListProps, $dictionary} =   useContext(GlobalContext);
    const { setFileListForMultipleUpload } = $fileListProps

    const [form]    =   useForm();

    const { viewResourceProp }   =   useBuyerResourceViewer();

    const { actionPoint }           =   useContext(TemplateActionPointContext);
    const { roomTemplateId }        =   useParams();

    const [_getBlobUrls]            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const [fileList, setFileList]                   =   useState<any[]>([]);
    const [pastedLink, setPastedLink]               =   useState<any>(null);
    const [showLibraryModal, setShowLibraryModal]   =   useState<boolean>(false);
    const [submitState, setSubmitState]             =   useState({
        loading         :   false,
        text            :   "Save"
    });

    const [showInput, setShowInput]                 =   useState("");

    const handleSelectResource = (resource: any) => {
        
        const messageLoading = message.loading("Updating action point", 0)
        RoomTemplateAgent.rtUpdateResourceInActionPoint({
            variables: {
                templateUuid    :   roomTemplateId, 
                actionPointUuid :   actionPoint.uuid, 
                type            :   actionType, 
                resourcesUuid    :   resource.map((res: any) => res.uuid),
            },
            onCompletion: () => {
                setShowLibraryModal(false)
                messageLoading()
                CommonUtil.__showSuccess("Action point updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handlePasteLinkChange = (event: any) => {
        setPastedLink(event.target.value)
        setFileList([])
    }

    const onSave = () => {
        const messageLoading = message.loading("Updating action point", 0)
        setSubmitState({
            loading :   true,
            text    :   "Saving..."
        })
        if(pastedLink){
            RoomTemplateAgent.rtUpdateLinkResourceInActionPoint({
                variables: {
                    templateUuid    :   roomTemplateId, 
                    actionPointUuid :   actionPoint.uuid, 
                    type            :   actionType, 
                    url             :   pastedLink
                },
                onCompletion: () => {
                    setShowInput("")
                    setPastedLink(null)
                    form.resetFields()
                    messageLoading()
                    setSubmitState({
                        loading :   false,
                        text    :   "Save"
                    })
                    CommonUtil.__showSuccess("Action point updated successfully")
                },
                errorCallBack: (error: any) => {
                    messageLoading()
                    setSubmitState({
                        loading :   false,
                        text    :   "Save"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else {
            messageLoading()
            setSubmitState({
                loading :   false,
                text    :   "Save"
            })
            CommonUtil.__showError("Upload or select resources.")
        }
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

    const handleChange = async ({file}: any) => {
        
        const { uid, name, lastModified, lastModifiedDate, size, type } = file;
        
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
            const { urls, contentId, uploadId } = await getPresignedUrls(file);

            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                prevFileListForMultipleUpload.map((item: any) =>
                    item.uid === file.uid ? { ...item, contentId } : item
                )
            );
    
            CommonUtil.__uploadToS3(
                file,           
                urls,                  
                contentId,             
                uploadId,              
                () => {  
                    RoomTemplateAgent.rtUpdateBlobResourceInActionPointV2({
                        variables: {
                            templateUuid    :   roomTemplateId,
                            actionPointUuid :   actionPoint.uuid,
                            type            :   actionType,
                            title           :   file.name,
                            input           :   {
                                contentUuid: contentId,
                                contentType: file.type,
                                fileName: file.name
                            }
                        },
                        onCompletion: () => {
                            setShowInput("")
                            setPastedLink(null)
                            form.resetFields()
                            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                prevFileListForMultipleUpload.map((item: any) =>
                                    item.contentId === contentId
                                        ? { ...item, status: 'completed' }
                                        : item
                                )
                            );                                },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })              
                },
            );
        } catch {}
    };

    const getAcceptedFiles = () => {
        switch (actionType) {
            case VIEW_DOCUMENT:
                return ACCEPTED_DOC_TYPES;
        
            case WATCH_VIDEO:
                return ACCEPTED_VIDEO_TYPES
            
            default:
                return ACCEPTED_FILE_TYPES
        }
    }

    const items: MenuProps['items'] = [
        {
            "key"       :   "upload_from_device",
            "title"     :   "Upload from device",
            "label"     :
                <Upload beforeUpload={()=> {return false}} showUploadList={false} onChange={handleChange} accept={getAcceptedFiles()} multiple={true} maxCount={5}>
                    <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                        <MaterialSymbolsRounded font={"upload"} size='20' color='#707070'/>
                        <div className='cm-font-size13 cm-font-fam500'>Upload from device</div>
                    </Space>
                </Upload>,
        },
        {
            "key"       :   "add_from_resource",
            "title"     :   `Select from ${$dictionary.library.title}`,
            "label"     :   
                <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                    <MaterialSymbolsRounded font={"home_storage"} size='20' color='#707070'/>
                    <div className='cm-font-size13 cm-font-fam500'>Select from {$dictionary.library.title}</div>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowLibraryModal(true)
            }
        },
        {
            "key"       :   "paste_link",
            "title"     :   "Paste link",
            "label"     :   
                <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                    <MaterialSymbolsRounded font={"link"} size='20' color='#707070'/>
                    <div className='cm-font-size13 cm-font-fam500'>Paste a link</div>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowInput("link_input")
            }
        } 
    ];  

    return (
        <>
            <div className="j-ap-upload-action-layout">
                <Form form={form} className="cm-width100 cm-form">
                    <Space direction='vertical' className='cm-width100'>
                        {
                            checkPermission($user.role, FEATURE_TEMPLATES, 'create') &&
                            actionPoint.resources && actionPoint.resources.length > 0 &&
                                <Dropdown menu={{items}} trigger={["click"]}>
                                    <Space className='cm-float-right cm-cursor-pointer cm-link-text'>
                                        <div className="cm-font-size13 cm-font-fam500">Add Resource</div>
                                        <MaterialSymbolsRounded font='expand_more' size="18"/>
                                    </Space>
                                </Dropdown>
                        }
                        {
                            showInput === "link_input" ?
                                <Space direction='vertical' className='cm-width100 cm-margin-top20'>
                                    <Form.Item noStyle name={"resourceUrl"}>
                                        <Input onChange={handlePasteLinkChange} prefix={<MaterialSymbolsRounded font="link" size="20"/>} placeholder="Paste a link" disabled={fileList.length > 0} allowClear/>
                                    </Form.Item>
                                    <Space className='cm-width100 cm-flex-justify-end'>
                                        <Button type="primary" ghost className="cm-flex-center cm-margin-bottom10" size="small" onClick={() => {setFileList([]); setShowInput("")}}>
                                            <div className="cm-font-size12">Cancel</div>
                                        </Button>
                                        <Button type="primary" className="cm-flex-center cm-margin-bottom10" size="small" onClick={() => onSave()}>
                                            <Space size={10}>
                                                <div className="cm-font-size12">{submitState.text}</div>
                                                {
                                                    submitState.loading && <Loading color="#fff" size='small'/>
                                                }
                                            </Space>
                                        </Button>
                                    </Space>
                                </Space>
                            :
                                actionPoint.resources && actionPoint.resources.length > 0
                                ?
                                    <Row gutter={[10, 10]} className='j-ap-uploaded-files-layout cm-margin-bottom20'>
                                        {
                                            actionPoint.resources.map((_resource: any) => (
                                                <Col span={24} className="cm-width100">
                                                    <EditActionPointResource key={_resource.uuid} {..._resource} />
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                :
                                    <Space direction='vertical' className='cm-flex-center j-ap-view-empty-files' size={25}>
                                        <Space direction='vertical'  className='cm-flex-center' size={5}>
                                            <div className='cm-font-fam500 cm-font-size16'>No resources added</div>
                                            { checkPermission($user.role, FEATURE_TEMPLATES, 'create') && <div className='cm-font-size13 cm-light-text'>Add resources to share with your buyers</div>}
                                        </Space>
                                        {
                                            checkPermission($user.role, FEATURE_TEMPLATES, 'create') &&
                                                <Dropdown menu={{items}} trigger={["click"]} placement='bottom'>
                                                    <Button type='primary' className="j-add-resource cm-flex-center" size="large" icon={<MaterialSymbolsRounded font="add" size="22"/>}>
                                                        <Space>
                                                            <div className="cm-font-size14 cm-font-fam500">Add Resource</div>
                                                            <MaterialSymbolsRounded font='expand_more' size="18"/>
                                                        </Space>
                                                    </Button>
                                                </Dropdown>
                                        }
                                    </Space>
                        }
                    </Space>
                </Form>
            </div>
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resource: any) => handleSelectResource(resource)}   
                initialFilter           =   {actionType === VIEW_DOCUMENT ? [DOCS] : []}
                multipleResource        =   {true}
            />

            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
                track           =   {false}
            />
        </>
    )
}

export default ActionDownloadType