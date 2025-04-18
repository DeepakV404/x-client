import { useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Typography } from "antd";
import { Column } from "@ant-design/charts";
import { truncate } from "lodash";

import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../../../globals";
import { TOP_ROOMS_VIEW } from "../../api/analytics-query";
import { CommonUtil } from "../../../../../utils/common-util";
import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";
import { TOP_5_BY_TIME_SPENT } from "../../../../../constants/module-constants";

const { Text }  = Typography

const TopRoomsViews = (props: {from: any, to: any, home? : any}) => {

    const { from, to, home}  =   props;

    const { $user }    =   useContext(GlobalContext);
    const navigate          =   useNavigate();

    const [_getTopRoomViews, { data,  error }] = useLazyQuery(TOP_ROOMS_VIEW, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            userUuids : home ? [$user.uuid] : undefined
        }
    });

    useEffect(() => {
        if(from && to){
            _getTopRoomViews()
        }
    }, [from, to])

    const topFiveData     = data?.topRoomsByTimeSpent?.slice(0, 5) || [];

    const config = {
        data: topFiveData?.map((item: any) => ({
            x: `${item.room.title}_room_uuid_${item.room.uuid}_account_uuid_${item.room.accountStub.uuid}`,
            y: item.timeSpent,
        })),
        xField: 'x',
        xAxis: {
            label: {
                formatter: (value: any) => {
                    return truncate(value.split("_room_uuid_")[0], {
                        'length'    :   15,
                        'omission'  :   '...'
                    });
                }
            },
        },
        yAxis: {
            min: 0,
            tickInterval: Math.ceil(Math.max(...topFiveData?.map((item: any) => item.value)) / 3), 
            grid: {
                line: {
                    style: {
                        stroke: "#E8E8EC",
                        lineDash: [4, 5],
                    }
                }
            },
            title: {
                text: 'Time Spent',
            },
        },
        yField: 'y',
        columnWidthRatio: 0.4,
        maxColumnWidth: 50,
        tooltip: {
            customContent: (_: any, items: any[]) => {
                const formattedItems = items.map(item => {
                    return `${item.title.split("_room_uuid_")[0]} : <span class='cm-font-fam600'>${CommonUtil.__getFormatDuration(item.value).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</span>`;
                });
    
                return `
                    <div style="padding: 8px;">
                        <div>${formattedItems}</div>
                    </div>
                `;
            },
        },
        interactions: [
            {
                type: 'element-selected',
                cfg: {
                    start: [
                        {
                            trigger: 'element:click',
                            action: (context: any) => {
                                const { data } = context.event.data;
                                const uuid = data.x.split("_room_uuid_")[1].split("_account_uuid_")[0];
                                const accountUuid = data.x.split("_account_uuid_")[1];
                                navigate(`/rooms/${accountUuid}/${uuid}/sections`)
                            },
                        },
                    ],
                },
            },
            {
                type: 'element-active',
                cfg: {
                    start: [
                        {
                            trigger: 'element:mouseenter',
                            action: (context: any) => {
                                context.element.style.cursor = 'pointer';
                            },
                        },
                    ],
                    end: [
                        {
                            trigger: 'element:mouseleave',
                            action: (context: any) => {
                                context.element.style.cursor = 'pointer';
                            },
                        },
                    ],
                },
            },
        ],
    };

    if(error) return <SomethingWentWrong />

    return (
        <div className="j-analytics-overview-card cm-padding15 cm-flex-direction-column">
            <Text className="cm-secondary-text cm-font-fam500 cm-margin-bottom20">Top 5 Rooms by Time Spent</Text>
            {
                topFiveData.length > 0 ?
                    <div className="cm-cursor-pointer">
                        <Column {...config} />
                    </div>
                :
                    <div className="cm-flex-center cm-height100">
                        <img src={TOP_5_BY_TIME_SPENT} alt="top_5_deals" width={120}/>
                    </div>
            }
        </div>
    )
}

export default TopRoomsViews