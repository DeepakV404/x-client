import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";
import { Space, Table, Typography } from "antd";

import { ED_DEAL_PERFORMANCE } from "../api/executive-dashboard-query";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import Loading from "../../../../utils/loading";
import EmptyText from "../../../../components/not-found/empty-text";

const { Text }  =   Typography;

const EdAgentVsDealPerformance = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>();

    const { data, loading, error } = useQuery(ED_DEAL_PERFORMANCE, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to,
            },
            userUuids: selectedUser === 'all_agents' ? undefined : [selectedUser],
        },
    });
    
    const [expandedRowKeys, setExpandedRowKeys]                 = useState<any[]>([]);
    const [expandedTemplateRowKeys, setExpandedTemplateRowKeys] = useState<any[]>([]);

    const renderers = {
        "_name": (_: any, record: any) => {
            const isExpanded = expandedRowKeys.includes(record.user.uuid);
            return (
                <Space className={`cm-flex-align-center ${record.dealsCount > 0 && "cm-cursor-pointer"}`}>
                    {record.dealsCount > 0 && (
                        <MaterialSymbolsRounded font={isExpanded ? "stat_minus_1" : "chevron_right"} />
                    )}
                    <Text style={{ width: "200px", paddingLeft: record.dealsCount === 0 ? "32px" : ""  }} ellipsis={{ tooltip: record.user.firstName + " " + record.user.lastName }}>
                        {`${record.user.firstName} ${record.user.lastName ?? ""}`}
                    </Text>
                </Space>
            );
        },
        "_salesProcessTemplates": (_: any, record: any) => {
            return <span className="cm-padding-left10">{record.dealsCount + " Deals"}</span>;
        },
        "_regions": (_: any, record: any) => {
            const uniqueRegions = new Set(record.details.filter((detail: any) => detail.regions).flatMap((detail: any) => detail.regions.map((_region: any) => _region.name)));          
            return (
                <span className="cm-padding-left10" style={{float: "right"}}>{uniqueRegions.size === 0 ? "-" : uniqueRegions.size}</span>
            );
        },
        "_dealCompletions": (_: any, record: any) => {
            return <span style={{float: "right"}}>{record.completionPercentage + "%"}</span>;
        },
    };

    const rootTableColumns: any = [
        {
            title       :   'Name',
            dataIndex   :   'user',
            key         :   'name',
            render      :   renderers._name,
            width       :   '250px',
            fixed       :   'left',
            onCell      :   (record: any) => ({
                onClick: () => handleExpand(record),
            }),
        },
        {
            title       :   'Sales Process (Template)',  
            dataIndex   :   'dealsCount',
            key         :   'sales_process_template',
            render      :   renderers._salesProcessTemplates,
            width       :   '250px',
            fixed       :   'left'
        },
        {
            title       :   'Regions',
            dataIndex   :   'regions',
            key         :   'regions',
            render      :   renderers._regions,
            width       :   '150px',
        },
        {
            title       :   'Deal Completion',
            dataIndex   :   'completionPercentage',
            key         :   'deal_completion',
            render      :   renderers._dealCompletions,
            width       :   '200px',
        },
        {
            title       :   'Not Started',
            dataIndex   :   'notStarted',
            key         :   'not_started',
            render      :   (record: any) => <span style={{ float: "right" }}>{record}</span>,
            width       :   '200px',
        },
        {
            title       :   'In progress',
            dataIndex   :   'inProgress',
            key         :   'in_progress',
            render      :   (record: any) => <span style={{ float: "right" }}>{record}</span>,
            width       :   '200px',
        },
        {
            title       :   'Completed',
            dataIndex   :   'completed',
            key         :   'completed',
            render      :   (record: any) => <span style={{ float: "right" }}>{record}</span>,
            width       :   '200px',
        },
        {
            title       :   'Stage Completion Overview',
            key         :   'stageCompletion',
            render      :   () => <span></span>,
            width       :   '250px',
        },
    ];

    const expandedRowRender = (record: any) => {
        return (
            <Table
                className       =   "cm-height100 j-agent-vs-meeting-table-2"
                size            =   "small"
                showHeader      =   {false}
                pagination      =   {false}
                dataSource      =   {record.details}
                rowKey          =   {(room: any) => room.uuid}
                expandable      =   {{
                    expandedRowKeys         :   expandedTemplateRowKeys,
                    expandIconColumnIndex   :   -1,
                    onExpand                :   (record) => handleTemplateExpand(record),
                    expandedRowRender       :   expandedRowRenderTemplateDetails,
                }}
                columns={[
                    {
                        width   :   '250px',
                    },
                    {
                        title   :   'Templates',
                        width   :   '250px',
                        render  :   (_: any, details: any) => {                            
                            const isExpanded = expandedTemplateRowKeys.includes(details.uuid);
                                return(
                                    <Space className="cm-flex-align-center cm-cursor-pointer">
                                        <MaterialSymbolsRounded font={!isExpanded ? "chevron_right" : "stat_minus_1"} />
                                        <Text ellipsis={{tooltip: `${details.name} (${details.dealsCount} Deals)`}} style={{maxWidth: "120px"}}>{`${details.name}`}</Text>
                                        <Text>{`(${details.dealsCount} Deals)`}</Text>
                                    </Space>
                                )
                        },
                        onCell  :   (record: any) => ({
                            onClick: () => handleTemplateExpand(record),
                        }),
                    },
                    { 
                        width   :   '150px',
                        render  :   (record: any) => 
                        <Text ellipsis={{tooltip: record.regions ? record.regions.map((_region: any) => _region.name).join(", "): ""}} style={{width: "140px", paddingLeft: "10px"}}>{record.regions ? record.regions.map((_region: any) => (_region.name)).join(", "): ""}</Text>
                    },
                    { render: (_: any, details: any) => <span style={{float: "right", paddingRight: "6px" }}>{details.completionPercentage}%</span>, width: '200px',},
                    { render: (_: any, details: any) => <span style={{float: "right", paddingRight: "6px" }}>{details.notStarted}</span>, width: '200px',},
                    { render: (_: any, details: any) => <span style={{float: "right", paddingRight: "6px" }}>{details.inProgress}</span>, width: '200px',},
                    { render: (_: any, details: any) => <span style={{float: "right", paddingRight: "6px" }}>{details.completed}</span>, width: '200px',},
                    { width: '250px', render: () => <span></span>}
                ]}
            />
        );
    };
    
    const handleTemplateExpand = (record: any) => {
        const currentExpandedTemplateRowKeys = expandedTemplateRowKeys.includes(record.uuid) ? expandedTemplateRowKeys.filter(key => key !== record.uuid) : [...expandedTemplateRowKeys, record.uuid];
        setExpandedTemplateRowKeys(currentExpandedTemplateRowKeys);
    };

    const expandedRowRenderTemplateDetails = (record: any) => {                                
        const hotDeals = record.hot;
        const warmDeals = record.warm;
        const coldDeals = record.cold;
        const stagesCompletionOverview = record.stagesCompletionOverview
        
        const combinedDealsData = [
            { type: 'Hot Deals - ' + hotDeals.dealsCount, completionPercentage: hotDeals.completionPercentage, notStarted: hotDeals.notStarted, inProgress: hotDeals.inProgress, completed: hotDeals.completed },
            { type: 'Warm Deals - ' + warmDeals.dealsCount, completionPercentage: warmDeals.completionPercentage, notStarted: warmDeals.notStarted, inProgress: warmDeals.inProgress, completed: warmDeals.completed },
            { type: 'Cold Deals - ' + coldDeals.dealsCount, completionPercentage: coldDeals.completionPercentage, notStarted: coldDeals.notStarted, inProgress: coldDeals.inProgress, completed: coldDeals.completed },
        ];

        return (
            <Table
                className   =   "cm-height100 j-agent-vs-meeting-table"
                size        =   "small"
                showHeader  =   {false}
                pagination  =   {false}
                dataSource  =   {combinedDealsData}
                rowKey      =   {(record: any) => record.type}
                columns     =   {[
                    {   
                        width       :   '250px', 
                        render      :   () => <></>
                    },
                    {   
                        title       :   'Deal Type', 
                        dataIndex   :   'type', 
                        key         :   'type', 
                        render      :   (text: string) => <Text style={{paddingLeft: "35px"}}>{text}</Text>, 
                        width       :   '250px',
                    },
                    {   
                        width       :   '150px',
                        render      :   () => <></>
                    },
                    {   title       :   'Completion Percentage', 
                        dataIndex   :   'completionPercentage', 
                        key         :   'completionPercentage', 
                        render      :   (record: any) => <span style={{ float: "right", paddingRight: "6px" }}>{record}%</span>,
                        width       :   '200px',
                    },
                    {   title       :   'Not Started', 
                        dataIndex   :   'notStarted', 
                        key         :   'notStarted', 
                        render      :   (record: any) => <span style={{ float: "right", paddingRight: "6px" }}>{record}</span>,
                        width       :   '200px',
                    },
                    {   title       :   'In Progress', 
                        dataIndex   :   'inProgress', 
                        key         :   'inProgress',
                        render      :   (record: any) => <span style={{ float: "right", paddingRight: "6px" }}>{record}</span>, 
                        width       :   '200px',
                    },
                    {   title       :   'Completed', 
                        dataIndex   :   'completed', 
                        key         :   'completed', 
                        render      :   (record: any) => <span style={{ float: "right", paddingRight: "6px" }}>{record}</span>,
                        width       :   '200px',
                    },
                    {
                        title       :   'Stages Completion Overview',
                        key         :   'stagesCompletion',
                        width       :   '250px',
                        className   :   "j-stage-complete-overview-cell",
                        onCell      :   () => ({
                            rowSpan: 3,
                        }),
                        render      :   (_: any, __: any, index: number) => {
                            if (index === 0) {
                                return (
                                    <div style={{borderLeft: "1px solid #E8E8E8", paddingLeft: "15px", paddingBlock: "2px", height: '116px', overflow: "auto" }}>
                                        {stagesCompletionOverview.map((item: any, idx: number) => (
                                            <span key={idx}>
                                                {`${item.name} (${item.completed} / ${item.total})`}
                                                <br /> 
                                            </span>
                                        ))}
                                    </div>
                                );
                            }
                            return null; 
                        },
                    }
                    
                ]}
            />
        );
    };

    const handleExpand = (record: any) => {
        if (record.dealsCount > 0) {
            setExpandedRowKeys(expandedRowKeys.includes(record.user.uuid) ? [] : [record.user.uuid]);
        }
    };

    const getEmptyText = () => {
        if (loading) return <Loading />;
        else if (!data) {
            if (error) return <EmptyText text="Something went wrong" />;
        } else return <EmptyText text="No meetings planned" />;
    };

    return (
        <div className="cm-background-white cm-padding15 cm-flex-direction-column cm-border-radius6 cm-border-light" style={{ minHeight: "375px", padding: 0 }}>
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Deal Performance</Text>
            <div style={{ paddingTop: "15px" }}>
                {loading ? (
                    <div style={{height: "305px"}}>
                        <Loading />
                    </div>
                ) : (
                    <Table
                        bordered
                        rowClassName        =   "j-agent-vs-meeting-row"
                        className           =   "j-agent-vs-meeting-table"
                        columns             =   {rootTableColumns}
                        dataSource          =   {data?._edDealPerformance}
                        pagination          =   {false}
                        rowKey              =   {(record: any) => record.user.uuid}
                        scroll              =   {{ y: "auto" }}
                        expandable          =   {{
                            expandedRowKeys,
                            expandIconColumnIndex   :   -1,
                            onExpand                :   (record) => handleExpand(record),
                            expandedRowRender       :   expandedRowRender,
                        }}
                        locale              =   {{
                            emptyText: <div className="cm-flex-center" style={{ height: "175px" }}>{getEmptyText()}</div>,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default EdAgentVsDealPerformance;
