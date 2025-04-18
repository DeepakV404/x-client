import { FC, useContext, useState } from "react";
import { Card, Dropdown, Tag, Typography } from "antd";
import type { MenuProps } from 'antd';

import { RoomTemplateAgent } from "../../../templates/api/room-template-agent";
import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";
import { checkPermission } from "../../../../config/role-permission";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import DeleteConfirmation from "../../../../components/confirmation/delete-confirmation";

const { Text, Paragraph }  =   Typography;

interface SellerResourceCardProps
{
    roomTemplateId      :   any;
    cardId              :   string;
    name                :   string;
    fileType            :   string;
    createdAt           :   string;
    thumbnail?          :   string;
    selected            :   boolean;
    onResourceClick     :   (arg0: string, arg1: any) => void;
    onCheck             :   (arg0: boolean, arg1: string) => void;
    resource            :   any,
    onEdit              :   (arg0: any) => void;
}

const SellerResourceCard : FC<SellerResourceCardProps> = (props) => {

    const { roomTemplateId, name, cardId, thumbnail, createdAt, selected, onResourceClick, resource }    =   props;

    const [deleteState, setDeleteState] =   useState(false);

    const { $user }     =    useContext(GlobalContext);

    const onCardClick = (event:any, cardId: string) => {
        event.stopPropagation();
        onResourceClick(cardId, resource);
    }

    const items: MenuProps['items'] = [
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

    const filteredItems = items.filter((item: any) => {
        if (item.key === 'delete' && !checkPermission($user.role, FEATURE_TEMPLATES, 'delete')) {
            return false;
        }else if(item.key === 'edit' && !checkPermission($user.role, FEATURE_TEMPLATES, 'update')){
            return false;
        }
        return true;
    });

    const handleDelete = () => {
        RoomTemplateAgent.updateRoomTemplateResources({
            variables: {
                templateUuid        : roomTemplateId,
                resourcesUuid       : [resource.uuid],
                action              : "REMOVE",
                updateInAllRooms    : false
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Resource removed successfully");
            },
            errorCallBack: (error: any) => {
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
                    <div className="j-buyer-res-card-info" >
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
                            className   =   "cm-font-fam500 cm-font-size14" 
                            ellipsis    =   {{rows:1, expandable:false, tooltip: name}}
                            style       =   {{width: "100%", marginBottom: "5px"}}
                        >
                            {name}
                        </Paragraph>
                        {/* <Checkbox key={cardId} value={cardId} className={`j-res-card-checkbox ${selected ? "selected" : ""}`} onClick={(event) => event.stopPropagation()} onChange={(event) => console.log("event",event)}></Checkbox> */}
                        <Text className="cm-font-fam300 cm-font-size10">{CommonUtil.__getDateDay(new Date(createdAt))}, {new Date(createdAt).getFullYear()}</Text>
                        {
                            checkPermission($user.role, FEATURE_TEMPLATES, 'update') &&
                                <Dropdown key={cardId} menu={{items: filteredItems}} placement="topRight" overlayStyle={{minWidth: "200px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                                    <div onClick={(event) => event.stopPropagation()} className="j-res-card-more cm-flex-center" >
                                        <MaterialSymbolsRounded font="more_vert" size="18"/>
                                    </div>
                                </Dropdown>
                        }
                    </div>
                </div>
            </Card>
        </>
    )
}

export default SellerResourceCard