import { Typography } from "antd"
import Loading from "../../../../utils/loading"
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ED_TASK_DUE_DATE_CHANGE } from "../api/executive-dashboard-query";
import { CommonUtil } from "../../../../utils/common-util";
import { truncate } from "lodash";
import { Column } from "@ant-design/charts";

const { Text }  =   Typography

const EdAgentVsTaskDueDateChange = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>();

    const { data, loading }      =   useQuery(ED_TASK_DUE_DATE_CHANGE, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    })

    // const totalActionPoints = data?._edTaskDueDateChange?.map((task: any) => {
    //     const { user, dueDateChangeInfo } = task;        
    //     const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
    //     return [
    //         { name: userName, value: dueDateChangeInfo.count, type: "Total ActionPoints", side: "left"},
    //     ];
    // }).flat() || [];

    const totalActionPointDateChange = data?._edTaskDueDateChange?.map((task: any) => {
        const { user, dueDateChangeInfo } = task;        
        const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
        return [
            { name: userName, value: dueDateChangeInfo.oneTime.count, type: "1 time", side: "right"},
            { name: userName, value: dueDateChangeInfo.twoToFour.count, type: "2-4 times", side: "right"},
            { name: userName, value: dueDateChangeInfo.fourToSix.count, type: "4-6 times", side: "right"},
            { name: userName, value: dueDateChangeInfo.moreThanSix.count, type: "> 6 times", side: "right"},
        ];
    }).flat() || [];

    const combinedData = [...totalActionPointDateChange]; 
    
    const config: any = {
        data: combinedData || [],
        // isGroup: true, 
        isStack: true,
        seriesField: "type",
        // groupField: "side",
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
            tickInterval: Math.ceil(Math.max(...combinedData?.map((item: any) => item.value)) / 4),
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
        color: ({ type }: { type: string }) => {
            if (type === "1 time") return "#AEDF22";   
            if (type === "2-4 times") return "#1A2690";       
            if (type === "4-6 times") return "#0AD3D3";          
            if (type === "> 6 times") return "#B922DF";        
            if(type === "Total ActionPoints") return "#2150FF"
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
        
                    if (type === "1 time") badgeColor = "#AEDF22";   
                    if (type === "2-4 times") badgeColor = "#1A2690";       
                    if (type === "4-6 times") badgeColor = "#0AD3D3";          
                    if (type === "> 6 times") badgeColor = "#B922DF";        
                    if(type === "Total ActionPoints") badgeColor = "#2150FF" 

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
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Task Due Date Change</Text>
            <div style={{height: "300px", paddingBlock: "25px"}}>
                {loading ? <Loading /> : data._edTaskDueDateChange.length ? <Column {...config} loading={loading}/> : <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100% - 10px)"}}>No activities yet</div>}
            </div>
        </div>
    )
}

export default EdAgentVsTaskDueDateChange