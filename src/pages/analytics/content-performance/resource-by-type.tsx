import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Dropdown, MenuProps, Space, Table, Typography } from "antd";
import _ from "lodash";

import { CD_REGION_CONTENT_PERFORMANCE } from "./api/cp-query";
import { CommonUtil } from "../../../utils/common-util";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";

const { Text } = Typography;

const ResourceByType = () => {

    const { from, to, selectedTemplate } = useOutletContext<{
        from                :   number;
        to                  :   number;
        selectedTemplate    :   string;
    }>();

    const [filterType, setFilterType] = useState({
        api         :   "REGION",
        displayName :   "Region"
    });
    const [expandedRowKeys, setExpandedRowKeys]                 = useState<any[]>([]);

    const { data, loading, error } = useQuery(CD_REGION_CONTENT_PERFORMANCE, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to,
            },
            templateUuids: selectedTemplate === "all_templates" ? undefined : [selectedTemplate],
            filter: filterType.api,
        },
    });

    const columnProps = {
        "region":   {
            key         :   "region",
            title       :   "Region",
            width       :   "150px",
        },
        "teamMember":   {
            key         :   "teamMember",
            title       :   "Team Member",
            width       :   "150px"
        },
        "viewedInRooms":   {
            key         :   "viewedInRooms",
            title       :   "Viewed in Rooms",
            width       :   "150px"
        },
        "totalNoOfRes":   {
            key         :   "totalNoOfRes",
            title       :   "Total No.of Resources",
            width       :   "170px"
        },
        "totalTimeSpent":   {
            key         :   "totalTimeSpent",
            title       :   "Total Time Spent",
            width       :   "150px"
        },
        "totalViews": {
            key         :   "totalViews",
            title       :   "Total Views",
            width       :   "130px"
        }
    }

    const commonColumns: any = [
        {
            dataIndex   :   "viewInRooms",
            title       :   columnProps.viewedInRooms.title,
            key         :   columnProps.viewedInRooms.key,
            width       :   columnProps.viewedInRooms.width,
        },
        {
            dataIndex   :   "totalNoOfRes",
            title       :   columnProps.totalNoOfRes.title,
            key         :   columnProps.totalNoOfRes.key,
            width       :   columnProps.totalNoOfRes.width,
        },
        {
            dataIndex   :   "totalTimeSpent",
            title       :   columnProps.totalTimeSpent.title,
            key         :   columnProps.totalTimeSpent.key,
            width       :   columnProps.totalTimeSpent.width,
            render      :   (detail: any) => <div>{CommonUtil.__getFormatDuration(detail).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</div>,
        },
        {
            dataIndex   :   "totalView",
            title       :   columnProps.totalViews.title,
            key         :   columnProps.totalViews.key,
            width       :   columnProps.totalViews.width,
        },
    ]

    const regionColumns: any = [
        {
            dataIndex   :   "region",
            fixed       :   "left",
            title       :   columnProps.region.title,
            key         :   columnProps.region.key,
            width       :   columnProps.region.width,
            render      :   (_: any, record: any) => <Space className="cm-flex-align-center cm-cursor-pointer"><MaterialSymbolsRounded font={!expandedRowKeys.includes(record.region.uuid) ? "chevron_right" : "stat_minus_1"}/><Text ellipsis={{tooltip: record.region.name}} style={{width: "130px"}}>{record.region.name}</Text></Space>,
            onCell: (record: any) => ({
                onClick: () => handleExpand(record),
            }),
        },
        {
            dataIndex   :   "count",
            title       :   columnProps.teamMember.title,
            key         :   columnProps.teamMember.key,
            width       :   columnProps.teamMember.width,
        }
    ].concat(commonColumns);

    const regionExpandedRowRender = (record: any) => (
        <Table
            className   =   "cm-height100 j-agent-vs-meeting-table-2"
            showHeader  =   {false}
            pagination  =   {false}
            columns     =   {[
                {
                    key     :   columnProps.teamMember.key,
                    width   :   columnProps.teamMember.width,
                    render  :   () => <></>,
                },
                {
                    dataIndex   :   "user",
                    key         :   columnProps.teamMember.key,
                    width       :   columnProps.teamMember.width,
                    render      :   (user: any) => (
                        <Text ellipsis={{ tooltip: user.name }} style={{width: "130px"}}>
                            {user.name}
                        </Text>
                    ),
                }

            ].concat(commonColumns)}
            size        =   "small"
            dataSource  =   {record.viewDetails}
        />
    );


  // Team Member Table

    const teamMemberColumns: any = [
        {
            dataIndex   :   "user",
            fixed       :   "left",
            key         :   columnProps.teamMember.key,
            width       :   columnProps.teamMember.width,
            render      :   (user: any) => (
                <Space className="cm-flex-align-center cm-cursor-pointer">
                    <MaterialSymbolsRounded font={expandedRowKeys.includes(user.uuid) ? "stat_minus_1" : "chevron_right"}/>
                    <Text ellipsis={{ tooltip: user.name }} style={{width: '100px'}}>
                        {user.name}
                    </Text>
                </Space>
            ),
            onCell: (record: any) => ({
                onClick: () => handleExpand(record),
            }),
        },
        {
            dataIndex   :   "count",
            title       :   columnProps.region.title,
            key         :   columnProps.region.key,
            width       :   columnProps.region.width,
        },
    ].concat(commonColumns);

    const teamMemberExpandedRowRender = (record: any) => (
        <Table
            className   =   "cm-height100 j-agent-vs-meeting-table-2"
            showHeader  =   {false}
            pagination  =   {false}
            size        =   "small"
            dataSource  =   {record.viewDetails}
            columns={[
                {
                    key     :   columnProps.teamMember.key,
                    width   :   columnProps.teamMember.width,
                    render  :   () => <></>,
                },
                {
                    dataIndex   :   "region",
                    key         :   columnProps.region.key,
                    width       :   columnProps.region.width,
                    render      :   (region: any) => (
                        <Text ellipsis={{ tooltip: region.name }} style={{width: "130px"}}>
                            {region.name}
                        </Text>
                    ),
                },
            ].concat(commonColumns)}
        />
    );

    const items: MenuProps['items'] = [
        {
            "key"       :   "REGION",
            "title"     :   "by Region",
            "label"     :   "by Region",
            onClick     :   () => {
                setFilterType({
                    api         : "REGION",
                    displayName : "Region"
                })
            }
        },
        {
            "key"       :   "USER",
            "title"     :   "by Team Member",
            "label"     :   "by Team Member",
            onClick     :   () => {
                setFilterType({
                    api         : "USER",
                    displayName : "Team Member"
                })
            }
        },
    ];

    const handleExpand = (record: any) => {
        const key = filterType.api === "REGION" ? record.region.uuid : record.user.uuid;
        setExpandedRowKeys(expandedRowKeys.includes(key) ? [] : [key]);
    };
    
    if (error) return <SomethingWentWrong />;

    return (
        <div className="j-cp-analytics-card cm-padding0" style={{ height: "370px" }}>
            <div className="cm-flex-space-between cm-flex-align-center">
                <div className="cm-font-fam500 cm-secondary-text cm-padding-block20 cm-padding-inline15">
                    Region Specific Content Performance
                </div>
                <Dropdown menu={{ items, selectedKeys: [filterType.api] }} placement="bottom" className="cm-margin-right15">
                    <Space className='cm-float-right cm-cursor-pointer cm-border-light cm-border-radius6 cm-padding-inline10 cm-padding5'>
                        <div className="cm-font-size13 cm-font-fam500"> by {filterType.displayName}</div>
                        <MaterialSymbolsRounded font='expand_more' size="18"/>
                    </Space>
                </Dropdown>
        </div>
        {
            loading
            ?
                <Loading />
            :
                <Table
                    rowKey          =   {(record: any) => filterType.api === "REGION" ? record.region.uuid : record.user.uuid}
                    rowClassName    =   {"j-agent-vs-meeting-row"}
                    className       =   "j-agent-vs-meeting-table"
                    columns         =   {filterType.api === "REGION" ? regionColumns : teamMemberColumns}
                    dataSource      =   {data?._cdResourceRegionReport || []}
                    pagination      =   {false}
                    scroll          =   {{ y: 260 }}
                    expandable={{
                        expandedRowKeys,
                        expandIconColumnIndex: -1,
                        onExpand: (record) => handleExpand(record),
                        expandedRowRender: filterType.api === "REGION" ? regionExpandedRowRender : teamMemberExpandedRowRender,}}
                    locale={{
                        emptyText: (
                            <div className="cm-flex-center" style={{ height: "190px" }}>
                                {loading || !data ? <Loading /> : <EmptyText text="No resource found" />}
                            </div>
                        ),
                    }}
                    style           =   {{overflow: "hidden"}}
                />
        }
        </div>
    );
};

export default ResourceByType;
