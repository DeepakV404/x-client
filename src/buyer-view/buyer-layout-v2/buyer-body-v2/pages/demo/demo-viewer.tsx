import { useContext, useState } from "react";
import { Space } from "antd";
import ReactPlayer from "react-player";
import { BuyerGlobalContext } from "../../../../../buyer-globals";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import Translate from "../../../../../components/Translate";
import LocalCache from "../../../../../config/local-storage";
import { CommonUtil } from "../../../../../utils/common-util";
import { BuyerAgent } from "../../../../api/buyer-agent";
import { TEMPLATE_PREVIEW } from "../../../../config/buyer-constants";
import Loading from "../../../../../utils/loading";

const DemoViewerV2 = (props: {data: any, loading: boolean}) => {

    const { data, loading }  =   props;

    const { $buyerData }            =   useContext(BuyerGlobalContext);

    const [metrics, setMetrics]     =   useState<any>();

    let portalAccessToken           =   window.location.pathname.split("/")[2];
    const $isTemplatePreview        =   $buyerData?.portalType === TEMPLATE_PREVIEW;

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

    const handleEnd = (resourceId: string | undefined) => {
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
                                resourceUuid: resourceId,
                                isViewed: true,
                                startedAt: metrics.startTime,
                                endedAt: new Date().valueOf(),
                                durationSpentInSecs: seconds
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

    const parseLink = (link: string) => {

        let contentUrl = link;

        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;   
        }

        const urlObj = new URL(contentUrl);

        if (urlObj.origin === "https://docs.google.com") {
            urlObj.pathname = urlObj.pathname.replace(/\/edit$/, "/embed");
        }

        return urlObj.toString();
    };

    const getTourViewer = (walkthroughData: any) => {
                    
        if(walkthroughData.type === "VIDEO" || (walkthroughData.type === "LINK" && CommonUtil.__checkVideoDomain(walkthroughData.content.url))){
            return (
                <div className="j-buyer-demo-player cm-width100">
                    <ReactPlayer 
                        className   =   "j-video-player" 
                        width       =   "100%"
                        height      =   "100%"
                        controls    =   {true}
                        url         =   {walkthroughData.content.url}
                        loop        =   {false}
                        onReady     =   {() => {
                            setMetrics((prevMetrics: any) => (
                                {
                                    ...prevMetrics,
                                    isLoaded    :   true
                                }
                            ))
                            handleVideoLoad(data.buyerUsecase["walkthrough"].uuid)
                        }}
                        onStart     =   {() => {
                            if($isTemplatePreview){
                                trackViewCount(walkthroughData.uuid)
                            }
                            else{
                                setMetrics((prevMetrics: any) => (
                                    {
                                        ...prevMetrics,
                                        startTime    :   new Date().valueOf()
                                    }
                                ))
                            }
                        }}
                        onPause     =   {() => {
                            setMetrics((prevMetrics: any) => (
                                {
                                    ...prevMetrics,
                                    endTime    :   new Date().valueOf()
                                }
                            ))
                            handleEnd(walkthroughData.uuid)
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
        } else {
            return (
                <div className="j-buyer-demo-player cm-width100">
                    <iframe src={parseLink(walkthroughData.content.url)} loading="lazy" style={{ width: "100%", height: "100%", colorScheme: "light", border: "0px" }} frameBorder={0} title={walkthroughData.title}></iframe>
                </div>
            );
        }
    }

    const getDemoVideoPlayer = (video: any) => {
        if(video.type === "VIDEO" || (video.type === "LINK" && CommonUtil.__checkVideoDomain(video.content.url))){
            return (
                <ReactPlayer
                    className   =   "j-video-player"
                    width       =   "100%"
                    height      =   "100%"
                    controls    =   {true}
                    url         =   {data.buyerUsecase["video"].content.url}
                    loop        =   {false}
                    onReady     =   {() => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                isLoaded    :   true
                            }
                        ))
                        handleVideoLoad(data.buyerUsecase["video"].uuid)
                    }}
                    onStart     =   {() => {
                        if($isTemplatePreview){
                            trackViewCount(data.buyerUsecase["video"].uuid)
                        }
                        else{
                            setMetrics((prevMetrics: any) => (
                                {
                                    ...prevMetrics,
                                    startTime    :   new Date().valueOf()
                                }
                            ))
                        }
                    }}
                    onPause     =   {() => {
                        setMetrics((prevMetrics: any) => (
                            {
                                ...prevMetrics,
                                endTime    :   new Date().valueOf()
                            }
                        ))
                        handleEnd(data.buyerUsecase["video"].uuid)
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
            )
        }else{
            return (
                <div className="cm-height100 cm-width100">
                    <iframe src={parseLink(video.content.url)} loading="lazy" style={{ width: "100%", height: "100%", colorScheme: "light", border: "0px" }} frameBorder={0} title={video.title}></iframe>
                </div>
            );
        }
    }

    return (
        <>
            {
                data.buyerUsecase.video ?
                    <Space direction="vertical" className="cm-width100 j-buyer-cm-card">
                        <Space className="cm-flex-align-center" size={15}>
                            <div className="cm-font-size16"><Translate i18nKey="common-labels.video"/></div>
                            <MaterialSymbolsRounded font="smart_display" size="18"  color="#DF2222"/>
                        </Space>
                        <div className="cm-flex-center j-buyer-demo-player cm-width100 cm-aspect-ratio16-9">
                            {loading ? <Loading /> : getDemoVideoPlayer(data.buyerUsecase["video"])}
                        </div>
                    </Space>
                :
                    null
            }
            {
                data.buyerUsecase["walkthrough"] ? 
                    <Space direction="vertical" className="cm-width100 j-buyer-cm-card">
                        <Space className="cm-flex-align-center" size={15}>
                            <div className="cm-font-size16"><Translate i18nKey="common-labels.tour"/></div>
                            <MaterialSymbolsRounded font="tour" size="18" color="#3176CD"/>
                        </Space>
                        <div className="cm-flex-center j-buyer-demo-player cm-width100 cm-aspect-ratio16-9">
                            {loading ? <Loading /> : getTourViewer(data.buyerUsecase["walkthrough"])}
                        </div>
                    </Space>
                : 
                    null
            }
        </>
    )
}

export default DemoViewerV2