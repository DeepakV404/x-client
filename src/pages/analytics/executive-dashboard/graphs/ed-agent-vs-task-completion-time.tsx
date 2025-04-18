import { Typography } from "antd"
import Loading from "../../../../utils/loading"
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ED_TASK_COMPLETION_TIME } from "../api/executive-dashboard-query";
import { Column } from "@ant-design/charts";
import { CommonUtil } from "../../../../utils/common-util";
import { truncate } from "lodash";

const { Text }  =   Typography

const EdAgentVsTaskCompletionTime = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>();

    const { data, loading }      =   useQuery(ED_TASK_COMPLETION_TIME, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    })

    const chartData = data?._edTaskCompletionTime?.map((task: any) => {
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

    const taskCountData = data?._edTaskCompletionTime?.map((task: any) => {
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
        columnWidthRatio: 0.25,
        maxColumnWidth: 50,
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
        legend: {
            position: "bottom",
            marker: {
                symbol: "circle", 
            },
        },
        tooltip: {
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
                        <div style="display: flex; margin-bottom: 8px;">
                            <div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div>
                            <span class="cm-font-fam600">${formattedType} : &nbsp; </span>
                            <span class="cm-font-fam600">${Math.ceil(value)}</span>
                        </div>
                    `;
                });
        
                return `
                    <div style="padding: 8px;">
                        <div class="cm-font-fam700 cm-margin-bottom10">${userName}</div>
                        ${formattedItems.join('')}
                    </div>
                `;
            },
        },
        
    };

    return (
        <div className="cm-background-white cm-padding15 cm-flex-direction-column cm-border-radius6 cm-border-light" style={{height: "375px", padding: 0}}>
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Task Completion Time</Text>
            <div style={{height: "300px", paddingBlock: "25px"}}>
                {loading ? <Loading /> : data._edTaskCompletionTime.length ? <Column {...config} loading={loading}/> : <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100% - 10px)"}}>No activities yet</div>}
            </div>
        </div>
    )
}

export default EdAgentVsTaskCompletionTime