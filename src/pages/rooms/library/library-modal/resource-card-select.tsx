import { FC } from "react";
import { Card, Divider, Dropdown, MenuProps, Space, Tag, Typography } from "antd";

import { CommonUtil } from "../../../../utils/common-util";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";


const { Text, Paragraph }  =   Typography;

interface ResourceCardProps
{
    cardId              :   string,
    name                :   string,
    fileType            :   string,
    createdAt           :   string,
    thumbnail?          :   string,
    downloadCount       :   number,
    viewCount           :   number,
    selected            :   boolean,
    resource            :   any;
    onResourceClick     :   (arg0: any, arg1: any) => void,
    multipleResource?   :   boolean
    isSelected          :   any
}

const ResourceCard : FC<ResourceCardProps> = (props) => {

    const { name, cardId, thumbnail, createdAt, downloadCount, viewCount, selected, resource, onResourceClick, isSelected }    =   props;

    const onCardClick = (event:any, resource: any) => {
        event.stopPropagation();
        onResourceClick(event, resource);
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
        <Card
            hoverable
            className   =   {`j-resource-card ${isSelected ? "is-selected" : ""}`}
            key         =   {cardId}
            onClick     =   {(event) => {
                onCardClick(event, resource)
            }}
        >
            <div className="j-res-card-modal">
                <div className={`j-res-card-img-wrap ${selected ? "selected" : ""}`}>
                    <img className = "j-res-thumbnail" alt = "no thumbnail" src = {thumbnail ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit : thumbnail ? "scale-down" : "cover"}}/>
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
                        className   =   "cm-font-fam500 cm-font-size14 cm-width100 cm-margin-bottom0"
                        ellipsis    =   {{rows:1, expandable:false, tooltip: name}}
                    >
                        {name}
                    </Paragraph>
                    <Space className="cm-flex-space-between cm-width100 cm-margin-bottom5">
                        <Space size={4}>
                            <Space size={4}><MaterialSymbolsRounded font="share" size="14"/> <span className="cm-font-size-14">{downloadCount}</span></Space>
                            <Divider type="vertical"/>
                            <Space size={4}><MaterialSymbolsRounded font="visibility" size="14"/> <span className="cm-font-size-14">{viewCount}</span></Space>
                        </Space>
                    </Space>
                    <Text className="cm-font-fam300 cm-font-size10 cm-margin-bottom5">{CommonUtil.__getDateDay(new Date(createdAt))}, {new Date(createdAt).getFullYear()}</Text>
                    { isSelected && <MaterialSymbolsRounded font="done" className="j-library-res-selected-icon cm-primary-color" weight="600"/> }
                </div>
            </div>
        </Card>
    )
}

export default ResourceCard