import { useContext, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'

import { TOUCH_POINT_TYPE_RESOURCE, WHEN_ON_PAUSE_RESOURCE } from '../../config/buyer-discovery-config';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { useTracking } from '../../../custom-hooks/resource-tracker';
import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { CommonUtil } from '../../../utils/common-util';

const GeneralBuyerVideoPlayer = (props: {resource: any}) => {
    
    const { resource }  =   props;

    const $isPreview                            =   CommonUtil.__getQueryParams(window.location.search).preview === "true";
    const { $buyerData }                        =   useContext<any>(BuyerGlobalContext);
    
    const playerRef                             =   useRef<any>(null);
    const $isTemplatePreview                    =   $buyerData?.portalType === TEMPLATE_PREVIEW;
    const portalAccessToken                     =   window.location.pathname.split("/")[2];

    const { touchPoints, setShowInitialPopup }  =   useContext<any>(BuyerDiscoveryContext);

    let $resourceTouchPoints                    =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_RESOURCE);

    const { 
        trackDuration, 
        trackViewCount, 
        trackViewEvent, 
        trackingMetrics, 
        trackViewedDurationEvent, 
        startTimer 
    }                                           =   useTracking(portalAccessToken);

    let discoveryQuestionsTimeout: any;

    useEffect(() => {
        return () => {
            clearTimeout(discoveryQuestionsTimeout);
        }
    }, [])

    useEffect(() => {

        const handleVisibilityChange = () => {
            if(document.hidden) {
                playerRef.current.getInternalPlayer().pause()
                
            }else{
                startTimer()
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackingMetrics]);

    const handleDiscoveryQuestions = (triggerType: string, entityId?: string) => {

        const touchPointToBeTriggered = $resourceTouchPoints.filter(
            (_resourceTouchPoint: any) => _resourceTouchPoint.target.when === triggerType && (entityId ? _resourceTouchPoint.target.entityUuid === entityId : true)
        );

        if(touchPointToBeTriggered.length){
            if(touchPointToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeout = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   touchPointToBeTriggered[0]
                    })
                }, (touchPointToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }
    }

    // VideoPlayer methods

    const onVideoStart = () => {
        if(!$isPreview){
            if($isTemplatePreview){
                trackViewCount(resource.uuid)
            }else{
                trackViewEvent(resource.uuid)
            }
        }
    }

    const onVideoPlay = () => {
        if(!$isPreview){
            startTimer()
        }
    }

    const onVideoPause = () => {
        if(!$isPreview){
            if($isTemplatePreview){
                trackDuration(resource.uuid)
            }else{
                trackViewedDurationEvent(resource.uuid)
            }
            handleDiscoveryQuestions(WHEN_ON_PAUSE_RESOURCE, resource.uuid)
        }
    }

    // VideoPlayer methods

    return (
        <div style={{aspectRatio: "16/9"}} className="cm-width100">
            <ReactPlayer 
                className       =   "j-buyer-demo-player"
                ref             =   {playerRef}
                width           =   "100%"
                height          =   "100%"
                controls        =   {true}
                url             =   {resource.content.url}
                loop            =   {false}
                config          =   {{
                                    youtube: {
                                        playerVars: { autoplay: 0 }
                                    },
                                }}
                onStart         =   {() => onVideoStart()}
                onPlay          =   {() => onVideoPlay()}
                onPause         =   {() => onVideoPause()}
                onSeek          =   {(event: any) => console.log("event",event)}
                stopOnUnmount   =   {true}
            />
        </div>
   )
}

export default GeneralBuyerVideoPlayer