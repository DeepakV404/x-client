import { useState } from "react";
import { useQuery } from "@apollo/client"
import { CD_RESOURCE_ACTIVITIES, CD_TOTAL_RESOURCE_ACTIVITIES } from "./api/cp-query"
import { useOutletContext } from "react-router-dom";
import { Pagination, Space, Typography } from "antd";


import { RESOURCE_TYPE_CONFIG } from "../../library/config/resource-type-config";
import { ANALYTICS_RESOURCE_LIMIT } from "../../../constants/module-constants";
import { CommonUtil } from "../../../utils/common-util";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import Loading from "../../../utils/loading";

const { Text } = Typography;

const ResourceActivities = () => {

    const { from, to, selectedTemplate } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedTemplate: string }>();

    const [currentPage, setCurrentPage] = useState(1);

    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })

    const { data, loading } = useQuery(CD_RESOURCE_ACTIVITIES, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            templateUuids: selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
            pageConstraint: {
                page: currentPage,
                limit: ANALYTICS_RESOURCE_LIMIT
            }
        }
    })

    const { data: activityCount } = useQuery(CD_TOTAL_RESOURCE_ACTIVITIES, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            templateUuids: selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
        }
    })

    return (
        <div className="j-cp-analytics-card cm-padding0" style={{ paddingBottom: "45px", height: "545px" }}>
            {
                loading ?
                    <Loading />
                    :
                    <>
                        <div className="cm-font-fam500 cm-secondary-text cm-padding-block20 cm-padding-inline15">Resource Activities</div>
                        <div className="j-cd-room-activities">
                            {
                                data && data._cdResourceActivities.length > 0
                                ?
                                    data._cdResourceActivities.map((activity: any) => (
                                        <Space className='cm-width100 j-home-room-activity cm-space-inherit cm-cursor-pointer' direction='vertical' style={{ paddingInline: "15px" }} onClick={() => setResourceAnalytics({ isOpen: true, resource: activity.resource })}>
                                            <div className='cm-flex-space-between cm-width100' style={{ columnGap: "10px" }}>
                                                <div className='cm-flex-direction-row cm-flex-align-center' style={{ maxWidth: "calc(100% - 110px)", columnGap: "8px" }}>
                                                    <img src={RESOURCE_TYPE_CONFIG[activity.resource.type].resourceTypeImg} style={{ borderRadius: "5px", objectFit: "contain" }} width={20} height={20} />
                                                    <Text className='cm-font-fam500' style={{ maxWidth: "100%" }} ellipsis={{ tooltip: activity.resource.title }}>{activity.resource.title}</Text>
                                                </div>
                                                <div className='cm-font-size11 cm-dark-grey-text cm-flex cm-flex-direction-row cm-flex-center'>
                                                    {CommonUtil.__getDateDay(new Date(activity.viewedAt))}, {CommonUtil.__format_AM_PM(activity.viewedAt)}
                                                </div>
                                            </div>
                                            <div>{CommonUtil.__getFullName(activity.buyer.firstName, activity.buyer.lastName)} has viewed the resource {activity.timeSpent ? `for ${CommonUtil.__getFormatDuration(activity.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : ""}</div>
                                        </Space>
                                    ))
                                :
                                    <div className="cm-flex-center cm-secondary-text" style={{ height: "calc(100% - 10px)" }}>No activities yet</div>
                            }
                        </div>
                        {
                            data?._cdResourceActivities.length > 0 &&
                                <div className="cm-float-right cm-margin-top10 cm-margin-right5">
                                    <Pagination size='small' current={currentPage} defaultPageSize={ANALYTICS_RESOURCE_LIMIT} onChange={(page) => setCurrentPage(page)} total={activityCount?._cdTotalResourceActivities} showSizeChanger={false} />
                                </div>
                        }
                    </>
            }
            <AnalyticsResourceViewerModal module={{ "type": "contentPerformance" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics?.resource} />
        </div>
    )
}

export default ResourceActivities