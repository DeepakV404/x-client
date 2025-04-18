import { Scatter } from "@ant-design/charts";
import { useQuery } from "@apollo/client";
import { useOutletContext } from "react-router-dom";

import { RESOURCE_TYPE_CONFIG } from "../../library/config/resource-type-config";
import { CD_CONTENT_PERFORMANCE } from "./api/cp-query";
import { CommonUtil } from "../../../utils/common-util";
import { TYPE } from "./config/cp-config";

const ContentPerformance = () => {

    // TODO 
    // Work on tooltip UI

    const { from, to, selectedTemplate } = useOutletContext<{ from: number, to: number, selectedTemplate: string }>();

    const { data, loading }      =   useQuery(CD_CONTENT_PERFORMANCE, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            templateUuids : selectedTemplate === 'all_templates' ? undefined : [selectedTemplate],
            filter  :  TYPE
        }
    })

    const chartData = data?._cdContentPerformance?.map((resource: any) => {
        return {
            time        :   resource?.timeSpent,
            views       :   resource.views,
            uniqueViews :   resource.uniqueViews,
            type        :   resource.resource.type,
            name        :   resource.resource.title
        };
    });

    const config: any = {
        data: chartData ? chartData : [],
        xField: 'time',
        yField: 'views',
        colorField: 'type',
        sizeField: 'uniqueViews', 
        shape: 'circle',
        size: [5, 50],
        color: (datum: any) => {
            return RESOURCE_TYPE_CONFIG[datum.type]?.color;
        },
        
        pointStyle: (datum: any) => {
            const strokeColor = RESOURCE_TYPE_CONFIG[datum.type]?.color;
            return {
                lineWidth: 1,
                strokeOpacity: 1,
                fillOpacity: 0.3,
                opacity: 0.65,
                stroke: strokeColor,
            };
        },

        legend:{
            position: "right"
        },
        xAxis: {
            title: { text: 'Time Spent' },
            min: 0,
            label: {
                formatter: (text: string) => {
                    const value = Number(text);
                    if (value < 60) {
                        return `${value}s`;  // Show seconds if under a minute
                    }
                    const hours = Math.floor(value / 3600);
                    const minutes = Math.floor((value % 3600) / 60);  // Fix minutes calculation
                    return `${hours ? hours + 'h ' : ''}${minutes}m`;
                },
            },
        },
        yAxis: {
            min: 0,
            tickInterval: chartData && chartData.length > 0 ? Math.ceil(Math.max(...chartData.map((item: any) => item.views || 0)) / 3) : 1,            
            grid: {
                line: {
                    style: {
                        lineDash: [4, 4],
                    },
                },
            },
            title: { text: 'Views' }
        },
        tooltip: {
            customContent: (_: any, items: any[]) => {
                if (!items.length) return "";
                
                const item = items[0]; // Use the first item
                const uniqueViews = item.data.uniqueViews;
                const time = CommonUtil.__getFormatDuration(item.data.time)
                    .slice(0, 2)
                    .map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`)
                    .join(" ");
                const views = item.data.views;
                const type = item.data.type;
                const name = item.data.name; // Get the resource name

                return `
                    <div style="padding: 10px; background-color: #fff; border-radius: 6px;">
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 6px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${name}
                        </div>
                        <div class="cm-flex cm-flex-direction-column cm-padding-block10">
                            <div style="display: flex; align-items: center; padding: 5px;">
                                <span style="flex-grow: 1;">Type:&nbsp;&nbsp;</span>
                                <div style="background-color: ${item.color}; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px;"></div>
                                <span class="cm-font-fam600" style="float: right;">${type}</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 5px;">
                                <span style="flex-grow: 1;">Unique Views:&nbsp;&nbsp;</span>
                                <span class="cm-font-fam600" style="float: right;">${uniqueViews}</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 5px;">
                                <span style="flex-grow: 1;">Views:&nbsp;&nbsp;</span>
                                <span class="cm-font-fam600" style="float: right;">${views}</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 5px;">
                                <span style="flex-grow: 1;">Time:&nbsp;&nbsp;</span>
                                <span class="cm-font-fam600" style="float: right;">${time}</span>
                            </div>
                        </div>
                    </div>
                `;
            },
        },
        
    };

    return(
        <div className="j-cp-analytics-card" style={{height: "545px"}}>
            <div className="cm-font-fam500 cm-secondary-text cm-margin-bottom20">Content Performance by Type</div>
            <Scatter {...config} style={{height: "450px"}} loading={loading}/>   
        </div>
    )
}

export default ContentPerformance