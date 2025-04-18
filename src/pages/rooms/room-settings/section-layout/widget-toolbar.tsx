import { useContext, useState } from "react";
import { Popconfirm, Tooltip } from "antd";

import { RoomsAgent } from "../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import WidgetComments from "./sellers-widget-comments";
import { CommonUtil } from "../../../../utils/common-util";
import { useRoom } from "../../room-collaboration";
import { MODULE_TEMPLATE } from "../../../../constants/module-constants";
import { GlobalContext } from "../../../../globals";

const WidgetToolbar = (props: {sectionId: string, widget: any, carousel?: boolean, setIsCarouselDrawerOpen?: any, onEdit: any, module?: string, showComments?: any }) => {

    const { sectionId, widget, onEdit, module, showComments=false }     =   props;

    const [loading, setLoading]                     =   useState(false)

    const { $orgDetail }   =   useContext(GlobalContext);

    console.log($orgDetail)

    const roomData      =   useRoom();
    
    // Header Widget
    const component                                 =   widget.components[0];
    const __titlePropertyMap                        =   {...component?.content?.title};
    // Header Widget
    
    const [headerAlignment, setHeaderAlignement]    =   useState<"left" | "middle" | "right">(__titlePropertyMap.alignment);

    const __isWidgetHidden = widget.isHidden

    const handleWidgetVisibility = () => {
        setLoading(true)
        RoomsAgent.updateWidget({
            variables: {
                sectionUuid: sectionId,
                widgetUuid: widget.uuid,
                input: {
                    isHidden: !__isWidgetHidden
                }
            },
            onCompletion: () => {setLoading(false)},
            errorCallBack: () => {}
        })
    }

    const handleLogoAlignment = () => {

        let updatedTitleAlignment = {...__titlePropertyMap};
        
        setHeaderAlignement(prevAlignment => {
            if (prevAlignment === "left") {
                updatedTitleAlignment["alignment"] = "middle"
                return "middle"
            };
            if (prevAlignment === "middle"){
                updatedTitleAlignment["alignment"] = "right"
                return "right";
            }
            updatedTitleAlignment["alignment"] = "left"
            return "left";
        });

        RoomsAgent.updateComponentByProperty({
            variables: {
                componentUuid   :   component.uuid,
                widgetUuid      :   widget.uuid,
                propertyKey     :   "title",
                propertyContent :   updatedTitleAlignment
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    }

    const handleCopyWidgetLink = () => {
        window.navigator.clipboard.writeText(roomData.room.buyerPortalLink + "&sectionid=" + (sectionId) + "&widgetid=" + (widget.uuid))
        CommonUtil.__showSuccess("Link copied successfully")
    }


    return (
        <div className="cm-flex-justify-end cm-position-absolute" style={{right: "15px", zIndex: 4}}>
            <div className="j-widget-toolbar cm-border-light cm-border-radius4 cm-flex cm-flex-direction-row">
                {
                    widget.type === "HEADER" &&
                        <div className="cm-cursor-pointer cm-flex-center cm-padding-block5" style={{borderRight: "1px solid #e8e8e8", width: "35px"}} onClick={handleLogoAlignment}>
                            <Tooltip title={"Align Logo and Title"}>
                                {headerAlignment === "right" ? <MaterialSymbolsRounded font="format_align_right" size="18"/> : headerAlignment === "middle" ? <MaterialSymbolsRounded font="format_align_center" size="18"/> : <MaterialSymbolsRounded font="format_align_left" size="18"/>}
                            </Tooltip>
                        </div>
                }
                {
                    onEdit &&
                        <div className="cm-cursor-pointer cm-flex-center cm-padding-block5" style={{borderRight: "1px solid #e8e8e8", width: "50px"}} onClick={onEdit}>
                            <div className="cm-font-size14">Edit</div>
                        </div>
                }
                <Tooltip title="Hide/Show widget" mouseEnterDelay={1}>
                    <div className="cm-cursor-pointer cm-flex-center cm-padding-block5" onClick={handleWidgetVisibility} style={{borderRight: "1px solid #e8e8e8", width: "35px"}}>
                        {
                            loading 
                            ? 
                                <div className="j-rotate-360">
                                    <MaterialSymbolsRounded font="progress_activity" size="18"/>
                                </div>
                            :
                                <MaterialSymbolsRounded font={__isWidgetHidden ? "visibility_off" : "visibility"} size="18"/>
                        }
                    </div>
                </Tooltip>
                {
                    module !== MODULE_TEMPLATE && showComments &&
                    <>
                        <Tooltip title="Copy widget link" mouseEnterDelay={1}>
                            <div className="cm-cursor-pointer cm-flex-center" style={{borderRight: "1px solid #e8e8e8", width: "35px"}}>
                                <MaterialSymbolsRounded font="link" className="cm-flex-center" size="20" onClick={() => handleCopyWidgetLink()}/>
                            </div>
                        </Tooltip>
                        <Tooltip title="Comments" mouseEnterDelay={1}>
                            <div className="cm-cursor-pointer cm-flex-center" style={{borderRight: "1px solid #e8e8e8", width: "35px"}}>
                                <WidgetComments widget={widget} />
                            </div>
                        </Tooltip>
                    </>
                }
                <Tooltip title="Delete widget" mouseEnterDelay={1}>
                    <Popconfirm 
                        placement           =   "leftTop"
                        title               =   {<div className="cm-font-fam500">Delete widget</div>}
                        description         =   {<div className="cm-font-size13">Are you sure you want to delete this widget?</div>}
                        icon                =   {null}
                        okText              =   "Delete"
                        okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F", fontSize: "12px"}}}
                        cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                        onCancel            =   {(event: any) => {
                            event.stopPropagation()
                        }}
                        onConfirm           =   {(event: any, ) => {
                            event.stopPropagation()
                            RoomsAgent.deleteWidget({
                                variables: {
                                    sectionUuid: sectionId,
                                    widgetUuid: widget.uuid,
                                },
                                onCompletion: () => {},
                                errorCallBack: () => {}
                            })
                        }}>
                            <div className="cm-cursor-pointer cm-flex-center cm-padding-block5" style={{width: "35px"}}>
                                <MaterialSymbolsRounded font="delete" size="18" color="#DF2222"/>
                            </div>
                        </Popconfirm>
                </Tooltip>
            </div>
        </div>
    )
}

export default WidgetToolbar