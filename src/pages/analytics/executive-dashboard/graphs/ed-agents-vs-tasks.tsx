import { Typography } from "antd"
import Loading from "../../../../utils/loading"
import { useQuery } from "@apollo/client"
import { useOutletContext } from "react-router-dom"
import { ED_TASKS } from "../api/executive-dashboard-query"
import { Column } from "@ant-design/charts"
import { CommonUtil } from "../../../../utils/common-util"
import { truncate } from "lodash";

const { Text }  =   Typography

const EdAgentsVsTasks = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>();

    const { data, loading }      =   useQuery(ED_TASKS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    })    
    
    const chartData = data?._edTasks?.map((task: any) => {
        const { user, tasks } = task;   
        const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
        const totalActionPoints = tasks.toDo.count + tasks.inProgress.count + tasks.completed.count + tasks.cancelled.count;
        return [
          { name: userName, value: tasks.toDo.count, type: "To-Do", totalActionPoints},
          { name: userName, value: tasks.inProgress.count, type: "In Progress", totalActionPoints },
          { name: userName, value: tasks.completed.count, type: "Completed", totalActionPoints },
          { name: userName, value: tasks.cancelled.count, type: "Cancelled", totalActionPoints },
        ];
    }).flat() || [];


    const config: any = {
        data: chartData || [],
        isStack: true,
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
        radius: 5,
        innerRadius: 0.75,
        columnWidthRatio: 0.25,
        maxColumnWidth: 50,
        seriesField: "type",
        color: ({ type }: { type: string }) => {
            if (type === "To-Do") return "#21AFFF";   
            if (type === "In Progress") return "#F48125";
            if (type === "Completed") return "#2FC25B";       
            if (type === "Cancelled") return "#DF2222";   
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
                let totalActionPoints = 0;
                const formattedItems = items.map(item => {
                    userName = item.title.split("__seller_uuid__")[0];
                    totalActionPoints = item.data.totalActionPoints; 
                    const { type, value } = item.data;
                    const badgeColor = type === 'To-Do' ? '#21AFFF' : type === 'In Progress' ? '#F48125' : type === 'Completed' ? '#2FC25B' : type === 'Cancelled' ? '#DF2222' : '#000';
                    const formattedType = type;
                    return `
                        <div style="display: flex; margin-bottom: 8px;">
                            <div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div>
                            <span class="cm-font-fam600">${formattedType} : &nbsp;</span>
                            <span class="cm-font-fam600">${Math.ceil(value)}</span>
                        </div>
                    `;
                });

                return `
                    <div style="padding: 8px;">
                        <div class="cm-font-fam700 cm-margin-bottom10">${userName}</div>
                        <div class="cm-font-fam700 cm-margin-bottom10">Total Action Points : &nbsp; ${totalActionPoints}</div>
                        ${formattedItems.join('')}
                    </div>
                `;
            },
        },
    };

    return (
        <div className="cm-background-white cm-padding15 cm-flex-direction-column cm-border-radius6 cm-border-light" style={{height: "375px", padding: 0}}>
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Task</Text>
            <div style={{height: "300px", paddingBlock: "25px"}}>
                {loading ? <Loading /> : data._edTasks.length ? <Column {...config}/> : <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100% - 10px)"}}>No activities yet</div>}
            </div>
        </div>
    )
}

export default EdAgentsVsTasks