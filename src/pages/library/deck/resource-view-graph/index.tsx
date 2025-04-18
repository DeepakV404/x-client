import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { D_RESOURCE_PAGE_REPORT_BY_BUYER } from "../../../../buyer-view/layout/Deck/API/deck-query";
import { CommonUtil } from "../../../../utils/common-util";
import Loading from "../../../../utils/loading";
import { Column } from "@ant-design/charts";

const PageResourceViewColumnChart = (props: { resourceData: any, buyerId: string | null }) => {

    const { resourceData, buyerId } = props

    const { linkId } = useParams()

    const { data, loading } = useQuery(D_RESOURCE_PAGE_REPORT_BY_BUYER, {
        fetchPolicy: "network-only",
        variables: {
            deckUuid: linkId,
            buyerUuid: buyerId,
            resourceUuid: resourceData.resource.uuid
        }
    });

    const getDataBasedOnItsType = () => {
        
        if(data?._dResourcePageReportByBuyer.length) {                        
            const chartData = data?._dResourcePageReportByBuyer?.map((item: any) => ({
                page        :   `Page ${item.page}`,
                views       :   CommonUtil.__getFormatDuration(item.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" "),
                timeSpent   :   item.timeSpent
            })) || [];
            return chartData
        } else {
            return [{
                page        : resourceData.resource.title,
                views       : CommonUtil.__getFormatDuration(resourceData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" "),
                timeSpent   : resourceData.timeSpent
            }]
        }
    }

    const config: any = {
        data: getDataBasedOnItsType(),
        xField: 'page',
        yField: 'timeSpent',
        yAxis: {
            tickCount   : 4,
            min         : 0,
            label: {
                formatter: () => null,
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
        radius: 1,
        innerRadius: 0.75,
        columnWidthRatio: 0.25,
        maxColumnWidth: 50,
        color: '#F06422',
        columnStyle: {
            radius: [6, 6, 0, 0],
        },
        tooltip: {
            customContent: (_: any, items: any[]) => {                
                const formattedItems = items.map(item => { 
                    if(item.value > 0) return `${item.title} : <span class='cm-font-fam600'>${CommonUtil.__getFormatDuration(item.value).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`
                    else return `${item.title} : <span class='cm-font-fam600'>0 sec`
                });
                return `
                    <div style="padding: 8px;">
                        <div>${formattedItems.join('<br>')}</div>
                    </div>
                `;
            },
        }
    };

    return (
        <div style={{ height: "250px", overflow: "auto" }}>
            {loading ? <Loading /> : <Column className="column-container" {...config} />}
        </div>
    )
} 

export default PageResourceViewColumnChart