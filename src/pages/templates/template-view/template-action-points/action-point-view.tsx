import { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Space, Avatar, Tag, Input, Button, Form, Typography, TabsProps, message, Select, Badge, Divider, Layout, Menu, Tooltip } from "antd";

import { ACTION_POINT_TYPE_CONFIG, TEXT } from "../../../../buyer-view/pages/journey/config/action-point-type-config";
import { STAGE_STATUS_CONFIG, TODO } from "../../../../buyer-view/pages/journey/config/stage-status-config";
import { Length_Input, OWNER_LOGO } from "../../../../constants/module-constants";
import { TemplateActionPointContext } from "./template-action-point";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";

import StakeholderDropdown from "../../../../components/stakeholder-dropdown/stakeholder-dropdown";
import WarningConfirmation from "../../../../components/confirmation/warning-confirmation";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import UserQuickView from "../../../../buyer-view/components/user-quick-view";
import BuyerAvatar from "../../../../components/avatars/buyer-avatar";
import ActionItemInfo from "./action-item-info";
import Sider from "antd/es/layout/Sider";

const { Text }      =   Typography;
const { Option }    =   Select;
const { TextArea }  =   Input;
const { Content }   =   Layout;
const { useForm }   =   Form;

const TemplateActionPointView = () => {

    const { actionPoint, onClose }       =   useContext(TemplateActionPointContext);

    const roomOwner: _TypeUser = {
        firstName: "Room",
        lastName: "Owner",
        __typename: "AccountUserOutput",
        uuid: "_room_owner",
        emailId: "",
        profileUrl: OWNER_LOGO
    }

    const DueDate = [
        { key: 1,   label: "After 1 Day" },
        { key: 2,   label: "After 2 Days" },
        { key: 3,   label: "After 3 Days" },
        { key: 7,   label: "After 7 Days" },
        { key: 30,  label: "After 30 Days" },
        { key: 60,  label: "After 60 Days" },
        { key: 90,  label: "After 90 Days" },
        { key: "customdays", label: "Custom"}
    ];

    const [actionType, setActionType]           =   useState<any>(actionPoint.type ? actionPoint.type : TEXT) 
    const [activeTab, setActiveTab]             =   useState("details");
    const [selectedOption, setSelectedOption]   =   useState(!actionPoint.dueInDays ? undefined : (DueDate.map((date) => date.key).includes(actionPoint.dueInDays) ? actionPoint.dueInDays : "customdays"));
    const [assignedUsers, setAssignedUsers]     =   useState<_TypeUser[]>(actionPoint.properties.ownerAsAssignee ? [...actionPoint.assignedSellers, roomOwner] : actionPoint.assignedSellers);

    useEffect(() => {
        setActionType(actionPoint.type ?? TEXT)
    }, [actionPoint.type])

    const descriptionRef: any       =   useRef(null);

    const [form]                    =   useForm();

    const { $sellers }             =   useContext(GlobalContext);

    const [editDesc, setEditDesc]   =   useState(false);
    const [editTitle, setEditTitle] =   useState(false);

    const [confirmationState, setConfirmationState] =   useState({
        visibility  :   false,
        type        :   ""
    });

    const handleDescUpdate = () => {
        setEditDesc(false)
        RoomTemplateAgent.updateActionPoint({
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

    const handleTitleUpdate = () => {
        RoomTemplateAgent.updateActionPoint({
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

    const addUser = (user: any) => {
        setAssignedUsers((prev) => [...(prev || []), user]);
        if(user.uuid === "_room_owner"){
            RoomTemplateAgent.updateActionPoint({
                variables: {
                    actionPointUuid :   actionPoint.uuid,
                    input           :   {
                        properties  :   {
                            ownerAsAssignee :   true
                        }
                    },
                },
                onCompletion: () => {
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                } 
            })
            return  
        }
        let input: any = {
            actionPointUuid : actionPoint.uuid,   
        }

        if(user.__typename === "AccountUserOutput"){
            input["sellersUuid"]    =   [user.uuid]
            input["buyersUuid"]     =   []

            if(user.uuid === "_room_owner"){
                input["ownerAsAssignee"]    =   true
            }

        }else{
            input["buyersUuid"]     =   [user.uuid]
            input["sellersUuid"]    =   []
        }

        RoomTemplateAgent.addRoomTemplateActionPointAssignees({
            variables: input,
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const ActionTabs: TabsProps['items'] = [];

    let details =  {
        key         :   'details',
        label       :   'Details',
        children    :   <ActionItemInfo actionType={actionType} setActionType={setActionType}/>
    }

    if(actionPoint.type && actionPoint.type !== TEXT){
        ActionTabs.unshift(details)
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

    const handleActionTypeChange = (key: string) => {
        const messageLoading = message.loading("Updating Action Point type", 0)
        RoomTemplateAgent.updateActionPointType({
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
                messageLoading()
                CommonUtil.__showSuccess("Action Point type updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const removeUser = (user: any) => {
        setAssignedUsers((prev) => prev.filter((ru) => ru.uuid !== user.uuid))
        if(user.uuid === "_room_owner"){
            RoomTemplateAgent.updateActionPoint({
                variables: {
                    actionPointUuid :   actionPoint.uuid,
                    input           :   {
                        properties  :   {
                            ownerAsAssignee :   false
                        }
                    },
                },
                onCompletion: () => {

                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }   
            })
            return
        }   
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

        RoomTemplateAgent.removeRoomTemplateActionPointAssignees({
            variables: input,
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleIconClick = (component: string) => {
        setActiveTab(component);
    };

    const handleDueDateChange = (value: any) => {
        setSelectedOption(value)
        RoomTemplateAgent.updateActionPointDueInDays({
            variables: {
                actionPointUuid: actionPoint.uuid,
                dueInDays: value ? (value === "customdays" ? 1 : parseInt(value)) : undefined
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleInputChange = (event: any) => {
        if(event.target.value){
            RoomTemplateAgent.updateActionPointDueInDays({
                variables: {
                    actionPointUuid: actionPoint.uuid,
                    dueInDays: parseInt(event.target.value)
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const moveRoomOwnerToTop = (obj: _TypeUser[]) => {
        const items = obj;
        const index = obj.findIndex(item => item.uuid === "_room_owner");
        if (index !== -1) {
            const [item] = items.splice(index, 1);
            items.unshift(item);
        }
        return obj;
    };

    return (
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
                                            <Input required={true} maxLength={Length_Input}  bordered={false} autoFocus style={{width : "350px", padding: "0px", fontSize: "16px"}}/>
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
                                    <Tag bordered={false} style={{ backgroundColor: STAGE_STATUS_CONFIG[actionPoint.status].backgroundColor, color: STAGE_STATUS_CONFIG[actionPoint.status].tag}}>
                                        {STAGE_STATUS_CONFIG[actionPoint.status].displayName}
                                    </Tag>
                                :
                                    <Tag bordered={false} style={{backgroundColor: STAGE_STATUS_CONFIG[TODO].backgroundColor, color: STAGE_STATUS_CONFIG[TODO].tag}}>
                                        {STAGE_STATUS_CONFIG[TODO].displayName}
                                    </Tag>
                            }
                        </div>
                    </Space>
                </div>
                <Divider style={{margin: 0}}/>
                <Row className="j-action-view-action-bar cm-flex-space-between">
                    <Col span={7}>
                        <Space direction="vertical">
                            <span className="cm-font-size13">Action type</span>
                            <Form form={form} className="cm-form">
                                <Form.Item name={"actionType"} initialValue={actionType}>
                                    <Select placeholder="Action type" style={{width: "180px", height: "35px"}} size="large" onChange={handleChange} optionLabelProp="label" popupMatchSelectWidth={false} popupClassName="j-action-select-dropdown" className="j-action-select" suffixIcon={<MaterialSymbolsRounded font="expand_more" size="18"/>}>
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
                    <Col span={12}>
                        <Space direction="vertical">
                            <Tooltip placement="bottom" title={`Action item due dates are automatically set for ${actionPoint.dueInDays ? actionPoint.dueInDays : "the selected "} days after the room is created.`}><Space size={4}><div className="cm-font-size13">Due Date</div> <div style={{cursor: "help"}}><MaterialSymbolsRounded font="info" size="14"/></div></Space></Tooltip>
                            <Form form={form} className="cm-form">
                                <Space>
                                    <Form.Item name={"dueDays"} initialValue={!actionPoint.dueInDays ? undefined : (DueDate.map((date) => date.key).includes(actionPoint.dueInDays) ? actionPoint.dueInDays : "customdays")}>
                                        <Select
                                            style           =   {{ width: 200, height: "35px" }}
                                            onChange        =   {(value) => {handleDueDateChange(value)}}
                                            suffixIcon      =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                            placeholder     =   "Setup due date"
                                            allowClear
                                        >
                                            { DueDate.map((_duedate: any) => (
                                                <Option key={_duedate.key} value={_duedate.key}>{_duedate.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    {selectedOption === "customdays" && (
                                        <Form.Item name={"dueDatedays"} initialValue={actionPoint.dueInDays ? actionPoint.dueInDays : 1}>
                                            <Input
                                                suffix      =   {'Days'}
                                                style       =   {{ width: 100 , height: "35px"}}
                                                placeholder =   "1"
                                                type        =   "number"
                                                min         =   {1}
                                                onChange    =   {(event) => handleInputChange(event)}
                                            />
                                        </Form.Item>
                                    )}
                                </Space> 
                            </Form>
                        </Space>
                    </Col>
                    <Col span={5}>
                        <Space direction="vertical" size={12}>
                            <span className="cm-font-size13">Assigned to</span>
                            <Space>
                                <Avatar.Group className='j-action-avatar-group cm-flex-align-center' max={{count: 5}} size={27}>
                                    {
                                        assignedUsers.map((_assignedSeller: any) => (
                                            <UserQuickView key={_assignedSeller.uuid} user={_assignedSeller}>
                                                <Badge offset={[10, 10]} className="j-action-point-seller-avatar cm-cursor-pointer" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation() ,removeUser(_assignedSeller)}}/>}>
                                                    <BuyerAvatar buyer={_assignedSeller} size={28} fontSize={12}/>
                                                </Badge>
                                            </UserQuickView> 
                                        ))
                                    }
                                </Avatar.Group>
                                <StakeholderDropdown 
                                    sellers             =   {moveRoomOwnerToTop($sellers.concat(roomOwner))}
                                    selectedSellers     =   {assignedUsers.filter((user) => user.__typename === "AccountUserOutput")}
                                    selectedBuyers      =   {assignedUsers.filter((user) => user.__typename === "ContactOutput")}
                                    onSelect            =   {addUser}
                                />
                            </Space>
                        </Space>
                    </Col>
                </Row>
                <Divider orientation="left" style={{marginBlock: "0px"}}/>
                {
                    <Layout className="j-action-point-slider-details-layout">
                        <Content>
                            { activeTab === 'details' && <ActionItemInfo actionType={actionType} setActionType={setActionType}/>}
                        </Content>
                        <Sider width='60px' className="j-buyer-action-view-menu">
                            <Menu style={{height: "100%", position: "absolute"}} defaultSelectedKeys={['1']}>
                                <Menu.Item className="cm-flex-center" onClick={() => handleIconClick('details')} key={1}><MaterialSymbolsRounded font="info" size="18"/></Menu.Item>
                            </Menu>
                        </Sider>
                    </Layout>
                }
            </div>
            <WarningConfirmation
                isOpen  =   {confirmationState.visibility}
                onOk    =   {() => handleActionTypeChange(confirmationState.type)}
                onCancel=   {() => {form.setFieldsValue({["actionType"]: actionPoint.type ? actionPoint.type : TEXT}); setConfirmationState({visibility: false, type: ""})}}
                header  =   {"Change Action Point type"}
                body    =   {"Changing Action Point type will delete all the files uploaded in this Action Point!"}
                okText  =   {"Change"}  
            />
        </>
    )
}

export default TemplateActionPointView
