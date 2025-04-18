import { useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Form, Popconfirm, Space, Table, Typography, Upload } from "antd";

import { ACCEPTED_FILE_TYPES, CHUNK_SIZE, MODULE_TEMPLATE, WIDGET_PROFILE_IMAGE_FALLBACK } from "../../../../../constants/module-constants";
import { RESOURCE_TYPE_CONFIG } from "../../../../library/config/resource-type-config";
import { RoomTemplateAgent } from "../../../../templates/api/room-template-agent";
import { FEATURE_ROOMS } from "../../../../../config/role-permission-config";
import { REQUEST_BLOB_URLS } from "../../../../library/api/library-query";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { GlobalContext } from "../../../../../globals";
import { CommonUtil } from "../../../../../utils/common-util";
import { ERROR_CONFIG } from "../../../../../config/error-config";
import { RoomsAgent } from "../../../api/rooms-agent";

import AnalyticsResourceViewerModal from "../../../../../components/analytics-resource-viewer";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded"
import EmptyText from "../../../../../components/not-found/empty-text";
import { useParams } from "react-router-dom";

const { useForm }   =   Form;
const { Dragger }   =   Upload;
const { Text }      =   Typography;

const FileUpload = (props: {module: string, widget: any}) => {

    const { module, widget }                =   props;
    const [ form ]                          =   useForm();
    const { $user, $fileListProps }         =   useContext(GlobalContext);
    const { roomId }                        =   useParams();

    const RoomEditPermission                =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [_getBlobUrls]                    =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const [fileList, setFileList]                   =   useState<any>([]);
    const [showResourceView, setShowResourceView]   =   useState({
        isOpen  :   false,
        resource:   null
    })

    const { setFileListForMultipleUpload }      =   $fileListProps;

    const handleChange = ({fileList}: any) => {
        if(!RoomEditPermission) return
        setFileList(fileList)
        form.submit()
    };

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

                    try {
                        setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                            prevFileListForMultipleUpload.map((item: any) =>
                                item.uid === currentFile.uid ? { ...item, contentId } : item
                            )
                        );

                        setFileList((prevFileList: any) => 
                            prevFileList.filter((item: any) => item.originFileObj.uid !== currentFile.uid)
                        );  

                        CommonUtil.__uploadToS3(
                            currentFile,
                            urls,
                            contentId,
                            uploadId,
                            () => {
                                getApi(contentId, currentFile)
                            },
                        );
                    } catch  {}
                }
            }
        }
    };

    const getApi = (contentId: string, currentFile: any) => {
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.addFileComponent({
                variables: {
                    widgetUuid      :   widget.uuid,
                    resourceInput   :   {
                        blobInput   :   {
                            contentUuid : contentId,
                            contentType: (currentFile.type && currentFile.type !== "") ? currentFile.type : getMKVFileType(currentFile.name.split('.').pop()),
                            fileName    : currentFile.name
                        }
                    }
                },
                onCompletion: () => {
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
        } else {
            RoomsAgent.addFileComponent({
                variables: {
                    widgetUuid      :   widget.uuid,
                    resourceInput   :   {
                        blobInput   :   {
                            contentUuid : contentId,
                            contentType: (currentFile.type && currentFile.type !== "") ? currentFile.type : getMKVFileType(currentFile.name.split('.').pop()),
                            fileName    : currentFile.name
                        }
                    }
                },
                onCompletion: () => {
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
        }  
    }

    const removeResource = (widgetId: string, componentId: string) => {
        RoomsAgent.deleteComponent({
            variables: {
                widgetUuid      : widgetId,
                componentUuid   : componentId
            },
            onCompletion: () => {
            },
            errorCallBack: () => {}
        })       
    }

    const renderers = {
        "_name"  :   (_: any, _record: any) => {
            return (
                <div className="cm-flex-align-center cm-cursor-pointer cm-width100" style={{columnGap: "10px"}}>
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
            return(
                <Space size={10}>
                    <img className="cm-flex-center cm-object-fit-contain" height="30" width="30" style={{borderRadius: "50%"}} src={_record.content.uploadedBy.value.profileUrl ?? WIDGET_PROFILE_IMAGE_FALLBACK} alt="Profile Image" />
                    <Space direction="vertical" size={0}>
                        <Text className="cm-font-size12" ellipsis={{ tooltip: `${_record.content.uploadedBy.value.firstName} ${_record.content.uploadedBy.value.lastName || ''}`}} style={{maxWidth: "100%"}}>
                            {_record.content.uploadedBy.value.firstName} {_record.content.uploadedBy.value.lastName || ''}
                        </Text>
                        <Text className="cm-font-size10 cm-secondary-text cm-flex">{CommonUtil.__getDateDayYear(_record.content.resource.value.createdAt)}, {CommonUtil.__format_AM_PM(_record.content.resource.value.createdAt)}</Text>
                    </Space>
                </Space>
            )
        },
        "_actions" : (_: any, _record: any) => {
            return (
                <Space className="cm-flex-justify-end" onClick={(e) => e.stopPropagation()}>
                    <div className="cm-icon-wrap" onClick={() => setShowResourceView({isOpen: true, resource: _record.content.resource.value})}>
                        <MaterialSymbolsRounded className="cm-cursor-pointer" font="visibility" size="19"/>
                    </div>
                    <div className="cm-icon-wrap" onClick={() => window.open(_record.content.resource.value.content.downloadableUrl, '_self')}>
                        <MaterialSymbolsRounded className="cm-cursor-pointer" font="download" size="19"/>
                    </div>
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
                            <div className="cm-icon-wrap">
                                <MaterialSymbolsRounded className="cm-cursor-pointer" font="delete" size="19" color="#e84745"/>
                            </div>
                        </Popconfirm>
                </Space>
            )
        }
    }

    const columns = [
        {
            title       :   "Name",
            dataIndex   :   'name',
            key         :   'name',
            render      :   renderers._name,
            ellipsis    :   true,
        },
        {
            title       :   "Type",
            dataIndex   :   'type',
            key         :   'type',
            render      :   renderers._type,
            width       :   '150px',
        },
        {
            title       :   "Uploaded By",
            key         :   'uploaded_by',
            render      :   renderers._uploadedBy,
            width       :   '250px',
        },
        {
            title       :   "",
            dataIndex   :   '',
            key         :   'actions',
            render      :   renderers._actions,
            width       :   "100px",
        },
    ];

    return (
        <>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Dragger className={`cm-width100 ${RoomEditPermission ? "cm-cursor-pointer": ""}`} beforeUpload={()=> {return false}} showUploadList={false} multiple={true} onChange={handleChange} maxCount={5} fileList={fileList} accept={ACCEPTED_FILE_TYPES}>
                    <Space direction="vertical">
                        <MaterialSymbolsRounded className="cm-text-align-center" font="upload_file" size="34" color="#5F6368"/>
                        <Space direction="vertical" className="cm-text-align-center">
                            <Text className="cm-font-fam500">File upload area</Text>
                            <Text className="cm-font-size13">This is where your viewers will be able to upload their files</Text>
                        </Space>
                    </Space>
                </Dragger>
            </Form>
            {
                widget.components.length > 0 &&
                    <div className="cm-margin-top20">
                        <Table    
                            className       =   "j-custom-bordered-table"
                            columns         =   {columns} 
                            dataSource      =   {widget.components}
                            pagination      =   {false}
                            rowHoverable    =   {false}
                            locale          =   {{
                                emptyText   :  <div className='cm-flex-center' style={{height: "350px"}}>
                                                    {<EmptyText text='No resource found'/>}
                                                </div>
                            }}
                            onRow           =   {(record) => ({
                                onClick: () => setShowResourceView({isOpen: true, resource: record.content.resource.value})
                            })}
                        />
                    </div>
            }

            <AnalyticsResourceViewerModal 
                module  =   {module === "MODULE_ROOM" ? { "type": "room", roomId: roomId! } : { type: "template" }} 
                isOpen  =   {showResourceView.isOpen} 
                onClose =   {() => setShowResourceView({isOpen: false, resource: null})} 
                resource=   {showResourceView.resource}
            />
        </>
    )
}

export default FileUpload