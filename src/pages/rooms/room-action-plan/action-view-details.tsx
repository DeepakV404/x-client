import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button, Col, DatePicker, Divider, Dropdown, Form, Input, Layout, Menu, MenuProps, Row, Select, Space, Tag, Typography, message} from "antd"
import dayjs from "dayjs";

import { ACTION_POINT_TYPE_CONFIG, TEXT } from "../../../buyer-view/pages/journey/config/action-point-type-config";
import { STAGE_STATUS_CONFIG, TODO } from "../../../buyer-view/pages/journey/config/stage-status-config";
import { Length_Input } from "../../../constants/module-constants";
import { AccountsAgent } from "../../accounts/api/accounts-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { Content } from "antd/es/layout/layout";
import { useRoom } from "../room-collaboration";
import { RoomsAgent } from "../api/rooms-agent";
import { ActionPointViewContext } from ".";

import StakeholderDropdown from "../../../components/stakeholder-dropdown/stakeholder-dropdown";
import WarningConfirmation from "../../../components/confirmation/warning-confirmation";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UserQuickView from "../../../buyer-view/components/user-quick-view";
import BuyerAvatar from "../../../components/avatars/buyer-avatar";
import ActionViewComment from "./action-view-comments";
import ActionItemInfo from "./action-item-info";
import Sider from "antd/es/layout/Sider";
import { useSearchParams } from "react-router-dom";

const { useForm }   =   Form;
const { TextArea }  =   Input;
const { Text }      =   Typography;
const { Option }    =   Select;

const ActionViewDetails = (props: {onClose: () => void, totalComments: number}) => {

    const { onClose, totalComments }   =   props;

    const { actionPoint }   =   useContext(ActionPointViewContext);    

    const { room }          =   useRoom();

    const $roomBuyers       =   room.buyers;
    
    const { $sellers }      =   useContext(GlobalContext)

    const [searchParams]    =   useSearchParams();

    let latestMessageId     =   searchParams.get("message") || null;

    const [activeTab, setActiveTab]     =   useState(latestMessageId ? "comments" : "details");

    const [form]                        =   useForm();

    const descriptionRef: any           =   useRef(null);
    
    const [editTitle, setEditTitle]         =   useState(false);
    const [editDesc, setEditDesc]           =   useState(false);
    const [assignedUsers, setAssignedUsers] =   useState<_TypeUser[]>(actionPoint.assignedBuyers.concat(actionPoint.assignedSellers))

    const [confirmationState, setConfirmationState] =   useState({
        visibility  :   false,
        type        :   ""
    });
    
    const [actionType, setActionType]               =   useState<any>(actionPoint.type ? actionPoint.type : TEXT) 

    const handleIconClick = (component: string) => {
        setActiveTab(component === 'details' ? 'details' : 'comments');
    };

    useEffect(() => {
        setActionType(actionPoint.type ?? TEXT)
    }, [actionPoint.type])

    const statusItems: MenuProps['items'] = [];

    Object.values(STAGE_STATUS_CONFIG).map((_status: any) => {
        let statusOption: any = {
            "key"       :   _status.key,
            "title"     :   _status.displayName,
            "label"     :   
                <Tag bordered={false} style={{backgroundColor: STAGE_STATUS_CONFIG[_status.key].backgroundColor, color:STAGE_STATUS_CONFIG[_status.key].tag}}>
                    {STAGE_STATUS_CONFIG[_status.key].displayName}
                </Tag>
            ,
            "onClick"   :   (_status: any) => {
                AccountsAgent.updateActionPointStatus({
                    variables: {
                        actionPointsUuid    :   [actionPoint.uuid],
                        status              :   _status.key
                    },
                    onCompletion: () => {
                        CommonUtil.__showSuccess("Status updated successfully")
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
                
            }
        } 
        statusItems.push(statusOption)
    })

    const customFormat  =   (value: any) => `${CommonUtil.__getDateDay(new Date(dayjs(value).valueOf()))}, ${new Date(dayjs(value).valueOf()).getFullYear()}`;

    const disabledDate = (current: any) => {
        const currentDate = dayjs();
        return current && current < currentDate.startOf('day');
    }

    const handleTitleUpdate = () => {
        AccountsAgent.updateActionPoint({
            variables: {
                actionPointUuid: actionPoint.uuid,
                input: {
                    title:    form.getFieldsValue().title
                }
            },
            onCompletion: () => {
                setEditTitle(false)
                CommonUtil.__showSuccess("Title updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }

        })
    }

    const removeUser = (user: any) => {
        setAssignedUsers((prev) => prev.filter((ru) => ru.uuid !== user.uuid))
        let input: any = {
            actionPointUuid: actionPoint.uuid
        }

        if(user.__typename === "AccountUserOutput"){
            input["sellersUuid"]    =   [user.uuid]
            input["buyersUuid"]     =   []
        }else{
            input["buyersUuid"]     =   [user.uuid]
            input["sellersUuid"]    =   []
        }

        AccountsAgent.removeActionPointAssignees({
            variables: input,
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDueChange = (value: any) => {
        AccountsAgent.updateActionPointDue({
            variables: {
                actionPointsUuid    :   [actionPoint.uuid],
                dueAt               :   new Date(value).valueOf()
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Due date updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDescUpdate = () => {
        setEditDesc(false)
        AccountsAgent.updateActionPoint({
            variables: {
                actionPointUuid: actionPoint.uuid,
                input: {
                    description:    descriptionRef?.current?.resizableTextArea.textArea.value
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Description updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }

        })
    }

    const handleActionTypeChange = (key: string) => {
        const messageLoading = message.loading("Updating Action Point type", 0)
        RoomsAgent.updateActionPointType({
            variables: {
                actionPointUuid :    actionPoint.uuid,
                type            :   key
            },
            onCompletion: () => {
                setConfirmationState({
                    visibility  :   false,
                    type        :   key
                })
                setActionType(key)
                setActiveTab("details")
                messageLoading()
                CommonUtil.__showSuccess("Action Point type updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleChange = (key: string) => {
        if(!actionType){
            handleActionTypeChange(key)
        }else{
            setConfirmationState({
                visibility  :   true,
                type        :   key
            })
        }
    }

    const addUser = (user: any) => {
        setAssignedUsers((prev) => [...(prev || []), user]);
        let input: any = {
            actionPointUuid : actionPoint.uuid,   
        }

        if(user.__typename === "AccountUserOutput"){
            input["sellersUuid"]    =   [user.uuid]
            input["buyersUuid"]     =   []
        }else{
            input["buyersUuid"]     =   [user.uuid]
            input["sellersUuid"]    =   []
        }

        RoomsAgent.addActionPointAssignees({
            variables: input,
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return(
        <>
            <div className="cm-width100 cm-height100">
                <div className="j-slider-push-close cm-flex-align-center">
                    <MaterialSymbolsRounded font="keyboard_tab" size="22" onClick={onClose} className="cm-cursor-pointer cm-flex"/>
                </div>
                <div className="j-action-slider-view-header cm-flex-space-between">
                    <Space direction="vertical">
                        <Space className="j-action-view-title" size={20}>
                            {
                                editTitle
                                ?
                                    <Form form={form} onFinish={handleTitleUpdate}>
                                        <Form.Item noStyle name={"title"} rules={[{required: true, whitespace: true}]} initialValue={actionPoint.title}>
                                            <Input required={true} maxLength={Length_Input} bordered={false} autoFocus style={{width : "350px", padding: "0px", fontSize: "16px"}}/>
                                        </Form.Item>
                                    </Form>
                                :
                                    <Text className="cm-font-size16 cm-font-fam500" style={{ maxWidth: "300px"}} ellipsis={{tooltip: actionPoint.title}}>{actionPoint.title}</Text>
                            }
                            {
                                editTitle ?
                                    <Space>
                                        <Button type="primary" size="small" className="cm-flex-center" onClick={() => handleTitleUpdate()} style={{boxShadow: "none"}}>
                                            <div className="cm-font-size12">Save</div>
                                        </Button>
                                        <Button type="primary" ghost size="small" className="cm-flex-center" onClick={() => setEditTitle(false)} style={{border: "none"}}>
                                            <div className="cm-font-size12">Cancel</div>
                                        </Button>
                                    </Space>
                                :
                                    <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer cm-light-text" onClick={() => setEditTitle(true)}/>
                            }
                        </Space>
                        <Space size={20}>
                            {
                                editDesc ?
                                    <TextArea autoSize autoFocus style={{paddingLeft: "0px", width: "350px", maxHeight: "150px", overflowY: "scroll"}} ref={descriptionRef} placeholder="Enter a description" defaultValue={actionPoint.description} bordered={false}/>
                                :
                                
                                    actionPoint.description
                                    ?
                                        <Text className="j-action-view-desc cm-font-size12 cm-font-fam400" style={{maxWidth: "400px", maxHeight: "150px"}} ellipsis={{tooltip: actionPoint.description}}>{actionPoint.description}</Text>
                                    :
                                        <span className="cm-font-size12 cm-light-text">No description found</span>
                                    
                            }
                            {
                                editDesc ?
                                    <Space>
                                        <Button type="primary" size="small" className="cm-flex-center" onClick={() => handleDescUpdate()} style={{boxShadow: "none"}}>
                                            <div className="cm-font-size12">Save</div>
                                        </Button>
                                        <Button type="primary" ghost size="small" className="cm-flex-center" onClick={() => setEditDesc(false)} style={{border: "none"}}>
                                            <div className="cm-font-size12">Cancel</div>
                                        </Button>
                                    </Space>
                                :
                                    <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer cm-light-text" onClick={() => setEditDesc(true)}/>
                            }
                        </Space>
                    </Space>
                    <Space>
                        {!editTitle && actionPoint.category === "INTERNAL" && <Tag className={`j-seller-ap-internal-tag is-internal`} style={{height: "fit-content"}}>Internal</Tag>}
                        <div className="j-action-view-status">
                            {
                                actionPoint.status ?
                                    <Dropdown menu={{items: statusItems}} trigger={["click"]} >
                                        <Space size={0} className="cm-cursor-pointer">
                                            <Tag bordered={false} style={{ backgroundColor: STAGE_STATUS_CONFIG[actionPoint.status].backgroundColor, color: STAGE_STATUS_CONFIG[actionPoint.status].tag}}>
                                                {STAGE_STATUS_CONFIG[actionPoint.status].displayName}
                                            </Tag>
                                            <MaterialSymbolsRounded font="expand_more" size="16"/>
                                        </Space>
                                    </Dropdown>
                                :
                                    <Dropdown menu={{items: statusItems}} trigger={["click"]}>
                                        <Space size={0} className="cm-cursor-pointer">
                                            <Tag bordered={false} style={{backgroundColor: STAGE_STATUS_CONFIG[TODO].backgroundColor, color: STAGE_STATUS_CONFIG[TODO].tag}}>
                                                {STAGE_STATUS_CONFIG[TODO].displayName}
                                            </Tag>
                                            <MaterialSymbolsRounded font="expand_more" size="16"/>
                                        </Space>
                                    </Dropdown>
                            }
                        </div>
                    </Space>
                </div>
                <Divider style={{margin: 0}}/>
                <Row className="j-action-view-action-bar cm-flex-center">
                    <Col span={9}>
                        <Space direction="vertical" size={9}>
                            <span className="cm-font-size13">Action type</span>
                            <Form form={form} className="cm-form">
                                <Form.Item name={"actionType"} initialValue={actionType}>
                                    <Select placeholder="Action type" style={{width: "180px", height: "35px"}} size="large" onChange={handleChange} optionLabelProp="label" popupMatchSelectWidth={false} popupClassName="j-action-select-dropdown" className="j-action-select" suffixIcon={<MaterialSymbolsRounded font="expand_more" size="20"/>}>
                                        {
                                            Object.values(ACTION_POINT_TYPE_CONFIG).map((_actionPointType) => (
                                                <Option key={_actionPointType.key} label={<Space className="cm-flex"><MaterialSymbolsRounded font={_actionPointType.iconName} size="18"/><div className="cm-font-size14">{_actionPointType.displayName}</div></Space>} >
                                                    <Space size={15}>
                                                        <MaterialSymbolsRounded font={_actionPointType.iconName} size="20" />
                                                        <Space direction="vertical" size={0}>
                                                            <div className="cm-font-fam500">{_actionPointType.displayName}</div>
                                                            <div className="cm-font-size12 cm-light-text">{_actionPointType.desc}</div>
                                                        </Space>
                                                    </Space>
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space direction="vertical" size={9}>
                            <span className="cm-font-size13">Due date</span>
                            <Form className="cm-form">
                                <Form.Item>
                                    <DatePicker bordered={false} defaultValue={actionPoint.dueAt ? dayjs(actionPoint.dueAt) : undefined} placeholder="Select Date" className="cm-cursor-pointer j-ap-date-picker" allowClear={!!actionPoint.dueAt} format={customFormat} disabledDate={disabledDate} suffixIcon={!actionPoint.dueAt ? <MaterialSymbolsRounded font="calendar_month" size="18" color="#000"/> : <></>} onChange={handleDueChange} style={{minWidth: "206px"}}/>
                                </Form.Item>
                            </Form>
                        </Space>
                    </Col>
                    <Col span={7}>
                        <Space direction="vertical" size={15}>
                            <span className="cm-font-size13">Assigned to</span>
                            <Form className="cm-form">
                                <Form.Item>
                                    <Space>
                                        <Avatar.Group maxCount={5} size={27} className="j-action-avatar-group">
                                            {
                                                assignedUsers.map((_assignedBuyer: any) => (
                                                    <UserQuickView key={_assignedBuyer.uuid} user={_assignedBuyer}>
                                                        <Badge offset={[10, 10]} className="j-action-point-seller-avatar cm-cursor-pointer" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation(); removeUser(_assignedBuyer)}}/>}>
                                                            <BuyerAvatar buyer={_assignedBuyer} size={25} fontSize={12}/>
                                                        </Badge>
                                                    </UserQuickView>
                                                ))
                                            }
                                        </Avatar.Group>
                                        <StakeholderDropdown 
                                            sellers             =   {$sellers}
                                            buyers              =   {$roomBuyers}
                                            selectedSellers     =   {assignedUsers.filter((user) => user.__typename === "AccountUserOutput")}
                                            selectedBuyers      =   {assignedUsers.filter((user) => user.__typename === "ContactOutput")}
                                            onSelect            =   {addUser}
                                        />  
                                    </Space>                 
                                </Form.Item>
                            </Form>
                        </Space>
                    </Col>
                </Row>
                <Divider orientation="left" style={{marginBlock: "0px"}}/>
                <Layout className="j-action-point-slider-details-layout">
                    <Content>
                        { activeTab === 'details' && 
                            <ActionItemInfo actionType={actionType} setActionType={setActionType}/>
                        }
                        { activeTab === 'comments' && 
                            <div className="j-action-point-comment-container cm-padding-right10">
                                <Space>Comments {totalComments > 0 && <span className="cm-font-size12 cm-dark-grey-text">({totalComments})</span> }</Space>
                                <ActionViewComment sellers={$sellers} buyers={$roomBuyers} room={room} latestMessageId={latestMessageId}/>
                            </div>
                        }
                    </Content>
                    <Sider width='60px' className="j-buyer-action-view-menu">
                        <Menu style={{height: "100%", position: "absolute"}}  selectedKeys={[activeTab]}>
                            <Menu.Item className="cm-flex-center" onClick={() => handleIconClick('details')} key={"details"}><MaterialSymbolsRounded font="info" size="18"/></Menu.Item>
                            <Menu.Item className="cm-flex-center" onClick={() => handleIconClick('comments')} key={"comments"}><MaterialSymbolsRounded font="comment" size="18"/></Menu.Item>
                        </Menu>
                    </Sider>
                </Layout>
            </div>
            <WarningConfirmation
                isOpen  =   {confirmationState.visibility}
                onOk    =   {() => handleActionTypeChange(confirmationState.type)}
                onCancel=   {() => {form.setFieldsValue({["actionType"]: actionPoint.type}); setConfirmationState({visibility: false, type: ""})}}
                header  =   {"Change Action Point type"}
                body    =   {"Changing Action Point type will delete all the files uploaded in this Action Point!"}
                okText  =   {"Change"}  
            />
        </>
    )
}

export default ActionViewDetails