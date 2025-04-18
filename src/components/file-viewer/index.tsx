
import './file-viewer.css';

import { FC, useContext, useEffect, useImperativeHandle, useState } from "react";

import { PageChangeEvent, SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core"
import { BuyerAgent } from '../../buyer-view/api/buyer-agent';

import { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { BuyerGlobalContext } from '../../buyer-globals';
import { TEMPLATE_PREVIEW } from '../../buyer-view/config/buyer-constants';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import Loading from '../../utils/loading';
import LocalCache from '../../config/local-storage';

interface FileViewerProps {
    fileId: string;
    fileUrl: string;
    fileViewerRef: any;
    track?: boolean;
    inProduct?: boolean;
    toolbarPluginInstance?: any
}

const FileViewer: FC<FileViewerProps> = (props) => {

    const { fileId, fileUrl, fileViewerRef, track, inProduct = true, toolbarPluginInstance } = props;

    const [startTime, setStartTime] = useState<any>();

    const { $buyerData } = useContext(BuyerGlobalContext);

    const $isTemplatePreview = $buyerData?.portalType === TEMPLATE_PREVIEW;
    let portalAccessToken = window.location.pathname.split("/")[2];

    const trackDuration = (resourceId: string, seconds: number) => {
        let cachedData = LocalCache.getData(portalAccessToken)
        let cacheResourceData = cachedData.resourceTracking;

        if (cacheResourceData[resourceId]) {
            if (cacheResourceData[resourceId].durationSpentInSecs) {
                cacheResourceData[resourceId].durationSpentInSecs += (seconds > 0 ? (seconds - 1) : seconds);
            } else {
                cacheResourceData[resourceId]["durationSpentInSecs"] = seconds > 0 ? (seconds - 1) : seconds
            }
        } else {
            cacheResourceData[resourceId] = {
                "durationSpentInSecs": seconds > 0 ? (seconds - 1) : seconds
            }
        }

        LocalCache.setData(portalAccessToken, cachedData)
    }

    const trackViewCount = (resourceId: string) => {
        let cachedData = LocalCache.getData(portalAccessToken)
        let cacheResourceData = cachedData.resourceTracking;

        if (cacheResourceData[resourceId]) {
            cacheResourceData[resourceId].viewCount += 1;
        } else {
            cacheResourceData[resourceId] = {
                "viewCount": 1
            }
        }

        LocalCache.setData(portalAccessToken, cachedData)
    }


    const handlePauseTrackTime = () => {
        if (startTime) {
            let seconds = Math.ceil(Math.abs(fileViewerRef.current?.getStartTime()?.getTime() - new Date().getTime()) / 1000);
            if ($isTemplatePreview) {
                trackDuration(fileId, seconds)
            }
            else {
                BuyerAgent.trackEvent({
                    variables: {
                        input: {
                            resourceUuid: fileId,
                            isViewed: true,
                            startedAt: fileViewerRef.current?.getStartTime()?.valueOf(),
                            endedAt: new Date().valueOf(),
                            durationSpentInSecs: seconds
                        }
                    },
                    onCompletion: () => { },
                    errorCallBack: () => { }
                })
            }
        }
    }

    useEffect(() => {
        if (track) {
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
        if (track) {
            setStartTime(new Date())
            if ($isTemplatePreview) {
                trackViewCount(fileId)
            }
            else {
                BuyerAgent.trackEvent({
                    variables: {
                        input: {
                            resourceUuid: fileId,
                            isViewed: true,
                        }
                    },
                    errorCallBack: () => { },
                    onCompletion: () => { }
                })
            }
        }
    }

    const handlePageChange = (e: PageChangeEvent) => {
        console.log("page change e", e.currentPage)
    }

    useImperativeHandle(fileViewerRef, () => ({
        getStartTime: () => {
            return startTime
        },
        closeFileViewer: () => handlePauseTrackTime()
    }))

    const getFileLoader = () => {
        return (
            <div style={{ height: "calc(100% - 50px)" }}>
                <Loading />
            </div>
        )
    }

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
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

    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance || {};

    const plugins = [defaultLayoutPluginInstance, toolbarPluginInstance].filter(Boolean);

    return (
        <div className={`j-${inProduct ? "" : "sfdc-"}pdf-viewer-layout cm-width100`}>
            <div className={inProduct ? "j-pdf-viewer-body" : ""}>
                <Viewer
                    fileUrl={fileUrl}
                    plugins={plugins}
                    renderLoader={() => getFileLoader()}
                    onDocumentLoad={handleDocumentLoad}
                    onPageChange={handlePageChange}
                    defaultScale={SpecialZoomLevel.PageWidth}
                />
            </div>
        </div>
    )
}

export default FileViewer