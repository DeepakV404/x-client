import { ROOM } from '../api/rooms-query';
import { useContext, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { GlobalContext } from '../../../globals';
import { useLazyQuery, useQuery } from '@apollo/client';
import { REQUEST_BLOB_URLS } from '../../library/api/library-query';
import { Avatar, Button, Card, Checkbox, Col, Divider, Dropdown, Form, Input, MenuProps, Popconfirm, Row, Select, Space, Tag, Typography, message } from 'antd';

import { ACCEPTED_VIDEO_TYPES, CHUNK_SIZE, Length_Input } from '../../../constants/module-constants';

import { BOOK_MEETING, GOTO_URL } from '../../../buyer-view/pages/journey/config/action-point-type-config';
import { ORG_INTEGRATIONS } from '../../settings/api/settings-query';
import { LibraryAgent } from '../../library/api/library-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { RoomsAgent } from '../api/rooms-agent';
import { ActionPointViewContext } from '.';

import AnalyticsResourceViewerModal from '../../../components/analytics-resource-viewer';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import UploadedFile from '../library/resource-form/uploaded-file';
import Loading from '../../../utils/loading';
import Dragger from 'antd/es/upload/Dragger';

const { useForm }   =   Form;
const { TextArea }  =   Input;
const { Text }      =   Typography;
const { Option }    =   Select;

const LinkAction = (props: {actionType: string}) => {

    const { data }  =   useQuery(ORG_INTEGRATIONS, {
        fetchPolicy: 'network-only'
    })

    const { actionType }    =   props;
    const params            =   useParams();
    const { roomId }        =   useParams();
    const [form]            =   useForm();
    const { actionPoint }   =   useContext(ActionPointViewContext);

    const { $fileListProps }   =   useContext<any>(GlobalContext);
    const { room }             =   useOutletContext<any>()

    const { setFileListForMultipleUpload } = $fileListProps

    const [copy, setCopy]                               =   useState(false);
    const [copyMeetLink, setCopyMeetLink]               =   useState(false);
    const [showInput, setShowInput]                     =   useState("");
    const [fileList, setFileList]                       =   useState<any[]>(actionPoint.meetingRecording ? [actionPoint.meetingRecording]: []);
    const [pastedLink, setPastedLink]                   =   useState<any>(null);
    const [editRecording, setEditRecording]             =   useState(false);
    const [editMode, setEditMode]                       =   useState((actionPoint.type === BOOK_MEETING && actionPoint.calendarInfo.type) || (actionPoint.type === GOTO_URL && actionPoint.resources[0]?.content.url) ? false : true);
    const [uploadFile, setUploadFile]                   =   useState(false)
    const [submitState, setSubmitState]                 =   useState({
        text        :   "Update recording",
        loading     :   false
    })
    const { data: rData}         =   useQuery(ROOM, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

    const [_getBlobUrls]            =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    const [selectedValue, setSelectedValue] = useState(actionPoint.calendarInfo.type === "OWNER_CALENDAR" ? "OWNER_CALENDAR" : (actionPoint.calendarInfo.type === "STATIC_CALENDAR_LINK" ? "STATIC_CALENDAR_LINK" : actionPoint.calendarInfo.linkedUser.uuid));

    const handleSelectChange = (value: any) => {
        setSelectedValue(value);
    };

    const [saveState, setSaveState]                 =   useState({
        text        :   "Save",
        loading     :   false
    });
    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })

    const onFinish = (values: any) => {
        
        setSaveState({
            loading :   true,
            text    :   "Saving..."
        })

        let messageLoading = message.loading("Updating action point..." , 0)
        
        if(actionType === BOOK_MEETING){

            let calendarInfoInput: any = {}

            if(values.calendarLinkType === "OWNER_CALENDAR"){
                calendarInfoInput["type"] = "OWNER_CALENDAR"
            }else if(values.calendarLinkType === "STATIC_CALENDAR_LINK"){
                calendarInfoInput["type"] = "STATIC_CALENDAR_LINK";
                calendarInfoInput["link"] = values.customCalendarLink;
            }else{
                calendarInfoInput["type"] = "TEAM_USER_CALENDAR";
                calendarInfoInput["linkedUserUuid"] = values.calendarLinkType
            }

            RoomsAgent.updateMeetingTypeInActionPoint({
                variables: {
                    roomUuid            :   roomId, 
                    actionPointUuid     :   actionPoint.uuid, 
                    meetingNotes        :   values.meetingNotes,
                    meetingMom          :   values.minutesOfMeeting,
                    meetingJoinLink     :   values.meetingLink,
                    calendarInfoInput   :   calendarInfoInput
                },
                onCompletion: () => {
                    setSaveState({
                        loading :   false,
                        text    :   "Save"
                    })
                    messageLoading()
                    setEditMode(false)
                    CommonUtil.__showSuccess("Action point updated successfully")
                },
                errorCallBack: (error: any) => {
                    setSaveState({
                        loading :   false,
                        text    :   "Save"
                    })
                    messageLoading()
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            RoomsAgent.updateUploadLinkResourceInActionPoint({
                variables: {
                    roomUuid        :   roomId, 
                    actionPointUuid :   actionPoint.uuid, 
                    type            :   GOTO_URL, 
                    url             :   values.url
                },
                onCompletion: () => {
                    setSaveState({
                        loading :   false,
                        text    :   "Save"
                    })
                    messageLoading()
                    setEditMode(false)
                    CommonUtil.__showSuccess("Action point updated successfully")
                },
                errorCallBack: (error: any) => {
                    setSaveState({
                        loading :   false,
                        text    :   "Save"
                    })
                    messageLoading()
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

        const updateRecording = () => {
            setSubmitState({
                loading :   true,
                text    :   "Updating recording..."
            })
            const messageLoading = message.loading("Updating recording...", 0)

            let recordingInput: any = {
                roomUuid        :   roomId, 
                actionPointUuid :   actionPoint.uuid,
                recordingInput  :   {}
            }

            recordingInput.recordingInput["link"] =   pastedLink
            if(showInput === "add_embedded_link") {
                recordingInput.recordingInput["property"] = {};
                recordingInput.recordingInput["property"]["embedLink"] = true;
            }

            RoomsAgent.updateMeetingTypeInActionPoint({
                variables: recordingInput,
                onCompletion: () => {
                    messageLoading()
                    setEditMode(false)
                    setSubmitState({
                        loading :   false,
                        text    :   "Update recording"
                    })
                    CommonUtil.__showSuccess("Recording updated successfully")
                },
                errorCallBack: (error: any) => {
                    messageLoading()
                    setSubmitState({
                        loading :   false,
                        text    :   "Update recording"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })

        }

    const handlePasteLinkChange = (event: any) => {
        setPastedLink(event.target.value)
        setFileList([])
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

    const handleUpload = async () => {

        if(pastedLink || fileList.length > 0){
            const isChecked = document.querySelector('#myCheckbox') as HTMLInputElement
            setUploadFile(false)
            let recordingInput: any = {
                roomUuid        :   roomId, 
                actionPointUuid :   actionPoint.uuid,
                uploadToCrm     :   data?.orgIntegrations?.CRM?.settings?.addResourcesBySellerToCRM ? undefined : isChecked?.checked,
                recordingInput  :   {}
            }

            if(pastedLink){
                setSubmitState({
                    loading :   true,
                    text    :   "Updating recording..."
                })

                const messageLoading = message.loading("Updating recording...", 0)

                recordingInput.recordingInput["link"] =   pastedLink

                RoomsAgent.updateMeetingTypeInActionPoint({
                    variables: recordingInput,
                    onCompletion: () => {
                        messageLoading()
                        setEditMode(false)
                        setSubmitState({
                            loading :   false,
                            text    :   "Update recording"
                        })
                        CommonUtil.__showSuccess("Recording updated successfully")
                    },
                    errorCallBack: (error: any) => {
                        messageLoading()
                        setSubmitState({
                            loading :   false,
                            text    :   "Update recording"
                        })
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }else if(fileList.length > 0){

                const { uid, name, lastModified, lastModifiedDate, size, type } = fileList[0].originFileObj;

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
                    const { urls, contentId, uploadId } = await getPresignedUrls(fileList[0].originFileObj);
                    setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                        prevFileListForMultipleUpload.map((item: any) =>
                            item.uid === fileList[0].originFileObj.uid ? { ...item, contentId } : item
                        )
                    );

                    recordingInput.recordingInput = {
                        blobInput: {
                            contentUuid: contentId,
                            contentType: fileList[0].originFileObj.type,
                            fileName: fileList[0].originFileObj.name,
                        },
                    };

                    CommonUtil.__uploadToS3(
                        fileList[0].originFileObj,
                        urls,
                        contentId,
                        uploadId,
                        () => {
                            RoomsAgent.updateMeetingTypeInActionPoint({
                                variables: recordingInput,
                                onCompletion: () => {
                                    setEditMode(false)
                                    setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                        prevFileListForMultipleUpload.map((item: any) =>
                                            item.contentId === contentId
                                                ? { ...item, status: 'completed' }
                                                : item
                                        )
                                    );
                                    CommonUtil.__showSuccess("Recording updated successfully")
                                },
                                errorCallBack: (error: any) => {
                                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                }
                            })
                        },
                    );
                } catch {}
            }
        }else{
            CommonUtil.__showError("Paste a recording link or upload a recording video")
        }
    };

    const handleChange = ({fileList}: any) => {
        setFileList(fileList)
    };

    const handleRemove = (fileId: string) => {
        setFileList((prevFileList: any) => prevFileList.filter((_file: any) => _file.uid !== fileId))
    }

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    const copyMeetingLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopyMeetLink(true);
        setTimeout(function() {			
            setCopyMeetLink(false)
        }, 2000);
    }

    const handleRemoveResource = (resourceId: string) => {
        const messageLoading = message.loading("Removing recording...");
        RoomsAgent.removeResourceInActionPoint({
            variables: {
                actionPointUuid :   actionPoint.uuid, 
                resourceUuid    :   resourceId
            },
            onCompletion: () => {
                messageLoading()
                setFileList([])
                setShowInput("")
                setPastedLink("")
                form.resetFields()
                CommonUtil.__showSuccess("Removed recording successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const updateResource = (values: any) => {

        let input: any = {
            resourceUuid    :   values.id,
            title           :   values.title,
        }

        LibraryAgent.updateResourceInfo({
            variables: input,
            onCompletion: () => {
                form.resetFields()
                setEditRecording(false)
                CommonUtil.__showSuccess("Recording edited successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const UploadFile = (_file: any) => {
        return (
            <Loading className="j-resource-loading" loading={_file.content.uploadStatus !== "COMPLETED"}>
                <Card key={_file.uuid} className='j-ap-uploaded-file cm-cursor-pointer' onClick={(event) => {event.stopPropagation(); setResourceAnalytics({ isOpen: true, resource: _file })}}>
                    <Space className="cm-flex-space-between">
                        <Space direction='vertical'>
                            <Space className='cm-flex'>
                                <MaterialSymbolsRounded font={'movie'}/>
                                {
                                    editRecording ?
                                        <Form form={form} className="cm-margin-left5 cm-width100 cm-flex-center" onFinish={updateResource} onClick={(event) => event.stopPropagation()}>
                                            <Space>
                                                <Form.Item noStyle name={"title"} initialValue={_file.title} >
                                                    <Input style={{height: "22px", width: "250px"}} maxLength={Length_Input} className="j-res-name-edit-input cm-font-fam500 cm-font-size12"  placeholder="Untitled" />
                                                </Form.Item>
                                                <Form.Item noStyle initialValue={_file.uuid} name={"id"} hidden>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item  noStyle>
                                                    <Button size='small' htmlType='submit' type="primary" >
                                                        <div className='cm-font-size12'>Save</div>
                                                    </Button>
                                                </Form.Item>
                                                <Form.Item  noStyle>
                                                    <Button type="primary" size='small' ghost onClick={() => setEditRecording(false)}>
                                                        <div className='cm-font-size12'>Cancel</div>
                                                    </Button>
                                                </Form.Item>
                                            </Space>
                                        </Form>
                                    :
                                        <Text style={{maxWidth: "300px"}} ellipsis={{tooltip: _file.title}} className='cm-font-size14 cm-font-fam400'>{_file.title}</Text>
                                }
                            </Space>
                            <Space  size={2}>
                                <Space className='cm-flex-justify-center' size={4}>
                                    <MaterialSymbolsRounded font="timer" size="15"/>
                                    <div className='cm-font-fam500 cm-font-size12 cm-whitespace-no-wrap'>{_file.report?.timeSpent ? `${CommonUtil.__getFormatDuration(_file.report.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`: "-"}</div>
                                </Space>
                                <Divider type="vertical" style={{backgroundColor: "#e4e4e4"}}/>
                                <Space className='cm-flex-justify-center'  size={4}>
                                    <MaterialSymbolsRounded font="visibility" size="17"/>
                                    <div className='cm-font-fam500 cm-font-size12 cm-whitespace-no-wrap'>{_file.report?.views ? _file.report?.views : "-"}</div>
                                </Space>
                                <Divider type="vertical" style={{backgroundColor: "#e4e4e4"}}/>
                                <Space className='cm-flex-justify-center'  size={4}>
                                    <div className='cm-font-size11'>Last viewed on : </div>
                                    <div className='cm-font-fam500 cm-font-size12 cm-whitespace-no-wrap'>{_file.report?.lastViewedAt  ? `${CommonUtil.__getDateDay(new Date(_file.report.lastViewedAt))}, ${new Date(_file.report.lastViewedAt).getFullYear()} - ${CommonUtil.__format_AM_PM(new Date(_file.report.lastViewedAt))}` : "-"}</div>
                                </Space>
                            </Space>
                        </Space>
                        {
                            !editRecording &&
                                <Space onClick={(event) => event.stopPropagation()}>
                                    <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer" onClick={(event) =>{event.stopPropagation(); setEditRecording(true)}}/>
                                    <Popconfirm
                                        placement           =   "left"  
                                        title               =   {<div className="cm-font-fam500">Remove recording</div>}
                                        description         =   {<div className="cm-font-size13">Are you sure you want to remove this recording?</div>}
                                        icon                =   {null}
                                        okText              =   "Remove"
                                        okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F", fontSize: "12px"}}}
                                        cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                                        onConfirm           =   {() => handleRemoveResource(_file.uuid)}
                                    >
                                        <MaterialSymbolsRounded font={'delete'} size={'18'} className='cm-cursor-pointer'/>
                                    </Popconfirm>
                                </Space>
                        }
                    </Space>
                </Card>
            </Loading>
        )
    }

    const items: MenuProps['items'] = [
        {
            "key"       :   "add_link",
            "title"     :   "Add a link",
            "label"     :   
                <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                    <MaterialSymbolsRounded font={"link"} size='20' color='#707070'/>
                    <div className='cm-font-size13 cm-font-fam500'>Add a link</div>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowInput("add_link")
            }
        }, 
        {
            "key"       :   "add_embedded_link",
            "title"     :   "Add an embed link",
            "label"     :   
                <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10}>
                    <MaterialSymbolsRounded font={"link"} size='20' color='#707070'/>
                    <div className='cm-font-size13 cm-font-fam500'>Add an embed link</div>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowInput("add_embedded_link")
            }
        },
        {
            "key"       :   "upload_from_device",
            "title"     :   "Upload from device",
            "label"     :
                    <Space className='cm-flex-align-center' style={{minWidth: "200px", height: "25px"}} size={10} onClick={() => setUploadFile(true)}>
                        <MaterialSymbolsRounded font={"upload"} size='20' color='#707070'/>
                        <div className='cm-font-size13 cm-font-fam500'>Upload from device</div>
                    </Space>
        },
    ];  

    const getAction = (_actionType: string) => {
        switch (_actionType) {
            case BOOK_MEETING:
                return (
                    uploadFile
                        ?
                        <div className='cm-width100 cm-height100' style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                            <div className='cm-padding15' style={{backgroundColor: "#F5F7F9", borderRadius: "6px", height: "calc(100% - 80px)", overflow: "auto"}}>
                                <div className='cm-height100'>
                                    <Dragger className={`j-demo-file-dragger ${fileList.length && "j-ap-dragger-vertical-align-baseline"} cm-margin-top15`} beforeUpload={() => {return false}} onChange={handleChange} showUploadList={false} disabled={pastedLink} accept={ACCEPTED_VIDEO_TYPES} style={{height: "calc(100% - 300px)", overflow: "auto"}}>
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
                            </div>
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
                                    <Button type='primary' onClick={handleUpload}>Upload</Button>
                                    <Button onClick={() => {setUploadFile(false); setFileList([])}}>Cancel</Button>
                                    </Space>
                            </Space>
                        </div>
                        :
                            <>
                                <div className='cm-width100 cm-flex-justify-end'>
                                    <MaterialSymbolsRounded font='edit' size='17' className='cm-cursor-pointer' onClick={() => setEditMode(true)}/>
                                </div>
                                <Row gutter={[0,20]} className='cm-margin-top10'>
                                    <Col span={6} className="cm-font-size13 cm-font-fam500">Recording:</Col>
                                    <Col span={18} >
                                        {
                                            actionPoint.meetingRecording ?
                                                <UploadFile key={actionPoint.meetingRecording.uuid} {...actionPoint.meetingRecording} />
                                            :
                                                (
                                                    (showInput === "add_link" || showInput === "add_embedded_link")  ?
                                                        <Form className='cm-form'>
                                                            <Form.Item className='cm-width100'>
                                                                <Input className='cm-width100' onChange={handlePasteLinkChange} prefix={<MaterialSymbolsRounded font="link" size="16"/>} placeholder="Paste a link to the recorded meeting" allowClear/>
                                                            </Form.Item>
                                                            <Space className='cm-width100 cm-flex-justify-end'>
                                                                <Button type="primary" ghost className="cm-flex-center cm-no-border-button" size="small" onClick={() => {setFileList([]); setShowInput("")}}>
                                                                    <div className="cm-font-size12">Cancel</div>
                                                                </Button>
                                                                <Button type="primary" className="cm-flex-center" size="small" onClick={() => updateRecording()}>
                                                                    <Space size={10}>
                                                                        <div className="cm-font-size12">{submitState.text}</div>
                                                                        {
                                                                            submitState.loading && <Loading color="#fff" size='small'/>
                                                                        }
                                                                    </Space>
                                                                </Button>
                                                            </Space>
                                                        </Form>
                                                    :
                                                        <Dropdown menu={{items}} trigger={["click"]} placement='bottom'>
                                                            <Button className="cm-flex-center"icon={<MaterialSymbolsRounded font="video_call" size="20"/>}>
                                                                <Space>
                                                                    <div className="cm-font-size14">Add recording</div>
                                                                    <MaterialSymbolsRounded font='expand_more' size="20"/>
                                                                </Space>
                                                            </Button>
                                                        </Dropdown>
                                                )
                                        }
                                    </Col>

                                    <Col span={6} className="cm-font-size13 cm-font-fam500">Meeting Link:</Col>
                                    <Col span={18} >
                                        <Space className='cm-flex-space-between' size={30}>
                                            {
                                                actionPoint.meetingJoinLink ?
                                                    <Space className='cm-flex-align-center'>
                                                        <a target='_blank' href={actionPoint.meetingJoinLink}><Text style={{color: "#1677ff"}} >{actionPoint.meetingJoinLink}</Text></a>
                                                        {
                                                            CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app"
                                                            ?
                                                                null
                                                            :
                                                                <div style={{marginTop: "3px"}}>
                                                                    <MaterialSymbolsRounded className='cm-cursor-pointer' font={copyMeetLink ? 'done' : 'content_copy'} size='16' onClick={() => copyMeetingLink(actionPoint.meetingJoinLink)}/>
                                                                </div>
                                                        }
                                                    </Space>
                                                :
                                                <span className='cm-empty-text cm-font-size12'>Add a meeting link</span>
                                            }
                                        </Space>
                                    </Col>

                                    <Col span={6} className="cm-font-size13 cm-font-fam500">MoM:</Col>
                                    <Col span={18} >
                                        <div className='cm-font-size13 j-ap-meeting-note'>
                                            {
                                                actionPoint.meetingMom ?
                                                    <div className='cm-font-size14 cm-width100 cm-word-wrap-break' dangerouslySetInnerHTML={{__html: CommonUtil.__replaceURLInText(actionPoint.meetingMom)}}></div>
                                                :
                                                    <span className='cm-empty-text cm-font-size12'>No minutes of meeting found</span>
                                            }
                                        </div>
                                    </Col>

                                    <Col span={24}><Divider style={{marginBlock: "10px"}}/></Col>

                                    <Col span={6} className="cm-font-size13 cm-font-fam500">Calendar Link:</Col>
                                    <Col span={18}>
                                        {
                                            actionPoint.calendarInfo.link ?
                                                <Space className='cm-flex-align-center'>
                                                    <a target='_blank' href={actionPoint.calendarInfo.link}><Text style={{color: "#1677ff"}} >{actionPoint.calendarInfo.link}</Text></a>
                                                    {
                                                        CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app" || CommonUtil.__getSubdomain(window.location.origin) === "hs-app"
                                                        ?
                                                            null
                                                        :
                                                            <div style={{marginTop: "3px"}}>
                                                                <MaterialSymbolsRounded className='cm-cursor-pointer' font={copy ? 'done' : 'content_copy'} size='16' onClick={() => copyLink(actionPoint.calendarInfo.link)}/>
                                                            </div>
                                                    }
                                                </Space>
                                            :
                                                <span className='cm-empty-text cm-font-size12'>Add a calendar link</span>
                                        }
                                    </Col>

                                    <Col span={6} className="cm-font-size13 cm-font-fam500">Meeting Notes:</Col>
                                    <Col span={18} >
                                        <div className='j-ap-meeting-note'>
                                            {
                                                actionPoint.meetingNotes ?
                                                    <div className='cm-font-size14 cm-width100 cm-word-wrap-break' dangerouslySetInnerHTML={{__html: CommonUtil.__replaceURLInText(actionPoint.meetingNotes)}}></div>
                                                :
                                                    <span className='cm-empty-text cm-font-size12'>No notes found</span>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </>
                )

            case GOTO_URL:
                let url = actionPoint.resources[0]?.content?.url
                return (
                    <>
                        <div className='cm-width100 cm-flex-justify-end'>
                            <MaterialSymbolsRounded font='edit' size='17' className='cm-cursor-pointer' onClick={() => setEditMode(true)}/>
                        </div>
                        <Row gutter={[0, 20]} className='cm-margin-top10'>  
                            <Col span={4} className="cm-font-size13 cm-font-fam500 cm-flex-align-center">Link:</Col>
                            <Col span={20}> 
                                <div className="j-action-type-link-card cm-width100 cm-flex-space-between">
                                    <div className="j-action-type-link cm-font-size16 cm-font-fam500">
                                        {
                                            actionPoint.resources[0]?.title === "Untitled" ? 
                                                <a target='_blank' href={actionPoint.resources[0]?.content?.url} ><Text style={{color: "#1677ff"}} className='cm-font-size14'>{actionPoint.resources[0]?.content?.url}</Text></a>
                                            :
                                                <a target='_blank' href={actionPoint.resources[0]?.content?.url} ><Text style={{color: "#1677ff"}} className='cm-font-size14'>{actionPoint.resources[0]?.title}</Text></a>
                                        }
                                    </div>
                                    <div className="j-action-link-copy cm-cursor-pointer cm-flex-align-center">
                                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-padding10' font={copy ? 'done' : 'content_copy'} size='20' onClick={() => copyLink(url)}/>
                                    </div>
                                </div>
                            </Col>
                        </Row> 
                    </>
                )
        }
    }

    const getEditMode = (_actionType: string) => {
        switch (_actionType) {
            case BOOK_MEETING:
                return (
                    <>
                        <Form.Item name={"calendarLinkType"} initialValue={selectedValue} label={"Calendar Link"}>
                            <Select
                                size                =      'large'
                                suffixIcon          =       {<MaterialSymbolsRounded font="expand_more" size="18" />}
                                defaultValue        =       {selectedValue}
                                onChange            =       {handleSelectChange}
                                optionLabelProp     =       "label"
                                listHeight          =       {300}
                            >
                                <Option 
                                    value   =   {"OWNER_CALENDAR"}
                                    label   =   {
                                        <Space className="cm-font-size14 cm-flex-align-center">
                                            <MaterialSymbolsRounded className='j-action-point-link' font="link" size="20" />
                                            Current Owner's Link - <span className='cm-secondary-text'>Room owner's calendar link will be picked</span>
                                        </Space>
                                    }>
                                        <Space className="cm-font-size14 cm-flex-align-center">
                                            <MaterialSymbolsRounded className='j-action-point-link' font="link" size="20" />
                                            <div className='j-select-option'>
                                                Current Owner's Link
                                                <div style={{opacity:"67%"}} className='cm-secondary-text cm-font-size12'>Automatically picked current owner's link</div>
                                            </div>
                                        </Space>
                                </Option>
                                {
                                    rData && rData.room.users.length > 0 && 
                                        <>
                                            {rData.room.users.map((user: any) => (
                                                <Option 
                                                    key     =   {user.uuid} 
                                                    value   =   {user.uuid}
                                                    label   =   {
                                                        <Space direction='horizontal' className='cm-width100 cm-flex-space-between'>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar shape="square" size={30} src={user.profileUrl} />
                                                                    <Space style={{ marginLeft: '8px', display: 'flex' }}>
                                                                        <Text className="cm-font-size12" ellipsis={{ tooltip: CommonUtil.__getFullName(user.firstName, user.lastName) }} style={{ display: 'block', maxWidth: "200px" }}>{CommonUtil.__getFullName(user.firstName, user.lastName)}</Text>
                                                                        {
                                                                            user.calendarUrl ? 
                                                                                <>
                                                                                    <Text>-</Text>
                                                                                    <Text className="cm-font-size12" style={{ display: 'block', color: "#0176D3" }}>
                                                                                        {user.calendarUrl}
                                                                                    </Text>
                                                                                </>
                                                                            :
                                                                                null
                                                                        }
                                                                    </Space>
                                                            </div>
                                                        </Space>
                                                    }
                                                >
                                                    <Space direction='horizontal' style={{ height:'50px' }} className='cm-width100 cm-flex-space-between'>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar shape="square" size={30} src={user.profileUrl} />
                                                            <div style={{ marginLeft: '8px' }}>
                                                                <Text className="cm-font-size14" ellipsis={{ tooltip: user.firstName }} style={{ display: 'block', maxWidth: "450px" }}>{user.firstName}</Text>
                                                                {user.calendarUrl ? <Text className="cm-font-size12 cm-secondary-text" style={{ display: 'block', opacity:'67%'}}>{user.calendarUrl}</Text> : <Text className="cm-font-size12 cm-secondary-text" style={{ display: 'block', opacity:'67%'}}>No calendar link found</Text>}
                                                            </div>
                                                        </div>
                                                        <div className='cm-flex-align-center'>
                                                            {user.isOwner && <Tag color='blue'>Owner</Tag>}
                                                            {selectedValue === user.uuid && (
                                                                <MaterialSymbolsRounded font="check" size="30" color="primary" />
                                                            )}
                                                            </div>
                                                    </Space>
                                                </Option>
                                            ))}
                                        </>
                                }
                                <Option 
                                    value   =   {"STATIC_CALENDAR_LINK"}
                                    label   =   {
                                        <Space className="cm-font-size14 cm-flex-align-center">
                                            <MaterialSymbolsRounded className='j-action-point-link' font="link" size="20" />
                                            Custom Link - <span className='cm-secondary-text cm-font-size12' style={{opacity:"67%"}}>You can add any static calendar link</span>
                                        </Space>
                                    }
                                >

                                    <Space className="cm-font-size14 cm-flex-align-center">
                                        <MaterialSymbolsRounded className='j-action-point-link' font="link" size="20" />
                                        <div>
                                            Custom Link 
                                            <div style={{opacity:"67%"}} className='cm-secondary-text cm-font-size12'>You can add any static calendar link</div>
                                        </div>
                                    </Space>
                                </Option>
                            </Select>
                        </Form.Item>
                        {
                            selectedValue === "STATIC_CALENDAR_LINK" && (
                                <Form.Item name={"customCalendarLink"} rules={[{required: true, message: "Calendar link is required"}]} initialValue={actionPoint.calendarInfo.link}>
                                    <Input
                                        allowClear
                                        size        =   'large'
                                        placeholder =   {"Paste a calendar link"}
                                        prefix      =   {<MaterialSymbolsRounded font="link" size="20" />}
                                    />
                                </Form.Item>
                        )}
                        <Form.Item label={"Agenda"} name={"meetingNotes"} initialValue={actionPoint.meetingNotes}>
                            <TextArea showCount rows={5} placeholder='Enter the agenda for the meeting.'/>
                        </Form.Item>
                        <Form.Item label={"Meeting Link"} name={"meetingLink"} initialValue={actionPoint.meetingJoinLink} >
                            <Input allowClear placeholder={"Paste a meeting link"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} />
                        </Form.Item>
                        <Form.Item label={"Minutes of Meeting"} name={"minutesOfMeeting"} initialValue={actionPoint.meetingMom}>
                            <TextArea showCount rows={5} placeholder='Minutes of the meeting.'/>
                        </Form.Item>
                    </>
                )
        
            case GOTO_URL: 
                return (
                    <Form.Item name={"url"} rules={[{required: true, message: "Paste a Link", whitespace: true}]} initialValue={actionPoint.resources[0]?.content?.url} label={"Link"}>
                        <Input allowClear placeholder={"Paste a Link"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} />
                    </Form.Item>
                )
        }
    }

    return (
        <>
            <div className="j-ap-upload-action-layout">
                {
                    editMode
                    ?
                        <Form form={form} className='cm-form' layout='vertical' onFinish={onFinish} >
                            <Space direction='vertical' className='cm-width100'>
                                {
                                    getEditMode(actionType)
                                }
                            </Space>
                            <Space className='cm-width100 cm-margin-top20 cm-flex-justify-end'>
                                {
                                    (actionType === GOTO_URL && actionPoint.resources[0]?.content?.url)  || (actionType === BOOK_MEETING && actionPoint.meetingLink) ?
                                        <Form.Item noStyle>
                                            <Button className="cm-cancel-btn cm-flex-center" onClick={() => setEditMode(false)}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    :
                                        null                                
                                }
                                <Form.Item noStyle>
                                    <Button type="primary" className="cm-flex-center" htmlType='submit'>
                                        <Space size={10}>
                                            {saveState.text}
                                            {
                                                saveState.loading && <Loading color="#fff" size='small'/>
                                            }
                                        </Space>
                                    </Button>
                                </Form.Item>
                            </Space>
                        </Form>
                    :
                        getAction(actionType)
                }
            </div>
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": params.roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
        </>
    )
}

export default LinkAction