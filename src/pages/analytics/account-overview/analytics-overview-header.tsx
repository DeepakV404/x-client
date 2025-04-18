import { useContext } from "react";
import { Col, Row, Space, Typography } from "antd"
import { useQuery } from "@apollo/client"
import { OVER_ALL_REPORT } from "./api/analytics-query";
import { GlobalContext } from "../../../globals";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";


const { Text }  =   Typography;

const AnalyticsOverviewHeader = (props: {from: any, to: any, home? : any}) => {

    const { from, to, home }  =   props;

    const { $user }  =   useContext(GlobalContext);
    
    const { data, loading, error}      =   useQuery(OVER_ALL_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : home ? [$user.uuid] : undefined
        }
    })

    if(error) return <SomethingWentWrong />

  return (
    <Row gutter={[15, 15]}>
        <Col span={4}>
            <Space size={0} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text cm-font-size1">Rooms Created</Text>
                    <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : data.overAllReport.createdRooms}</Text>
                </Space>
                {/* <Emoji font="⚙️" size="40"/> */}
            </Space>
        </Col>
        <Col span={4}>
            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text">Deals Won</Text>
                    <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : data.overAllReport.dealsWon}</Text>
                </Space>
                {/* <Emoji font="🎉" size="40"/> */}
            </Space>
        </Col>
        <Col span={4}>
            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text">Deals Lost</Text>
                    <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : data.overAllReport.dealsLost}</Text>
                </Space>
                {/* <Emoji font="👎🏼" size="40"/> */}
            </Space>
        </Col>
        <Col span={4}>
            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text">Win Rate</Text>
                    <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : data.overAllReport.winRate == -1 ? "-" : `${data.overAllReport.winRate.toFixed(0)}%`}</Text>
                </Space>
            </Space>
        </Col>
        <Col span={4}>
            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text">Average Deal Cycle</Text>
                    <Text className="cm-font-fam500 cm-font-size24">{ loading || data.overAllReport.avgDealCycles === 0 ? "-" : `${data.overAllReport.avgDealCycles.toFixed(0)} days`}</Text>
                </Space>
            </Space>
        </Col>
        <Col span={4}>
            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                <Space direction="vertical" size={15}>
                    <Text className="cm-font-fam500 cm-secondary-text">Avg. Interactions</Text>
                    <Text className="cm-font-fam500 cm-font-size24">
                        {loading ? "-" : (
                            <div>
                                {
                                    data?.overAllReport.avgInteractions > 0 
                                    ?
                                        Math.ceil(data?.overAllReport.avgInteractions)
                                    : 
                                        "-"
                                }
                            </div>
                        )}
                    </Text>
                </Space>
            </Space>
        </Col>
    </Row>
  )
}
export default AnalyticsOverviewHeader