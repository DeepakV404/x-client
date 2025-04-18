import { Col, Row } from "antd";
import TopRoomsViews from "../../analytics/account-overview/account-overview-graph/graphs/top-rooms-views";
import TopRoomsDealCycle from "../../analytics/account-overview/account-overview-graph/graphs/top-rooms-deal-cycle";


const HomeAnalyticsGraphLayout = (props: {from: any, to: any}) => {

    const { from, to}  =   props;

    return (
        <Row gutter={[15, 15]}>
            <Col span={12}>
                <TopRoomsViews from={from} to={to} home={"home"}/>
            </Col>
            <Col span={12}>
                <TopRoomsDealCycle from={from} to={to} home={"home"}/>
            </Col>
        </Row>
    )
}

export default HomeAnalyticsGraphLayout