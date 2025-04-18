import { FC, useContext, useState } from "react";
import { Card, Divider, Dropdown, Space, Tag, Tooltip, Typography } from "antd";
import type { MenuProps } from 'antd';

import { R_SECTION, ROOM_PORTAL_LINK, SECTION_BY_UUID } from "../api/rooms-query";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { AccountsAgent } from "../../accounts/api/accounts-agent";
import { checkPermission } from "../../../config/role-permission";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { ROOM } from "../config/room-resource-config";
import { GlobalContext } from "../../../globals";

import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import ResourceLinkCopyModal from "./resource-link-copy-modal";

const { Text, Paragraph }  =   Typography;

interface SellerResourceCardProps
{
    roomId              :   any;
    cardId              :   string;
    name                :   string;
    fileType            :   string;
    createdAt           :   string;
    thumbnail?          :   string;
    selected            :   boolean;
    onResourceClick     :   (arg0: string, arg1: any) => void;
    onCheck             :   (arg0: boolean, arg1: string) => void;
    resource            :   any;
    onEdit              :   (arg0: any) => void;
    origin?             :   string;
}

const SellerResourceCard : FC<SellerResourceCardProps> = (props) => {

    const { roomId, name, cardId, thumbnail, createdAt, selected, onResourceClick, resource, onEdit, origin }    =   props;

    const [deleteState, setDeleteState] =   useState(false);

    const [showCopy, setShowCopy] =   useState({
        visibility  :   false,
        link        :   ""
    });

    const params = useParams()

    const { data: resourceSectionUuid} = useQuery(SECTION_BY_UUID, {
        variables: {
            roomUuid: roomId,
            type: "Resources"
        },
    })
    
    const { data: resourceSection} = useQuery(R_SECTION, {
        variables: {
            roomUuid: roomId,
            sectionUuid: params.sectionId || resourceSectionUuid?._rSectionUuidByType
        },
        fetchPolicy: "network-only"
    })

    const { data } =   useQuery(ROOM_PORTAL_LINK, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

    const { $user }     =    useContext(GlobalContext);

    const onCardClick = (event:any, cardId: string) => {
        event.stopPropagation();
        onResourceClick(cardId, resource);
    }

    const items: MenuProps['items'] = [
        {
            key     :   'copy-link',
            icon    :   <MaterialSymbolsRounded font="content_copy" size="16"/>,
            label   :   (
                <span>Copy Link</span>
            ),
            onClick :   (event: any) => {
                event.domEvent.stopPropagation()
                let resourceLink = "";
                if(resourceSection?._rSection.isHidden) {
                    resourceLink = data?.room.buyerPortalLink + "&resourceid=" + resource.uuid;
                } else {
                    resourceLink = data?.room.buyerPortalLink + "&resourceid=" + resource.uuid + "&sectionid=" + (params.sectionId || resourceSectionUuid?._rSectionUuidByType)
                }

                if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
                    setShowCopy({
                        visibility: true,
                        link: resourceLink
                    })
                }else{
                    window.navigator.clipboard.writeText(resourceLink)
                    CommonUtil.__showSuccess("Resource Link Copied Successfully")
                }
            }
        },
        {
            type: "divider"
        },
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            danger  :   true,
            label   :   (
                <span>Remove</span>
            ),
            onClick :   (event: any) => {
                event.domEvent.stopPropagation()
                setDeleteState(true)
            }
        },
    ];

    if(origin === ROOM){
        items.unshift(
            {
                key     :   'edit',
                icon    :   <MaterialSymbolsRounded font="edit" size="16"/>,
                label   :   (
                    <span>Edit</span>
                ),
                onClick :   (event) => {
                    event.domEvent.stopPropagation()
                    onEdit(resource)
                }
            },
        )
    }

    const handleDelete = () => {
        AccountsAgent.updateResources({
            variables: {
                roomUuid: roomId, 
                resourcesUuid: [resource.uuid], 
                action: "REMOVE"
            },
            onCompletion: () => {
                setDeleteState(false)
                CommonUtil.__showSuccess("Resource deleted successfully");
            },
            errorCallBack: (error: any) => {
                setDeleteState(false)
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const _getOptions: any = (options: any) => {

        const categories: MenuProps['items'] = [];

        options.map((_option: any) => {
            let option = {
                "key"      :   _option.uuid,
                "label"    :   _option.name,
                "onClick"   :   (event: any) => {
                    event.domEvent.stopPropagation()
                }
            }
            categories.push(option)
        })
        categories.shift();
        return categories
    }

    return (
        <>
            <DeleteConfirmation
                isOpen      =   {deleteState}
                onOk        =   {() => handleDelete()}
                onCancel    =   {() => setDeleteState(false)}
                header      =   "Remove resource"
                body        =   "Are you sure you want to remove this resource? "
                okText      =   "Remove"
            />

            <Card
                hoverable
                className   =   "j-buyer-resource-card"
                key         =   {cardId}
                onClick     =   {(event) => {
                    event.stopPropagation()
                    onCardClick(event, cardId)
                }}
            >
                <div className="cm-width100 cm-height100 j-res-card">
                    <div className={`j-res-card-img-wrap ${selected ? "selected" : ""}`}>
                        <img className = "j-res-thumbnail" alt = "no thumbnail" src = {thumbnail ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit : thumbnail ? "scale-down" : "cover"}}/>
                    </div>
                    <div className="j-buyer-res-card-info">
                        {
                            resource?.categories && resource?.categories?.length > 0
                            ?
                                <div className="cm-flex-justify-end cm-margin-bottom5">
                                    <Tag style={{maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis"}} color="blue" onClick={(event) => event?.stopPropagation()}>{resource?.categories[0].name}</Tag>
                                    {
                                        resource?.categories?.length > 1
                                        ?
                                            (
                                                <Dropdown menu={{items : _getOptions(resource.categories)}} placement="bottom">
                                                    <Tag color='blue' onClick={(event) => event?.stopPropagation()}>{"+ " + (resource?.categories?.length - 1)}</Tag>
                                                </Dropdown>
                                            )
                                        :
                                            null
                                    }
                                </div>
                            :
                                <div style={{height: "22px"}} className="cm-margin-bottom5"></div>
                        }
                        <Paragraph 
                            className   =   "cm-font-fam500 cm-font-size14 cm-width100"
                            ellipsis    =   {{rows:1, expandable:false, tooltip: name}}
                            style       =   {{marginBottom: "5px"}}
                        >
                            {name}
                        </Paragraph>
                        <Space size={4} className="cm-margin-bottom5">
                            <Tooltip title={"Views"}>
                                <Space size={4} className="cm-flex-center">
                                    <MaterialSymbolsRounded font="visibility" size="15"/>
                                    <div className="cm-font-size13 cm-font-fam500">{resource.report.views}</div>
                                </Space>
                            </Tooltip>
                            <Divider type="vertical"/>
                            <Tooltip title={"Time spent"}>
                                <Space size={4} className="cm-flex-center">
                                    <MaterialSymbolsRounded font="timer" size="15"/>
                                    <div className="cm-font-size13 cm-font-fam500">{resource.report.timeSpent ? `${CommonUtil.__getFormatDuration(resource.report.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`: 0}</div>
                                </Space>
                            </Tooltip>
                        </Space>
                        <Text className="cm-font-fam300 cm-font-size10">{CommonUtil.__getDateDay(new Date(createdAt))}, {new Date(createdAt).getFullYear()}</Text>
                        {
                            checkPermission($user.role, FEATURE_ROOMS, 'update') &&
                                <Dropdown key={cardId} menu={{items}} placement="topRight" overlayStyle={{minWidth: "200px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                                    <div onClick={(event) => event.stopPropagation()} className="j-res-card-more cm-flex-center" >
                                        <MaterialSymbolsRounded font="more_vert" size="18"/>
                                    </div>
                                </Dropdown>
                        }
                    </div>
                </div>
            </Card>
            <ResourceLinkCopyModal 
                isOpen  =   {showCopy.visibility}
                onClose =   {() => setShowCopy({visibility: false, link: ""})}
                link    =   {showCopy.link}
            />
        </>
    )
}

export default SellerResourceCard