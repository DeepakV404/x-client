import { useState } from 'react';
import { Button, Space } from 'antd';

import { CommonUtil } from '../../../../utils/common-util';
import { IMAGE, LINK, VIDEO } from '../../../../pages/library/config/resource-type-config';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import BuyerWidgetTitle from '../buyer-widget-title';

const BuyerFeatureWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const featureResource      =   widget.components[0]?.content?.resource;
    const featureHeading       =   widget.components[0]?.content?.heading;
    const featureButton        =   widget.components[0]?.content?.button;
    const featureParagraph     =   widget.components[0]?.content?.paragraph;

    const getLink = (link: string) => {
        return link && !link.startsWith('http') ? `https://${link}` : link;
    }

    const [viewFile, setViewFile]                   =   useState<any>({
        isOpen      :   false,
        onClose     :   () => {},
        resourceInfo:   ""
    });
    
    const handleResourceClick = (fileInfo: any) => {
        setViewFile({
            isOpen          :   true,
            onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
            resourceInfo    :   fileInfo
        })
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
                    <div className="cm-height100 cm-width100 cm-flex-align-center cm-padding20">
                        <div className='cm-flex-center' style={{columnGap: "25px"}}>
                            {
                                (featureResource.value && featureResource.value !== "") &&  
                                    <div className="cm-cursor-pointer cm-height100 cm-flex-center j-buyer-resource-record-wrapper" style={{width: "40%"}}>
                                        <>
                                            <div className="j-buyer-resource-record-mask" onClick={() => handleResourceClick(featureResource.value)} >
                                                {getButton(featureResource.value)}
                                            </div>
                                            {
                                                featureResource.value.content?.thumbnailUrl 
                                                ? 
                                                    <img className="cm-width100 cm-height100 cm-object-fit-scale-down" style={{borderRadius: "inherit"}} src={featureResource.value.content?.thumbnailUrl}/> 
                                                : 
                                                    <img style={{borderRadius: "inherit"}} className="cm-width100" src={CommonUtil.__getResourceFallbackImage(featureResource.value.content?.type)}/>
                                            }
                                        </>
                                    </div>
                            }
                            <Space direction='vertical' size={25} align='start' style={{width: "60%"}} className='cm-flex-justify-center'>
                                <Space direction='vertical' align='start' style={{lineBreak: "anywhere"}}>
                                    {
                                        featureHeading.enabled ?
                                            <div className='cm-font-size18 cm-font-fam600' style={{color: "#252525"}}>{featureHeading.value}</div>
                                        :
                                            null
                                    }
                                    {
                                        featureParagraph.enabled ?
                                            <div className="tiptap" style={{padding: "0px", minHeight: "fit-content"}} dangerouslySetInnerHTML={{__html: featureParagraph?.value || ""}}></div>   
                                        :
                                            null
                                    }
                                </Space>
                                {
                                    featureButton?.enabled &&
                                        <a href={getLink(featureButton.link) || undefined} target={featureButton.openInNewTab ? "_blank" : "_self"}>
                                            <Button type="primary" className='cm-margin0'>
                                                {featureButton.name || "Button Name"}
                                            </Button>
                                        </a>
                                }
                            </Space>
                        </div>
                    </div>
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

export default BuyerFeatureWidget