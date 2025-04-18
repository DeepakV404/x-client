import { Pie } from "@ant-design/charts";

import { Avatar, Col, Divider, Popover, Progress, Row, Space, Tag, Typography } from "antd";
import { CommonUtil } from "../../../utils/common-util";

import BS_Badge from "../../../buyer-view/components/badge";

const { Text }  =   Typography;

const RoomStageAnalytics = (props: {stageWiseApStats: any}) => {

    const { stageWiseApStats }  =   props;

    const colors = [
        "#00BAC7",
        "#2D97F4",
        "#E77946",
        "#D051EC",
        "#F0BD26",
        "#0067C7",
        "#F42D79",
        "#77C708",
        "#F05A54",
        "#6879A3"
    ]

    const getColor = (index: number) => colors[index % colors.length];

    if(stageWiseApStats?.length > 0){
        return (
            <div className="cm-margin-top20">
                <div className="cm-font-size16 cm-font-fam600">Stages</div>
                <div className="j-horizontal-scroll-wrapper cm-scrollbar-none">
                    <Space size={15} style={{marginInline: (CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? "unset" : "calc((100vw - 1280px) / 2 + 20px)"}}>
                        {
                            stageWiseApStats?.map((_stage: any, index: any) => {
                                const pieData = 
                                [
                                    { status: "Planned", value: _stage?.apStats?.plannedAps || 0 },
                                    { status: "On-Going", value: _stage?.apStats?.onGoingAps || 0 },
                                    { status: "Pending", value: _stage?.apStats?.pendingAps || 0 },
                                    { status: "Finished", value: _stage?.apStats?.completedAps || 0 },
                                ];

                                const emptyData = [
                                    { status: "Planned", value: _stage?.apStats?.plannedAps || 100 },
                                    { status: "On-Going", value: _stage?.apStats?.onGoingAps || 0 },
                                    { status: "Pending", value: _stage?.apStats?.pendingAps || 0 },
                                    { status: "Finished", value: _stage?.apStats?.completedAps || 0 },
                                ];
    
                                const config: any = {
                                    data: _stage?.apStats?.totalAps ? pieData : emptyData,
                                    angleField: "value",
                                    colorField: "status",
                                    radius: 1,
                                    innerRadius: 0.7,
                                    color: _stage?.apStats?.totalAps ? ["#2979FF", "#FF9800", "#FF1744", "#00C853"] : ["#e4e4e4", "#e4e4e4", "#e4e4e4", "#e4e4e4"],
                                    legend: false,
                                    label: false,
                                    statistic: null,
                                    tooltip: false,
                                };
    
                                return(
                                    <div key={_stage?.simpleStage?.uuid} className="j-stage-analytics-card cm-padding15">
                                        <Space direction="vertical" size={12} className="cm-width100">
                                            <Space className="cm-flex-space-between">
                                                <Text style={{maxWidth: "225px"}} ellipsis={{tooltip: _stage?.simpleStage?.title}}>{_stage?.simpleStage?.title}</Text>
                                                <Tag color="#E8E8EC" style={{color: "#000000"}} className="cm-font-size12 cm-border-none cm-font-fam500 cm-margin-right0">{_stage?.apStats?.completedAps}/{_stage?.apStats?.totalAps}</Tag>
                                            </Space>
                                            <Space className="cm-flex-space-between">
                                                <Progress 
                                                    className   =   "j-stage-analytics-progress cm-flex"
                                                    percent     =   {Math.ceil(_stage?.apStats?.completionPercentage * 100)}
                                                    size        =   {[255, 20]}
                                                    strokeColor =   {getColor(index)}
                                                    showInfo    =   {false}
                                                />
                                                <div style={{lineHeight: "12px"}} className="cm-flex">{Math.ceil(_stage?.apStats?.completionPercentage * 100)}%</div>
                                            </Space>
                                        </Space>
                                        <Divider style={{marginBlock: "10px"}}/>
                                        <div className="j-stage-assignee-details cm-scrollbar-none">
                                        {
                                            _stage?.sellerWiseApStats?.length > 0 ?
                                                _stage?.sellerWiseApStats?.map((_sellerwise: any) => {
                                                    const content = (
                                                        <Space>
                                                            <Avatar size={32} className="j-ap-assignee-avatar" src={_sellerwise?.sellerStub?.profileUrl ? <img src={_sellerwise?.sellerStub?.profileUrl} alt={CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName)}/> : ""}>
                                                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName),1)}
                                                            </Avatar>
                                                            <Space direction="vertical" size={0}>
                                                                <div className="cm-font-opacity-black-85 cm-font-fam500">{`${_sellerwise.sellerStub.firstName} ${_sellerwise.sellerStub.lastName ?? ""}`}</div>
                                                                {_sellerwise?.sellerStub?.emailId ? <div className="cm-font-opacity-black-67">{`${_sellerwise?.sellerStub?.emailId}`}</div> : ""}
                                                            </Space>
                                                        </Space>
                                                    )
                                                    return(
                                                        <Space className="cm-margin-bottom10 cm-flex-space-between">
                                                            <Popover content={content}>
                                                                <Avatar size={30} className="j-ap-assignee-avatar" src={_sellerwise?.sellerStub?.profileUrl ? <img src={_sellerwise?.sellerStub?.profileUrl} alt={CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName)}/> : ""}>
                                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName),1)}
                                                                </Avatar>
                                                            </Popover>
                                                            <Space direction="vertical" size={4}>
                                                                <Text style={{maxWidth: "225px"}} ellipsis={{tooltip: CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName)}} className="cm-font-size13">{CommonUtil.__getFullName(_sellerwise?.sellerStub?.firstName, _sellerwise?.sellerStub?.lastName)}</Text>
                                                                <Progress
                                                                    percent    =   {Math.ceil(_sellerwise?.apStats?.completionPercentage * 100)}
                                                                    size       =   {[210, 10]}
                                                                    showInfo   =   {false}
                                                                    strokeColor=   {getColor(index)}
                                                                />
                                                            </Space>
                                                            <div style={{width: "35px"}} className="cm-margin-top20">{Math.ceil(_sellerwise?.apStats?.completionPercentage * 100)}%</div>
                                                        </Space>
                                                    )
                                                })
                                            :
                                                <div className="cm-height100 cm-flex-center cm-light-text">No assignees found</div>
                                        }
                                    </div>
                                        <div className="j-stage-ap-status-card cm-padding10">
                                            <div style={{ width: '80px', height: '55px' }}>
                                                <Pie {...config} />
                                            </div>
                                            <Row gutter={[5, 10]}>
                                                {pieData.map((item, index) => (
                                                    <Col span={12} className="cm-flex-align-center">
                                                        <Space size={6}>
                                                            <BS_Badge color={config.color[index]} shape="square" size="10px" radius="3px"/>
                                                            <div className="cm-font-size12"><span className="cm-font-fam500">{item.value}</span> {item.status}</div>
                                                        </Space>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Space>
                </div>
            </div>
        );    
    }else{
        return <></>
    }
    
};

export default RoomStageAnalytics;
