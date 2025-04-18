import { Col, Row, Space, Tooltip, Typography } from "antd"
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import Loading from "../../../../utils/loading";
import GetRoomEngagementStatus from "../../../../components/get-room-engagement-status";

const { Text }  =   Typography

const DealPerformance = (props: {data: any, loading: boolean}) => {

    const { data, loading }  =   props;

    return(
        <Space direction="vertical" className="cm-padding10 cm-background-white cm-width100 cm-border-radius6 cm-border-light">
            <Text className="cm-font-fam500">Deal Performance</Text>
            {
                loading 
                    ? 
                        <div className="cm-flex-center" style={{height: "100px"}}>
                            <Loading />
                        </div>
                    :
                        <Space style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                            <div className="cm-border-light cm-border-radius6 cm-padding10 cm-width100">
                                <Space size={0} direction="vertical" className="cm-width100">
                                    <Text className="cm-font-fam500 cm-secondary-text">Deal Pipeline</Text>
                                    <div className="cm-flex-space-between" style={{columnGap: "8px"}}>
                                        <Space size={0} direction="vertical">
                                            <Text className="cm-font-size20 cm-font-fam600 cm-flex-justify-center">{data?._edOverallInsights.dealPipeline.hot.count ?? 0}</Text>
                                                <GetRoomEngagementStatus roomStatus={"HOT"}/>
                                            </Space>
                                        <Space size={0} direction="vertical">
                                            <Text className="cm-font-size20 cm-font-fam600 cm-flex-justify-center">{data?._edOverallInsights.dealPipeline.warm.count ?? 0}</Text>
                                            <GetRoomEngagementStatus roomStatus={"WARM"}/>
                                        </Space>
                                        <Space size={0} direction="vertical">
                                            <Text className="cm-font-size20 cm-font-fam600 cm-flex-justify-center">{data?._edOverallInsights.dealPipeline.cold.count ?? 0}</Text>
                                            <GetRoomEngagementStatus roomStatus={"COLD"}/>
                                        </Space>
                                    </div>
                                </Space>
                            </div>
                            <div className="cm-border-light cm-border-radius6 cm-padding10 cm-flex-direction-column">
                                <Space className="cm-margin-bottom20">
                                    <Text className="cm-secondary-text cm-font-fam500 cm-whitespace-no-wrap">
                                        Open Deal Progress 
                                    </Text>
                                    <Tooltip title={<span>Calculated based on action point completion of opened rooms</span>}>
                                        <div><MaterialSymbolsRounded font='info' size='15' className='cm-cursor-pointer'/></div>
                                    </Tooltip>
                                </Space>
                                <Space className="cm-flex-space-between">
                                    <Text className="cm-font-size24 cm-font-fam600">{Math.round(data?._edOverallInsights.openDealProgress) ?? 0}%</Text>
                                    <Text className="cm-font-fam500">{Math.round(data?._edOverallInsights.openDealCount)} Deals</Text>
                                </Space>   
                            </div>
                            <div className="cm-border-light cm-border-radius6 cm-padding10 cm-flex cm-flex-direction-column">
                                <Space className="cm-margin-bottom20">
                                    <Text className="cm-secondary-text cm-font-fam500">Deal Win Rate</Text>
                                    <Tooltip title={<span>Calculated from closed rooms</span>}>
                                        <div><MaterialSymbolsRounded font='info' size='15' className='cm-cursor-pointer'/></div>
                                    </Tooltip>
                                </Space>
                                    <Text className="cm-font-size24 cm-font-fam600">{Math.round(data?._edOverallInsights.dealWinRate)}%</Text>
                                <Space>
                                </Space>
                            </div>
                        </Space>
            }
        </Space>
    )
}

const getDueNatureColor = (nature: string) => {

    if(nature === "Overdue") return "#e66057"
    else if(nature === "Early") return "#0065E5"
    else return "#3EB200"

}

const AgentPerformance = (props: {data: any, loading: boolean, meetingPlanned: number}) => {

    const { data, loading, meetingPlanned }  =   props;

    return(
        <Space direction="vertical" className="cm-padding10 cm-background-white cm-width100 cm-border-radius6 cm-border-light">
            <Text className="cm-font-fam500">User Performance</Text>
            {
                loading 
                ?
                    <div className="cm-flex-center cm-width100" style={{height: "100px"}}>
                        <Loading />
                    </div>
                :
                    <div className="cm-space-inherit cm-width100">
                        {
                            <Row gutter={[10,10]}>
                                <Col span={9}>
                                    <div className="cm-border-light cm-border-radius6 cm-padding10">
                                        <Space style={{marginBottom: "17px"}}>
                                            <Text className="cm-secondary-text cm-font-fam500">Avg. Due Date Strike</Text>
                                            <Tooltip title={<span>Calculated based on the due date planned vs completion date</span>}>
                                                <div><MaterialSymbolsRounded font='info' size='15' className='cm-cursor-pointer'/></div>
                                            </Tooltip>
                                        </Space>
                                        <div>
                                            <Text className="cm-font-size26 cm-font-fam600">{Math.round(data?._edOverallInsights.avgDueDateStrike.strikeRate) + " Days"}</Text>
                                            <Text className="cm-font-fam600" style={{color: getDueNatureColor(data?._edOverallInsights.avgDueDateStrike.dueNature), marginLeft: "20px"}}>{data?._edOverallInsights.avgDueDateStrike.dueNature}</Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="cm-border-light cm-border-radius6 cm-padding10">
                                        <Space size={17} direction="vertical">
                                            <Text className="cm-secondary-text cm-font-fam500">Completed Action points</Text>
                                            <Text className="cm-font-size26 cm-font-fam600">{data?._edOverallInsights.totalAPsCompleted}</Text>
                                        </Space>                                
                                    </div>
                                </Col>
                                <Col span={7}>
                                    <div className="cm-border-light cm-border-radius6 cm-padding10">
                                        <Space style={{marginBottom: "17px"}}>
                                            <Text className="cm-secondary-text cm-font-fam500">Planned Meetings</Text>
                                            <Tooltip title={<span>Both planned by seller and buyer on selected date range</span>}>
                                                <div><MaterialSymbolsRounded font='info' size='15' className='cm-cursor-pointer'/></div>
                                            </Tooltip>
                                        </Space>
                                        <div>
                                            <Text className="cm-font-size26 cm-font-fam600">{meetingPlanned}</Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        }
                    </div>
            }
        </Space>
    )
}


export {DealPerformance, AgentPerformance}