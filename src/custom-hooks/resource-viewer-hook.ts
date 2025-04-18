import { useState } from "react";

import { DOCS, LINK} from "../pages/library/config/resource-type-config";
import { OFFICE_FILES } from "../constants/module-constants";
import { BuyerAgent } from "../buyer-view/api/buyer-agent";
import { CommonUtil } from "../utils/common-util";

interface ResourceViewerProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    resourceInfo    :   any;
}

export const useBuyerResourceViewer  = () => {

    const [viewResource, setViewResource]           =   useState<ResourceViewerProps>({
        isOpen          :   false,
        onClose         :   () => {},
        resourceInfo    :   ""
    });

    const handleOpenInNew = (resource: any) => {
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid: resource.uuid,
                    isViewed: true
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
        window.open(resource.content.url);
    }

    const openResourceViewer = (resourceInfo: any) => {
        setViewResource({
            isOpen          :   true,
            onClose         :   () => setViewResource({isOpen: false, onClose: () => {}, resourceInfo: ""}),
            resourceInfo    :   resourceInfo
        })
    }

    const handleResourceOnClick = (resourceInfo: any) => {        
        if(resourceInfo.type === DOCS){
            if(resourceInfo.content.type === "application/pdf" || resourceInfo.content.type === ".pdf" || OFFICE_FILES.includes(resourceInfo.content.type)){
                openResourceViewer(resourceInfo)
            }else{
                handleOpenInNew(resourceInfo)
            }
        }else if(resourceInfo.type === LINK){
            CommonUtil.__checkVideoDomain(resourceInfo.content.url) || resourceInfo?.content?.properties?.embedLink
            ? 
                openResourceViewer(resourceInfo)
            :
                handleOpenInNew(resourceInfo)
        }else{
            openResourceViewer(resourceInfo)
        }
    }

    return {
        handleResourceOnClick,
        viewResourceProp        :   viewResource,
    }

}
