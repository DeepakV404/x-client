import { FC, useContext, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Image, Input, MenuProps, Popconfirm, Row, Space, Typography, Upload, message } from 'antd';

import { ACCEPTED_DOC_TYPES, ACCEPTED_FILE_TYPES, ACCEPTED_VIDEO_TYPES, CHUNK_SIZE } from '../../../../constants/module-constants';
import { useBuyerResourceViewer } from '../../../../custom-hooks/resource-viewer-hook';
import { VIEW_DOCUMENT, WATCH_VIDEO } from '../config/action-point-type-config';
import { BuyerGlobalContext } from '../../../../buyer-globals';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { P_REQUEST_BLOB_URLS } from '../../../api/buyers-query';
import { BuyerAgent } from '../../../api/buyer-agent';
import { useLazyQuery } from '@apollo/client';

import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../../custom-hooks/use-translation-hook';
import Translate from '../../../../components/Translate';
import Loading from '../../../../utils/loading';
import { CommonUtil } from '../../../../utils/common-util';

const { Text }      =   Typography;
const { useForm }   =   Form;

interface UploadActionProps 
{
    actionId            :   string;
    actionPoint         :   any;
}

const UploadAction: FC<UploadActionProps> = (props) => {

    const { actionId, actionPoint }   =   props;

    const { $buyerData, $fileListProps }    =   useContext(BuyerGlobalContext);
    const { setFileListForMultipleUpload }  = $fileListProps

    const [form]            =   useForm();

    const { translate }     =   useLocalization();

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    let isDemoAcc           =   $buyerData?.sellerAccount.type === "DEMO";

    const [pastedLink, setPastedLink]               =   useState<any>(null);

    const [showInput, setShowInput]                 =   useState("");

    const [submitState, setSubmitState]             =   useState(false);

    const [_getBlobUrls]            =   useLazyQuery(P_REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const handlePasteLinkChange = (event: any) => {
        setPastedLink(event.target.value)
    }

    const requestBlobURLs: any = async (parts: number, file: string) => {

        const urls = await _getBlobUrls({
            variables: {
                numberOfParts: parts,
                contentType: file
            }
        })

        return urls.data._pRequestBlobUrls
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
                    BuyerAgent.addActionPointBlobResource({
                        variables: {
                            actionPointUuid :   actionPoint.uuid, 
                            title           :   file.name.split(".").slice(0, -1).join("."),
                            input           :   {
                                blobInput   :   {
                                    contentUuid: contentId,
                                    contentType: file.type,
                                    fileName: file.name
                                }
                            },
                        },
                        onCompletion: () => {
                            setShowInput("")
                            setPastedLink(null)
                            CommonUtil.__showSuccess(<Translate i18nKey="success-message.resource-upload-message" />); 
                            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                prevFileListForMultipleUpload.map((item: any) =>
                                    item.contentId === contentId ? { ...item, status: 'completed' } : item
                                )
                            );               
                        },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })          
                },
                "buyer"
            );
        } catch {}
    };

    const onSave = () => {
        const messageLoading = message.loading("Uploading resource...", 0)
       if(pastedLink){
            setSubmitState(true)
            BuyerAgent.addActionPointLinkResource({
                variables: {
                    actionPointUuid :   actionPoint.uuid, 
                    url             :   pastedLink
                },
                onCompletion: () => {
                    setShowInput("")
                    setPastedLink(null)
                    setSubmitState(false)
                    messageLoading()
                    CommonUtil.__showSuccess(<Translate i18nKey="success-message.actionpoint-update-message" />);                
                },
                errorCallBack: (error: any) => {
                    messageLoading()
                    setSubmitState(false)
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            messageLoading()
            CommonUtil.__showError("Upload a file or paste a link.")
        }
    }

    const removeResourceActionPoint = (resourceId: string) => {
        const messageLoading = message.loading("Removing resource...");
        BuyerAgent.removeActionPointResource({
            variables: {
                actionPointUuid :   actionId,
                resourceUuid    :   resourceId
            },
            onCompletion: () => {
                messageLoading()
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.delete-resource-message" />);                
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const UploadedFile = (_resource: any) => {
        return (
            <Card key={_resource.uuid} className='j-ap-uploaded-file cm-cursor-pointer' hoverable onClick={() => handleResourceOnClick(_resource)}>
                <Space className="cm-flex-space-between">
                    <Space className='cm-flex'>
                        <Image className='j-ap-resource-thumbnail' preview={false} width={50} height={40} src={_resource.content.thumbnailUrl ? _resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(_resource.content.type)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(_resource.content.type)}}/> 
                        <Text style={{maxWidth: "190px"}} ellipsis={{tooltip: _resource.title}} className='cm-font-size13 cm-font-fam400'>{_resource.title}</Text>
                    </Space>
                    {
                        _resource.createdStakeholder.__typename !== "AccountUserOutput" 
                        ?
                            <Popconfirm
                                placement           =   "left"  
                                title               =   {<div className="cm-font-fam500"><Translate i18nKey='common-labels.delete-resource'/></div>}
                                description         =   {<div className="cm-font-size13"><Translate i18nKey='common-labels.resource-delete-confirmation'/></div>}
                                icon                =   {null}
                                okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0"}}}
                                cancelButtonProps   =   {{style: {fontSize: "12px"}}}
                                okText              =   {"Delete"}
                                onConfirm           =   {(event: any) => {event.stopPropagation(); removeResourceActionPoint(_resource.uuid)}}
                                onCancel            =   {(event: any) => event?.stopPropagation()}
                            >
                                <MaterialSymbolsRounded font={'delete'} size={'18'} className='cm-cursor-pointer' onClick={(event: any) => event?.stopPropagation()}/>
                            </Popconfirm>
                        :
                            <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer' onClick={() => window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url)}/>
                    }
                </Space>
            </Card>
        )
    }

    const getAcceptedFiles = () => {
        switch (actionPoint.type){
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
                        <div className='cm-font-size13 cm-font-fam500'>
                            <Translate i18nKey='common-labels.upload-from-device'/>
                        </div>
                    </Space>
                </Upload> ,
        },
        {
            "key"       :   "paste_link",
            "title"     :   "Paste link",
            "label"     :   
                <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                    <MaterialSymbolsRounded font={"link"} size='20' color='#707070'/>
                    <div className='cm-font-size13 cm-font-fam500'>
                        <Translate i18nKey='common-labels.paste-a-link'/>
                    </div>
                </Space>,
            "onClick"   :   (_resource: any) => {
                !isDemoAcc  ? setShowInput("link_input") : CommonUtil.__showError("You are in a demo account")
            }
        } 
    ];  

    return (
        <>
            <Form form={form} className="cm-width100 cm-form">
                <Space direction='vertical' className='cm-width100'>
                    {
                        actionPoint.resources && actionPoint.resources.length > 0 
                        ?
                            <Dropdown menu={{items}} trigger={["click"]}>
                                <Space className='cm-link-text cm-float-right cm-cursor-pointer'>
                                    <div className="cm-font-size13 cm-font-fam500"><Translate i18nKey='common-labels.add-resource'/></div>
                                    <MaterialSymbolsRounded font='expand_more' size="18"/>
                                </Space>
                            </Dropdown>
                        :
                            null
                    }
                    {
                        showInput === "link_input" ? 
                            <Space direction='vertical' className='cm-width100'>
                                <Form.Item noStyle name={"resourceUrl"}>
                                    <Input onChange={handlePasteLinkChange} prefix={<MaterialSymbolsRounded font="link" size="20"/>} placeholder={translate("common-labels.paste-a-link")} allowClear/>
                                </Form.Item>
                                <Space className='cm-width100 cm-flex-justify-end'>
                                    <Button type="primary" ghost className="cm-flex-center cm-margin-bottom10" size="small" onClick={() => {setShowInput("")}}>
                                        <div className=" cm-font-size12"><Translate i18nKey='common-labels.cancel'/></div>
                                    </Button>
                                    <Button type="primary" className="cm-flex-center cm-margin-bottom10" size="small" onClick={() => onSave()}>
                                        <Space size={10}>
                                            <div className=" cm-font-size12">
                                                <Translate i18nKey={submitState ? 'common-labels.saving' : 'common-labels.save'}/>
                                            </div>
                                            {
                                                submitState && <Loading color="#fff" size='small'/>
                                            }
                                        </Space>
                                    </Button>
                                </Space>
                            </Space>
                        :                
                            actionPoint.resources && actionPoint.resources.length > 0 
                            ? 
                                <Row gutter={[10, 10]} className='cm-padding-block10 cm-margin-bottom20'>
                                    {
                                        actionPoint.resources.map((_resource: any) => (
                                            <Col span={24} className="cm-width100">
                                                <UploadedFile key={_resource.uuid} {..._resource} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            :
                                <Space direction='vertical' className='cm-flex-center j-ap-view-empty-files' size={25}>
                                    <Space direction='vertical'  className='cm-flex-center' size={5}>
                                        <div className='cm-font-fam500 cm-font-size16'><Translate i18nKey='common-empty.no-resource-added'/></div>
                                        <div className='cm-font-size13 cm-light-text'><Translate i18nKey='common-empty.no-resource-added-subtitle'/></div>
                                    </Space>
                                    <Dropdown menu={{items}} trigger={["click"]} placement='bottom'>
                                        <Button type='primary' className="j-add-resource cm-flex-center" size="large" icon={<MaterialSymbolsRounded font="add" size="22"/>}>
                                            <Space>
                                                <div className="cm-font-size14 cm-font-fam500"><Translate i18nKey='common-labels.add-resource'/></div>
                                                <MaterialSymbolsRounded font='expand_more' size="18"/>
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                </Space>
                    }
                </Space>
            </Form>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default UploadAction