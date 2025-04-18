import { useMemo, useState } from "react";
import ReactPlayer from "react-player";

import { CAROUSEL_FALLBACK_IMAGE1, CAROUSEL_FALLBACK_IMAGE2 } from "../../../../../constants/module-constants";
import { DOCS, IMAGE, LINK, VIDEO } from "../../../../library/config/resource-type-config";
import { CommonUtil } from "../../../../../utils/common-util";

import SellerResourceViewerModal from "../../../../resource-viewer/seller-resource-viewer-modal";

const SectionResourceViewer = (props: {resource: any}) => {
    
    const { resource } = props;

    const [viewFile, setViewFile]           =   useState<any>({
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

    const getFileViewerComponent = (fileInfo: any) => {
        
        if(fileInfo.type === DOCS){
            return(
                <div className="cm-flex-center cm-cursor-pointer cm-height100" onClick={() => handleResourceClick(resource)} >
                    <img className="cm-border-radius12" src={fileInfo.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(fileInfo.content.type)} style={{height: "100%", width: "100%", objectFit: "scale-down"}}/>
                </div>
            )
        }else if(fileInfo.type === IMAGE){
            return (
                <div className="cm-height100 cm-width100 cm-flex-center">
                    <img src={fileInfo.content.url ? fileInfo.content.url : CommonUtil.__getResourceFallbackImage(fileInfo.content.type)} className="cm-object-fit-scale-down cm-border-radius12" alt={fileInfo.title} height="100%" width="100%" style={{borderRadius: "8px"}}/>
                </div>
            )
        } else if (fileInfo.type === LINK) {
            if(CommonUtil.__checkVideoDomain(fileInfo.content.url)) {
                return (
                    <div className="cm-flex-center cm-height100 cm-width100">
                        <ReactPlayer 
                            className   =   "j-buyer-demo-player cm-aspect-ratio16-9"
                            width       =   {"100%"}
                            style       =   {{minHeight: "360px"}}
                            controls    =   {true}
                            url         =   {fileInfo.content.url}
                            loop        =   {false}
                            config      =   {{
                                youtube: {
                                    playerVars: { autoplay: 0 }
                                },
                            }}
                        />
                    </div>
                )
            } else {
                return (
                    <div className="cm-flex-center cm-cursor-pointer cm-height100" onClick={() => handleResourceClick(resource)} >
                        <img className="cm-border-radius12" src={fileInfo.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(fileInfo.content.type)} style={{height: "100%", width: "100%", objectFit: "scale-down"}}/>
                    </div>
                )
            }
        } else if (fileInfo.type === VIDEO) {
            return (
                <div className="cm-flex-center cm-height100 cm-width100">
                    <ReactPlayer 
                        className   =   "j-buyer-demo-player cm-aspect-ratio16-9"
                        width       =   {"100%"}
                        height      =   {"100%"}
                        controls    =   {true}
                        url         =   {fileInfo.content.url}
                        loop        =   {false}
                        config      =   {{
                            youtube: {
                                playerVars: { autoplay: 0 }
                            },
                        }}
                    />
                </div>
            )
        } else {
            return null
        }
    }

    const getRandomFallbackImage = useMemo(() => {
        return Math.random() < 0.5 ? CAROUSEL_FALLBACK_IMAGE1 : CAROUSEL_FALLBACK_IMAGE2;
    }, []);

    return (
        <>
            {
                resource 
                ? 
                    <div className="cm-width100 cm-aspect-ratio16-9" style={{ margin: "0 auto", padding: "10px" }}>
                        {getFileViewerComponent(resource)}
                    </div>
                :   
                    <img src={getRandomFallbackImage} style={{borderRadius: "12px"}}/>
            }
            <SellerResourceViewerModal
                isOpen          =   {viewFile.isOpen}
                onClose         =   {viewFile.onClose}
                fileInfo        =   {viewFile.resourceInfo}
            />
        </>
    )
}

export default SectionResourceViewer