import { useRef } from "react";
import { Avatar, Col, Collapse, Divider, Row, Space, Tag, Typography } from "antd";
import { useQuery } from "@apollo/client";

import { DOCS, IMAGE, LINK, VIDEO } from "../../pages/library/config/resource-type-config";
import { DECK_RESOURCE, RESOURCE, RESOURCE_REPORT } from "../../pages/library/api/library-query";
import { ROOM_RESOURCE } from "../../pages/rooms/api/rooms-query";
import { OFFICE_FILES } from "../../constants/module-constants";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { CommonUtil } from "../../utils/common-util";

import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import IframeComponent from "./iframe-component";
import Loading from "../../utils/loading";
import FileViewer from "../file-viewer";
import ReactPlayer from "react-player";

import { ContentPerformanceModule, DeckModule, LibraryModule, RoomModule, TemplateModule } from ".";

type ModuleType = RoomModule | DeckModule | LibraryModule | ContentPerformanceModule | TemplateModule;

const { Text } = Typography

const AnalyticsResourceViewer = (props: { resource: any, onClose: () => void, module: ModuleType }) => {

    const { resource, onClose, module } = props;

    const toolbarPluginInstance = toolbarPlugin();

    const { data: roomResource, loading: roomLoading } = useQuery(ROOM_RESOURCE, {
        skip: module?.type !== "room",
        variables: {
            roomUuid: (module as RoomModule)?.roomId,
            resourceUuid: resource.uuid
        },
        fetchPolicy: "network-only"
    });

    const { data: deckResource, loading: deckLoading } = useQuery(DECK_RESOURCE, {
        skip: module?.type !== "deck",
        variables: {
            deckUuid: (module as DeckModule)?.deckId,
            resourceUuid: resource.uuid
        },
        fetchPolicy: "network-only"
    });

    const { data: libraryResource, loading: libraryLoading, } = useQuery(RESOURCE, {
        skip: module?.type !== "library",
        fetchPolicy: "network-only",
        variables: {
            resourceUuid: resource.uuid
        }
    });

    const { data: CDResource, loading: CDResourceLoading, } = useQuery(RESOURCE_REPORT, {
        skip: module?.type !== "contentPerformance",
        fetchPolicy: "network-only",
        variables: {
            resourceUuid: resource.uuid
        }
    });

    const getCurrentResource = () => {
        if(module?.type === "deck") return deckResource?.deckResource
        else if(module.type === "room") return roomResource?._rResource
        else if(module?.type === "library") return libraryResource?.resource
        else if(module?.type === "template") return resource
        return CDResource?.resourceReport
    }

    const showAnalytics = () => {
        return module?.type !== "template"
    }

    const loading = module?.type === "deck" ? deckLoading : module?.type === "room" ? roomLoading : module?.type === "library" ? libraryLoading : CDResourceLoading;

    const fileViewerRef = useRef();

    function getTextForModuleType(moduleType: string) {
        switch (moduleType) {
            case "library":
                return "Activities by Room";
            default:
                return "Activities";
        }
    }

    const imageFullScreen = document.getElementById("fullScreenImage");


    const checkDocsUrl: any = (link: string) => {
 

        const urlMatch = link.match(/https?:\/\/[^\s"<>]+/);
    
        if (!urlMatch) return false;

        let contentUrl = urlMatch[0];
 
        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;
        }

        try {
            const urlObj = new URL(contentUrl);
    
            if (urlObj.origin === "https://docs.google.com") {
                urlObj.pathname = urlObj.pathname.replace(/\/edit$/, "/embed");
                return urlObj.toString();
            }
        } catch (e) {
            return false;
        }

        return false
 
    };


    const parseUrl = (link: string) => {

        let contentUrl = link;
        
        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;
        }

        return contentUrl
    }

    const getViewerByFileType = (fileInfo: any) => {
        if (fileInfo?.type === DOCS) {
            if (OFFICE_FILES.includes(fileInfo.content.type)) {
                return <iframe width="100%" height="100%" src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileInfo.content.url)}`} style={{ borderRadius: "8px" }} frameBorder={0}></iframe>

            } else {
                return (
                    <div className='j-doc-layout cm-width100'>
                        <FileViewer fileUrl={fileInfo.content.url} fileViewerRef={fileViewerRef} fileId={fileInfo._id} track={false} toolbarPluginInstance={toolbarPluginInstance} />
                    </div>
                )
            }
        } else if (fileInfo?.type === IMAGE) {
            return (
                <div className="cm-height100 cm-width100 cm-flex-center">
                    <img id="fullScreenImage" className="cm-cursor-pointer" src={fileInfo.content.url} alt={fileInfo.title} width={"100%"} height={"100%"} style={{ objectFit: "scale-down" }} onClick={() => imageFullScreen?.requestFullscreen()} />
                </div>
            )
        }
        else if((fileInfo?.type === LINK && CommonUtil.__checkVideoDomain(fileInfo.content.url)) || fileInfo?.type === VIDEO){
            return (
                <div className="cm-flex-center cm-height100 cm-width100 ">
                    <ReactPlayer
                        className   =   "cm-aspect-ratio16-9 j-seller-resource-viewer-video-player"
                        width       =   "100%"
                        height      =   "100%"
                        controls    =   {true}
                        url         =   {getCurrentResource()?.content?.url}
                        loop        =   {false}
                        onClick     =   {() => imageFullScreen?.requestFullscreen()}
                        config={{
                            youtube: {
                                playerVars: { autoplay: 0 }
                            },
                        }}
                    />
                </div>
            )
        }else if(fileInfo?.type === LINK){
            return (
                <>
                    {
                        getCurrentResource()?.content?.properties?.embedLink ?
                            <iframe width="100%" height="100%" src={checkDocsUrl(getCurrentResource().content.url) ? checkDocsUrl(getCurrentResource().content.url) : parseUrl(getCurrentResource().content.url)} frameBorder={0}></iframe>
                        :
                            <IframeComponent resource={getCurrentResource()}/>
                    }
                </>
            )
        }
        else {
            return <div>File type not supported</div>
        }
    }

    return (
        <div className="cm-width100 cm-height100 cm-position-relative cm-flex">
            {
                loading
                ?
                    <div className="cm-flex-center cm-width100">
                        <Loading/>
                    </div>
                :
                (
                    showAnalytics() ?
                        <>
                            <div style={{ width: "calc(100% - 500px)", height: "calc(100% - 60px)", padding: "30px", background: "#F1F4F7", borderRadius: "4px 0px 0px 4px" }} className="cm-flex-center">
                                {getViewerByFileType(getCurrentResource())}
                            </div>
                            <div style={{ width: "500px" }}>
                                <div style={{ height: "60px", justifyContent: "space-between", borderBottom: "1px solid #F0F0F0" }} className="cm-flex-align-center cm-padding-inline15">
                                    <Text className="cm-font-fam500 cm-font-size16" style={{ width: "90%" }} ellipsis={{ tooltip: getCurrentResource()?.title }}>{getCurrentResource()?.title}</Text>
                                    <Space>
                                        {/* <MaterialSymbolsRounded font={fullScreen ? "collapse_content" : "open_in_full"} size="20" className="cm-cursor-pointer" onClick={handleFullScreen}/> */}
                                        <MaterialSymbolsRounded font="close" size="22" className="cm-cursor-pointer" onClick={() => onClose()} />
                                    </Space>
                                </div>
                                <div className="cm-flex" style={{ height: "calc(100% - 61px)", overflow: "auto" }}>
                                    <Space direction="vertical" className="cm-padding15 cm-width100" size={15}>
                                        <Space direction="vertical" className="cm-width100" size={5}>
                                            <Text className="cm-font-fam500 cm-font-size13 cm-font-opacity-black-67">Engagement</Text>
                                            <Row className="cm-border-light cm-border-radius6 cm-padding15">
                                                <Col span={7}>
                                                    <Space direction="vertical" size={5}>
                                                        <Text className="cm-font-fam600 cm-font-size20">{getCurrentResource()?.report?.views === 0 ? "0" : getCurrentResource()?.report?.views}</Text>
                                                        <Text className="cm-font-opacity-black-67">Views</Text>
                                                    </Space>
                                                </Col>
                                                <Col span={7}>
                                                    <Space direction="vertical" size={5}>
                                                        <Text className="cm-font-fam600 cm-font-size20">{getCurrentResource()?.report?.uniqueViews === 0 ? "0" : getCurrentResource()?.report?.uniqueViews}</Text>
                                                        <Text className="cm-font-opacity-black-67">Unique Views</Text>
                                                    </Space>
                                                </Col>
                                                <Col span={10}>
                                                    <Space direction="vertical" size={5}>
                                                        <Text className="cm-font-fam600 cm-font-size20">{getCurrentResource()?.report?.timeSpent === 0 ? "0" : CommonUtil.__getFormatDuration(getCurrentResource()?.report?.timeSpent).slice(0, 2).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</Text>
                                                        <Text className="cm-font-opacity-black-67">Total Time Spent</Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Space>
                                        <Space direction="vertical" className="cm-width100" size={5}>
                                            <Text className="cm-font-fam500 cm-font-size13 cm-font-opacity-black-67">Last Viewed By</Text>
                                            <div className="cm-border-light cm-padding15 cm-border-radius6 cm-flex-direction-column">
                                                <div className="cm-flex-space-between">
                                                    {getCurrentResource()?.report?.lastViewedBy ? (
                                                        <Space className="cm-flex-space-between cm-width100">
                                                            <div className="cm-flex cm-gap8">
                                                                <Avatar size={42} shape='square' style={{ backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", borderRadius: "6px" }} src={getCurrentResource().report.lastViewedBy.profileUrl ? <img src={getCurrentResource().report.lastViewedBy.profileUrl} alt={CommonUtil.__getFullName(getCurrentResource().report.lastViewedBy.firstName, getCurrentResource().report.lastViewedBy.lastName)} /> : ""}>
                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(getCurrentResource()?.report?.lastViewedBy?.firstName, getCurrentResource()?.report?.lastViewedBy?.lastName), 1)}
                                                                </Avatar>
                                                                <Space direction="vertical" size={0}>
                                                                    <Text className="cm-font-fam500">{CommonUtil.__getFullName(getCurrentResource()?.report?.lastViewedBy.firstName, getCurrentResource()?.report?.lastViewedBy?.lastName)}</Text>
                                                                    {getCurrentResource()?.report?.lastViewedBy.emailId !== "anonymous@buyerstage.io" ? <Text className="cm-font-size12 cm-font-opacity-black-67"  style={{ width: "185px" }} ellipsis={{tooltip: getCurrentResource()?.report?.lastViewedBy.emailId}}>{getCurrentResource()?.report?.lastViewedBy.emailId}</Text> : "-"}
                                                                </Space>
                                                            </div>
                                                            {getCurrentResource()?.report?.lastViewedAt && getCurrentResource()?.report?.lastViewedAt !== 0 ? (
                                                                <Space size={4}>
                                                                    <Text className="cm-font-size12">{CommonUtil.__getFormatDate(getCurrentResource()?.report?.lastViewedAt)},</Text>
                                                                    <Text className="cm-font-size12">{CommonUtil.__format_AM_PM(getCurrentResource()?.report?.lastViewedAt)}</Text>
                                                                </Space>
                                                            ) : null}
                                                        </Space>
                                                    ) : (
                                                        <span className="cm-font-opacity-black-67 cm-font-size12">Not viewed yet</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Space>
                                        <Space direction="vertical" className="cm-width100" size={5}>
                                            <Text className="cm-font-fam500 cm-font-size12 cm-font-opacity-black-67">Categories</Text>
                                            <div className="cm-border-light cm-padding15 cm-border-radius6">
                                                {getCurrentResource()?.categories?.length > 0 ? (
                                                    getCurrentResource().categories.map((_category: any) => <Tag color='blue' key={_category.name} style={{ marginBottom: "5px" }}>{_category.name}</Tag>)
                                                ) : (
                                                    <span className="cm-font-opacity-black-67 cm-font-size12">No categories found</span>
                                                )}
                                            </div>
                                        </Space>
                                        <Space direction="vertical" className="cm-width100" size={5}>
                                            <Text className="cm-font-fam500 cm-font-size13 cm-font-opacity-black-67">{getTextForModuleType(module.type)}</Text>
                                            {module.type !== "library" && module.type !== "contentPerformance" ? (
                                                <Space direction="vertical" className="cm-width100" size={10}>
                                                    {getCurrentResource()?.report?.viewDetails.length === 0 ? (
                                                        <span className="cm-font-opacity-black-67 cm-font-size12">All activities will appear here</span>
                                                    ) : (
                                                        getCurrentResource()?.report?.viewDetails.map((_detail: any) => (
                                                            <div className="cm-border-light cm-border-radius6 cm-padding10" key={_detail.uuid}>
                                                                <Space className="cm-flex-space-between">
                                                                    <div className="cm-flex cm-gap8">
                                                                        <Avatar size={42} shape='square' style={{ backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", borderRadius: "6px" }} src={_detail.viewer.profileUrl ? <img src={_detail.viewer.profileUrl} alt={CommonUtil.__getFullName(_detail.viewer.firstName, _detail.viewer.lastName)} /> : ""}>
                                                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_detail.viewer.firstName, _detail.viewer.lastName), 1)}
                                                                        </Avatar>
                                                                        <Space direction="vertical" size={0}>
                                                                            <Text className="cm-font-fam500">{CommonUtil.__getFullName(_detail.viewer.firstName, _detail.viewer.lastName)}</Text>
                                                                            {_detail.viewer.emailId !== "anonymous@buyerstage.io" ? <Text style={{ width: "175px" }} ellipsis={{ tooltip: _detail.viewer.emailId }} className="cm-font-size12 cm-font-opacity-black-67">{_detail.viewer.emailId}</Text> : "-"}
                                                                        </Space>
                                                                    </div>
                                                                    <Space direction="vertical" size={0} style={{ alignItems: "end" }}>
                                                                        {_detail?.lastViewedAt && _detail?.lastViewedAt !== 0 ? (
                                                                            <Space size={4}>
                                                                                <Text className="cm-font-size12">{CommonUtil.__getFormatDate(_detail.lastViewedAt)},</Text>
                                                                                <Text className="cm-font-size12">{CommonUtil.__format_AM_PM(_detail.lastViewedAt)}</Text>
                                                                            </Space>
                                                                        ) : null}
                                                                    </Space>
                                                                </Space>
                                                                {_detail.timeSpent > 0 ? (
                                                                    <>
                                                                        <Divider className="cm-margin-block10" />
                                                                        <Space className="cm-flex-space-between">
                                                                            <div></div>
                                                                            <Text className="cm-flex-align-center cm-font-fam500"><MaterialSymbolsRounded font="timer" size="18" />&nbsp; {_detail.timeSpent === 0 ? "0" : CommonUtil.__getFormatDuration(_detail.timeSpent).slice(0, 2).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</Text>
                                                                        </Space>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        ))
                                                    )}
                                                </Space>
                                            ) : (
                                                <div className="cm-border-radius6">
                                                    {getCurrentResource()?.roomReports?.length === 0 ? (
                                                        <span className="cm-font-opacity-black-67 cm-font-size12">All activities will appear here</span>
                                                    ) : (
                                                        getCurrentResource()?.roomReports.map((_report: any) => (
                                                            <Collapse
                                                                className="cm-margin-bottom10 hover-item"
                                                                items={[
                                                                    {
                                                                        key: _report.uuid,
                                                                        label: (
                                                                            <Space size={4}>
                                                                                {_report?.roomStub?.title}
                                                                                <span className="show-on-hover-icon" onClick={(e) => { e.stopPropagation(); window.open(`#rooms/${_report.roomStub.accountStub.uuid}/${_report.roomStub.uuid}/sections`, '_blank'); }}>
                                                                                    <MaterialSymbolsRounded font="open_in_new" size="15" />
                                                                                </span>
                                                                            </Space>
                                                                        ),
                                                                        children: _report?.report?.viewDetails.map((viewDetail: any, index: number) => (
                                                                            <div
                                                                                key={viewDetail.uuid}
                                                                                className={`cm-flex-space-between cm-border-light ${index === getCurrentResource()?.roomReports?.length - 1 ? "" : "cm-margin-bottom15"} cm-border-radius6 cm-padding10`}
                                                                            >
                                                                                <div className="cm-flex cm-gap8">
                                                                                    <Avatar
                                                                                        size={42}
                                                                                        shape="square"
                                                                                        style={{ backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", borderRadius: "6px" }}
                                                                                        src={
                                                                                            viewDetail.viewer.profileUrl
                                                                                                ?
                                                                                                <img src={viewDetail.viewer.profileUrl} alt={CommonUtil.__getFullName(viewDetail.viewer.firstName, viewDetail.viewer.lastName)} />
                                                                                                :
                                                                                                ""
                                                                                        }
                                                                                    >
                                                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(viewDetail.viewer.firstName, viewDetail.viewer.lastName), 1)}
                                                                                    </Avatar>
                                                                                    <Space direction="vertical" size={0}>
                                                                                        <Text className="cm-font-fam500"> {CommonUtil.__getFullName(viewDetail.viewer.firstName, viewDetail.viewer.lastName)} </Text>
                                                                                        <Text ellipsis={{ tooltip: viewDetail.viewer.emailId }} style={{ width: "175px" }} className="cm-font-size12 cm-font-opacity-black-67">{viewDetail.viewer.emailId}</Text>
                                                                                    </Space>
                                                                                </div>
                                                                                <Space direction="vertical" size={1} style={{ alignItems: "end" }} >
                                                                                    {
                                                                                        viewDetail?.lastViewedAt && viewDetail?.lastViewedAt !== 0 
                                                                                        ?
                                                                                            <Space size={4}>
                                                                                                <Text className="cm-font-size12">{CommonUtil.__getFormatDate(viewDetail.lastViewedAt)},</Text>
                                                                                                <Text className="cm-font-size12">{CommonUtil.__format_AM_PM(viewDetail.lastViewedAt)}</Text>
                                                                                            </Space>
                                                                                        : 
                                                                                            null
                                                                                    }
                                                                                    <Text className="cm-font-size12 cm-flex-align-center" style={{lineHeight: "22px"}}>
                                                                                        <MaterialSymbolsRounded font="timer" size="14" />&nbsp; {viewDetail.timeSpent === 0 ? "0" : CommonUtil.__getFormatDuration(viewDetail.timeSpent).slice(0, 2).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}
                                                                                    </Text>
                                                                                </Space>
                                                                            </div>
                                                                        )),
                                                                    }
                                                                ]}
                                                            />
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                            <div className="cm-padding15" />
                                        </Space>
                                    </Space>
                                </div>
                            </div>
                        </>
                    :
                        <>
                            <div style={{ width: "calc(100% - 500px)", height: "calc(100% - 60px)", padding: "30px", background: "#F1F4F7", borderRadius: "4px 0px 0px 4px" }} className="cm-flex-center">
                                {getViewerByFileType(getCurrentResource())}
                            </div>
                            <div style={{ width: "500px" }}>
                                <div style={{ height: "60px", justifyContent: "space-between", borderBottom: "1px solid #F0F0F0" }} className="cm-flex-align-center cm-padding-inline15">
                                    <Text className="cm-font-fam500 cm-font-size16" style={{ width: "90%" }} ellipsis={{ tooltip: getCurrentResource()?.title }}>{getCurrentResource()?.title}</Text>
                                    <Space>
                                        <MaterialSymbolsRounded font="close" size="22" className="cm-cursor-pointer" onClick={() => onClose()} />
                                    </Space>
                                </div>
                                <div className="cm-flex" style={{ height: "calc(100% - 61px)", overflow: "auto" }}>
                                    <Space direction="vertical" className="cm-padding15 cm-width100" size={15}>
                                        <Space direction="vertical" className="cm-width100" size={5}>
                                            <Text className="cm-font-fam500 cm-font-size12 cm-font-opacity-black-67">Tags</Text>
                                            <div className="cm-border-light cm-padding15 cm-border-radius6">
                                                {getCurrentResource()?.categories?.length > 0 ? (
                                                    getCurrentResource().categories.map((_category: any) => <Tag color='blue' key={_category.name} style={{ marginBottom: "5px" }}>{_category.name}</Tag>)
                                                ) : (
                                                    <span className="cm-font-opacity-black-67 cm-font-size12">No tags found</span>
                                                )}
                                            </div>
                                        </Space>
                                    </Space>
                                </div>
                            </div>
                        </>
                )
            }
        </div>
    );

}


export default AnalyticsResourceViewer