import { useQuery } from "@apollo/client"
import { ED_DEALS_OVERVIEW } from "../api/executive-dashboard-query"
import { useOutletContext } from "react-router-dom";
import { Typography } from "antd";
import Loading from "../../../../utils/loading";
import { Column } from "@ant-design/charts";
import { truncate } from "lodash";
import { CommonUtil } from "../../../../utils/common-util";


const { Text }  =   Typography

const EdAgentVsDealOverview = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>();

    const { data, loading }      =   useQuery(ED_DEALS_OVERVIEW, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    })    

    const chartData = data?._edDealsOverview?.map((dealOverview: any) => {
        const { user, overview } = dealOverview;
        const userName = `${CommonUtil.__getFullName(user.firstName, user.lastName)}__seller_uuid__${user.uuid}`
        return [
          { name: userName, value: overview.open.count, type: "Open" },
          { name: userName, value: overview.win.count, type: "Win" },
          { name: userName, value: overview.loss.count, type: "Loss" },
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
            } 
        },
        autoFit: true,
        radius: 1,
        innerRadius: 0.75,
        columnWidthRatio: 0.25,
        maxColumnWidth: 50,
        seriesField: "type",
        color: ({ type }: { type: string }) => {
            if (type === "Open") return "#2150FF";   
            if (type === "Win") return "#2FC25B";    
            if (type === "Loss") return "#DF2222";   
            return "#000"; 
        },
        legend: {
            position: "bottom",
            marker: {
                symbol: "circle", 
            },
        },
        tooltip: {
            customContent: (_:any, items: any[]) => {
                let userName = ""
                const formattedItems = items.map((item: any) => {                    
                    userName = item.title.split("__seller_uuid__")[0];
                    const { type, value } = item.data;
                    const badgeColor = type === 'Open' ? '#2150FF' : type === 'Win' ? '#2FC25B' : type === 'Loss' ? '#DF2222' : '#000';
                    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                    return `
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div>
                            <span class="cm-font-fam600">${formattedType} : &nbsp;</span>
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
            <Text className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">User vs Deals Overview</Text>
            <div style={{height: "300px", paddingBlock: "25px"}}>
                {loading ? <Loading /> : data._edDealsOverview.length ? <Column {...config} loading={loading}/> : <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100% - 10px)"}}>No activities yet</div>}
            </div>
        </div>
    )
}

export default EdAgentVsDealOverview