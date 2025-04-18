import { ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { RenderZoomInProps, RenderZoomOutProps } from "@react-pdf-viewer/zoom";
import { Button, Space, Typography } from "antd";
import { useContext, useRef, useState } from "react";
import { useMutation } from '@apollo/client';

import { DOCS, IMAGE, LINK, VIDEO } from "../../../../pages/library/config/resource-type-config";
import { OFFICE_FILES, RESOURCE_TYPE_PDF } from "../../../../constants/module-constants";
import { CommonUtil } from "../../../../utils/common-util";
import { D_TrackDeckResource } from '../API/deck-mutation';
import { DeckValuesContext } from "..";

import SellerOfficeFilesViewer from "../../../../pages/resource-viewer/buyer-office-files-viewer";
import SellerImageViewer from "../../../../pages/resource-viewer/buyer-image-viewer";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../../custom-hooks/use-translation-hook";
import DeckVideoPlayer from "./deck-resource-viewer";
import DeckPdfViewer from "./deck-pdf-viewer";

const { Text }  =   Typography;

const DeckResource = (props: {index: number}) => {

    const { isMobile, resourceData, buyerDeckData, setSelectedCard }  =   useContext(DeckValuesContext);
    
    const { index }         =   props
    const { translate }     =   useLocalization();

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const [trackDeckResource]       =   useMutation(D_TrackDeckResource)

    const [copy, setCopy]           =   useState(false)

    const imageViewerRef: any       =   useRef();
    const officeFileViewRef: any    =   useRef();
    const deckResRef: any           =   useRef()

    const getViewerComponent = (resource: any) => {
        
        let contentType =   resource.content.type;
        let contentUrl  =   resource.content.url;

        switch(resource.type) {
            case DOCS:
                if(contentType === RESOURCE_TYPE_PDF){
                    return (
                        <DeckPdfViewer resource={resource} key={resource.uuid} toolbarPluginInstance={toolbarPluginInstance}/>
                    )
                }
                else if(OFFICE_FILES.includes(contentType)){
                    return <SellerOfficeFilesViewer resource={resource} officeFileViewRef={officeFileViewRef}/>
                }else {
                    return null
                }
        
            case LINK:
                if(CommonUtil.__checkVideoDomain(contentUrl)){
                    return <DeckVideoPlayer resource={resource}/>
                }else{
                    return (
                        <a href={resource.content.url} target='_blank' className="cm-width100 cm-height100">
                            <img 
                                width       =   {"100%"}
                                height      =   {"100%"}
                                className   =   "j-anim-img-zoomable" 
                                alt         =   {resource.title} 
                                src         =   {resource.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{objectFit :"scale-down"}}
                            />
                        </a>
                    )
                }
            
            case VIDEO:
                return <DeckVideoPlayer resource={resource}/>
            
            case IMAGE:
                return <SellerImageViewer resource={resource} imageViewerRef={imageViewerRef}/>

            default:
                return <iframe width="100%" height="100%" src={contentUrl} style={{borderRadius: "8px", minHeight: "500px"}} frameBorder={0}></iframe>
        }
    }

    const handleCopyButtonClick = (link: string) => {
        setCopy(true)
        CommonUtil.__copyToClipboard(link + "?ref=reshare")
        setTimeout(() => {
            setCopy(false)
        }, 1500)
    }

    const trackDownload = (resourceId: string) => {
        window.open(resourceData?._dBuyerDeckResources[index].content.downloadableUrl, "_self")
        trackDeckResource({
            variables: {
                input: {
                    resourceUuid: resourceId,
                    isDownloaded: true
                }
            }
        })
    }

    const isPdfViewerRendered = (resource: any) => {
        if(resource.type === DOCS && resource.content.type === RESOURCE_TYPE_PDF) return true
        return false
    }

    return (
        <div className="cm-height100 j-deck-visible" style={{scrollSnapAlign: "start"}} ref={deckResRef} data-uuid = {resourceData._dBuyerDeckResources[index].uuid}>
            <header className="j-deck-resource-view-header">
                <div className="cm-width100 cm-flex-space-between">
                    <Space size={15} >
                        {
                            (resourceData?._dBuyerDeckResources.length === 1 && !isMobile) ?
                                <img height={40} width={40} src={buyerDeckData?._dBuyerDeck.logoUrl} alt="logo" />
                            :
                                <MaterialSymbolsRounded font="arrow_back" className="cm-cursor-pointer" onClick={() => setSelectedCard(null)}/>
                        }
                        <Text style={{maxWidth: isMobile ? "120px" : "350px"}} ellipsis={{tooltip: resourceData?._dBuyerDeckResources[index].title}} className="j-deck-resource-view-header-title">{resourceData?._dBuyerDeckResources[index].title}</Text>
                    </Space>
                    {
                        isPdfViewerRendered(resourceData._dBuyerDeckResources[index]) &&
                            <div style={{width: "fit-content", margin: "auto"}}>
                                <Toolbar>
                                    {(props: ToolbarSlot) => {
                                        const { Zoom, ZoomIn, ZoomOut } = props;
                                        return (
                                            <div className='cm-flex-align-center' style={{height: "30px"}}>
                                                <ZoomOut>
                                                    {
                                                        (props: RenderZoomOutProps) => (
                                                            <div onClick={props.onClick} className='cm-cursor-pointer cm-user-select-none'>
                                                                <MaterialSymbolsRounded font='remove'/>
                                                            </div>
                                                        )
                                                    }
                                                </ZoomOut>
                                                <Zoom />
                                                <ZoomIn>
                                                    {
                                                        (props: RenderZoomInProps) => (
                                                            <div onClick={props.onClick} className='cm-cursor-pointer cm-user-select-none'>
                                                                <MaterialSymbolsRounded font='add'/>
                                                            </div>
                                                        )
                                                    }
                                                </ZoomIn>
                                            </div>
                                        );
                                    }}
                                </Toolbar>
                            </div>
                    }
                    <Space size={20}>
                        {buyerDeckData?._dBuyerDeck?.settings?.allowDownloads && <MaterialSymbolsRounded font="download" size="22" color="white" className="cm-flex-center" onClick={(e) => {e.stopPropagation(); trackDownload(resourceData._dBuyerDeckResources[index].uuid)}}/>}
                        <Button className={isMobile ? "cm-font-size12" : ""} size={isMobile ? "small" : "middle"} type="primary" icon={!isMobile ? <MaterialSymbolsRounded font="link" size="20"/> : null} style={{width: isMobile ? "unset" : "115px"}} onClick={() => handleCopyButtonClick(buyerDeckData?._dBuyerDeck.copyLink)}>{copy ? translate("common-labels.copied") : translate("common-labels.copy-link")}</Button>
                    </Space>
                </div>
            </header>
            <main className="j-deck-resource-view-content" style={{padding: isPdfViewerRendered(resourceData._dBuyerDeckResources[index]) ? "0px" : "56px 100px"}}>
                {getViewerComponent(resourceData._dBuyerDeckResources[index])}
            </main>
        </div>
    )
}

export default DeckResource