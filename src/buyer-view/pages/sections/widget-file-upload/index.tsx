import { useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Form, Popconfirm, Space, Table, Tooltip, Typography } from "antd";
import _ from "lodash";

import { ACCEPTED_FILE_TYPES, CHUNK_SIZE, WIDGET_PROFILE_IMAGE_FALLBACK } from "../../../../constants/module-constants";
import { RESOURCE_TYPE_CONFIG } from "../../../../pages/library/config/resource-type-config";
import { TEMPLATE_PREVIEW } from "../../../config/buyer-constants";
import { P_REQUEST_BLOB_URLS } from "../../../api/buyers-query";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { BuyerGlobalContext } from "../../../../buyer-globals";
import { CommonUtil } from "../../../../utils/common-util";
import { BuyerAgent } from "../../../api/buyer-agent";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import EmptyText from "../../../../components/not-found/empty-text";
import Translate from "../../../../components/Translate";
import BuyerWidgetTitle from "../buyer-widget-title";
import Dragger from "antd/es/upload/Dragger";

import BuyerResourceViewerModal from "../../resource-viewer/buyer-resource-viewer-modal";
import { useBuyerResourceViewer } from "../../../../custom-hooks/resource-viewer-hook";

const { Text }      =   Typography;
const { useForm }   =   Form;

const BuyerFileUploadWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const { $fileListProps, $buyerData, $setShowPreviewForm, $isMobile }    =   useContext(BuyerGlobalContext);
    const { setFileListForMultipleUpload }  = $fileListProps

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const $isPreview            =   CommonUtil.__getQueryParams(window.location.search).preview === "true";
    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;    

    const [form]    =   useForm();

    const [fileList, setFileList]                   =   useState<any>([]);

    const [_getBlobUrls]            =   useLazyQuery(P_REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});
    
    const handleChange = ({fileList}: any) => {
        if ($isTemplatePreview) {
            return;
        }
        setFileList(fileList)
        form.submit()
    };

    const handleTemplate = () => {
        if ($isTemplatePreview) {
            $setShowPreviewForm(true); 
            return false;
        }
    };

    const removeResource = (widgetId: string, componentId: string) => {
        BuyerAgent.deleteComponent({
            variables: {
                widgetUuid      : widgetId,
                componentUuid   : componentId
            },
            onCompletion: () => {
            },
            errorCallBack: () => {}
        });
    }   

    const renderers = {
        "_name"  :   (_: any, _record: any) => {                                    
            return (
                <div className="cm-flex-align-center cm-cursor-pointer cm-width100" style={{columnGap: "10px"}} >
                    <img src={RESOURCE_TYPE_CONFIG[_record.content.resource.value.type].resourceTypeImg} style={{borderRadius: "5px", objectFit:"contain"}} width={20} height={20}/>
                    <Text style={{maxWidth: "calc(100% - 20px)"}} ellipsis={{tooltip: _record.content.resource.value.title}}>{_record.content.resource.value.title}</Text>
                </div>
            )
        },
        "_type" : (_: any, _record: any) => {
            return (
                <div>{RESOURCE_TYPE_CONFIG[_record.content.resource.value.type].displayName}</div>
            )
        },
        "_uploadedBy" : (_: any, _record: any) => {

            const uploadedBy = _record?.content?.uploadedBy;
            
            return(
                <Space size={10} className="cm-flex-align-center">
                    <img className="cm-flex-center cm-object-fit-contain" height="30" width="30" style={{borderRadius: "50%"}} src={uploadedBy?.value?.profileUrl ?? WIDGET_PROFILE_IMAGE_FALLBACK} alt="Profile Image" />
                    <div className="cm-flex cm-flex-direction-column">
                        <Text className="cm-font-size12" ellipsis={{ tooltip: `${uploadedBy?.value?.firstName} ${uploadedBy?.value?.lastName || ''}`}} style={{maxWidth: "100%"}}>
                            {uploadedBy?.value?.firstName} {uploadedBy?.value.lastName || ''}
                        </Text>
                        <Text className="cm-font-size10 cm-secondary-text cm-flex">{CommonUtil.__getDateDayYear(_record.content.resource.value.createdAt)}, {CommonUtil.__format_AM_PM(_record.content.resource.value.createdAt)}</Text>
                    </div>
                </Space>
            )
        },
        "_actions" : (_: any, _record: any) => {
            return (
                <Space className="cm-flex-justify-end">
                    {
                        !$isTemplatePreview && $buyerData?.buyers[0].uuid === _record.content.uploadedBy.value.uuid ? 
                            <Popconfirm
                                placement           =   "left" 
                                title               =   {<div className="cm-font-fam500">Remove resource</div>}
                                description         =   {<div className="cm-font-size13">Are you sure want to remove this resource?</div>}
                                icon                =   {null}
                                okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0"}, danger: true}}
                                cancelButtonProps   =   {{style: {fontSize: "12px"}, danger: true, ghost: true}}
                                okText              =   {"Remove"}
                                onConfirm           =   {() => removeResource(widget.uuid, _record.uuid)}
                            >
                                <div className="cm-icon-wrap" >
                                    <MaterialSymbolsRounded className="cm-cursor-pointer" font="delete" size="19" color="#e84745"/>
                                </div>
                            </Popconfirm> 
                        : 
                            null
                    }
                    <div className="cm-icon-wrap" onClick={() => handleResourceOnClick(_record.content.resource.value)}>
                        <MaterialSymbolsRounded className="cm-cursor-pointer" font="visibility" size="19"/>
                    </div>
                    <div className="cm-icon-wrap"  onClick={() => { if ($isTemplatePreview) { $setShowPreviewForm(true); } else { window.open(_record.content.resource.value.content.downloadableUrl, '_self')}}}>
                        <MaterialSymbolsRounded className="cm-cursor-pointer" font="download" size="19"/>
                    </div>
                </Space>
            )
        }
    }

    const columns = [
        {
            title       :   "Name",
            dataIndex   :   'name',
            key         :   'name',
            ellipsis    :   true,
            render      :   renderers._name,
        },
        {
            title       :   "Type",
            dataIndex   :   'type',
            key         :   'type',
            width       :   "150px",
            render      :   renderers._type
        },
        {
            title       :   "Uploaded By",
            key         :   'uploaded_by',
            width       :   "250px",
            render      :   renderers._uploadedBy
        },
        {
            title       :   "",
            dataIndex   :   '',
            key         :   'actions',
            width       :   "150px",
            render      :   renderers._actions
        },
    ];

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

    const getMKVFileType = (type: any) => {
        if(type === "mkv"){
            return `video/x-matroska`
        }else return type
    }

    const onFinish = async () => {        
        if (fileList.length > 0) {
    
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
                                BuyerAgent.addResourceComponent({
                                    variables: {
                                        widgetUuid :   widget.uuid, 
                                        blobInput   :   {
                                            contentUuid: contentId,
                                            contentType: (currentFile.type && currentFile.type !== "") ? currentFile.type : getMKVFileType(currentFile.name.split('.').pop()),
                                            fileName: currentFile.name
                                        }
                                    },
                                    onCompletion: () => {
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
                    } catch  {}
                }
            }
        }
    };

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
        <>
            <div className='j-buyer-section-card' id={widget.uuid}>
                <Space direction="vertical" className="cm-width100 cm-margin-bottom20 cm-margin-top10" size={15}>
                    {widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null}
                    <Form layout="vertical" form={form} onFinish={onFinish} onClick={handleTemplate}>
                        <Dragger openFileDialogOnClick={!$isTemplatePreview && true} className="cm-width100" beforeUpload={()=> {return false}} showUploadList={false} multiple={true} onChange={handleChange} maxCount={5} fileList={fileList} disabled={$isPreview} accept={ACCEPTED_FILE_TYPES}>
                            <Space direction="vertical">
                                <MaterialSymbolsRounded className="cm-text-align-center" font="upload_file" size="34" color="#5F6368"/>
                                <Space direction="vertical" className="cm-text-align-center">
                                    <Text className="cm-font-fam500">Drop files here</Text>
                                    <Text className="cm-font-size13"><Translate i18nKey="common-labels.drag-or-upload-files-here"/></Text>
                                </Space>
                            </Space>
                        </Dragger>
                    </Form>
                </Space>
                <div className="cm-margin-top20">
                    {
                        widget.components.length > 0 &&
                        <div className="cm-margin-top20">
                            {$isMobile 
                                ?
                                    widget.components.map((item: any) =>
                                    (
                                        <div className="cm-border-light cm-border-radius6 cm-padding15 cm-width100 cm-margin-bottom10">
                                            <Space className="cm-flex-space-between cm-margin-bottom5">
                                                <Space>
                                                    <img src={RESOURCE_TYPE_CONFIG[item.content.resource.value.type].resourceTypeImg} style={{borderRadius: "5px", objectFit:"contain"}} width={20} height={20}/>
                                                    <Text ellipsis={{tooltip: item.content.resource.value.title}} style={{maxWidth: "150px"}}>{item.content.resource.value.title}</Text>
                                                    <div className="cm-text-align-center cm-font-size12" style={{height: "15px", width: "50px", borderRadius: "10px", background: "#E8E8EC"}}>{_.capitalize(item.content.resource.value.type)}</div>
                                                </Space>
                                                <Space>
                                                    <MaterialSymbolsRounded className="cm-cursor-pointer" font="download" size="19" onClick={() => { if ($isTemplatePreview) { $setShowPreviewForm(true); } else { window.open(item.content.resource.value.content.downloadableUrl, '_self')}}}/>
                                                    {!$isTemplatePreview && $buyerData?.buyers[0].uuid === item.content.uploadedBy.value.uuid && <Popconfirm
                                                        placement           =   "left" 
                                                        title               =   {<div className="cm-font-fam500">Remove resource</div>}
                                                        description         =   {<div className="cm-font-size13">Are you sure want to remove this resource?</div>}
                                                        icon                =   {null}
                                                        okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0"}, danger: true}}
                                                        cancelButtonProps   =   {{style: {fontSize: "12px"}, danger: true, ghost: true}}
                                                        okText              =   {"Remove"}
                                                        onConfirm           =   {() => removeResource(widget.uuid, item.uuid)}
                                                    >
                                                        <MaterialSymbolsRounded className="cm-cursor-pointer" font="delete" size="19" color="#e84745"/>
                                                    </Popconfirm>}
                                                </Space>
                                            </Space>
                                            <Space className="cm-margin-left25">
                                                <Tooltip title={`${item.content.uploadedBy.value.firstName} ${item.content.uploadedBy.value.lastName || ''}`}>
                                                    <img className="cm-flex-center cm-object-fit-contain" height="20" width="20" style={{borderRadius: "50%"}} src={item.content.uploadedBy.value.profileUrl ?? WIDGET_PROFILE_IMAGE_FALLBACK} alt="Profile Image" />
                                                </Tooltip>
                                                <span className="cm-light-text">&#921;</span>
                                                <Text className="cm-font-size12 cm-secondary-text cm-whitespace-no-wrap">{CommonUtil.__getDateDayYear(item.content.resource.value.createdAt)}, <span className="cm-secondary-text">{CommonUtil.__format_AM_PM(item.content.resource.value.createdAt)}</span></Text>
                                            </Space>    
                                        </div>
                                    ))
                                :
                                    <Table    
                                        className       =   "j-custom-bordered-table"
                                        rowHoverable    =   {false}
                                        columns         =   {columns} 
                                        dataSource      =   {widget.components}
                                        pagination      =   {false}
                                        locale          =   {{
                                            emptyText   :  <div className='cm-flex-center' style={{height: "350px"}}>
                                                                {<EmptyText text='No resource found'/>}
                                                            </div>
                                        }}
                                        onRow           =   {(record) => ({
                                            onClick: () => handleResourceOnClick(record.content.resource.value)
                                        })}
                                    />
                            }
                        </div>
                    }
                </div>
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default BuyerFileUploadWidget