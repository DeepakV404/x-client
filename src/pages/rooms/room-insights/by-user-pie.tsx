import { useParams } from 'react-router-dom';
import { Pie } from '@ant-design/charts';
import { useQuery } from '@apollo/client';
import { Card } from 'antd';

import { CONTRIBUTIONS_BY_BUYER } from '../api/rooms-query';
import { CommonUtil } from '../../../utils/common-util';

import Loading from '../../../utils/loading';
import { truncate } from 'lodash';

const ByUserPie = () => {

    const params = useParams();

    const { data, loading }  = useQuery(CONTRIBUTIONS_BY_BUYER, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        }
    })

    let pie_data: any[] = [];
    let hasValue = false;
    data && data.contributionsByBuyer.map((_item: any) => {
        if(_item.timeSpent){
            let input: any = {};
            input["type"]   =  `${CommonUtil.__getFullName(_item.buyer.firstName, _item.buyer.lastName)}__uuid__${_item.buyer.uuid}`
            input["value"]  =   _item.timeSpent/60

            pie_data.push(input)
        }

        if(_item.timeSpent){
            hasValue = true
        }
    });

    const config = {
        data            :   pie_data,
        appendPadding   :   5,
        angleField      :   'value',
        colorField      :   'type',
        radius          :   0.75,
        tooltip: {
            formatter: (data: any) => {
                let label = data.type.split("__uuid__")[0]
                const truncatedType = truncate(label, {
                    omission: "..."
                });
                return { name: `${truncatedType}`, value: `${CommonUtil.__getFormatDuration(data.value * 60).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`};
            },
        },
        label           :   {
            labelHeight :   28,
            type        :   'spider',
            content: (data: any) => {
                let label = data.type.split("__uuid__")[0]
                const truncatedType = truncate(label, {
                    length: 15,
                    omission: "..."
                });
                return `${truncatedType}\n${CommonUtil.__getFormatDuration(data.value * 60).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`;
            }
            
        },
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
                        <Pie
                            {...config}
                            legend  =   {false}
                        />
                    :
                        <div className='cm-flex-center cm-height100 cm-empty-text cm-letter-spacing03' style={{minHeight: "400px"}}>No contributions yet</div>
            }
        </Card>
    )
}

export default ByUserPie