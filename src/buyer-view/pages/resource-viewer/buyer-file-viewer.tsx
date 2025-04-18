import { FC, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";

import { PageChangeEvent, SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core"
import { fullScreenPlugin, FullScreenPlugin } from '@react-pdf-viewer/full-screen';

import { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { BuyerAgent } from '../../api/buyer-agent';
import Loading from '../../../utils/loading';
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { TOUCH_POINT_TYPE_RESOURCE, WHEN_ON_CLOSE_RESOURCE, WHEN_ON_LOAD_RESOURCE } from "../../config/buyer-discovery-config";
import { CommonUtil } from "../../../utils/common-util";


interface BuyerFileViewer
{
    fileId          :   string;
    fileUrl         :   string;
    fileViewerRef   :   any;
    track?          :   boolean;
    inProduct?      :   boolean;   
}

const BuyerFileViewer: FC <BuyerFileViewer> = (props) => {

    const { fileId, fileUrl, fileViewerRef, track, inProduct=true }           =   props;
    const $isPreview                             =   CommonUtil.__getQueryParams(window.location.search).preview === "true"

    const { touchPoints, setShowInitialPopup }           =   useContext<any>(BuyerDiscoveryContext);
    
    let $documentTouchPoints = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_RESOURCE);

    const [startTime, setStartTime]     =   useState<any>();
    const fullScreenPluginInstance = useRef<FullScreenPlugin>(fullScreenPlugin()).current;

    let discoveryQuestionsTimeoutId: any

    useEffect(() => {

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [])

    const handlePauseTrackTime = () => {        
        if(startTime){
            let seconds = Math.ceil(Math.abs(fileViewerRef.current?.getStartTime()?.getTime() - new Date().getTime())/1000);
    
            BuyerAgent.trackEvent({
                variables: {
                    input   :   {
                        resourceUuid        :   fileId,
                        isViewed            :   true,
                        startedAt           :   fileViewerRef.current?.getStartTime()?.valueOf(),
                        endedAt             :   new Date().valueOf(),
                        durationSpentInSecs :   seconds
                    }
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        }

        const DocumentOnCloseToBeTriggered = $documentTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_CLOSE_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === fileId
        );        

        if(DocumentOnCloseToBeTriggered.length){
            if(DocumentOnCloseToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   DocumentOnCloseToBeTriggered[0]
                    }) 
                }, (DocumentOnCloseToBeTriggered[0].target.durationInSecs ?? 0 ) * 1000)
            }
        }
    }

    useEffect(() => {
        if(track && !$isPreview){
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    handlePauseTrackTime()
                } else {
                    setStartTime(new Date())
                }
            };
    
            document.addEventListener('visibilitychange', handleVisibilityChange);
    
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [startTime]);

    const handleDocumentLoad = () => {
        if(track && !$isPreview){
            setStartTime(new Date())
            BuyerAgent.trackEvent({
                variables: {
                    input   :   {
                        resourceUuid    :   fileId,
                        isViewed        :   true,
                    }
                },
                errorCallBack: () => {},
                onCompletion: () => {}
            })
        }

        const documentOnLoadToBeTriggered = $documentTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_LOAD_RESOURCE &&
                _resourceTouchPoint.target.entityUuid === fileId
        );        

        if(documentOnLoadToBeTriggered.length){
            if(documentOnLoadToBeTriggered[0].target.durationInSecs !== undefined){
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   documentOnLoadToBeTriggered[0]
                    })
                }, (documentOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            } 
        }
    }

    const handlePageChange = (e: PageChangeEvent) => {
        console.log("page change e",e.currentPage)
    }

    useImperativeHandle(fileViewerRef, () => ({
        getStartTime : () =>  {
            return startTime
        },
        closeFileViewer: () =>  handlePauseTrackTime()
    }))

    const getFileLoader = () => {
        return (
            <div style={{height: "calc(100% - 50px)"}}>
                <Loading/>
            </div>
        )
    }

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        EnterFullScreen: fullScreenPluginInstance.EnterFullScreen,
        EnterFullScreenMenuItem: fullScreenPluginInstance.EnterFullScreenMenuItem,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Print: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>
    });

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    );
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
        sidebarTabs: () => [],
    });
    
    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    return (
        <div className={`j-${inProduct ? "" : "sfdc-"}pdf-viewer-layout cm-width100`}>
            <div className={inProduct ? "j-pdf-viewer-body" : ""}>
                <Viewer 
                    fileUrl         =   {fileUrl}
                    plugins         =   {[defaultLayoutPluginInstance, fullScreenPluginInstance]}
                    renderLoader    =   {() => getFileLoader()}
                    onDocumentLoad  =   {handleDocumentLoad}
                    onPageChange    =   {handlePageChange}
                    defaultScale    =   {SpecialZoomLevel.PageWidth}
                />
            </div>
        </div>
    )
}

export default BuyerFileViewer