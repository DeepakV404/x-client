import { useRef, useState } from "react";
import { Button, Space } from "antd";


import { IMAGE, LINK, VIDEO } from "../../../pages/library/config/resource-type-config";
import { CommonUtil } from "../../../utils/common-util";

import BuyerResourceViewerModal from "../resource-viewer/buyer-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import BuyerResourceViewLayout from "../resource-viewer";
import BuyerWidgetTitle from "./buyer-widget-title";

const BuyerSectionResource = (props: {widget: any, widgets: any}) => {

    const { widget, widgets }    =   props;

    const resourceViewRef       =   useRef();

    const [viewFile, setViewFile]                   =   useState<any>({
        isOpen      :   false,
        onClose     :   () => {},
        resourceInfo:   ""
    });
    
    const handleResourceClick = (fileInfo: any) => {
        if(fileInfo.type === LINK && !CommonUtil.__checkVideoDomain(fileInfo.content.url)){
            window.open(fileInfo.content.url, "_blank")
        }else{
            setViewFile({
                isOpen          :   true,
                onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
                resourceInfo    :   fileInfo
            })
        }
    }

    const getButton = (resource: any) => {
        if(resource.type === VIDEO || resource.type === LINK && CommonUtil.__checkVideoDomain(resource.content.url)){
            return (
                <div className="j-video-play-icon">
                    <MaterialSymbolsRounded font="play_circle" size="110"/>
                </div>
            )
        } else if(resource.type === LINK || resource.type === IMAGE) {
            return (
                <Button className="cm-flex-center" size="large" style={{background: "#161a30", color: "#fff", border: "none", borderRadius: "6px"}}>
                    <Space>
                        <MaterialSymbolsRounded font="visibility" size="22"/>
                        <div className="cm-font-fam400">View</div>
                    </Space>
                </Button>
            )
        } else {
            return (
                <Button className="cm-flex-center" size="large" style={{background: "#161a30", color: "#fff", border: "none", borderRadius: "6px"}}>
                    <Space>
                        <MaterialSymbolsRounded font="visibility" size="22"/>
                        <div className="cm-font-fam400">View Document</div>
                    </Space>
                </Button>
            )
        }
    }

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
        <>
            <div className='j-buyer-section-card' id={widget.uuid}>
                <Space direction="vertical" className="cm-width100" size={15}>
                {
                    widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                }
                {
                    widgets.length === 1 ?
                    <>
                        <BuyerResourceViewLayout fileInfo={widgets[0]?.components[0]?.content?.resource?.value} resourceViewRef={resourceViewRef}/>
                    </>
                :
                    widget.components[0].content.resource.value && 
                        <div className="cm-cursor-pointer cm-height100 cm-width100 cm-flex-center cm-padding1 j-buyer-resource-record-wrapper">
                            {
                                widget.components.map((_component: any) => 
                                    (_component.content.resource.value) 
                                    &&  
                                        <>
                                            <div className="j-buyer-resource-record-mask" onClick={() => handleResourceClick(_component.content.resource.value)} >
                                                {getButton(_component.content.resource.value)}
                                            </div>
                                            {
                                                _component?.content?.resource?.value.content?.thumbnailUrl 
                                                ? 
                                                    <img className="cm-width100 cm-height100 cm-object-fit-scale-down" style={{borderRadius: "inherit"}} src={_component?.content?.resource?.value?.content?.thumbnailUrl}/> 
                                                : 
                                                    <img style={{borderRadius: "inherit"}} className="cm-width100" src={CommonUtil.__getResourceFallbackImage(_component?.content?.resource?.value?.content?.type)}/>
                                            }
                                        </>
                                )
                            }
                        </div>
                }
                </Space>
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewFile.isOpen}
                onClose         =   {viewFile.onClose}
                fileInfo        =   {viewFile.resourceInfo}
            /> 
        </>
    )
}

export default BuyerSectionResource