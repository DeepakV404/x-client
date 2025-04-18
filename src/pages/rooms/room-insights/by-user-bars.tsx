import { useParams } from 'react-router-dom';
import { Column } from '@ant-design/charts';
import { useQuery } from '@apollo/client';
import { Card } from 'antd';
import { truncate} from 'lodash';
import { ENGAGEMENTS_BY_BUYER } from '../api/rooms-query';
import { CommonUtil } from '../../../utils/common-util';

import Loading from '../../../utils/loading';

const ByUserBars = () => {

    const params    =   useParams();

    const { data, loading }  = useQuery(ENGAGEMENTS_BY_BUYER, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        }
    })

    let bar_data: any[] = [];
    let hasValue = false;

    data && data.engagementsByBuyer.map((_item: any) => {
        let timeSpentOnContent: any = {};
        let timeSpentOnPitchVideo: any = {};
        let timeSpentOnUsecase: any = {};
        const buyerId = `${CommonUtil.__getFullName(_item.buyer.firstName, _item.buyer.lastName)}__buyer_uuid__${_item.buyer.uuid}`;
        
        timeSpentOnContent["buyerId"] = buyerId
        timeSpentOnContent["type"]  =   "Content"
        timeSpentOnContent["value"] =   _item.timeSpentOnContent/60
        bar_data.push(timeSpentOnContent)

        timeSpentOnPitchVideo["buyerId"] =   buyerId
        timeSpentOnPitchVideo["type"]  =    "Pitch Video"
        timeSpentOnPitchVideo["value"] =    _item.timeSpentOnPitchVideo/60
        bar_data.push(timeSpentOnPitchVideo)

        timeSpentOnUsecase["buyerId"] =   buyerId;
        timeSpentOnUsecase["type"]  =   "Demo"
        timeSpentOnUsecase["value"] =   _item.timeSpentOnUsecase/60
        bar_data.push(timeSpentOnUsecase)

        if(_item.timeSpentOnContent || _item.timeSpentOnPitchVideo || _item.timeSpentOnUsecase){
            hasValue = true
        }
    });

    const config = {
        data        :   bar_data, 
        xField      :   'buyerId',
        yField      :   'value',
        seriesField :   'type',
        isGroup     :   true,
        color       :   ['#0263FF', '#FF7723', '#8E30FF'],
        tooltip: {
            formatter: (data: any) => {
                return { 
                    title   : truncate(data.buyerId.split('__buyer_uuid__')[0], {
                        'length'    :   15,
                        'omission'  :   '...'
                    }),
                    name    : data.type,
                    value   : data.value  ? `${CommonUtil.__getFormatDuration(data.value * 60).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}` : "-"};
            },
        },
        columnStyle :   {
            radius: [5, 5, 0, 0],
        },
        xAxis: {
            label: {    
                autoHide: false, 
                autoRotate: true,
                formatter: (buyerId: string) => {
                    return truncate(buyerId.split('__buyer_uuid__')[0], {
                        'length'    :   15,
                        'omission'  :   '...'
                    });
                }
            },
        },
        yAxis: {
            min: 0,
            tickInterval: Math.ceil(Math.max(...bar_data?.map((item: any) => item.value)) / 3), 
            label: {
                formatter :  (x: any) => `${x} min`
            },
        },
        columnWidthRatio: 0.3,
    };

    return (
        <Card bordered={false} className="j-acc-insight-card cm-width100">
            {
                loading
                ?
                    <Loading/>
                :
                    hasValue 
                    ?
                        <Column {...config} legend={false}/>   
                    :   
                        <div className='cm-flex-center cm-height100 cm-empty-text cm-letter-spacing03' style={{minHeight: "400px"}}>No engagements yet</div>
            }
        </Card>
    )
}

export default ByUserBars