import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Card, Space, Table } from "antd";
import { useParams } from "react-router-dom";

import { RESOURCE_TYPE_CONFIG } from "../../library/config/resource-type-config";
import { R_CONTENT_REPORT } from "../../accounts/api/accounts-query";
import { CommonUtil } from "../../../utils/common-util";
import { ROOM_PORTAL_LINK } from "../api/rooms-query";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import ResourceLinkCopyModal from "../room-resources/resource-link-copy-modal";
import NoResultFound from "../../../components/no-result-found";
import Loading from "../../../utils/loading";

const ContentInfo = () => {

    const params = useParams();

    const [showCopy, setShowCopy] =   useState({
        visibility  :   false,
        link        :   ""
    });

    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })

    const { data, loading, error } = useQuery(R_CONTENT_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        }
    })

    const { data: buyerPortalLink } =   useQuery(ROOM_PORTAL_LINK, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

    const handleCopyLink = (e: any, data: any) => {        
        e.stopPropagation();
        let resourceLink = buyerPortalLink.room.buyerPortalLink + "&resourceid=" + data.resource.uuid;
        if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
            setShowCopy({
                visibility: true,
                link: resourceLink
            })
        }else{
            window.navigator.clipboard.writeText(buyerPortalLink.room.buyerPortalLink + "&resourceid=" + data.resource.uuid)
            CommonUtil.__showSuccess("Resource Link Copied Successfully")
        }
    }

    const renderers = {
        "_content": (_content: any, _record: any) => {
            return (
                <Space size={20}>
                    <div className="j-report-thumbnail-wrap cm-flex-center">
                        {
                            _content.content.thumbnailUrl ?
                                <img src={_content.content.thumbnailUrl} alt={_content.content.thumbnailUrl} width={100} style={{ height: "100%", objectFit: "scale-down" }} />
                                :
                                <img src={RESOURCE_TYPE_CONFIG[_content.type].imageFile} alt={_content.type} style={{ width: "100px", height: "50px", borderRadius: "8px" }} />
                        }
                    </div>
                    <Space direction='vertical' size={8}>
                        <div>{_content.title}</div>
                        <Space size={5} className="j-content-report-tag">
                            <div><MaterialSymbolsRounded font={RESOURCE_TYPE_CONFIG[_content.type].displayIconName} size="18" /></div>
                            <div >{RESOURCE_TYPE_CONFIG[_content.type].displayName}</div>
                        </Space>
                    </Space>
                </Space>
            )
        },
        "_lastViewedAt": (_lastViewedAt: any) => {
            return (
                <div>{CommonUtil.__getFormatDate(_lastViewedAt)} - {CommonUtil.__format_AM_PM(_lastViewedAt)}</div>
            )
        },
        "_views": (_views: any) => {
            return (
                <div>{_views}</div>
            )
        },
        "_copyLink": (_: any, data: any) => {
            return (
                <Button  type="link" onClick={(e) => handleCopyLink(e, data)}>Copy Link</Button>
            )
        },
        "_timeSpent": (_timeSpent: any) => {
            return (
                <div>{CommonUtil.__getFormatDuration(_timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</div>
            )
        },
    }

    const columns = [
        {
            title: "Content",
            dataIndex: 'resource',
            key: 'resource',
            render: renderers._content,
            width: '45%',
        },
        {
            title: "Last viewed at",
            dataIndex: 'lastViewedAt',
            key: 'lastViewedAt',
            render: renderers._lastViewedAt,
            width: '25%',
        },
        {
            title: "Time spent",
            dataIndex: 'timeSpent',
            key: 'timeSpent',
            render: renderers._timeSpent,
            width: '15%',
        },
        {
            title: "Views",
            dataIndex: 'views',
            key: 'views',
            render: renderers._views,
            width: '15%',
        },
        {
            title: "Actions",
            dataIndex: 'copyLink',
            key: 'copyLInk',
            render: renderers._copyLink,
        },
    ];

    if (loading) return <div className="j-room-activity-card cm-width100 cm-flex-center"><Loading /></div>
    if (error) return <SomethingWentWrong />

    return (
        <>
            {
                data.contentReports.length > 0
                    ?
                    <Table
                        bordered
                        pagination      =   {false}
                        className       =   'cm-height100'
                        rowClassName    =   {"cm-cursor-pointer"}
                        size            =   "small"
                        columns         =   {columns}
                        dataSource      =   {data.contentReports}
                        onRow           =   {(record: any) => ({
                            onClick: () => {
                                setResourceAnalytics({ isOpen: true, resource: record.resource })
                            }
                        })}
                    />
                :
                    <Card bordered={false} className="j-room-activity-card cm-width100 cm-flex-center">
                        <div className="cm-height100 cm-flex-center">
                            <NoResultFound message={"No resources viewed yet!"} description={"Tracking will appear once the buyer interacts with content."} />
                        </div>
                    </Card>
            }
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": params.roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
            <ResourceLinkCopyModal 
                isOpen  =   {showCopy.visibility}
                onClose =   {() => setShowCopy({visibility: false, link: ""})}
                link    =   {showCopy.link}
            />
        </>
    )
}

export default ContentInfo