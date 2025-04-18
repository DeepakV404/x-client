import { Space, Table, Typography } from "antd";

import GetRoomEngagementStatus from "../../../../components/get-room-engagement-status";
import EmptyText from "../../../../components/not-found/empty-text";
import Loading from "../../../../utils/loading";
import { useState } from "react";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Text } = Typography;

const EdAgentVsMeeting = (props: { data: any, loading: boolean, error: any }) => {

    const { data, loading, error } = props

    const [expandedRowKeys, setExpandedRowKeys]     =   useState<any[]>([]);

    const renderers = {
        _name: (_: any, record: any) => {            
            const isExpanded = expandedRowKeys.includes(record.user.uuid);
            return (
                <Space className={`cm-flex-align-center ${record.meetingsByRoom.length > 0 && "cm-cursor-pointer"}`}>
                    {record.meetingsByRoom.length > 0 && <MaterialSymbolsRounded font={isExpanded ? "stat_minus_1" : "chevron_right"} />}
                    <Text ellipsis={{tooltip: `${record.user.firstName} ${record.user.lastName ?? ""}`}} style={{width: "150px", paddingLeft: record.meetingsByRoom.length === 0 ? "32px" : ""}}>{`${record.user.firstName} ${record.user.lastName ?? ""}`}</Text>
                </Space>
            );
        },
        "_room": (_: any, record: any) => {
            return (
                <span style={{ float: "right" }}>{record.meetingsByRoom.length}</span>
            );
        }
    };

    const columns = [
        {
            title       :   'Name',
            dataIndex   :   'user',
            key         :   'name',
            render      :   renderers._name,
            width       :   '200px',
            onCell: (record: any) => ({
                onClick: () => handleExpand(record),
            }),
        },
        {
            title       :   'Rooms',
            dataIndex   :   'roomName',
            key         :   'room',
            render      :   renderers._room,
            width       :   '200px',
        },
        {
            title: 'By Seller',
            children: [
                {
                    title       :   'Meetings Planned',
                    dataIndex   :   'meetingsByRoom',
                    key         :   'sellerMeetingPlanned',
                    width       :   '150px',
                    render: (_: any, record: any) => {
                        const totalPlanned = record.meetingsByRoom?.reduce((sum: number, room: any) => sum + (room.meetingsBySeller?.meetingsPlanned || 0), 0);
                        return <span style={{ float: "right" }}>{totalPlanned}</span>
                    },
                },
                {
                    title       :   'Meetings Completed',
                    dataIndex   :   'meetingsByRoom',
                    key         :   'sellerMeetingCompleted',
                    width       :   '150px',
                    render: (_: any, record: any) => {
                        const totalCompleted = record.meetingsByRoom?.reduce((sum: number, room: any) => sum + (room.meetingsBySeller?.meetingsCompleted || 0), 0);
                        return <span style={{ float: "right" }}>{totalCompleted}</span>
                    },
                },
            ],
        },
        {
            title: 'By Buyer',
            children: [
                {
                    title       :   'Meetings Planned',
                    dataIndex   :   'meetingsByRoom',
                    key         :   'buyerMeetingPlanned',
                    width       :   '150px',
                    render: (_: any, record: any) => {
                        const totalPlanned = record.meetingsByRoom?.reduce((sum: number, room: any) => sum + (room.meetingsByBuyer?.meetingsPlanned || 0), 0);
                        return <span style={{ float: "right" }}>{totalPlanned}</span>
                    },
                },
                {
                    title       :   'Meetings Completed',
                    dataIndex   :   'meetingsByRoom',
                    key         :   'buyerMeetingCompleted',
                    width       :   '150px',
                    render: (_: any, record: any) => {
                        const totalCompleted = record.meetingsByRoom?.reduce((sum: number, room: any) => sum + (room.meetingsByBuyer?.meetingsCompleted || 0), 0);
                        return <span style={{ float: "right" }}>{totalCompleted}</span>
                    },
                },
            ],
        },
    ];

    const expandedRowRender = (record: any) => {
        return (
            <Table
                className   =   "cm-height100 j-agent-vs-meeting-table-2"
                size        =   "small"
                showHeader  =   {false}
                pagination  =   {false}
                dataSource  =   {record.meetingsByRoom}
                rowKey      =   {(room: any) => room.uuid}
                columns     =   {[
                    {
                        width: "200px"
                    },
                    {
                        title: 'Room Name',
                        dataIndex: 'room',
                        key: 'room',
                        render: (room: any) => 
                            <Space style={{width: "200px", paddingLeft: "6px"}}>
                                <Text ellipsis={{tooltip: room.name}} style={{width: "100px"}}>{room.name}</Text>
                                <GetRoomEngagementStatus roomStatus={room.engagementStatus}/>
                            </Space>,
                        width: "150px",
                    },
                    {
                        render: (room: any) => <span style={{ float: "right", paddingRight: "6px"}}>{room.meetingsBySeller?.meetingsPlanned}</span>,
                        width: "150px"
                    },
                    {
                        render: (room: any) => <span style={{ float: "right", paddingRight: "6px"}}>{room.meetingsBySeller?.meetingsCompleted}</span>,
                        width: "150px"
                    },
                    {
                        render: (room: any) => <span style={{ float: "right", paddingRight: "6px"}}>{room.meetingsByBuyer?.meetingsPlanned}</span>,
                        width: "150px"
                    },
                    {
                        render: (room: any) => <span style={{ float: "right", paddingRight: "6px"}}>{room.meetingsByBuyer?.meetingsCompleted}</span>,
                        width: "150px"
                    },
                ]}
            />
        );
    };

    const handleExpand = (record: any) => {
        if (record.meetingsByRoom.length > 0) {
            setExpandedRowKeys(expandedRowKeys.includes(record.user.uuid) ? [] : [record.user.uuid]);
        }
    };
    

    const getEmptyText = () => {
        if(loading) return <Loading/>
        else if(!data){
            if(error) return <EmptyText text='Something went wrong' />
        }else return  <EmptyText text='No meetings planned' />
    }

    return (
        <div className="cm-background-white cm-padding15 cm-flex-direction-column cm-border-radius6 cm-border-light" style={{ height: "375px", padding: 0 }}>
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Meetings</Text>
            <div style={{ paddingTop: "15px" }}>
                {loading ? (
                    <div style={{height: "305px"}}>
                        <Loading />
                    </div>
                ) : (
                    <Table
                        bordered
                        rowClassName    =   "j-agent-vs-meeting-row"
                        className       =   "j-agent-vs-meeting-table"
                        columns         =   {columns}
                        dataSource      =   {data?._edMeetingsOverview || []}
                        pagination      =   {false}
                        rowKey          =   {(record: any) => record.user.uuid}
                        scroll          =   {{ y: 220 }}
                        expandable={{
                            expandedRowKeys,
                            expandIconColumnIndex: -1,
                            onExpand: (record) => handleExpand(record),
                            expandedRowRender: expandedRowRender,
                        }}
                        locale          =   {{
                            emptyText: <div className='cm-flex-center' style={{ height: "175px" }}>{getEmptyText()}</div>
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default EdAgentVsMeeting;
