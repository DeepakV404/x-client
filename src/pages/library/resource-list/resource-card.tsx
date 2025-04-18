import { FC, useContext, useEffect, useState } from "react";
import { Card, Checkbox, Divider, Dropdown, Space, Tag, Tooltip, Typography } from "antd";
import type { MenuProps } from 'antd';

import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { checkPermission } from "../../../config/role-permission";
import { FEATURE_DECK, FEATURE_LIBRARY } from "../../../config/role-permission-config";
import { GlobalContext } from "../../../globals";

const { Paragraph, Text }  =   Typography;

interface ResourceCardProps
{
    resource                :   any;
    setResetAllSelectedRes  :   any;
    cardId                  :   string,
    name                    :   string,
    fileType                :   string,
    createdAt               :   string,
    thumbnail?              :   string,
    downloadCount           :   number,
    viewCount               :   number,
    selected                :   boolean,
    resetAllSelectedRes     :   boolean
    checkedResourcesId      :   string[]
    onEdit                  :   (arg0: any) => void,
    onDelete                :   (arg0: any) => void
    onCheckboxClick         :   (arg0: string) => void
    onResourceClick         :   (arg0: string, arg1: string) => void,
    onCreateLink?           :   any;
}

const ResourceCard : FC<ResourceCardProps> = (props) => {

    const { name, cardId, thumbnail, selected, resource, onResourceClick, onEdit, createdAt, onDelete, onCheckboxClick, resetAllSelectedRes, setResetAllSelectedRes, checkedResourcesId, onCreateLink }    =   props;
    
    const [cardChecked, setCardChecked]                    =   useState(false);

    const { $user }     =    useContext(GlobalContext);

    useEffect(() => {
        if (resetAllSelectedRes) {
            setCardChecked(false);
            setResetAllSelectedRes(false)
        }
    }, [resetAllSelectedRes]);

    const onCardClick = (event: any, cardId: string) => {
        event.stopPropagation();
        if (checkedResourcesId.length > 0) {
            setCardChecked(!cardChecked);
            if(onCheckboxClick) onCheckboxClick(cardId)
        } 
        else onResourceClick(cardId, resource);
    };

    const items: MenuProps['items'] = [
        {
            key     :   'createLink',
            icon    :   <MaterialSymbolsRounded font="link" size="16"/>,
            label   :   (
                <span>Create Link</span>
            ),
            onClick :   (event) => {
                event.domEvent.stopPropagation();
                handleOnCreateDeckClick(resource)
            }
        },
        {
            key     :   'edit',
            icon    :   <MaterialSymbolsRounded font="edit" size="16"/>,
            label   :   (
                <span>Edit</span>
            ),
            onClick :   (event) => {
                event.domEvent.stopPropagation();
                onEdit(resource)
            }
        },
        resource.content.downloadableUrl ? {
            key     :   'download',
            icon    :   <MaterialSymbolsRounded font="download" size="16"/>,
            danger  :   false,
            label   :   (
                <span>Download</span>
            ),
            onClick :   (event) => {
                event.domEvent.stopPropagation();
                window.open(resource.content.downloadableUrl, "_blank")
            }
        } : null,
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
            danger  :   true,
            label   :   (
                <span>Delete</span>
            ),
            onClick :   (event) => {
                event.domEvent.stopPropagation();
                onDelete(resource)
            }
        },
    ];

    const filteredItems = items.filter((item: any) => {
        if (item?.key === 'delete' && !checkPermission($user.role, FEATURE_LIBRARY, 'delete')) {
            return false;
        }else if(item?.key === 'edit' && !checkPermission($user.role, FEATURE_LIBRARY, 'update')){
            return false;
        }else if(item?.key === 'createLink' && !checkPermission($user.role, FEATURE_DECK, 'create')){
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

    const handleOnCreateDeckClick = (resource: any) => {
        onCreateLink(resource)
    }

    return (
        <>
            <Card
                hoverable
                className   =   {`j-resource-card cm-position-relative hover-item ${cardChecked ? "cm-active-border2" : ""}`}
                key         =   {cardId}
                onClick     =   {(event) => {
                    onCardClick(event, cardId);
                }}
            >
                <div className={`cm-width100 cm-height100 j-res-card`}>
                    <div className={`j-res-card-img-wrap ${selected ? "selected" : ""}`}>
                        <img className="j-res-thumbnail" alt={name} src={thumbnail ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit : thumbnail ? "scale-down" : "cover"}}/>
                    </div>
                    <div className="j-res-card-info">
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
                            className   =   "cm-font-fam500 cm-font-size14 cm-margin-top5 cm-width100" 
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
                            (checkPermission($user.role, FEATURE_LIBRARY, 'update') || checkPermission($user.role, FEATURE_DECK, 'create')) && !checkedResourcesId.length &&
                                <Dropdown menu={{items: filteredItems}} overlayStyle={{minWidth: "200px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                                    <div className="j-res-card-more cm-flex-center" onClick={(event) => event.stopPropagation()}>
                                        <MaterialSymbolsRounded font="more_vert" size="18"/>
                                    </div>
                                </Dropdown>
                        }
                    </div>
                    {
                        (checkPermission($user.role, FEATURE_LIBRARY, 'update') || checkPermission($user.role, FEATURE_DECK, 'create')) && 
                            <div className={`cm-position-absolute ${!cardChecked ? "show-on-hover-icon" : ''}`} style={{top: "15px", left: "15px"}}>
                                <Checkbox checked={cardChecked} onChange={(e) => {e.stopPropagation(); setCardChecked(!cardChecked); if(onCheckboxClick) onCheckboxClick(cardId)}} onClick={(e) => e.stopPropagation()} />
                            </div>
                    }
                </div>
            </Card>
        </>
    )
}
    
export default ResourceCard