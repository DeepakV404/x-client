import { FC, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Dropdown, MenuProps, Tag, Typography, message } from "antd";

import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { checkPermission } from "../../../../config/role-permission";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";
import { RoomsAgent } from "../../api/rooms-agent";

import DeleteConfirmation from "../../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Paragraph, Text }   =   Typography;

interface RoomStageResourceProps
{
    cardId              :   string;
    name                :   string;
    fileType            :   string;
    createdAt           :   string;
    thumbnail?          :   string;
    selected            :   boolean;
    onResourceClick     :   (arg0: string, arg1: any) => void;
    onCheck             :   (arg0: boolean, arg1: string) => void;
    resource            :   any;
    onEdit              :   (arg0: any) => void
}

const RoomStageResourceCard: FC<RoomStageResourceProps> = (props) => {

    const { cardId, onResourceClick, name, createdAt, selected, thumbnail, resource, onEdit }   =   props;

    const { roomId, stageId }    =   useParams();

    const { $user }     =    useContext(GlobalContext);

    const [deleteState, setDeleteState] =   useState(false);

    const handleDelete = () => {

        const messageLoading   =   message.loading("Removing stage resource...", 0)

        RoomsAgent.removeRoomStageResource({
            variables: {
                roomUuid        :   roomId,
                stageUuid       :   stageId,
                resourceUuid    :   resource.uuid
            },
            onCompletion: () => {
                messageLoading()
                CommonUtil.__showSuccess("Resource removed successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)                
            }
        })
    }

    const items: any = [
        resource.resourceOrigin !== "LIBRARY" && {
            key: 'edit',
            icon: <MaterialSymbolsRounded font="edit" size="16" />,
            label: <span>Edit</span>,
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                onEdit(resource);
            }
        },
        {
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            danger: true,
            label: <span>Remove</span>,
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                setDeleteState(true);
            }
        },
    ].filter(Boolean);
    

    const filteredItems = items.filter((item: any) => {
        if (item.key === 'delete' && !checkPermission($user.role, FEATURE_ROOMS, 'delete')) {
            return false;
        }else if(item.key === 'edit' && !checkPermission($user.role, FEATURE_ROOMS, 'update')){
            return false;
        }
        return true;
    });

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
            <Card
                hoverable
                className   =   "j-buyer-resource-card"
                key         =   {cardId}
                onClick     =   {(event: any) => {
                    onResourceClick(event, resource)
                }}
            >
                <div className="cm-width100 cm-height100 j-res-card">
                    <div className={`j-res-card-img-wrap ${selected ? "selected" : ""}`} style={{height: "calc(100% - 70px)"}}>
                        <img className = "j-res-thumbnail" alt = "no thumbnail" src = {thumbnail ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit : thumbnail ? "scale-down" : "cover"}}/>
                    </div>
                    <div className="j-res-card-info" >
                        {
                            resource?.categories && resource?.categories?.length > 0
                            ?
                                <div className="cm-flex-justify-end">
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
                                <div style={{height: "22px"}}></div>
                        }
                        <Paragraph 
                            className   =   "cm-font-fam500 cm-font-size14 cm-margin-top5"
                            ellipsis    =   {{rows:1, expandable:false, tooltip: name}}
                            style       =   {{marginBottom: "5px", width: "95%"}}
                        >
                            {name}
                        </Paragraph>
                        <Text className="cm-font-fam300 cm-font-size10">{CommonUtil.__getDateDay(new Date(createdAt))}, {new Date(createdAt).getFullYear()}</Text>
                        {
                            checkPermission($user.role, FEATURE_ROOMS, 'update') &&
                                <Dropdown menu={{items: filteredItems}} placement="topRight" overlayStyle={{minWidth: "200px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                                    <div className="j-res-card-more cm-flex-center" onClick={(event) => event.stopPropagation()}>
                                        <MaterialSymbolsRounded font="more_vert" size="18"/>
                                    </div>
                                </Dropdown>
                        }
                    </div>
                </div>
            </Card>
            <DeleteConfirmation
                isOpen      =   {deleteState}
                onOk        =   {() => handleDelete()}
                onCancel    =   {() => setDeleteState(false)}
                title       =   "resource"
                subTitle    =   "resource"
            />

        </>
    )
}

export default RoomStageResourceCard