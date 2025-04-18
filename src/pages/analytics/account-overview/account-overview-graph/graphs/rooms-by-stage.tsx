import { useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Card, Space, Typography } from "antd";
import { Pie, PieConfig, measureTextWidth } from "@ant-design/charts";
import { GlobalContext } from "../../../../../globals";
import { ROOMS_BY_STAGE } from "../../api/analytics-query";
import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";

const { Text } = Typography

const RoomsByStage = (props: { from: any, to: any, home?: any }) => {

    const { from, to, home } = props;

    const { $user } = useContext(GlobalContext);

    const [_getRoomsByStage, { data, error }] = useLazyQuery(ROOMS_BY_STAGE, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            userUuids: home ? [$user.uuid] : undefined
        }
    });

    useEffect(() => {
        if (from && to) {
            _getRoomsByStage()
        }
    }, [from, to])

    const formateValue = (count: any) => {
        return count < 10 ? parseInt(count.toString().replace(/^0+/, '')) : count;
    }
    
    const roomsByStageData = (data?.roomsByStage || []).map((stageData: any) => {
        const { label, properties } = stageData.roomStage; 
        const count = stageData.roomsCount;
        const formattedCount = formateValue(count); 
    
        return {
            type: `${label} - ${formattedCount}`, 
            value: formattedCount,
            color: properties?.color 
        };
    });

    function renderStatistic(containerWidth: any, text: any, style: any) {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2;

        let scale = 1;

        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }

        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }

    const config: PieConfig = {
        data: roomsByStageData,
        angleField: 'value',
        autoFit: true,
        radius: 1,
        innerRadius: 0.75,
        colorField: "color",
        color: (data: any) => data.color,
        legend: false,
        label: false,
        statistic: {
            title: {
                offsetY: -10,
                style: {
                    fontSize: '14px',
                },
            },
            content: {
                offsetY: 10,
                style: {
                    fontSize: '18px',
                },
                customHtml: (container: any, datum: any) => {
                    const { width } = container.getBoundingClientRect();
                    let totalRooms = datum.filteredData.reduce((accumulator: any, current: any) => (accumulator + current.value), 0)
                    return renderStatistic(width, `${totalRooms} Rooms`, {
                        fontSize: 22,
                    });
                },
            },
        },
        tooltip: {
            showMarkers: false,
            customContent: (_title: any, items: any[]) => {
                if (items?.length) {
                    const { data } = items[0];
                    const stage = data?.type?.split(" - ")[0];
                    return `
                        <div style="padding:10px;">
                            <div style="display: flex; align-items: center;">
                                <div style="
                                    height: 8px; 
                                    width: 8px; 
                                    background-color: ${data?.color}; 
                                    border-radius: 50%; 
                                    margin-right: 10px;">
                                </div>
                                <span>${stage}</span>: ${data?.value}
                            </div>
                        </div>`;
                }
            },
        },
        
    };

    if (error) return <SomethingWentWrong />;

    return (
        <Space direction="vertical" className="j-analytics-overview-card cm-padding15">
            <Text className="cm-font-fam500 cm-secondary-text">Rooms by Stage</Text>
            <Card className="cm-flex-center" bordered={false}>
                <div className="cm-flex-center">
                    <Pie {...config} style={{ height: "310px", width: "340px", paddingBlock: "10px" }} />
                </div>
            </Card>
        </Space>
    );
}

export default RoomsByStage;
