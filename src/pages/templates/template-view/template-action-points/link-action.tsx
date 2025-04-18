import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, Col, Form, Input, Row, Select, Space, Tag, Typography, message } from 'antd';

import { BOOK_MEETING, GOTO_URL } from '../../../../buyer-view/pages/journey/config/action-point-type-config';
import { TemplateActionPointContext } from './template-action-point';
import { RoomTemplateAgent } from '../../api/room-template-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import Loading from '../../../../utils/loading';

const { useForm }   =   Form;
const { TextArea }  =   Input;
const { Text }      =   Typography;
const { Option }    =   Select;

const LinkAction = (props: {actionType: string}) => {

    const { actionType }    =   props;

    const { roomTemplateId }    =   useParams();
    const [form]                =   useForm();
    const { actionPoint }       =   useContext(TemplateActionPointContext);
    const { $sellers }          =   useContext(GlobalContext);

    const [copy, setCopy]                               =   useState(false);
    const [saveState, setSaveState]                     =   useState({
        text        :   "Save",
        loading     :   false
    });
    
    const [editMode, setEditMode]                       =   useState((actionPoint.type === BOOK_MEETING && (actionPoint.meetingLink || actionPoint.meetingLink === "")) || (actionPoint.type === GOTO_URL && actionPoint.resources[0]?.content.url) ? false : true);

    const [selectedValue, setSelectedValue]             =   useState(actionPoint.calendarInfo.type === "OWNER_CALENDAR" ? "OWNER_CALENDAR" : (actionPoint.calendarInfo.type === "STATIC_CALENDAR_LINK" ? "STATIC_CALENDAR_LINK" : actionPoint.calendarInfo.linkedUser.uuid));

    const handleSelectChange = (value: any) => {
        setSelectedValue(value);
    };

    const onFinish = (values: any) => {
        setSaveState({
            loading :   true,
            text    :   "Saving..."
        })
        let messageLoading = message.loading("Updating action point..." , 0)
        if(actionType === BOOK_MEETING){

            let meetingInput: any = {
                templateUuid    :   roomTemplateId, 
                actionPointUuid :   actionPoint.uuid, 
                meetingNotes    :   values.meetingNotes
            }


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

            meetingInput["calendarInfoInput"] = calendarInfoInput

            RoomTemplateAgent.rtUpdateMeetingTypeInActionPoint({
                variables: meetingInput,
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

            let normalizedUrl = values.url.trim();
            if (!normalizedUrl.startsWith("https://")) {
                normalizedUrl = `https://${normalizedUrl}`;
            }

            RoomTemplateAgent.rtUpdateLinkResourceInActionPoint({
                variables: {
                    templateUuid    :   roomTemplateId, 
                    actionPointUuid :   actionPoint.uuid, 
                    type            :   GOTO_URL, 
                    url             :   normalizedUrl
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

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    const getAction = (_actionType: string) => {
        switch (_actionType) {
            case BOOK_MEETING:
                return (
                    <>
                        <div className="cm-width100 cm-flex-justify-end">
                            <MaterialSymbolsRounded font='edit' size='17' className='cm-cursor-pointer' onClick={() => setEditMode(true)}/>
                        </div>
                        <Row gutter={[0, 20]} className='cm-margin-top10'>
                            <Col span={6} className="cm-font-size13 cm-font-fam500 cm-flex-align-center">Calendar Link</Col>
                            <Col span={18} >
                                {
                                    actionPoint.calendarInfo.type === "OWNER_CALENDAR" ?
                                        <span className='cm-secondary-text cm-font-size12' style={{fontStyle: "italic"}}>Owner's calendar will be mapped</span>
                                    :
                                        <Space className="j-action-type-link-card cm-width100 cm-flex-space-between" size={0}>
                                            {
                                                actionPoint.calendarInfo.link ?
                                                    <>
                                                        <div className="j-action-type-link cm-font-size16 cm-font-fam500">
                                                            <a target='_blank' href={actionPoint.calendarInfo.link} ><Text style={{color: "#1677ff"}} className='cm-font-size14'>{actionPoint.calendarInfo.link}</Text></a>
                                                        </div>
                                                        <div className="cm-cursor-pointer">
                                                            <MaterialSymbolsRounded className='cm-cursor-pointer cm-padding10' font={copy ? 'done' : 'content_copy'} size='16' onClick={() => copyLink(actionPoint.calendarInfo.link)}/>
                                                        </div>       
                                                    </>
                                                :
                                                    <div className='cm-light-text cm-padding10 cm-font-size12'>No calendar link found</div>
                                            }
                                        </Space>
                                }
                            </Col>
                            <Col span={6} className="cm-font-size13 cm-font-fam500">Meeting Notes</Col>
                            <Col span={18} >
                                <div className='cm-font-size13 j-ap-meeting-note'>
                                    {
                                        actionPoint.meetingNotes ?
                                            actionPoint.meetingNotes
                                        :
                                            <span className='cm-empty-text cm-font-size12'>No notes found</span>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </>
                )
        
            case GOTO_URL:

                let normalizedUrl = actionPoint?.resources[0]?.content?.url.trim();
                if (!normalizedUrl?.startsWith("https://")) {
                    normalizedUrl = `https://${normalizedUrl}`;
                }
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
                                                <a target='_blank' href={normalizedUrl} ><Text style={{color: "#1677ff"}} className='cm-font-size14'>{normalizedUrl}</Text></a>
                                            :
                                                <a target='_blank' href={normalizedUrl} ><Text style={{color: "#1677ff"}} className='cm-font-size14'>{actionPoint.resources[0]?.title}</Text></a>
                                        }
                                    </div>
                                    <div className="j-action-link-copy cm-cursor-pointer cm-flex-align-center">
                                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-padding10' font={copy ? 'done' : 'content_copy'} size='20' onClick={() => copyLink(normalizedUrl)}/>
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
                                            Current Owner's Link - <span className='cm-secondary-text cm-font-size12' style={{opacity:"67%"}}>Room owner's calendar link will be picked</span>
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
                                    <>
                                        {$sellers.filter((_seller: any) => _seller.status !== "DELETED").map((user: any) => (
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
                        <Form.Item label={"Meeting notes"} name={"meetingNotes"} initialValue={actionPoint.meetingNotes}>
                            <TextArea rows={5} placeholder='Enter the agenda for the meeting.'/>
                        </Form.Item>
                    </>
                )
        
            case GOTO_URL: 
                return (
                    <Form.Item name={"url"} rules={[{required: true, message: "Paste a link", whitespace: true}]} initialValue={actionPoint.resources[0]?.content?.url} label={"Link"}>
                        <Input allowClear placeholder={"Paste a link"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} />
                    </Form.Item>
                )
        }
    }

    return (
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
                        <Space className='cm-width100 cm-flex-justify-end'>
                            {
                                (actionType === GOTO_URL && actionPoint.resources[0]?.content?.url)  || (actionType === BOOK_MEETING && actionPoint.meetingLink) ?
                                    <Form.Item noStyle>
                                        <Button className="cm-cancel-btn cm-flex-center cm-margin-bottom10" onClick={() => setEditMode(false)}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                :
                                    null                                
                            }
                            <Form.Item noStyle>
                                <Button type="primary" className="cm-flex-center cm-margin-bottom10" htmlType='submit'>
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
    )
}

export default LinkAction