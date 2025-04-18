import { useContext } from "react";
import { Col, Row, Space, Tabs } from "antd";
import { GlobalContext } from "../../../globals";

import ActivityContent from "../activity/activity-content";
import InsightOverview from "./insight-overview";
import DiscoveryResponse from "../discovery";
import ProgressChart from "./progress-chart";
import ByUserDonut from "./by-user-donut";
import ContentInfo from "./content-info";
import StageReport from "./stage-report";
import ByUserBars from "./by-user-bars";
import ByUserPie from "./by-user-pie";
import { ACCOUNT_TYPE_DSR } from "../../../constants/module-constants";

const { TabPane }   =   Tabs;

const RoomInsights = () => {

    const { $orgDetail, $isVendorMode, $isVendorOrg, $accountType, $dictionary }   =   useContext(GlobalContext);

    return (
        <div className="cm-height100" >
            <Tabs className="j-room-analytics-tabs cm-width100 cm-height100" tabPosition="left" tabBarStyle={{paddingTop: "14px"}}>
                <TabPane tab="Overview" key='dashboard' style={{padding: "15px"}}>
                    <Row gutter={[15, 15]} className="j-room-insight-wrapper">
                        <Col span={24}>
                            <InsightOverview/>
                        </Col>

                        <Col span={!($isVendorOrg || $isVendorMode) ? 16 : 24}>
                            <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom10" style={{height: "20px"}}>Engagement by {$dictionary.buyers.singularTitle.toLowerCase()}</div>
                            <ByUserBars/>
                        </Col>
                        {
                            !($isVendorOrg || $isVendorMode) &&
                                <Col span={8}>
                                    <Space direction="vertical" className="cm-width100" size={10}>
                                        <Space direction="vertical" className="cm-width100" size={0}>
                                            <StageReport />
                                        </Space>
                                        <Space direction="vertical" className="cm-width100" size={0}>
                                            <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom10" style={{height: "20px"}}>Action points completed</div>
                                            <ProgressChart/>
                                        </Space>
                                    </Space>
                                </Col>
                        }

                        <Col span={12}>
                            <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom10" style={{height: "20px"}}>Engagement by content</div>
                            <ByUserDonut/>
                        </Col>

                        <Col span={12}>
                            <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom10" style={{height: "20px"}}>Contributions by {$dictionary.buyers.singularTitle.toLowerCase()}</div>
                            <ByUserPie/>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Content Engagement" key='content_engagement' className="cm-height100 cm-padding15 j-room-insights-tab">
                    <ContentInfo/>
                </TabPane>
                <TabPane tab="Activities" key='activity' className="cm-padding15">
                    <ActivityContent/>
                </TabPane>
                {
                    $orgDetail.tenantName !== "kissflow" && !($accountType === ACCOUNT_TYPE_DSR) &&
                        <TabPane tab="Discovery" key='discovery' className="cm-padding15">
                            <DiscoveryResponse/>
                        </TabPane>
                }
            </Tabs>
        </div>
    )
}

export default RoomInsights