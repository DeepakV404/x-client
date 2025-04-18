import { Col, Row } from "antd";

import RoomViews from "./graphs/room-views";
import RoomsByStage from "./graphs/rooms-by-stage";
import TopRoomsViews from "./graphs/top-rooms-views";
import TopRoomsDealCycle from "./graphs/top-rooms-deal-cycle";
import DealsVsSales from "./graphs/deals-vs-sales";
import LeaderBoard from "../account-overview-table/leader-board";
import RoomsByStatus from "../rooms-by-status";


const AnalyticsGraphLayout = (props: { from: any, to: any, dataFilter: string }) => {

    const { from, to, dataFilter }  =   props;

    return (
        <Row gutter={[15, 15]} className="cm-margin-bottom20">
            <Col span={14} >
                <RoomViews from={from} to={to} dataFilter={dataFilter} />
            </Col>
            <Col span={6}>
                <RoomsByStage from={from} to={to} />
            </Col>
            <Col span={4}>
                <RoomsByStatus from={from} to={to} />
            </Col>
            <Col span={12}>
                <TopRoomsViews from={from} to={to} />
            </Col>
            <Col span={12}>
                <TopRoomsDealCycle from={from} to={to} />
            </Col>
            <Col span={12}>
                <DealsVsSales from={from} to={to} />
            </Col>
            <Col span={12}>
                <LeaderBoard from={from} to={to} />
            </Col>
        </Row>
    )
}

export default AnalyticsGraphLayout