import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client';
import { Card, Col, Row, Statistic } from 'antd';

import { OVERALL_ROOM_INSIGHTS } from '../api/rooms-query';
import { CommonUtil } from '../../../utils/common-util';

const InsightOverview = () => {

    const params = useParams();

    const { data }  =   useQuery(OVERALL_ROOM_INSIGHTS, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        },
    });

    const formatDuration = (duration: number) => {
        const formattedDuration = CommonUtil.__getFormatDuration(duration);
        
        if (formattedDuration && formattedDuration.length > 0) {
            const { value, unit } = formattedDuration[0];
            if (value > 0) {
                return `${value} ${unit}`;
            } else {
                return unit;
            }
        }
    }

    return (
        <div className="cm-width100" style={{height: "calc(100% - 30px)"}}>
            <Row gutter={[15, 15]} >
                <Col span={8}>
                    <Card bordered={false} className='j-room-insight-card'>
                        <Statistic
                            title       =   {<div className=''>Total Time Spent</div>}
                            value       =   {data && data.overAllRoomInsight && data.overAllRoomInsight.totalTimeSpent ? formatDuration(data.overAllRoomInsight.totalTimeSpent) : "-"}
                            precision   =   {2}
                            valueStyle  =   {{ color: '#000', fontSize: "22px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className='j-room-insight-card'>
                        <Statistic
                            title       =   {<div className='cm-font-size15'>Total Interactions</div>}
                            value       =   {data && data.overAllRoomInsight && data.overAllRoomInsight.totalInteractions ? data.overAllRoomInsight.totalInteractions : "-"}
                            valueStyle  =   {{ color: '#000', fontSize: "22px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
                {/* <Col span={8} >
                    <Card bordered={false}>
                        <Statistic
                            title       =   {<div className='cm-font-size15'>Links Clicked</div>}
                            value       =   {data && data.overAllRoomInsight && data.overAllRoomInsight.linksClicked ? data.overAllRoomInsight.linksClicked : "-"}
                            valueStyle  =   {{ color: '#000', fontFamily: "Inter500, sans-serif", fontSize: "22px" }}
                        />
                    </Card>
                </Col> */}
                {/* <Col span={8} >
                    <Card bordered={false}>
                        <Statistic
                            title       =   {<div className='cm-font-size15'>Usecases</div>}
                            value       =   {data && data.overAllRoomInsight && data.overAllRoomInsight.timeSpentOnUsecase ? `${CommonUtil.__getFormatDuration(data.overAllRoomInsight.timeSpentOnUsecase).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"}
                            precision   =   {2}
                            valueStyle  =   {{ color: '#000', fontFamily: "Inter500, sans-serif", fontSize: "22px" }}
                        />
                    </Card>
                </Col> */}
                <Col span={8}>
                    <Card bordered={false} className='j-room-insight-card'>
                        <Statistic
                            title       =   {<div className='cm-font-size15'>Resources</div>}
                            value       =   {data && data.overAllRoomInsight && data.overAllRoomInsight.timeSpentOnContent ? formatDuration(data.overAllRoomInsight.timeSpentOnContent) : "-"}
                            valueStyle  =   {{ color: '#000', fontSize: "22px" }}
                            className   =   "cm-font-fam500"
                        />
                    </Card>
                </Col>
                {/* <Col span={8} >
                    <Card bordered={false}>
                        <Statistic
                            title       =   "Pitch Video"
                            value       =   {(data && data.overAllRoomInsight && data.overAllRoomInsight.timeSpentOnPitchVideo ? `${CommonUtil.__getFormatDuration(data.overAllRoomInsight.timeSpentOnPitchVideo).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`: "-")}
                            valueStyle  =   {{ color: '#000', fontFamily: "Inter500, sans-serif", fontSize: "22px" }}
                        />
                    </Card>
                </Col> */}
            </Row>            
        </div>
    )
}

export default InsightOverview