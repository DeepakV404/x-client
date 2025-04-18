import { useQuery } from "@apollo/client";
import { Column } from "@ant-design/charts";
import { truncate } from "lodash";

import { CommonUtil } from "../../../utils/common-util";
import { ROOM_TASK_PROGRESS } from "../api/rooms-query";

import Loading from "../../../utils/loading";

const TaskProgress = (props: { roomId: string }) => {

    const { roomId }    =   props;

    const { data, loading }      =   useQuery(ROOM_TASK_PROGRESS, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid : roomId
        }
    })

    const chartData = data?._rdTaskCompletionTime?.map((task: any) => {
        const { user, completionTimeInfo } = task;        
        const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
        return [
            { name: userName, value: completionTimeInfo.early.count, type: "Early", side: "right"},
            { name: userName, value: completionTimeInfo.onTime.count, type: "On-time", side: "right"},
            { name: userName, value: completionTimeInfo.oneToThreeDaysOverdue.count, type: "< 3 days", side: "right"},
            { name: userName, value: completionTimeInfo.threeDaysOverdue.count, type: "3 - 7 days", side: "right"},
            { name: userName, value: completionTimeInfo.aWeekOverdue.count, type: "> a week", side: "right"},
            { name: userName, value: completionTimeInfo.aMonthOverdue.count, type: "> a month", side: "right"},
        ];
    }).flat() || [];

    const taskCountData = data?._rdTaskCompletionTime?.map((task: any) => {
        const { user, totalCompletedTasks } = task;                
        const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
        return {
            name: userName,
            value: totalCompletedTasks.count,
            type: "Total Completed",
            side: "left"
        };
    }) || [];

    const combinedData = [...taskCountData, ...chartData]; 
    
    const config: any = {
        data: combinedData || [],
        isGroup: true, 
        isStack: true,
        seriesField: "type",
        groupField: "side",
        xField: "name",
        xAxis: {
            label: {
                autoHide: false, 
                autoRotate: true,
                style: {
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Inter'
                },
                formatter: (value: any) => {                    
                    return truncate(value.split("__seller_uuid__")[0], {
                        'length'    :   15,
                        'omission'  :   '...'
                    });
                }
            },
        }, 
        yField: "value", 
        yAxis: {
            min: 0,
            tickInterval: Math.ceil(Math.max(...chartData?.map((item: any) => item.value)) / 3),
            label: {
                style: {
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Inter'
                },
                formatter: (val: string) => `${Math.round(Number(val))}`,
            }, 
            grid: {
                line: {
                    style: {
                        stroke: "#E8E8EC",
                        lineDash: [4, 5],
                    }
                }
            },
        },
        autoFit: true,
        columnWidthRatio: 0.15,
        maxColumnWidth: 30,
        
        color: ({ type }:  any ) => {
            switch (type) {
                case "> a month":
                    return "#DF2222";
                case "> a week":
                    return "#F46060";
                case "Early":
                    return "#9DF5B8";
                case "On-time":
                    return "#8EF5A0";
                case "< 3 days":
                    return "#5FF58C";
                case "3 - 7 days":
                    return "#2FC25B";
                case "Total Completed":
                    return "#C6EDD2";
                default:
                    return "#000000";
            }
        },
        legend: false,
        tooltip: {
            style: {
                fontSize: 14,
                color: '#000',
                fontFamily: 'Inter'
            },
            customContent: (_: string, items: any[]) => {
                let userName = ""
                const formattedItems = items.map(item => {
                    userName = item.title.split("__seller_uuid__")[0];
                    const { type, value } = item.data;
                    let badgeColor = "#000";
        
                    if  (type === "Early") badgeColor = "#9DF5B8";
                    else if (type === "On-time") badgeColor = "#8EF5A0";
                    else if (type === "< 3 days") badgeColor = "#5FF58C";
                    else if (type === "3 - 7 days") badgeColor = "#2FC25B";
                    else if (type === "> a week") badgeColor = "#F46060";
                    else if (type === "> a month") badgeColor = "#DF2222";
                    else if(type === "Total Completed") badgeColor = "#C6EDD2";   

        
                    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                    return `
                        <div style="display: flex; margin-bottom: 10px;">
                            <div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div>
                            <span class="cm-font-fam400">${formattedType} : &nbsp; </span>
                            <span class="cm-font-fam600">${Math.ceil(value)}</span>
                        </div>
                    `;
                });
        
                return `
                    <div style="padding: 8px;">
                        <div class="cm-font-fam600 cm-font-size14 cm-margin-bottom15 cm-margin-top5">${userName}</div>
                        ${formattedItems.join('')}
                    </div>
                `;
            },
        },
        
    };

    return (
        <div className="j-taks-progress-wrapper" style={{height: "545px"}}>
            <div className='cm-font-fam500 cm-margin-bottom15'>Progress</div>
            <div style={{height: "450px", paddingBlock: "25px"}}>
                {loading ? <Loading /> : data?._rdTaskCompletionTime.length ? <Column {...config} loading={loading}/> : <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100% - 10px)"}}>No activities yet</div>}
            </div>
        </div>
    )
}

export default TaskProgress