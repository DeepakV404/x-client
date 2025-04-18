import { FC, useContext } from "react";
import { Card, Dropdown, MenuProps, Typography } from "antd";

import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { useParams } from "react-router-dom";

const { Text, Paragraph }  =   Typography;

interface BuyerResourceCardProps
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
    showCopyLink?       :   boolean;
}

const BuyerResourceCard : FC<BuyerResourceCardProps> = (props) => {

    const { name, cardId, thumbnail, createdAt, selected, onResourceClick, resource, showCopyLink }    =   props;

    const { $buyerData }    =   useContext(BuyerGlobalContext);

    const params            =   useParams();

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
                window.navigator.clipboard.writeText($buyerData?.properties.roomLink + "&resourceid=" + resource.uuid + "&sectionid=" + (params.sectionId))
                CommonUtil.__showSuccess("Resource Link Copied Successfully")
            }
        },
    ];

    return (
        <Card
            hoverable
            className   =   "j-buyer-resource-card"
            key         =   {cardId}
            onClick     =   {(event) => {
                onCardClick(event, cardId)
            }}
        >
            <div className="cm-width100 cm-height100 j-res-card" style={{paddingBottom: "0"}}>
                <div className={`j-res-card-img-wrap ${selected ? "selected" : ""}`} style={{height: "calc(100% - 70px)"}}>
                    <img className = "j-res-thumbnail" alt = "no thumbnail" src = {thumbnail ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit : thumbnail ? "scale-down" : "cover"}}/>
                </div>
                <div className="j-buyer-res-card-info" >
                    <div className="cm-flex-justify-start cm-margin-bottom5">
                        <Text className="cm-font-fam300 cm-font-size10">{CommonUtil.__getDateDay(new Date(createdAt))}, {new Date(createdAt).getFullYear()}</Text>
                    </div>
                    <Paragraph 
                        className   =   "cm-font-fam500 cm-font-size14" 
                        ellipsis    =   {{rows:1, expandable:false, tooltip: name}}
                        style       =   {{width: showCopyLink ? "calc(100% - 20px)" : "100%", marginBottom: "5px"}}
                    >
                        {name}
                    </Paragraph>
                </div>
                {
                    showCopyLink ?
                        <Dropdown key={cardId} menu={{items}} placement="topRight" overlayStyle={{minWidth: "200px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                            <div onClick={(event) => event.stopPropagation()} className="j-res-card-more cm-flex-center" >
                                <MaterialSymbolsRounded font="more_vert" size="18"/>
                            </div>
                        </Dropdown> 
                    : 
                        null
                }
            </div>
        </Card>
    )
}

export default BuyerResourceCard