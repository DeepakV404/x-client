import { useContext, useEffect, useState } from "react";
import { Avatar, Checkbox, Divider, Form, Popconfirm, Space, Typography, message, Tag, Badge, Tooltip, Button, Dropdown, MenuProps } from "antd";

import { BOOK_MEETING, DOWNLOAD, GOTO_URL, UPLOAD, VIEW_DOCUMENT, WATCH_VIDEO } from "../../../../buyer-view/pages/journey/config/action-point-type-config";
import { CANCELLED, COMPLETED, IN_PROGRESS, STAGE_STATUS_CONFIG, TODO } from "../../../../buyer-view/pages/journey/config/stage-status-config";
import { useBuyerResourceViewer } from "../../../../custom-hooks/resource-viewer-hook";
import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { AccountsAgent } from "../../../accounts/api/accounts-agent";
import { LINK } from "../../../library/config/resource-type-config";
import { BuyerAgent } from "../../../../buyer-view/api/buyer-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";
import { RoomsAgent } from "../../api/rooms-agent";
import { useRoom } from "../../room-collaboration";

import StakeholderDropdown from "../../../../components/stakeholder-dropdown/stakeholder-dropdown";
import SellerResourceViewerModal from "../../../resource-viewer/seller-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import UserQuickView from "../../../../buyer-view/components/user-quick-view";
import SellerAvatar from "../../../../components/avatars/seller-avatar";
import BuyerAvatar from "../../../../components/avatars/buyer-avatar";

const { Text }  =   Typography;

const { useForm }   =   Form;

const ActionItemCard = (props: {provided: any, actionItem: any, onCardClick: (actionId: string) => void}) => {

    const { provided, onCardClick, actionItem }   =   props;

    let actionId        =   actionItem.uuid;
    let status          =   actionItem.status;
    let dueDate         =   actionItem.dueAt;

    const { $sellers, $user }                           =   useContext(GlobalContext);
    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const [assignedUsers, setAssignedUsers]             =   useState<_TypeUser[]>(actionItem.assignedBuyers.concat(actionItem.assignedSellers))

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const { room }      =   useRoom();

    let $roomBuyers     =   room.buyers;

    const [form]                    =   useForm();

    const [category, setCategory]   =   useState(actionItem.category);
    const [checked, setChecked]     =   useState(false);

    const isOverdue = Number(Date.now()) > dueDate;
  
    useEffect(() => {
        setChecked(status === COMPLETED || status === CANCELLED)
        form.setFieldsValue({
            [actionItem.uuid]   :   status === COMPLETED || status === CANCELLED
        })
    }, [status])

    const addUser = (user: any) => {
        setAssignedUsers((prev) => [...(prev || []), user]);
        let input: any = {
            actionPointUuid : actionItem.uuid,   
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

    const removeUser = (user: any) => {
        setAssignedUsers((prevAssignedUsers) => prevAssignedUsers.filter((userToBeRemoved) => userToBeRemoved.uuid !== user.uuid))        
        let input: any = {
            actionPointUuid: actionItem.uuid
        }

        if(user.__typename === "AccountUserOutput"){
            input["sellersUuid"]    =   [user.uuid]
            input["buyersUuid"]     =   []
        }else{
            input["buyersUuid"]     =   [user.uuid]
            input["sellersUuid"]    =   []
        }

        RoomsAgent.removeActionPointAssignees({
            variables       :   input,
            onCompletion    :   () => {},
            errorCallBack   :   (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleCheckChange = (event: any) => {  
        event.stopPropagation()
        const handleLoading = message.loading("Updating action point status", 0)
        setChecked(event.target.checked)
        RoomsAgent.updateActionPointStatus({
            variables: {
                actionPointsUuid    :   [actionItem.uuid],
                status              :   event.target.checked ? COMPLETED : TODO,
            },
            onCompletion: () => {
                handleLoading()
                CommonUtil.__showSuccess(`Action point marked as ${event.target.checked ? "completed" : "todo"}.`);
            },
            errorCallBack: (error: any) => {
                handleLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    const trackDownload = (resourceId: string) => {
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid: resourceId,
                    isDownloaded: true
                }
            },
            errorCallBack: () => {},
            onCompletion: () => {}
        })
    }

    const handleInternalClick = (event: any) => {
        event.stopPropagation();
        const handleUpdate = (category: string) => {
            AccountsAgent.updateActionPoint({
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


    const getCTA = () => {
        if(actionItem.meetingRecording){
            return (
                <Button className="j-quick-action cm-flex-center" type="primary" ghost icon={<MaterialSymbolsRounded font="event" size="16"/>} onClick={(event) => {event.stopPropagation(); onCardClick(actionId)}}>
                    <div className="cm-font-size12">
                        View recording
                    </div>
                </Button>
            )
        }else if(actionItem.meetingMom){
            return (
                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => {event.stopPropagation(); onCardClick(actionId)}} icon={<MaterialSymbolsRounded font="description" size="16"/>}>
                    <div className="cm-font-size12">
                        View MoM
                    </div>
                </Button>
            )
        }else if(status === TODO || status === IN_PROGRESS){
            if(actionItem.meetingJoinLink){
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => {event.stopPropagation(); window.open(actionItem.meetingJoinLink, "_blank")}} >
                        <div className="cm-font-size12 cm-line-height22">
                            Join Meeting
                        </div>
                    </Button>
                )
            }else if(actionItem.meetingLink){
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => {event.stopPropagation(); window.open(actionItem.meetingLink, "_blank")}} icon={<MaterialSymbolsRounded font="event" size="16"/>}>
                        <div className="cm-font-size12 cm-line-height22">
                            Book Meeting
                        </div>
                    </Button>
                )
            }else if(actionItem.createdStakeholder.__typename === "ContactOutput"){
                return (
                    <div className="cm-font-size11 cm-light-text">
                        <Tag color="geekblue" className="cm-font-size11">{`${CommonUtil.__getFullName(actionItem.createdStakeholder.firstName, actionItem.createdStakeholder.lastName)} has requested a meeting`}</Tag>
                    </div>
                )
            }else if (actionItem.meetingLink === "") {
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={() => onCardClick(actionItem.uuid)}>
                        <div className="cm-font-size12 cm-line-height22">
                            Add meeting link
                        </div>
                    </Button>
                );
            }
        }
    }

    const getQuickAction = () => {
        switch (actionItem.type) {
            case BOOK_MEETING:
                return (
                    <Space className="j-buyer-ap-card-actions">
                        {getCTA()}
                    </Space>
                )
                
            case GOTO_URL:
                if(actionItem.resources[0]?.content?.url){
                    return (
                        <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => {event.stopPropagation(); window.open(actionItem.resources[0].content.url, "_blank")}} icon={<MaterialSymbolsRounded font="link" size="16"/>}>
                            <div className="cm-font-size12">Go to Link</div>
                        </Button>
                    )
                }else{
                    return (
                        <Space>
                            <Tag color="red" className="cm-font-size11">
                                <div className="cm-font-size11">No link found</div>
                            </Tag>
                        </Space>
                    )
                }

            case VIEW_DOCUMENT:
                const viewDocs: MenuProps['items'] = [];
                let count = 0;
            
                actionItem.resources.map((_resource: any) => {
                    let docItem = {
                        "key": _resource.uuid,
                        "label": 
                            <Space style={{ minWidth: "250px", height: "30px" }} className="cm-flex-space-between">
                                <Text style={{ maxWidth: "300px" }} ellipsis={{ tooltip: _resource.title }}>{_resource.title}</Text>
                                <MaterialSymbolsRounded font="import_contacts" size="16" />
                            </Space>,
                        "onClick": (event: any) => {
                            event.domEvent.stopPropagation();
                            handleResourceOnClick(_resource);
                        }
                    }
                    viewDocs.push(docItem);
                    if (_resource.report.views > 0) {
                        count += 1;
                    }
                });
            
                if (actionItem?.resources.length === 1) {
                    return (
                        <Space>
                            <div className="cm-font-size13">
                                <Tag color="green" className="cm-font-size11">   
                                    <span className="cm-font-fam600">{count} </span> 
                                    resource(s) viewed 
                                </Tag>
                            </div>
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); handleResourceOnClick(actionItem?.resources[0]) }} icon={<MaterialSymbolsRounded font="description" size="16" />}>
                                <div className="cm-font-size12">
                                    View Document
                                </div>
                            </Button>
                        </Space>
                    );
                } else if (actionItem?.resources.length > 1) {
                    return (
                        <Space>
                            <div className="cm-font-size13">
                                <Tag color="green" className="cm-font-size11">   
                                    <span className="cm-font-fam600">{count} </span> 
                                    resource(s) viewed 
                                </Tag>
                            </div>
                            <Dropdown menu={{ items: viewDocs }} placement="bottom">
                                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="description" size="16" />}>
                                    <Space>
                                        <div className="cm-font-size12">View Document</div>
                                        <MaterialSymbolsRounded font="expand_more" size="16" />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    );
                } else {
                    return (
                        <div className="cm-font-size12 cm-light-text cm-margin-right5">
                            <Tag color="red" className="cm-font-size11">No resources found</Tag>
                        </div>
                    );
            }

            case WATCH_VIDEO:
                if (actionItem.resources.length > 0) {
                    let count = 0;
                    const videos = actionItem.resources.map((_resource:any) => {
                        if (_resource.report.timeSpent > 0) {
                            count = count + 1;
                        }
                        return {
                            "key": _resource.uuid,
                            "label": 
                                <Space style={{ minWidth: "250px", height: "30px" }} className="cm-flex-space-between">
                                    <Text style={{ maxWidth: "300px" }} ellipsis={{ tooltip: _resource.title }}>{_resource.title}</Text>
                                    <MaterialSymbolsRounded font="play_circle" size="16" />
                                </Space>,
                            "onClick": (event:any) => {
                                event.domEvent.stopPropagation();
                                handleResourceOnClick(_resource);
                            }
                        };
                    });
            
                    if (count > 0) {
                        if (actionItem.resources.length === 1) {
                            return (
                                <Space className="cm-font-size13">
                                    <Tag color="green" className="cm-font-size11"><span className="cm-font-fam600">{count}</span> video watched </Tag>
                                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); handleResourceOnClick(actionItem.resources[0]) }} icon={<MaterialSymbolsRounded font="movie" size="16" />}>
                                        <div className="cm-font-size12">Watch Video</div>
                                    </Button>
                                </Space>
                            );
                        } else {
                            return (
                                <Space className="cm-font-size13">
                                    <Tag color="green" className="cm-font-size11"><span className="cm-font-fam600">{count}</span> video(s) watched </Tag>
                                    <Dropdown menu={{ items: videos }} placement="bottom">
                                        <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="movie" size="16" />}>
                                            <Space>
                                                <div className="cm-font-size12">Watch Video</div>
                                                <MaterialSymbolsRounded font="expand_more" size="16" />
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                </Space>
                            );
                        }
                    } else {
                        return (
                            <Tag color="orange" className="cm-font-size11"> No videos watched yet </Tag> 
                        )
                    }
                } else {
                    return (
                        <div className="cm-font-size12 cm-light-text cm-margin-right5">
                            <Tag color="red" className="cm-font-size11">No resources found</Tag>
                        </div>
                    )
                }
            

                case DOWNLOAD:
                    const resources: MenuProps['items'] = [];
                    let dcount = 0;
                    
                    actionItem.resources.map((_resource: any) => {
                        let option = {
                            "key": _resource.uuid,
                            "label":
                                <Space style={{minWidth: "250px", height: "30px"}} className="cm-flex-space-between">
                                    <Text style={{maxWidth: "300px"}} ellipsis={{tooltip: _resource.title}}>{_resource.title}</Text>
                                    {_resource.type !== LINK && <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer'/>}
                                </Space>,
                            "onClick": (event: any) => {
                                event.domEvent.stopPropagation()
                                trackDownload(_resource.uuid)
                                window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url, "_blank")
                            }
                        }
                        resources.push(option)
                    })
                
                    actionItem.resources.map((_resource: any) => {
                        if (_resource.report.downloadCount > 0) {
                            dcount += 1;
                        }
                    })
                
                    return (
                        <Space>
                            {actionItem.resources.length > 0 && dcount > 0 ? (
                                <div className="cm-font-size13">
                                    <Tag color="green" className="cm-font-size11">   
                                        <span className="cm-font-fam600">{dcount}</span> resources downloaded
                                    </Tag>
                                </div>
                            ) : actionItem.resources.length > 0 ? (
                                <div className="cm-font-size11 cm-light-text">
                                    <Tag color="orange" className="cm-font-size11"> No resources downloaded yet </Tag> 
                                </div>
                            ) : actionItem.createdStakeholder.__typename === "ContactOutput" ? (
                                <span>
                                    <Tag color="geekblue" className="cm-font-size11">
                                        <Text style={{color: 'blue', maxWidth: "250px" }} ellipsis={{ tooltip: CommonUtil.__getFullName(actionItem.createdStakeholder.firstName, actionItem.createdStakeholder.lastName) }} className="cm-font-size11">
                                            {CommonUtil.__getFullName(actionItem.createdStakeholder.firstName, actionItem.createdStakeholder.lastName)}
                                            <span style={{ color: 'blue' }}> has requested a resource</span>
                                        </Text>
                                    </Tag>
                                </span>
                            ) : (
                                <div className="cm-font-size11 cm-light-text"><Tag color="red" className="cm-font-size11"> No resources found </Tag></div>
                            )}
                
                            {actionItem.resources.length === 1 ? (
                                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); trackDownload(actionItem.resources[0].uuid); window.open(actionItem.resources[0].content.downloadableUrl ? actionItem.resources[0].content.downloadableUrl : actionItem.resources[0].content.url, "_blank") }} icon={<MaterialSymbolsRounded font="download" size="16"/>}>
                                    <div className="cm-font-size12">
                                        Download
                                    </div>
                                </Button>
                            ) : actionItem.resources.length > 1 ? (
                                <Dropdown menu={{ items: resources }} placement="bottom">
                                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="download" size="16"/>}>
                                        <Space>
                                            <div className="cm-font-size12">Download</div>
                                            <MaterialSymbolsRounded font="expand_more" size="16"/>
                                        </Space>
                                    </Button>
                                </Dropdown>
                            ) : null}
                        </Space>
                    )
                    
            
            case UPLOAD:
                if(actionItem.resources.length > 0){
                    return (
                        <Space className="cm-font-size13">
                            <Tag color="green" className="cm-font-size11"> 
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> resources uploaded
                            </Tag> 
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) =>  {event.stopPropagation(); onCardClick(actionId)}} icon={<MaterialSymbolsRounded font="upload" size="16"/>}>
                                <div className="cm-font-size12">Upload</div>
                            </Button>
                        </Space>
                    )
                }else{
                    return (
                        <div className="cm-font-size11 cm-light-text">
                            {
                                actionItem.resources.length > 0 
                                ? 
                                    (
                                        <Tag color="red" className="cm-font-size11">
                                            {actionItem.resources.length} {actionItem.resources.length > 1 ? "resources uploaded" : "resource uploaded"}
                                        </Tag>
                                    )
                                :
                                    (
                                        <Tag color="red" className="cm-font-size11">
                                            No resource uploaded
                                        </Tag>
                                    )
                            }
                        </div>
                    )
                }
        
            default:
                break;
        }
    }

    return (
        <>
            <div
                className   =   'j-seller-ap-card cm-width100 cm-flex-align-center cm-cursor-pointer'
                ref         =   {provided.innerRef} 
                onClick     =   {(event: any) => {event.stopPropagation(); onCardClick(actionItem.uuid)}}
                {...provided.draggableProps} 
            >                
                <div className="cm-width100">
                    <div className="cm-flex-space-between" style={{padding: "10px 10px 10px 5px"}}>
                        <div className="cm-flex cm-gap15 cm-flex-align-center cm-flex-space-between cm-width100">
                            <div className="cm-flex cm-gap15" style={{maxWidth: "calc(100% - 390px)"}}>
                                <div {...provided.dragHandleProps} className="cm-cursor-dragger" onClick={(e) => e.stopPropagation()}>
                                    <MaterialSymbolsRounded font='drag_indicator' size='18' className='cm-light-text' />
                                </div>
                                <Form form={form} onClick={(event) => event.stopPropagation()}>
                                    <Form.Item noStyle name={actionItem.uuid} valuePropName="checked" initialValue={status === COMPLETED}>
                                        <Checkbox
                                            className   =   "j-action-point-checkbox"
                                            key         =   {actionItem.uuid} 
                                            onChange    =   {(event) => handleCheckChange(event)}
                                            disabled    =   {!RoomEditPermission}
                                        />
                                    </Form.Item>
                                </Form>
                                <Text ellipsis={{tooltip: actionItem.title}} style={{width: "100%"}} className={`j-action-title ${checked ? "cm-text-strike" : ""} cm-font-size15`}>{actionItem.title}</Text>
                            </div>
                            <div className="cm-flex-align-center cm-gap8 cm-width100" style={{justifyContent: "flex-end"}}>
                                <Tooltip title={<span>This action point won't be visibile to the Buyer</span>}>
                                    <Tag className={`j-seller-ap-internal-tag ${category === "INTERNAL" ? "is-internal" : ""}`} onClick={handleInternalClick}>Internal</Tag>
                                </Tooltip>
                                {getQuickAction()}
                            </div>
                        </div>
                    </div>
                    <Space className="cm-width100 j-action-item-action-bar cm-flex-space-between">
                        <Space className="cm-flex" onClick={(event) => event.stopPropagation()}>
                            {
                                RoomEditPermission && 
                                    <StakeholderDropdown 
                                        sellers         =   {$sellers}
                                        buyers          =   {$roomBuyers}
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
                                                            {RoomEditPermission
                                                            ? 
                                                                <Badge offset={[10, 10]} className="j-action-point-seller-avatar" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation() ,removeUser(_stakeHolder)}}/>}>
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
                                                                RoomEditPermission ?
                                                                    <Badge offset={[10, 10]} className="j-action-point-seller-avatar" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-seller-avatar-close" onClick={(event) =>{event.stopPropagation() ,removeUser(_stakeHolder)}}/>}>
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
                                    RoomEditPermission && <div className="cm-light-text cm-font-size12">Add assignees</div>
                            }

                        </Space>
                        <Space size={15}>
                            {
                                actionItem.status === IN_PROGRESS || actionItem.status === CANCELLED 
                                ?   
                                    <>
                                        <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[actionItem.status].tag, backgroundColor: STAGE_STATUS_CONFIG[actionItem.status].backgroundColor, margin: 0}}>
                                            {STAGE_STATUS_CONFIG[actionItem.status].displayName}
                                        </Tag>
                                        <Divider type="vertical" style={{marginInline: "0px"}}/>
                                    </>
                                :
                                    null
                            }
                            {
                            dueDate && (actionItem.status === IN_PROGRESS || actionItem.status === TODO)
                            ?  
                                <>  
                                    {
                                        <Space className="cm-flex-center" onClick={e => e.stopPropagation()} size={4}>
                                            <div className="cm-font-size11">Due on: </div>
                                            <Tooltip title={isOverdue ? "Over Due" : ""}>
                                                <div className={`cm-font-size13 cm-font-fam500 ${isOverdue ? 'cm-red-text' : ''}`}>
                                                    {`${CommonUtil.__getDateDay(new Date(dueDate))}, ${new Date(dueDate).getFullYear()}`}
                                                </div>                                        
                                            </Tooltip>
                                            <Divider type="vertical"/>
                                        </Space>
                                    }
                                </>
                            :
                                null
                            }
                            {
                                RoomEditPermission &&
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
                                            RoomsAgent.deleteActionPoint({
                                                variables: {
                                                    actionPointUuid :   actionItem.uuid
                                                },
                                                onCompletion: () => {
                                                    messageLoading()
                                                    CommonUtil.__showSuccess(`Action point deleted successfully`);
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
                    </Space>
                </div>
            </div>
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default ActionItemCard