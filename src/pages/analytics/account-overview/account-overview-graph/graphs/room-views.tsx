import { useState, useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Card, Typography } from 'antd';

import { GlobalContext } from '../../../../../globals';
import { ROOM_VIEWS } from '../../api/analytics-query';
import Loading from '../../../../../utils/loading';
import RoomViewsGraph from './room-views-graph';

const { Text }  =   Typography;

const RoomViews = (props: { from: any, to: any, dataFilter: string, home? : any}) => {

    const { from, to, dataFilter, home }  =   props;

    const { $user }    =   useContext(GlobalContext);

    const [data, setData] = useState([]);

    const [_getRoomViews, { data: graphData, loading }] = useLazyQuery(ROOM_VIEWS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            granularity: dataFilter ===  "today" ? "HOURLY" : "DAILY",
            userUuids : home ? [$user.uuid] : undefined

        }
    })

    useEffect(() => {
        if(from && to){
            _getRoomViews()
        }
    }, [from, to])

    useEffect(() => {
        if(graphData){
            let chartData: any = [];
            graphData?.roomViews.map((_item: any) => {
                chartData.push({"time": _item.label, "value": Math.ceil(_item.views), "type": "Views", key: `${_item.key}`}, {"time": _item.label, "value": Math.ceil(_item.uniqueViews), "type": "Unique Views", key: `${_item.key}`})
                // {"time": _item.label, "value": Math.ceil(_item.avgViews), "type": "Avg Views", key: `${_item.key}`}
            })
            setData(chartData)
        }
    }, [graphData]);
    
    return (
        <Card className="j-analytics-overview-card cm-padding15 cm-flex-direction-column" style={{height: "380px"}}>
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">Rooms Views</Text>
            <div style={{height: "300px", paddingBlock: "25px"}}>
                {loading ? <Loading/> : <RoomViewsGraph data={data}/>}
            </div>
        </Card>
    )
}

export default RoomViews
