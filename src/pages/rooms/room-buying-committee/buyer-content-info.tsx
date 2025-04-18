import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button, Space, Table } from "antd";

import { RESOURCE_TYPE_CONFIG } from "../../library/config/resource-type-config";
import { CONTENT_REPORTS_BY_BUYER, ROOM_PORTAL_LINK } from "../api/rooms-query";
import { CommonUtil } from "../../../utils/common-util";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import ResourceLinkCopyModal from "../room-resources/resource-link-copy-modal";
import Loading from "../../../utils/loading";

const BuyerContentInfo = (props: { buyer: any }) => {

    const { buyer } = props;

    const params = useParams();

    const [showCopy, setShowCopy] =   useState({
        visibility  :   false,
        link        :   ""
    });

    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })

    const { data, loading } = useQuery(CONTENT_REPORTS_BY_BUYER, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId,
            contactUuid: buyer?.uuid
        }
    })

    const { data: buyerPortalLink } =   useQuery(ROOM_PORTAL_LINK, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

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
        "_timeSpent": (_timeSpent: any) => {
            return (
                <div>{CommonUtil.__getFormatDuration(_timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</div>
            )
        },
        "_copyLink": (_: any, data: any) => {
            return (
                <Button  type="link" onClick={(e) => handleCopyLink(e, data)}>Copy Link</Button>
            )
        },
    }

    const columns = [
        {
            title: "Resource",
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

    const handleCopyLink = (e: any, data: any) => {        
        e.stopPropagation();
        let resourceLink = buyerPortalLink.room.buyerPortalLink + "&resourceid=" + data.resource.uuid;
        if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
            setShowCopy({
                visibility: true,
                link: resourceLink
            })
        }else{
            window.navigator.clipboard.writeText(resourceLink)
            CommonUtil.__showSuccess("Resource Link Copied Successfully")
        }
    }

    if (loading) return <Loading />

    return (
        <>
            <Table
                bordered
                pagination      =   {false}
                size            =   "small"
                className       =   'cm-width100'
                rowClassName    =   {"cm-cursor-pointer"}
                columns         =   {columns}
                dataSource      =   {data.contentReportsByBuyer}
                onRow           =   {(record: any) => ({
                    onClick: () => {
                        setResourceAnalytics({ isOpen: true, resource: record.resource })
                    }
                })}
            />
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": params.roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
            <ResourceLinkCopyModal 
                isOpen  =   {showCopy.visibility}
                onClose =   {() => setShowCopy({visibility: false, link: ""})}
                link    =   {showCopy.link}
            />
        </>
    )
}

export default BuyerContentInfo