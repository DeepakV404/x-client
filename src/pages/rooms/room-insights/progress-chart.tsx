import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Card } from 'antd'
import { Gauge } from '@ant-design/charts';

import { ACTION_POINTS_REPORT } from '../api/rooms-query';

import Loading from '../../../utils/loading';

const ProgressChart = () => {

    const params = useParams();

    const { data, loading, error } = useQuery(ACTION_POINTS_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid  : params.roomId
        },
    });

    if(error) return <>Something went wrong</>

    const config: any = data ? {
        percent: data.actionPointsReport.completedActionPoints / data.actionPointsReport.totalActionPoints,
        range: {
            color: 'l(0) 0:#087aea 0.5:#b2cde7 1:#1e9c90',
        },
        startAngle: 2.7 * Math.PI,
        endAngle:2.3 * Math.PI,
        indicator: null,
        statistic: {
            title: {
                offsetY: -80,
                style: {
                    fontSize: '20px',
                    color: '#4B535E',
                },
                formatter: () => `${data.actionPointsReport.completedActionPoints} ${"/"} ${data.actionPointsReport.totalActionPoints}`,
            },
            content: {
                offsetY: -60,
                style: {
                    fontSize: '16px',
                    lineHeight: '40px',
                    color: '#4B535E',
                },
                formatter: () => 'Action Points',
            },
        },
    } : {};

    return (
        <Card bordered={false} className="j-acc-insight-card cm-width100 cm-flex-center" style={{padding: "0px", minHeight: "235px"}}>
            {
                loading ?
                    <Loading/>
                :
                    <Gauge {...config} style={{width: "200px", height: "185px"}}/>
            }
        </Card>

    )
}

export default ProgressChart