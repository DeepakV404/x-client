import { Line } from "@ant-design/charts";

const RoomViewsGraph = (props: {data: any}) => {
    
    const { data } = props; 

    const getColor = (type: any) => {
        if (type === 'Views') return '#2150FF';
        else if(type === "Unique Views") return "#0AD3D3"
        else if(type === "Avg Views") return "#FD333C"
        return '#000000'; 
    }

    const config: any = {
        data,
        xField: 'time',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        area: {
            style: (datum: any) => {
                const baseColor = getColor(datum.type);
                return {
                    fill: `l(90) 0:${baseColor}FF 1:${baseColor}00`,
                    fillOpacity: 0.5,
                };
            },
        },
        lineStyle: (datum: any) => {
            return {
                stroke: getColor(datum.type),
                lineWidth: 1,
            };
        },
        animation: {
            appear: {
                animation: 'wave-in',
                duration: 1000,
            },
        },
        legend: {
            position: 'bottom',
            itemName: {
                style: {
                    fontSize: 14,
                },
            },
            padding: [30, 0, 0, 0],
        },
        yAxis: {
            min: 0,
            tickInterval: Math.ceil(Math.max(...data?.map((item: any) => item.value)) / 3), 
            label: {
                formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        color: (data: any) => getColor(data.type),
        tooltip: {
            customContent: (_: any, items: any[]) => {
                const formattedItems = items.map(item => {
                    const badgeColor = getColor(item.data.type)
                    const type = item?.data.type
                    const value = item?.data.value;
                    const textStyle = 'margin-right: 5px'
                    return `<div style="display: flex"><div style="background-color: ${badgeColor}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div> <span style="${textStyle}">${type}</span>  : <span style="font-weight: 600; margin-left: 8px">${Math.ceil(value)}</span></div>`;
                });
    
                return `
                    <div style="padding: 8px;">
                        <div class="cm-font-fam700 cm-margin-bottom10">${items[0]?.data.key}</div>
                        <div>${formattedItems.join('<br>')}</div>
                    </div>
                `;
            },
        },
    };

    return (
        <Line {...config}/>
    )
}

export default RoomViewsGraph