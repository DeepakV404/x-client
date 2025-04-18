import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Pagination, Table, Typography } from "antd";
import { useOutletContext } from "react-router-dom";

import { CommonUtil } from "../../../utils/common-util";
import { ANALYTICS_RESOURCE_LIMIT } from "../../../constants/module-constants";
import { CD_RESOURCE_DETAIL_REPORT, CD_TOTAL_RESOURCE_DETAIL_REPORT } from "./api/cp-query";
import { RESOURCE_TYPE_CONFIG } from "../../library/config/resource-type-config";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";

const { Text }  =  Typography;

const AllResources = () => {

    const { from, to, selectedTemplate } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedTemplate: string }>();

    const [currentPage, setCurrentPage]             =   useState(1);
    const [resourceAnalytics, setResourceAnalytics] =   useState({
        isOpen: false,
        resource: null
    })


    const { data, loading, error}      =   useQuery(CD_RESOURCE_DETAIL_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            templateUuids : selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
            pageConstraint : {
                page: currentPage,
                limit: ANALYTICS_RESOURCE_LIMIT
            }
        }
    })

    const { data: totalResourcesCount }    =   useQuery(CD_TOTAL_RESOURCE_DETAIL_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            templateUuids : selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
        }
    });

    const calculateDays = (from: number, to: number): number => {
        return Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
    };

    let days = calculateDays(from, to);

    const renderers = {
        "_name"  :   (_: any, _record: any) => {
            return (
                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                    <img src={RESOURCE_TYPE_CONFIG[_record.resource.type].resourceTypeImg} style={{borderRadius: "5px", objectFit:"contain"}} width={20} height={20}/>
                    <Text style={{ maxWidth: "100%"}} ellipsis={{ tooltip: _record?.resource?.title }}>{_record?.resource?.title}</Text>
                </div>
            )
        },
        "_type" : (_: any, _record: any) => {
            return (
                <div>{RESOURCE_TYPE_CONFIG[_record.resource.type].displayName}</div>
            )
        },
        "uniqueViews" : (_: any, resource: any) => {
            return (
                <div>{resource.uniqueViews}</div>
            )
        },
        "avgTimeSpent" : (_: any, _record: any) => {
            return (
                <div>{`${CommonUtil.__getFormatDuration(_record?.totalTimeSpent/days).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ") || "-"}`}</div>
            )
        },
        "totalTimeSpent" : (_: any, _record: any) => {
            return (
                <div>{`${CommonUtil.__getFormatDuration(_record?.totalTimeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ") || "-"}`}</div>
            )
        },
        "totalViews" : (_: any, resource: any) => {
            return (
                <div>{resource.totalViews}</div>
            )
        },
        "decksUsedIn" : (_: any, resource: any) => {
            return (
                <div>{resource.decksUsedIn}</div>
            )
        },
        "roomsUsedIn" : (_: any, resource: any) => {
            return (
                <div>{resource.roomsUsedIn}</div>
            )
        },
    }

    const columns = [
        {
            title       :   "Name",
            dataIndex   :   'name',
            key         :   'name',
            render      :   renderers._name,
            width       :   '300px',
        },
        {
            title       :   "Type",
            dataIndex   :   'type',
            key         :   'type',
            render      :   renderers._type,
            width       :   '100px',
        },
        {
            title       :   "Total Time Spent",
            dataIndex   :   "totalTimeSpent",
            key         :   "totalTimeSpent",
            render      :   renderers.totalTimeSpent,
            width       :   '150px'
        },
        {
            title       :   "Total Views",
            dataIndex   :   "totalViews",
            key         :   "totalViews",
            render      :   renderers.totalViews,
            width       :   '100px'
        },
        {
            title       :   "Unique Views",
            dataIndex   :   'uniqueViews',
            key         :   'uniqueViews',
            render      :   renderers.uniqueViews,
            width       :   '100px',
        },
        {
            title       :   "Average Time Spent per day",
            dataIndex   :   "avgTimeSpent",
            key         :   "avgTimeSpent",
            render      :   renderers.avgTimeSpent,
            width       :   '150px'
        },
        {
            title       :   "Viewed in Room",
            dataIndex   :   "roomsUsedIn",
            key         :   "roomsUsedIn",
            render      :   renderers.roomsUsedIn,
            width       :   '100px'
        },
        {
            title       :   "Viewed in Link",
            dataIndex   :   "decksUsedIn",
            key         :   "decksUsedIn",
            render      :   renderers.decksUsedIn,
            width       :   '100px'
        },
    ];

    // const filteredData = data?._cdResourceDetailReport.filter((_resource: any) =>
    //     _resource?.resource?.title?.toLowerCase().includes(searchKey.toLowerCase())
    // );

    if(error) return <SomethingWentWrong/>;

    return(
        <div className="j-cp-analytics-card cm-padding0" style={{height: "550px"}}>
            <div className="cm-font-fam500 cm-secondary-text cm-padding-block20 cm-padding-inline15">Top Performing Content</div>
            {
                loading
                ?
                    <Loading/>
                :
                    <Table    
                        className       =   "j-accounts-table cm-position-relative"
                        rowClassName    =   "cm-cursor-pointer"
                        scroll          =   {{y: 370}}
                        columns         =   {columns} 
                        dataSource      =   {data?._cdResourceDetailReport}
                        pagination      =   {false}
                        loading         =   {{spinning: loading, indicator: <Loading/>}}
                        locale          =   {{
                            emptyText:  <div className='cm-flex-center' style={{height: "350px"}}>
                                            {loading ? <Loading /> : <EmptyText text='No resource found'/>}
                                        </div>
                        }}
                        onRow={(record) => ({
                            onClick: () => setResourceAnalytics({ isOpen: true, resource: record.resource })
                        })}
                    />
            }
            {
                data?._cdResourceDetailReport.length > 0 &&
                    <div style={{bottom: "15px", right: "40px", position: "absolute"}}>
                        <Pagination size='small' current={currentPage} defaultPageSize={ANALYTICS_RESOURCE_LIMIT} onChange={(data: any) => setCurrentPage(data)} total={totalResourcesCount?._cdTotalResourceDetailReport} />
                    </div>
            }
            <AnalyticsResourceViewerModal module={{ "type": "contentPerformance" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
        </div>
    )
}

export default AllResources