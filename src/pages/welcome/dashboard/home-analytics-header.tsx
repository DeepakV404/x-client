import { useContext, useEffect } from "react";
import { Col, Row, Space, Typography } from "antd"
import { useLazyQuery } from "@apollo/client"
import { GlobalContext } from "../../../globals";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import RoomViews from "../../analytics/account-overview/account-overview-graph/graphs/room-views";
import RoomsByStage from "../../analytics/account-overview/account-overview-graph/graphs/rooms-by-stage";
import TopRoomsViews from "../../analytics/account-overview/account-overview-graph/graphs/top-rooms-views";
import TopRoomsDealCycle from "../../analytics/account-overview/account-overview-graph/graphs/top-rooms-deal-cycle";
import { OVER_ALL_REPORT } from "../../analytics/account-overview/api/analytics-query";


const { Text }  =   Typography;

const HomeAnalyticsHeader = (props: {from: any, to: any, dataFilter: string, home? : any}) => {

    const { from, to, dataFilter, home }  =   props;

    const { $user }    =   useContext(GlobalContext);
    
    const [_getReportData, { data, loading, error}]      =   useLazyQuery(OVER_ALL_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : home ? [$user.uuid] : undefined
        }
    })
    
    useEffect(() => {
        if(from && to){
            _getReportData()
        }
    }, [from, to])

    if(error) return <SomethingWentWrong />

    return (
        <Row gutter={[15, 15]} className="cm-overflow-auto cm-height100">
            <Col span={5}>
                <Space size={0} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                    <Space direction="vertical" size={15}>
                        <Text className="cm-font-fam500 cm-secondary-text cm-font-size1">Rooms Created</Text>
                        <Text className="cm-font-fam500 cm-font-size24">{ (loading || !data) ? "-" : data.overAllReport.createdRooms}</Text>
                    </Space>
                </Space>
            </Col>
            <Col span={4}>
                <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                    <Space direction="vertical" size={15}>
                        <Text className="cm-font-fam500 cm-secondary-text">Deals Won</Text>
                        <Text className="cm-font-fam500 cm-font-size24">{ (loading || !data)  ? "-" : data.overAllReport.dealsWon}</Text>
                    </Space>
                </Space>
            </Col>
            <Col span={5}>
                <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                    <Space direction="vertical" size={15}>
                        <Text className="cm-font-fam500 cm-secondary-text">Deals Lost</Text>
                        <Text className="cm-font-fam500 cm-font-size24">{ (loading || !data) ? "-" : data.overAllReport.dealsLost}</Text>
                    </Space>
                </Space>
            </Col>
            <Col span={5}>
                <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                    <Space direction="vertical" size={15}>
                        <Text className="cm-font-fam500 cm-secondary-text">Win Rate</Text>
                        <Text className="cm-font-fam500 cm-font-size24">{ (loading || !data) ? "-" : data.overAllReport.winRate == -1 ? "-" : `${data.overAllReport.winRate.toFixed(0)}%`}</Text>
                    </Space>
                </Space>
            </Col>
            <Col span={5}>
                <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                    <Space direction="vertical" size={15}>
                        <Text className="cm-font-fam500 cm-secondary-text">Average Deal Cycle</Text>
                        <Text className="cm-font-fam500 cm-font-size24">{ (loading || !data) || data.overAllReport.avgDealCycles === 0 ? "-" : `${data.overAllReport.avgDealCycles.toFixed(0)} days`}</Text>
                    </Space>
                </Space>
            </Col>
            <Col span={14}>
                <RoomViews from={from} to={to} dataFilter={dataFilter} home={true}/>
            </Col>
            <Col span={10}>
                <RoomsByStage from={from} to={to} home={true}/>
            </Col>
            <Col span={12}>
                <TopRoomsViews from={from} to={to} home={"home"}/>
            </Col>
            <Col span={12}>
                <TopRoomsDealCycle from={from} to={to} home={"home"}/>
            </Col>
        </Row>
    )
}

export default HomeAnalyticsHeader