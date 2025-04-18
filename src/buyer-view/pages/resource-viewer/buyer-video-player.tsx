import { useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { TOUCH_POINT_TYPE_RESOURCE, WHEN_ON_CLOSE_RESOURCE, WHEN_ON_LOAD_RESOURCE, WHEN_ON_PAUSE_RESOURCE } from "../../config/buyer-discovery-config";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { TEMPLATE_PREVIEW } from "../../config/buyer-constants";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import LocalCache from "../../../config/local-storage";

const BuyerVideoPlayer = (props: {resource: any, videoResourceRef: any, track: boolean, shouldAutoPlay?: any}) => {

    const { resource, videoResourceRef, track, shouldAutoPlay=false }  =   props;
    const $isPreview                             =   CommonUtil.__getQueryParams(window.location.search).preview === "true"

    const { touchPoints, setShowInitialPopup }           =   useContext<any>(BuyerDiscoveryContext);

    let $resourceTouchPoints = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_RESOURCE);

    const { $buyerData }        =   useContext(BuyerGlobalContext);

    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;
    const portalAccessToken     =   window.location.pathname.split("/")[2];

    const [metrics, setMetrics] =   useState<any>();

    const playerRef             = useRef<any>(null);

    let discoveryQuestionsTimeoutId: any

    let videoUrl = resource.content.url;

    useEffect(() => {

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [])

    useEffect(() => {
        if(track && !$isPreview && !$isTemplatePreview){
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    playerRef.current.getInternalPlayer().pause()
                } else {
                    setMetrics((prevMetrics: any) => (
                        {
                            ...prevMetrics,
                            startTime    :   new Date().valueOf()
                        }
                    ))
                }
            };
    
            document.addEventListener('visibilitychange', handleVisibilityChange);
    
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
    
        }
    }, [metrics]);

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

    const handleVideoLoad = (resourceId: string | undefined) => {
        if(track && !$isPreview && !$isTemplatePreview){
            if(resourceId){
                BuyerAgent.trackEvent({
                    variables: {
                        input: {
                            resourceUuid: resourceId,
                            isViewed: true
                        }
                    },
                    errorCallBack: () => {},
                    onCompletion: () => {}
                })
            }
        }

        const videoOnLoadToBeTriggered = $resourceTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_LOAD_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === resourceId
        );        

        if(videoOnLoadToBeTriggered.length){
            if(videoOnLoadToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   videoOnLoadToBeTriggered[0]
                    })
                }, (videoOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }
    }   

    const handleEnd = (resourceId: string | undefined) => {
        if(track && !$isPreview){
            if(resourceId){
                if(metrics?.startTime){
                    let seconds = Math.ceil(Math.abs(new Date(metrics.startTime).getTime() - new Date().getTime())/1000);
                    if($isTemplatePreview)
                    {
                        trackDuration(resourceId, seconds)
                    }
                    else
                    {
                        BuyerAgent.trackEvent({
                            variables: {
                                input: {
                                    resourceUuid        :   resourceId,
                                    isViewed            :   true,
                                    startedAt           :   metrics.startTime,
                                    endedAt             :   new Date().valueOf(),
                                    durationSpentInSecs :   seconds
                                }
                            },
                            onCompletion: () => {
                                setMetrics((prevMetrics: any) => (
                                    {
                                        ...prevMetrics,
                                        startTime   :   null
                                    }
                                ))
                            },
                            errorCallBack: () => {},
                        })
                    }
                }
            }
        }
    }

    const handleClose = () => {
        
        handleEnd(resource.uuid)

        const videoOnCloseToBeTriggered = $resourceTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_CLOSE_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === resource.uuid
        );        

        if(videoOnCloseToBeTriggered.length){
            if(videoOnCloseToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   videoOnCloseToBeTriggered[0]
                    })
                }, (videoOnCloseToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }
    }

    useImperativeHandle(videoResourceRef, () => ({
        closeVideoPlayer: () => handleClose()
    }))

    return (
        <div style={{aspectRatio: "16/9"}}  className="cm-width100" >
            <ReactPlayer 
                ref         =   {playerRef}
                width       =   "100%"
                height      =   "100%"
                controls    =   {true}
                url         =   {videoUrl}
                loop        =   {false}
                playing     =   {shouldAutoPlay}
                onReady     =   {() => {
                    setMetrics((prevMetrics: any) => (
                        {
                            ...prevMetrics,
                            isLoaded    :   true
                        }
                    ))
                    handleVideoLoad(resource.uuid)
                }}
                onStart     =   {() => {
                    if($isTemplatePreview){
                        trackViewCount(resource.uuid)
                    }
                    setMetrics((prevMetrics: any) => (
                        {
                            ...prevMetrics,
                            startTime    :   new Date().valueOf()
                        }
                    ))
                }}
                // onEnded     =   {() => {
                //     handleEnd(resource.uuid)
                // }}
                onPause     =   {() => {
                    handleEnd(resource.uuid)

                    const videoOnPauseToBeTriggered = $resourceTouchPoints.filter(
                        (_resourceTouchPoint: any) =>
                            _resourceTouchPoint.target.when === WHEN_ON_PAUSE_RESOURCE &&
                            _resourceTouchPoint.target.entityUuid === resource.uuid
                    );
            
                    if(videoOnPauseToBeTriggered.length){
                        if(videoOnPauseToBeTriggered[0].target.durationInSecs !== undefined) {
                            discoveryQuestionsTimeoutId = setTimeout(() => {
                                setShowInitialPopup({
                                    visibility      :   true,
                                    touchpointData  :   videoOnPauseToBeTriggered[0]
                                })
                            }, (videoOnPauseToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
                        }
                    }
                }}
                onPlay      =   {() => {
                    setMetrics((prevMetrics: any) => (
                        {
                            ...prevMetrics,
                            startTime    :   new Date().valueOf()
                        }
                    ))
                }}
                config={{
                    youtube: {
                        playerVars: { autoplay: 0 }
                    },
                }}
                
            />
        </div>
    )
}

export default BuyerVideoPlayer