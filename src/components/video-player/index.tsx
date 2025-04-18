import { FC, useImperativeHandle, useState } from "react";
import ReactPlayer from "react-player";

import { BuyerAgent } from "../../buyer-view/api/buyer-agent";

import MaterialSymbolsRounded from "../MaterialSymbolsRounded";

interface VideoPlayerProps
{
    resourceId?         :   string; 
    videoUrl            :   string;
    onClose             :   () => void;
    videoPlayerRef?     :   any;
    videoResourceRef    :   any;
}

const VideoPlayer: FC<VideoPlayerProps> = (props) => {

    const { videoUrl, onClose, resourceId, videoResourceRef }  =   props;

    const [metrics, setMetrics] =   useState<any>();

    const handleVideoLoad = (resourceId: string | undefined) => {
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

    const handleEnd = (resourceId: string | undefined) => {
        if(resourceId){
            if(metrics?.startTime){
                let seconds = Math.ceil(Math.abs(new Date(metrics.startTime).getTime() - new Date().getTime())/1000);
                BuyerAgent.trackEvent({
                    variables: {
                        input: {
                            resourceUuid: resourceId,
                            isViewed: true,
                            startedAt: metrics.startTime,
                            endedAt: new Date().valueOf(),
                            durationSpentInSecs: seconds
                        }
                    },
                    errorCallBack: () => {
        
                    },
                    onCompletion: () => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                startTime   :   null
                            }
                        ))
                    }
                })
            }
        }
    }

    const handleClose = () => {
        if(resourceId){
            if(metrics?.startTime){
                let seconds = Math.ceil(Math.abs(new Date(metrics.startTime).getTime() - new Date().getTime())/1000);
                BuyerAgent.trackEvent({
                    variables: {
                        input: {
                            resourceUuid: resourceId,
                            isViewed: true,
                            startedAt: metrics.startTime,
                            endedAt: new Date().valueOf(),
                            durationSpentInSecs: seconds
                        }
                    },
                    errorCallBack: () => {},
                    onCompletion: () => {}
                })
            }
        }
        onClose()
    }

    useImperativeHandle(videoResourceRef, () => ({
        closeVideoPlayer: () => {
            handleClose();
        }
    }))

    return (
        <>
            <div className='j-viewer-modal-close cm-cursor-pointer' onClick={handleClose}>
                <MaterialSymbolsRounded font='close' size='20' />
            </div>
            <div className="cm-flex-center j-video-player-wrapper">
                <ReactPlayer 
                    className   =   "j-video-player" 
                    width       =   "100%"
                    height      =   "100%"
                    controls    =   {true}
                    url         =   {videoUrl}
                    loop        =   {false}
                    onReady     =   {() => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                isLoaded    :   true
                            }
                        ))
                        handleVideoLoad(resourceId)
                    }}
                    onStart     =   {() => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                startTime    :   new Date().valueOf()
                            }
                        ))
                    }}
                    onPause     =   {() => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                endTime    :   new Date().valueOf()
                            }
                        ))
                        handleEnd(resourceId)
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
        </>
    )
}

export default VideoPlayer