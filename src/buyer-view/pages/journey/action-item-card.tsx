import { FC, useContext, useEffect, useState } from "react";
import { Avatar, Badge, Button, Checkbox, Divider, Dropdown, Form, MenuProps, Space, Tag, Tooltip, Typography } from "antd";

import { BOOK_MEETING, DOWNLOAD, GOTO_URL, UPLOAD, VIEW_DOCUMENT, WATCH_VIDEO } from "./config/action-point-type-config";
import { CANCELLED, COMPLETED, IN_PROGRESS, STAGE_STATUS_CONFIG, TODO } from "./config/stage-status-config";
import { useBuyerResourceViewer } from "../../../custom-hooks/resource-viewer-hook";
import { LINK } from "../../../pages/library/config/resource-type-config";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import StakeholderDropdown from "../../../components/stakeholder-dropdown/stakeholder-dropdown";
import BuyerResourceViewerModal from "../resource-viewer/buyer-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import SellerAvatar from "../../../components/avatars/seller-avatar";
import BuyerAvatar from "../../../components/avatars/buyer-avatar";
import UserQuickView from "../../components/user-quick-view";
import Translate from "../../../components/Translate";
import CommentPopover from "./comment-popover";

const { useForm }   =   Form;
const { Text }      =   Typography;

interface ActionItemCardProps {
    actionItem  :   any;
    onClick     :   (arg0: string) => void;
}

const ActionItemCard: FC<ActionItemCardProps> = (props) => {

    const { onClick, actionItem }   =   props;

    const actionId          =   actionItem.uuid;
    const actionName        =   actionItem.title;
    const status            =   actionItem.status;
    const dueDate           =   actionItem.dueAt;

    const isOverdue         =   Number(Date.now()) > dueDate;

    const { $allUsers, $sellers, $buyerData }           =   useContext(BuyerGlobalContext);

    const [form]                                        =   useForm();

    const [checked, setChecked]                         =   useState<boolean>(false);
    const [assignedBuyers, setAssignedBuyers]           =   useState<_TypeUser[]>(actionItem.assignedSellers.concat(actionItem.assignedBuyers))

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    useEffect(() => {
        setChecked(status === COMPLETED || status === CANCELLED)
        form.setFieldsValue({
            [actionId]: status === COMPLETED || status === CANCELLED
        })
    }, [status])

    const addUser = (value: any) => {
        setAssignedBuyers((prev) => [...(prev || []), value]);
        BuyerAgent.addActionPointAssignees({
            variables: {
                actionPointsUuid    :   [actionId],
                buyersUuid          :   [value.uuid]
            },
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.user-assigned-message" />);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleCheckChange = (event: any) => {
        setChecked(event.target.checked)
        BuyerAgent.updateActionPointStatus({
            variables: {
                actionPointsUuid: [actionId],
                status: event.target.checked ? COMPLETED : TODO
            },
            onCompletion: () => { },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const removeUser = (user: any) => {
        setAssignedBuyers((prev) => prev.filter((as) => as.uuid !== user.uuid))
        let input: any = {
            actionPointsUuid: [actionId]
        }

        input["buyersUuid"] = [user.uuid]

        BuyerAgent.removeActionPointAssignees({
            variables: input,
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.assignee-add-message" />);
            },
            errorCallBack: (error: any) => {
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
            errorCallBack: () => { },
            onCompletion: () => { }
        })
    }

    const getCTA = () => {
        if (actionItem.meetingRecording) {
            return (
                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); handleResourceOnClick(actionItem.meetingRecording) }} icon={<MaterialSymbolsRounded font="event" size="16" />}>
                    <div className="cm-font-size12">
                        <Translate i18nKey={"step.view-recording"} />
                    </div>
                </Button>
            )
        } else if (actionItem.meetingMom) {
            return (
                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); onClick(actionId) }} icon={<MaterialSymbolsRounded font="description" size="16" />}>
                    <div className="cm-font-size12">
                        <Translate i18nKey={"step.view-mom"} />
                    </div>
                </Button>
            )
        } else if (status === TODO || status === IN_PROGRESS) {
            if (actionItem.meetingJoinLink) {
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); window.open(actionItem.meetingJoinLink, "_blank") }} >
                        <div className="cm-font-size12">
                            <Translate i18nKey={"step.join-meeting"} />
                        </div>
                    </Button>
                )
            } else if (actionItem.meetingLink) {
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); window.open(actionItem.meetingLink, "_blank") }} icon={<MaterialSymbolsRounded font="event" size="16" />}>
                        <div className="cm-font-size12">
                            <Translate i18nKey="step.book-meeting" />
                        </div>
                    </Button>
                )
            } else {
                return (
                    <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); onClick(actionId) }} icon={<MaterialSymbolsRounded font="event" size="16" />}>
                        <div className="cm-font-size12">
                            <Translate i18nKey="step.view-meet-details" />
                        </div>
                    </Button>
                )
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
                if (actionItem.resources[0]?.content?.url) {
                    return (
                        <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); window.open(!actionItem.resources[0].content.url.startsWith('http') ? `https://${actionItem.resources[0].content.url}` : actionItem.resources[0].content.url, "_blank") }} icon={<MaterialSymbolsRounded font="link" size="16" />}>
                            <div className="cm-font-size12">
                                <Translate i18nKey="step.go-to-link" />
                            </div>
                        </Button>
                    )
                }
                else {
                    return null
                }

            case VIEW_DOCUMENT:

                const viewDocs: MenuProps['items'] = [];

                actionItem.resources.map((_resource: any) => {
                    let docItem = {
                        "key": _resource.uuid,
                        "label":
                            <Space style={{ minWidth: "250px", height: "30px" }} className="cm-flex-space-between">
                                <Text style={{ maxWidth: "300px" }} ellipsis={{ tooltip: _resource.title }}>{_resource.title}</Text>
                                <MaterialSymbolsRounded font="import_contacts" size="16" />
                            </Space>,
                        "onClick": (event: any) => {
                            event.domEvent.stopPropagation()
                            handleResourceOnClick(_resource)
                        }
                    }
                    viewDocs.push(docItem)
                })

                if (actionItem?.resources.length === 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resource-uploaded"} />
                            </Tag>
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); handleResourceOnClick(actionItem?.resources[0]) }} icon={<MaterialSymbolsRounded font="description" size="16" />}>
                                <div className="cm-font-size12">
                                    <Translate i18nKey={"step.view-document"} />
                                </div>
                            </Button>
                        </Space>
                    )
                } else if (actionItem?.resources.length > 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resources-uploaded"} />
                            </Tag>
                            <Dropdown menu={{ items: viewDocs }} placement="bottom">
                                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="description" size="16" />}>
                                    <Space>
                                        <div className="cm-font-size12"><Translate i18nKey={"step.view-document"} /></div>
                                        <MaterialSymbolsRounded font="expand_more" size="16" />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    )
                } else {
                    return null
                }

            case DOWNLOAD:
                const resources: MenuProps['items'] = [];

                actionItem.resources.map((_resource: any) => {
                    let option = {
                        "key": _resource.uuid,
                        "label":
                            <Space style={{ minWidth: "250px", height: "30px" }} className="cm-flex-space-between">
                                <Text style={{ maxWidth: "300px" }} ellipsis={{ tooltip: _resource.title }}>{_resource.title}</Text>
                                {_resource.type !== LINK && <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer' />}
                            </Space>,
                        "onClick": (event: any) => {
                            event.domEvent.stopPropagation()
                            trackDownload(_resource.uuid)
                            window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url, "_blank")
                        }
                    }
                    resources.push(option)
                })

                if (actionItem?.resources.length === 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resource-uploaded"} />
                            </Tag>
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); trackDownload(actionItem.resources[0].uuid); window.open(actionItem.resources[0].content.downloadableUrl ? actionItem.resources[0].content.downloadableUrl : actionItem.resources[0].content.url, "_blank") }} icon={<MaterialSymbolsRounded font="download" size="16" />}>
                                <div className="cm-font-size12">
                                    <Translate i18nKey={"common-labels.download"} />
                                </div>
                            </Button>
                        </Space>
                    )
                } else if (actionItem?.resources.length > 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resources-uploaded"} />
                            </Tag>
                            <Dropdown menu={{ items: resources }} placement="bottom">
                                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="download" size="16" />}>
                                    <Space>
                                        <div className="cm-font-size12"><Translate i18nKey={"common-labels.download"} /></div>
                                        <MaterialSymbolsRounded font="expand_more" size="16" />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    )
                } else {
                    if (actionItem.createdStakeholder.__typename === "ContactOutput") {
                        return <div className="cm-font-size12 cm-light-text cm-margin-right5"><Translate i18nKey={"step.resource-requested"} /></div>
                    } else {
                        return null
                    }
                }

            case UPLOAD:
                if (actionItem?.resources.length === 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resource-uploaded"} />
                            </Tag>
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); onClick(actionId) }} icon={<MaterialSymbolsRounded font="upload" size="16" />}>
                                <div className="cm-font-size12"><Translate i18nKey={"common-labels.upload"} /></div>
                            </Button>
                        </Space>
                    )
                } else if (actionItem?.resources.length > 1) {
                    return (
                        <Space>
                            <Tag color="green" className="cm-font-size11">
                                <span className="cm-font-fam600">{actionItem.resources.length}</span> <Translate i18nKey={"step.resources-uploaded"} />
                            </Tag>
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); onClick(actionId) }} icon={<MaterialSymbolsRounded font="upload" size="16" />}>
                                <div className="cm-font-size12"><Translate i18nKey={"common-labels.upload"} /></div>
                            </Button>
                        </Space>
                    )
                } else {
                    return null
                }


            case WATCH_VIDEO:
                const videos: MenuProps['items'] = [];

                actionItem.resources.map((_resource: any) => {
                    let docItem = {
                        "key": _resource.uuid,
                        "label":
                            <Space style={{ minWidth: "250px", height: "30px" }} className="cm-flex-space-between">
                                <Text style={{ maxWidth: "300px" }} ellipsis={{ tooltip: _resource.title }}>{_resource.title}</Text>
                                <MaterialSymbolsRounded font="play_circle" size="16" />
                            </Space>,
                        "onClick": (event: any) => {
                            event.domEvent.stopPropagation()
                            handleResourceOnClick(_resource)
                        }
                    }
                    videos.push(docItem)
                })

                if (actionItem?.resources.length === 1) {
                    return (
                        <Space>
                            {
                                actionItem?.resources.length > 0 &&
                                <Tag color="green" className="cm-font-size11">
                                    <span className="cm-font-fam600">{actionItem.resources.length}</span> resources uploaded
                                </Tag>
                            }
                            <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => { event.stopPropagation(); handleResourceOnClick(actionItem?.resources[0]) }} icon={<MaterialSymbolsRounded font="movie" size="16" />}>
                                <div className="cm-font-size12"><Translate i18nKey={"step.watch-video"} /></div>
                            </Button>
                        </Space>
                    )
                } else if (actionItem?.resources.length > 1) {
                    return (
                        <Space>
                            {
                                actionItem?.resources.length > 0 &&
                                <Tag color="green" className="cm-font-size11">
                                    <span className="cm-font-fam600">{actionItem.resources.length}</span> resources uploaded
                                </Tag>
                            }
                            <Dropdown menu={{ items: videos }} placement="bottom">
                                <Button className="j-quick-action cm-flex-center" type="primary" ghost onClick={(event) => event.stopPropagation()} icon={<MaterialSymbolsRounded font="movie" size="16" />}>
                                    <Space>
                                        <div className="cm-font-size12"><Translate i18nKey={"step.watch-video"} /></div>
                                        <MaterialSymbolsRounded font="expand_more" size="16" />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    )
                } else {
                    return <div className="cm-font-size12 cm-light-text cm-margin-right5"><Translate i18nKey={"common-empty.no-resources-found"} /></div>
                }

            default:
                break;
        }
    }

    let filteredUsers = $allUsers.filter((_filterUser) => _filterUser.__typename !== "AccountUserOutput")

    return (
        <>
            <div
                className='j-buyer-ap-card cm-flex-align-center cm-cursor-pointer'
                onClick={() => onClick(actionId)}
            >
                <Space direction="vertical" className="cm-width100" size={0}>
                    <Space className="cm-width100 cm-flex-space-between" style={{ padding: "10px 5px 10px 10px" }}>
                        <Space size={15} className="cm-width100">
                            <Form form={form}>
                                <Form.Item noStyle name={actionId} valuePropName="checked" initialValue={status === COMPLETED}>
                                    <Checkbox
                                        onChange    =   {(event) => handleCheckChange(event)}
                                        onClick     =   {(event) => event.stopPropagation()}
                                        className   =   "j-action-point-checkbox"
                                        key         =   {actionId}
                                    />
                                </Form.Item>
                            </Form>
                            <Text style={{ maxWidth: "400px" }} ellipsis={{ tooltip: actionName }} className={`j-action-title ${checked ? "cm-text-strike" : ""} cm-font-size15`}>{actionName}</Text>
                        </Space>
                        <Space size={20} className="j-buyer-ap-quick-action">
                            {getQuickAction()}
                        </Space>
                    </Space>
                    <Space className="cm-width100 j-action-item-action-bar cm-flex-space-between">
                        <Space className="cm-flex-center" size={8} onClick={(event) => event.stopPropagation()}>
                            <StakeholderDropdown
                                buyers          =   {filteredUsers}
                                selectedSellers =   {assignedBuyers.filter((user) => user.__typename === "AccountUserOutput")}
                                selectedBuyers  =   {assignedBuyers.filter((user) => user.__typename === "BuyerContactOutput")}
                                onSelect        =   {addUser}
                                shouldTraslate  =   {true}
                            />
                            <Avatar.Group className="cm-flex-center" max={{count: 8, style: { width: "25px", height: "25px", fontSize: "12px", lineHeight: "25px" }}}>
                                {
                                    assignedBuyers.map((_stakeHolder: any) => (
                                        _stakeHolder.__typename === "AccountUserOutput" ?
                                            <UserQuickView user={_stakeHolder}>
                                                <Badge className="j-action-point-buyer-avatar cm-cursor-pointer">
                                                    <SellerAvatar key={_stakeHolder.uuid} seller={_stakeHolder} size={28} fontSize={12} />
                                                </Badge>
                                            </UserQuickView>
                                            :
                                            <UserQuickView user={_stakeHolder}>
                                                <Badge className="j-action-point-buyer-avatar cm-cursor-pointer" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-buyer-avatar-close" onClick={(event) => { event.stopPropagation(), removeUser(_stakeHolder) }} />}>
                                                    <BuyerAvatar key={_stakeHolder.uuid} buyer={_stakeHolder} size={28} fontSize={12} />
                                                </Badge>
                                            </UserQuickView>
                                    ))
                                }
                            </Avatar.Group>
                        </Space>
                        <Space size={10} onClick={(event) => event.stopPropagation()}>
                            <Space className="j-buyer-ap-status">
                                {
                                    actionItem.status === IN_PROGRESS || actionItem.status === CANCELLED || actionItem.status === COMPLETED
                                        ?
                                        <>
                                            <Tag bordered={false} style={{ backgroundColor: STAGE_STATUS_CONFIG[actionItem.status].backgroundColor, color: STAGE_STATUS_CONFIG[actionItem.status].tag, margin: "0" }}>
                                                {STAGE_STATUS_CONFIG[actionItem.status].displayName}
                                            </Tag>
                                            <Divider type="vertical" style={{ marginInline: "0px" }} />
                                        </>
                                        :
                                        null
                                }
                                {
                                    dueDate && (actionItem.status === IN_PROGRESS || actionItem.status === TODO)
                                        ?
                                        <Space>
                                            <Space className="cm-flex-center" onClick={e => e.stopPropagation()}>
                                                <span className="cm-font-size11 cm-flex">Due on: </span>
                                                <Tooltip title={isOverdue ? "Over Due" : ""}>
                                                    <div className={`cm-font-size13 cm-font-fam500 ${isOverdue ? 'cm-red-text' : ''}`}>
                                                        {`${CommonUtil.__getDateDay(new Date(dueDate))}, ${new Date(dueDate).getFullYear()}`}
                                                    </div>
                                                </Tooltip>
                                                <Divider type="vertical" style={{ marginInline: "0px" }} />
                                            </Space>
                                        </Space>
                                        :
                                        null
                                }
                            </Space>
                            {
                                $buyerData?.properties?.isCommentsEnabled &&
                                    <CommentPopover actionId={actionId} sellers={$sellers} buyers={$buyerData?.buyers}>
                                        <div onClick={(event) => event.stopPropagation()}>
                                            <div className="j-buyer-ap-comment">{actionItem.totalComments > 0 ? actionItem.totalComments : ''} {actionItem.totalComments === 1 ? "Comment" : "Comments"}</div>
                                        </div>
                                    </CommentPopover>
                            }
                        </Space>
                    </Space>
                </Space>
            </div>
            <BuyerResourceViewerModal
                isOpen      =   {viewResourceProp.isOpen}
                onClose     =   {viewResourceProp.onClose}
                fileInfo    =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default ActionItemCard