import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Card, Col, Row, Statistic } from "antd";

import { ROOM_REPORT_BY_BUYER } from "../api/rooms-query";
import { CommonUtil } from "../../../utils/common-util";

import Loading from "../../../utils/loading";

const BuyerDetails = (props: {buyer: any}) => {

    const { buyer } =   props;

    const params    =   useParams();

    const { data, loading, error }  =   useQuery(ROOM_REPORT_BY_BUYER, {
        variables: {
            roomUuid     :   params.roomId,
            contactUuid  :   buyer?.uuid
        },
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>
    if(error) return <div>Something went wrong</div>

    return(
        <div className="cm-width100">
            <Row gutter={[10, 10]} >
                <Col span={8}>
                    <Card bordered={false} className='j-buyer-stats-card'>
                        <Statistic
                            title       =   {<div className='cm-font-size12'>Total Time Spent</div>}
                            value       =   {data && data.roomReportByBuyer && data.roomReportByBuyer.totalTimeSpent ? `${CommonUtil.__getFormatDuration(data.roomReportByBuyer.totalTimeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"}
                            precision   =   {0}
                            valueStyle  =   {{ color: '#000', fontSize: "15px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className='j-buyer-stats-card'>
                        <Statistic
                            title       =   {<div className='cm-font-size12'>Total Interactions</div>}
                            value       =   {data.roomReportByBuyer.totalInteractions}
                            valueStyle  =   {{ color: '#000', fontSize: "15px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
                <Col span={8} >
                    <Card bordered={false} className='j-buyer-stats-card'>
                        <Statistic
                            title       =   {<div className='cm-font-size12'>Content</div>}
                            value       =   {data && data.roomReportByBuyer && data.roomReportByBuyer.timeSpentOnContent ? `${CommonUtil.__getFormatDuration(data.roomReportByBuyer.timeSpentOnContent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"}
                            valueStyle  =   {{ color: '#000', fontSize: "15px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
            </Row>            
        </div>
    )
}

export default BuyerDetails