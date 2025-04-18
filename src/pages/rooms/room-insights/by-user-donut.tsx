import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { Card } from 'antd';

import { ENGAGEMENT_BY_CONTENT } from '../api/rooms-query';
import { CommonUtil } from '../../../utils/common-util';

import Loading from '../../../utils/loading';

const ByUserDonut = () => {

    const params = useParams();

    const { data, loading }  = useQuery(ENGAGEMENT_BY_CONTENT, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        }
    });

    let pie_data: any[] = [];
    let hasValue = false;
    data && Object.keys(data.engagementsByContent).map((_item: any) => {

        let input: any = {};
        input["type"]  =   _item
        input["value"] =   data.engagementsByContent[_item]

        data.engagementsByContent[_item] ? pie_data.push(input) : null;

        if(data.engagementsByContent[_item]){
            hasValue = true
        }
    });

    function renderStatistic(containerWidth: any, text: any, style: any) {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; 
    
        let scale = 1;
    
        if (containerWidth < textWidth) {
          scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }
    
        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
      }

    const config = {
        data            :   pie_data,
        angleField      :   'value',
        colorField      :   'type',
        radius          :   0.8,
        innerRadius     :   0.8,
        tooltip: {
            formatter: (data: any) => {
                return { name: data.type, value: `${CommonUtil.__getFormatDuration(data.value).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`};
            },
        },
        label: {
            content     :   (data: any) => {
                return `${data.type}\n${CommonUtil.__getFormatDuration(data.value).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`
            }
        },
        statistic: {
            title: {
                offsetY: -4,
                style: {
                    fontSize: '15px',
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '18px',
                },
                customHtml: (container: any, datum: any) => {
                    const { width } = container.getBoundingClientRect();
                    let time = CommonUtil.__getFormatDuration(datum.filteredData.reduce((r: any, d: any) => r + d.value, 0)).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")
                    return renderStatistic(width, time, {
                        fontSize: 22,
                    });
                },
            },
        },
    };

    return (
        <Card bordered={false} className="j-acc-insight-card cm-width100 j-donut-insight-card">
        {
            loading 
            ?
                <Loading/>
                :
                    hasValue 
                    ?
                        <Pie {...config} legend={false} style={{height: "400px", paddingBlock: "20px", width: "100%"}}/>
                    :
                        <div className='cm-flex-center cm-height100 cm-empty-text cm-letter-spacing03' style={{minHeight: "400px"}}>No engagements yet</div>
        }
        </Card>
    )
};

export default ByUserDonut
