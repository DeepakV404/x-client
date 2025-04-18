import { useContext, useEffect, useImperativeHandle, useState } from 'react';

import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import LocalCache from '../../../config/local-storage';

const BuyerOfficeFilesViewer = (props: {resource: any, track: boolean, officeFileViewRef: any}) => {

    const { resource, track, officeFileViewRef }    =   props;
    const $isPreview                                =   CommonUtil.__getQueryParams(window.location.search).preview === "true"

    const [officeFilesTrackTime, setOfficeFilesTrackTime]   =   useState<any>();

    const { $buyerData }        =   useContext(BuyerGlobalContext);

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
            if(officeFilesTrackTime){
                let seconds = Math.ceil(Math.abs(officeFilesTrackTime - new Date().getTime())/1000);
                if($isTemplatePreview) {
                    trackDuration(resource.uuid, seconds)
                }
                else{
                    BuyerAgent.trackEvent({
                        variables: {
                            input   :   {
                                resourceUuid        :   resource.uuid,
                                isViewed            :   true,
                                startedAt           :   officeFilesTrackTime,
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
    }

    const onOfficeViewerLoad = () => {
        if(track && !$isPreview){
            setOfficeFilesTrackTime(new Date())
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
    }

    useEffect(() => {
        if(track && !$isPreview){
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    handlePauseTrackTime()
                } else {
                    setOfficeFilesTrackTime(new Date())
                }
            };
    
            document.addEventListener('visibilitychange', handleVisibilityChange);
    
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }

    }, [officeFilesTrackTime]);

    useImperativeHandle(officeFileViewRef, () => ({
        closeOfficeFilesViewer: () => handlePauseTrackTime()
    }))

    return (
        <div className="cm-height100 cm-width100 cm-flex-center">
            <iframe className='j-office-iframe' width="100%" height="100%" src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.content.url)}`} style={{borderRadius: "8px", aspectRatio: "16/9"}} frameBorder={0} onLoad={() => onOfficeViewerLoad()}></iframe>
        </div>
    )
}

export default BuyerOfficeFilesViewer