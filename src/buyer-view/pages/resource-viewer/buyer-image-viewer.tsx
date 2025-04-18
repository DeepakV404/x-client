import { useContext, useEffect, useImperativeHandle, useState } from 'react';

import { TOUCH_POINT_TYPE_RESOURCE, WHEN_ON_CLOSE_RESOURCE, WHEN_ON_LOAD_RESOURCE } from '../../config/buyer-discovery-config';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import LocalCache from '../../../config/local-storage';

const BuyerImageViewer = (props: {imageViewerRef: any, resource: any, track: boolean}) => {

    const { imageViewerRef, resource, track }   =   props;
    const $isPreview                             =   CommonUtil.__getQueryParams(window.location.search).preview === "true"

    const { touchPoints, setShowInitialPopup }           =   useContext<any>(BuyerDiscoveryContext);
    let $imageTouchPoints = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_RESOURCE);


    const [imageStartTime, setImageStartTime]       =   useState<any>();

    let discoveryQuestionsTimeoutId: any

    useEffect(() => {

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [])

    const { $buyerData } =   useContext(BuyerGlobalContext);

    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;
    let portalAccessToken       =   window.location.pathname.split("/")[2];

    const trackDuration = (resourceId: string, seconds: number) => {
        let cachedData          =   LocalCache.getData(portalAccessToken)
        let cacheResourceData   =   cachedData.resourceTracking;

        if(cacheResourceData[resourceId]){
            if(cacheResourceData[resourceId].durationSpentInSecs){
                cacheResourceData[resourceId].durationSpentInSecs += (seconds > 0 ? (seconds - 1) : seconds);
            }else{
                cacheResourceData[resourceId]["durationSpentInSecs"] = seconds > 0 ? (seconds - 1) : seconds
            }
        }else{
            cacheResourceData[resourceId] = {
                "durationSpentInSecs"   :   seconds > 0 ? (seconds - 1) : seconds
            }
        }

        LocalCache.setData(portalAccessToken, cachedData)
    }

    const trackViewCount = (resourceId: string) => {
        let cachedData          =   LocalCache.getData(portalAccessToken)
        let cacheResourceData   =   cachedData.resourceTracking;

        if(cacheResourceData[resourceId]){
            cacheResourceData[resourceId].viewCount += 1;
        }else{
            cacheResourceData[resourceId] = {
                "viewCount"   :   1
            }
        }

        LocalCache.setData(portalAccessToken, cachedData)
    }

    const handlePauseTrackTime = () => {
        if(track && !$isPreview){
            if(imageStartTime){
                let seconds = Math.ceil(Math.abs(imageStartTime - new Date().getTime())/1000);
                if($isTemplatePreview) {
                    trackDuration(resource.uuid, seconds)
                }
                else {
                    BuyerAgent.trackEvent({
                        variables: {
                            input   :   {
                                resourceUuid        :   resource.uuid,
                                isViewed            :   true,
                                startedAt           :   imageStartTime,
                                endedAt             :   new Date().valueOf(),
                                durationSpentInSecs :   seconds
                            }
                        },
                        onCompletion: () => {},
                        errorCallBack: () => {}
                    })
                }
            }
        }

        const imageOnCloseToBeTriggered = $imageTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_CLOSE_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === resource.uuid
        );

        if(imageOnCloseToBeTriggered.length){
            if(imageOnCloseToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   imageOnCloseToBeTriggered[0]
                    })
                }, (imageOnCloseToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }
    }

    const onImageLoad = () => {
        if(track && !$isPreview){
            setImageStartTime(new Date().valueOf())
            if($isTemplatePreview){
               trackViewCount(resource.uuid)
            }
            else{
                BuyerAgent.trackEvent({
                    variables: {
                        input   :   {
                            resourceUuid    :   resource.uuid,
                            isViewed        :   true
                        }
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {}
                })
            }
        }

        const imageOnLoadToBeTriggered = $imageTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_LOAD_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === resource.uuid
        );

        if(imageOnLoadToBeTriggered.length){
            if(imageOnLoadToBeTriggered[0].target.durationInSecs !==undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   imageOnLoadToBeTriggered[0]
                    })
                }, (imageOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }
    }

    useEffect(() => {
        if(track && !$isPreview){
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    handlePauseTrackTime()
                } else {
                    setImageStartTime(new Date().valueOf())
                }
            };
    
            document.addEventListener('visibilitychange', handleVisibilityChange);
    
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }

    }, [imageStartTime]);

    useImperativeHandle(imageViewerRef, () => ({
        closeImageViewer: () => handlePauseTrackTime()
    }))

    return (
        <div className="cm-height100 cm-width100 cm-flex-center">
            <img src={resource.content.url} alt={resource.title} className={"j-buyer-resource-viewer-image"} onLoad={() => onImageLoad()}/>
        </div>
    )
}

export default BuyerImageViewer