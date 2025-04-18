
import { Pie } from "@ant-design/charts";
import { Col, Progress, Row, Space, Typography } from "antd";

import LatestActivity from "../rooms-listing/latest-activity";
import BS_Badge from "../../../buyer-view/components/badge";
import SalesPersonCard from "./sales-person-card";
import { CommonUtil } from "../../../utils/common-util";

const { Text }  =   Typography;

const ApStatusAnalytics = (props: {overAllApStats: any, latestActivity: any, roomInfo: any, ownerStats: any}) => {

    const { overAllApStats, latestActivity, roomInfo, ownerStats }    =   props;

    const data = [
        {
            type: 'Completion',
            value: overAllApStats?.completionPercentage * 100,
        },
        {
            type: 'Remaining',
            value: (100 - (overAllApStats?.completionPercentage * 100)),
        },
    ];
    
    const config: any = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        label : false,
        innerRadius: 0.64,
        startAngle: Math.PI,
        endAngle: Math.PI * 1.5,
        legend: false,
        title: false,
        tooltip: false,
        pieStyle: () => {
            return {
                stroke: '#fff',
                lineWidth: 3,
            };
        },
        color: ["#8C78EA", "#fff"],
        statistic: {
            title: false,
            content: false
        },
    };

    // const gaugeConfig: any = {
    //     percent: 0,
    //     radius: 1,
    //     innerRadius: 0.65,
    //     startAngle: Math.PI - 0.5,
    //     endAngle: 2 * Math.PI + 0.5,
    //     range: {
    //         ticks: [0, 0.33, 0.66, 1],
    //         color: ["#D5E4FA", "#FBEBD4", "#EA9E78"],
    //     },
    //     indicator: {
    //         pointer: {
    //             style: {
    //                 stroke: "#2F3A5F",
    //                 lineWidth: 4,
    //             },
                
    //         },
    //         pin: {
    //             style: {
    //                 stroke: "#2F3A5F",
    //                 r: 1,
    //             },
    //         },
    //     },
    //     axis: {
    //         label: null,
    //         subTickLine: null,
    //         tickLine: null,
    //     },
    //     statistic: false,
    //     tooltip: false,
    // };

    const calculateDays = (createdAt: any) => {
        const now = Date.now();
        const diffInMilliseconds = now - createdAt;

        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 1) {
            return `${days} day${days > 1 ? 's' : ''} so far`;
        } else if (hours >= 1) {
            return `${hours} hour${hours > 1 ? 's' : ''} so far`;
        } else if (minutes >= 1) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} so far`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} so far`;
        }
    };

    return (
        <div className={`${(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app")  ? "cm-gap15" : "cm-gap30"} j-ap-completion-score cm-padding20 cm-flex`}>
            <Space direction="vertical" size={15}>
                <div className="cm-font-size24 cm-font-fam600">Activities</div>
                {latestActivity ? <LatestActivity activity={latestActivity} isDashboard={true}/> : <div className="cm-font-opacity-black-67 cm-font-size12">No Latest activity</div>}
                <div className="cm-flex cm-position-relative">
                    <Progress
                        className       =   "j-room-ap-progress"
                        percentPosition =   {{ align: 'center', type: 'inner'}}
                        percent         =   {Math.ceil(overAllApStats.completionPercentage * 100)}
                        strokeColor     =   "#9f7aea"
                        trailColor      =   "#e6e6fa"
                        size            =   {(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? [575, 30] : [670, 30]}
                        format          =   {() => Math.ceil(overAllApStats.completionPercentage * 100) > 10 ? calculateDays(roomInfo.createdAt) : ""}
                    />
                    {overAllApStats?.completedAps === overAllApStats?.totalAps ? <></> : <div style={{position: "absolute", right: "8px", top: "6px"}}>{overAllApStats?.completedAps ?? 0} / {overAllApStats?.totalAps ?? 0}</div>}
                </div>
                <Row gutter={16} className="cm-margin-block10">
                    <Col span={6} className="cm-padding10">
                        <Space direction="vertical" size={20}>
                            <BS_Badge color="#0061FC" text="Planned" size="10px"/>
                            <div className="cm-font-size24 cm-font-fam600">{overAllApStats?.plannedAps ?? 0}</div>
                        </Space>
                    </Col>
                    <Col span={6} className="cm-padding10">
                        <Space direction="vertical" size={20}>
                            <BS_Badge color="#FFA950" text="On-Going" size="10px"/>
                            <div className="cm-font-size24 cm-font-fam600">{overAllApStats?.onGoingAps ?? 0}</div>
                        </Space>
                    </Col>
                    <Col span={6} className="cm-padding10">
                        <Space direction="vertical" size={20}>
                            <BS_Badge color="#FF3E3E" text="Pending" size="10px"/>
                            <div className="cm-font-size24 cm-font-fam600">{overAllApStats?.pendingAps ?? 0}</div>
                        </Space>
                    </Col>
                    <Col span={6} className="cm-padding10">
                        <Space direction="vertical" size={20}>
                            <BS_Badge color="#00A41E" text="Finished" size="10px"/>
                            <div className="cm-font-size24 cm-font-fam600">{overAllApStats?.completedAps ?? 0}</div>
                        </Space>
                    </Col>
                </Row>
            </Space>

            <Space size={(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? 15 : 30}>
                <Space direction="vertical" className="j-completion-score-card">
                    <div className="cm-font-opacity-black-67">Completion Score</div>
                    <div className="cm-font-size24 cm-font-fam600">{overAllApStats?.completionPercentage ? `${(Math.ceil(overAllApStats?.completionPercentage * 100))}%` : "0"}</div>
                    <Pie {...config} legend={false} style={{height: "131px", width: "192px"}}/>
                </Space>
                {/* <div className="j-buyer-engagement-score-card">
                    <Space direction="vertical" size={8}>
                        <div className="cm-font-opacity-black-67">Buyer Engagement Score</div>
                        <div className="cm-font-size24 cm-font-fam600">0%</div>
                    </Space>
                    <Gauge {...gaugeConfig} style={{position: "relative", bottom: "-15px", height: "160px"}}/>
                </div> */}
                <div className="j-owner-stats-card" >
                    <div className="cm-font-opacity-black-67 cm-margin-bottom15">Salesperson Performance</div>
                    {
                        !ownerStats.length ? 
                            roomInfo?.owner 
                            ?
                                <div className="cm-flex-center cm-flex-direction-column" style={{rowGap: "10px"}}>
                                    <SalesPersonCard salesReport={[]} profile={""} size={120} showEmptyData={true}/>
                                    <Text style={{maxWidth: "250px"}} ellipsis={{tooltip: `${roomInfo?.owner?.firstName} ${roomInfo?.owner?.lastName ?? ""}`}} className="cm-font-opacity-black-85 cm-font-fam500 cm-font-size15">{`${roomInfo?.owner?.firstName} ${roomInfo?.owner?.lastName ?? ""}`}</Text>
                                </div>
                            :
                                <div className="cm-flex-center cm-flex-direction-column" style={{rowGap: "10px"}}>
                                    <SalesPersonCard salesReport={[]} profile={""} size={145} showEmptyData={true}/>
                                </div>
                        :
                            ownerStats?.filter(Boolean)
                                .map((_salesPerson: any) => {
                                    return (
                                        <div key={_salesPerson?.sellerStub?.uuid} className="cm-flex-center cm-flex-direction-column" style={{rowGap: "10px"}}>
                                            <SalesPersonCard salesReport={_salesPerson?.apStats} profile={_salesPerson?.sellerStub?.profileUrl} size={120}/>
                                            <Text style={{maxWidth: "250px"}} ellipsis={{tooltip: `${_salesPerson?.sellerStub?.firstName} ${_salesPerson?.sellerStub?.lastName ?? ""}`}} className="cm-font-opacity-black-85 cm-font-fam500 cm-font-size15">{`${_salesPerson?.sellerStub?.firstName} ${_salesPerson?.sellerStub?.lastName ?? ""}`}</Text>
                                        </div>
                                    )
                                })
                    }
                </div>
            </Space>            
        </div>                
    )
}

export default ApStatusAnalytics
