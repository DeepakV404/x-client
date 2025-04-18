import { useQuery } from "@apollo/client";
import { Table, Typography } from "antd";
import { useOutletContext } from "react-router-dom";

import { CommonUtil } from "../../../utils/common-util";
import { CD_RESOURCE_STATS_BY_CATEGORY } from "./api/cp-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";

const { Text } = Typography;

const ResourceByCategory = () => {

    const { from, to, selectedTemplate } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedTemplate: string }>();

    const { data, loading, error } = useQuery(CD_RESOURCE_STATS_BY_CATEGORY, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            templateUuids: selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
        }
    })

    const renderers = {
        "_category": (_: any, _record: any) => {
            return (
                <Text style={{ maxWidth: "100%" }} ellipsis={{ tooltip: _record?.category?.name }}>{_record?.category?.name}</Text>
            )
        },
        "_resourceCount": (_: any, _record: any) => {
            return (
                <div>{_record?.totalResources}</div>
            )
        },
        "timeSpent": (_: any, _record: any) => {
            return (
                <div>{`${CommonUtil.__getFormatDuration(_record?.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ") || "-"}`}</div>
            )
        },
        "views": (_: any, _record: any) => {
            return (
                <div>{_record.views}</div>
            )
        },
        "_usedInRoom": (_: any, _record: any) => {
            return (
                <div>{_record?.roomViews}</div>
            )
        },
        "deckViews": (_: any, _record: any) => {
            return (
                <div>{_record?.deckViews}</div>
            )
        },
    }

    const columns: any = [
        {
            title: "Category",
            dataIndex: 'title',
            key: 'title',
            render: renderers._category,
            width: '200px',
            fixed: "left",
        },
        {
            title: "No.of Resources",
            dataIndex: 'totalResources',
            key: 'totalResources',
            render: renderers._resourceCount,
            width: '150px',
        },
        {
            title: "Time Spent",
            dataIndex: 'buyers',
            key: 'buyers',
            render: renderers.timeSpent,
            width: '180px',
        },
        {
            title: "Views",
            key: "stats",
            render: renderers.views,
            width: '120px'
        },
        {
            title: "Viewed in Room",
            key: "roomViews",
            render: renderers._usedInRoom,
            width: '150px'
        },
        {
            title: "Viewed in Link",
            key: "deckViews",
            render: renderers.deckViews,
            width: '150px'
        },
    ];

    const TopFiveStats = data?._cdResourceStatsByCategory

    if (error) return <SomethingWentWrong />;

    return (
        <div className="j-cp-analytics-card cm-padding0" style={{ height: "370px" }}>
            <div className="cm-font-fam500 cm-secondary-text cm-padding-block20 cm-padding-inline15">Category Performance</div>
            {
                loading
                    ?
                        <Loading />
                    :
                        <Table
                            className   =   'j-accounts-table cm-padding-top20 cm-position-relative'
                            columns     =   {columns}
                            dataSource  =   {TopFiveStats?.filter((item: any) => item.views > 0 && item.category !== null)}
                            pagination  =   {false}
                            scroll      =   {{ y: 260 }}
                            locale      =   {{
                                emptyText: <div className='cm-flex-center' style={{ height: "250px" }}>
                                    {loading ? <Loading /> : <EmptyText text='No resource found' />}
                                </div>
                            }}
                        />
            }
        </div>
    )
}

export default ResourceByCategory