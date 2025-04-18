import { Typography } from "antd"
import { useQuery } from "@apollo/client";
import { Column } from '@ant-design/plots';
import { truncate } from "lodash";
import { LEADER_BOARD_STATS } from "../../api/analytics-query";
import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";
import { CommonUtil } from "../../../../../utils/common-util";
import { NO_DEAL_VS_USER } from "../../../../../constants/module-constants";



const { Text }      =    Typography

const DealsVsSales = (props: {from: any, to: any}) => {

    const { from, to }  =   props;

    const { data, loading, error } = useQuery(LEADER_BOARD_STATS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from    :   from,
                to      :   to
            },
            pageConstraint: {
                page: 1,
                limit: 1000
            }
        }
    });

    const topFiveData     = data?.leaderboardStats?.slice(0, 5) || [];

    let chartData: any = [];
    topFiveData.map((_data: any) => chartData.push({x: `${CommonUtil.__getFullName(_data.seller.firstName, _data.seller.lastName)}__seller_uuid__${_data.seller.uuid}`, type: "win", value: _data.winRate > 0 ? (100 - _data.winRate) : 0}, {x: `${CommonUtil.__getFullName(_data.seller.firstName, _data.seller.lastName)}__seller_uuid__${_data.seller.uuid}`, type: "loss", value: _data.winRate == -1 ? 0 : parseInt(_data.winRate)}))

    const config = {
        data: chartData,
        isStack: true,
        xField: 'x',
        xAxis: {
            label: {
                formatter: (value: any) => {
                    return truncate(value.split("__seller_uuid__")[0], {
                        'length'    :   15,
                        'omission'  :   '...'
                    });
                }
            },
        },
        yField: 'value',
        yAxis: {
            min: 0,
            tickInterval: Math.ceil(Math.max(...chartData?.map((item: any) => item.value)) / 3), 
            grid: {
                line: {
                    style: {
                        stroke: "#E8E8EC",
                        lineDash: [4, 5],
                    }
                }
            },
        },
        color: ['#FD333C', '#2FC25B'],
        columnWidthRatio: 0.4,
        maxColumnWidth: 50,
        seriesField: 'type',
        tooltip: {
            customContent: (_: any, items: any[]) => {
                const formattedItems = items.map(item => {
                    const badgeColor = item.data.type === 'win' ? '#FD333C' : '#2FC25B';
                    const type = item?.data.type === "win" ? "Loss" : "Win";
                    const value = item?.data.value;
                    const textStyle = item.data.type === 'loss' ? 'margin-right: 5px' : '';
                    return `<div style="display: flex"><div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div> <span style="${textStyle}">${type}</span>  : <span style="font-weight: 600; margin-left: 8px">${Math.ceil(value)}%</span></div>`;
                });
    
                return `
                    <div style="padding: 8px;">
                        <div>${formattedItems.reverse().join('<br>')}</div>
                    </div>
                `;
            },
        },
    };

    if(error) return <SomethingWentWrong />

    return (
        <div className="j-analytics-overview-card cm-padding15 cm-flex-direction-column" style={{height: "370px"}}>
            <Text className="cm-secondary-text cm-font-fam500 cm-margin-bottom20">Deals vs Salespeople</Text>
            {
                chartData.length > 0 ?
                    <div style={{height: "100%"}}> 
                        <Column  {...config} legend={false} loading={loading}/>
                    </div>
                :
                    <div className="cm-flex-center cm-height100">
                        <img src={NO_DEAL_VS_USER} alt="top_5_deals" width={150}/>
                    </div>
            }
        </div>
    )
}

export default DealsVsSales