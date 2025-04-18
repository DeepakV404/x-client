import { FC, useContext, useEffect, useState } from "react";
import { Avatar, Badge, Checkbox, Form, Popconfirm, Space, Tag, Tooltip, Typography, message } from "antd";

import { COMPLETED } from "../../../buyer-view/pages/journey/config/stage-status-config";
import { RoomTemplateAgent } from "../../templates/api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";

import StakeholderDropdown from "../../../components/stakeholder-dropdown/stakeholder-dropdown";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UserQuickView from "../../../buyer-view/components/user-quick-view";
import SellerAvatar from "../../../components/avatars/seller-avatar";
import BuyerAvatar from "../../../components/avatars/buyer-avatar";
import { PermissionCheckers } from "../../../config/role-permission";
import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { OWNER_LOGO } from "../../../constants/module-constants";

const { useForm }   =   Form;
const { Text }      =   Typography
interface ActionItemCardProps
{
    provided        :   any;
    actionName      :   string;
    actionId        :   string;
    dueDate         :   number;
    actionItem      :   any;
    onClick         :   (arg0: string) => void;
    status          :   string;
    stakeHolders    :   any[];
    checkBox?       :   boolean
}

const ActionItemCard: FC<ActionItemCardProps> = (props) => {

    const { provided, actionName, actionId, onClick, status, actionItem, checkBox }   =   props;

    const { $sellers, $user }               =   useContext(GlobalContext);

    const TemplateEditPermission            =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const roomOwner: _TypeUser = {
        firstName: "Room",
        lastName: "Owner",
        __typename: "AccountUserOutput",
        uuid: "_room_owner",
        emailId: "",
        profileUrl: OWNER_LOGO
    }

    const [form]                                        =   useForm();
    const [checked, setChecked]                         =   useState(false);
    const [category, setCategory]                       =   useState(actionItem.category);
    const [assignedUsers, setAssignedUsers]             =   useState<_TypeUser[]>(actionItem.properties.ownerAsAssignee ? [...actionItem.assignedSellers, roomOwner] : actionItem.assignedSellers);

    useEffect(() => {
        if(actionItem.properties.ownerAsAssignee) setAssignedUsers(() => [...actionItem.assignedSellers, roomOwner]) 
        else setAssignedUsers(() => [...actionItem.assignedSellers])  
    }, [actionItem])

    useEffect(() => {
        setChecked(status === COMPLETED)
        form.setFieldsValue({
            [actionId]   :   status === COMPLETED
        })
    }, [status])

    const removeUser = (value: any) => {
        setAssignedUsers((prevAssignedUsers) => prevAssignedUsers.filter((userToBeRemoved) => userToBeRemoved.uuid !== value))  
        if(value === "_room_owner"){
            RoomTemplateAgent.updateActionPoint({
                variables: {
                    actionPointUuid :   actionId,
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
        RoomTemplateAgent.removeRoomTemplateActionPointAssignees({
            variables: {
                actionPointUuid: actionId, 
                sellersUuid: [value]
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleCheckChange = (event: any) => {        
        event.stopPropagation()
        setChecked(event.target.checked)
    }

    const addUser = (user: any) => {
        setAssignedUsers((prev) => [...(prev || []), user]);
        if(user.uuid === "_room_owner"){
            RoomTemplateAgent.updateActionPoint({
                variables: {
                    actionPointUuid :   actionId,
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
            actionPointUuid : actionId,   
        }

        if(user.__typename === "AccountUserOutput"){
            input["sellersUuid"]    =   [user.uuid]
            input["buyersUuid"]     =   []

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

    const handleInternalClick = (event: any) => {
        event.stopPropagation();
        const handleUpdate = (category: string) => {
            RoomTemplateAgent.updateActionPoint({
                variables: {
                    actionPointUuid: actionId,
                    input: {
                        category:    category
                    }
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
        if(category === "INTERNAL"){
            setCategory("EXTERNAL")
            handleUpdate("EXTERNAL")
            
        }else{
            handleUpdate("INTERNAL")
            setCategory("INTERNAL")
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
            <div
                {...provided.draggableProps} 
                className   =   'j-seller-ap-card cm-width100 cm-flex-align-center cm-cursor-pointer'
                ref         =   {provided.innerRef} 
                onClick     =   {() => onClick(actionId)}
            >                
                <div className="cm-width100">
                    <div className="cm-flex-space-between" style={{padding: "10px 10px 10px 5px"}}>
                        <div className="cm-flex cm-gap15" style={{maxWidth: "calc(100% - 100px)"}}>
                            <div {...provided.dragHandleProps} className="cm-cursor-dragger" onClick={(e) => e.stopPropagation()}>
                                <MaterialSymbolsRounded font='drag_indicator' size='18' className='cm-light-text' />
                            </div>
                            <Form form={form} onClick={(event) => event.stopPropagation()}>
                                <Form.Item noStyle name={actionId} valuePropName="checked" initialValue={status === COMPLETED}>
                                    <Checkbox
                                        className   =   "j-action-point-checkbox"
                                        key         =   {actionId} 
                                        onChange    =   {(event) => handleCheckChange(event)}
                                        disabled    =   {checkBox}
                                    />
                                </Form.Item>
                            </Form>
                            <div className="cm-flex cm-gap8 cm-width100">
                                <Text ellipsis={{tooltip: actionName}} style={{width: "100%"}} className={`j-action-title ${checked ? "cm-text-strike" : ""} cm-font-size15`}>{actionName}</Text>
                                <Tooltip title={<span>This action point won't be visibile to the Buyer</span>}>
                                    <Tag className={`j-seller-ap-internal-tag ${category === "INTERNAL" ? "is-internal" : ""}`} onClick={handleInternalClick}>Internal</Tag>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {
                        actionItem.status !== COMPLETED &&
                            <Space className="cm-width100 j-action-item-action-bar cm-flex-space-between">
                                <Space className="cm-flex" onClick={(event) => event.stopPropagation()}>
                                    {
                                        TemplateEditPermission &&
                                            <StakeholderDropdown 
                                                sellers         =   {moveRoomOwnerToTop($sellers.concat(roomOwner))}
                                                selectedSellers =   {assignedUsers.filter((user) => user.__typename === "AccountUserOutput")}
                                                selectedBuyers  =   {assignedUsers.filter((user) => user.__typename === "ContactOutput")}
                                                onSelect        =   {addUser}
                                            />
                                    }
                                    {
                                        assignedUsers.length > 0 ?
                                            <Avatar.Group style={{display: "flex", fontSize: "11px"}} maxCount={8} size={25}>
                                                {
                                                    assignedUsers.map((_stakeHolder: any) => (
                                                        _stakeHolder.__typename === "ContactOutput" 
                                                        ? 
                                                            <UserQuickView user={_stakeHolder}>
                                                                 <div className="cm-cursor-pointer">
                                                                    {
                                                                        TemplateEditPermission ?
                                                                            <Badge offset={[10, 10]} className="j-action-point-seller-avatar" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation(); removeUser(_stakeHolder.uuid)}}/>}>
                                                                                <BuyerAvatar buyer={_stakeHolder} size={25} fontSize={11}/>
                                                                            </Badge>
                                                                        :
                                                                            <BuyerAvatar buyer={_stakeHolder} size={25} fontSize={11}/>
                                                                    }
                                                                </div>
                                                            </UserQuickView>
                                                        : 
                                                            <UserQuickView user={_stakeHolder}>
                                                                 <div className="cm-cursor-pointer">
                                                                    {
                                                                        TemplateEditPermission ?
                                                                            <Badge offset={[10, 10]} className="j-action-point-seller-avatar" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation(); removeUser(_stakeHolder.uuid)}}/>}>
                                                                                <SellerAvatar seller={_stakeHolder} size={25} fontSize={11}/>
                                                                            </Badge>
                                                                        :
                                                                            <SellerAvatar seller={_stakeHolder} size={25} fontSize={11}/>
                                                                    }
                                                                </div>
                                                            </UserQuickView>
                                                    ))
                                                }   
                                            </Avatar.Group>
                                        :
                                            TemplateEditPermission && <div className="cm-light-text cm-font-size12">Add assignees</div>
                                    }
                                </Space>
                                {
                                    TemplateEditPermission &&
                                        <Popconfirm 
                                            placement           =   "bottom"  
                                            title               =   {<div className="cm-font-fam500">Delete action point</div>}
                                            description         =   {<div className="cm-font-size13">Are you sure you want to delete this action point?</div>}
                                            icon                =   {null}
                                            okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0"}, danger: true}}
                                            cancelButtonProps   =   {{style: {fontSize: "12px"}, danger: true, ghost: true}}
                                            okText              =   {"Delete"}
                                            onCancel            =   {(event: any) => {
                                                event.stopPropagation()
                                            }}
                                            onConfirm           =   {(event: any) => {
                                                event.stopPropagation()
                                                const messageLoading = message.loading("Deleting action point...", 0);
                                                RoomTemplateAgent.deleteActionPoint({
                                                    variables: {
                                                        actionPointUuid :   actionId
                                                    },
                                                    onCompletion: () => {
                                                        messageLoading()
                                                        CommonUtil.__showSuccess("Action Point deleted successfully")
                                                    },
                                                    errorCallBack: (error: any) => {
                                                        messageLoading()
                                                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                                    }
                                                })
                                            }}
                                        >
                                            <MaterialSymbolsRounded font='delete' size='16' onClick={(event: any) => event.stopPropagation()}/>
                                        </Popconfirm>
                                }
                            </Space>
                    }
                </div>
            </div>
        </>
    )
}

export default ActionItemCard