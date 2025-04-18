import { useState } from "react";
import LocalCache from "../config/local-storage";

import { BuyerAgent } from "../buyer-view/api/buyer-agent";

export const useTracking = (portalAccessToken: string) => {

    const [trackingMetrics, setTrackingMetrics]     =   useState<any>();

    const trackDuration = (resourceId: string) => {
        let seconds             =   Math.ceil(Math.abs(new Date(trackingMetrics?.startTime).getTime() - new Date().getTime())/1000);
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

    const trackViewEvent = (resourceId: string) => {
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid    :   resourceId,
                    isViewed        :   true
                }
            },
            errorCallBack: () => {},
            onCompletion: () => {}
        })
    }

    const trackViewedDurationEvent = (resourceId: string) => {
        let seconds =   Math.ceil(Math.abs(new Date(trackingMetrics?.startTime).getTime() - new Date().getTime())/1000);
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid        :   resourceId,
                    isViewed            :   true,
                    startedAt           :   trackingMetrics.startTime,
                    endedAt             :   new Date().valueOf(),
                    durationSpentInSecs :   seconds > 1800 ? 1800 : seconds
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        })
    }

    const startTimer = () => {
        setTrackingMetrics((prevMetrics: any) => (
            {
                ...prevMetrics,
                startTime    :   new Date().valueOf()
            }
        ))   
    }

    return {
        trackDuration,
        trackViewCount,
        trackViewEvent,
        trackingMetrics,
        setTrackingMetrics,
        trackViewedDurationEvent,
        startTimer
    }

}