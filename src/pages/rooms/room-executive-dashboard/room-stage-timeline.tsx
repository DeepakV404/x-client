import { Bar } from "@ant-design/charts";
import { truncate } from "lodash";

const RoomStageTimeline = (props: {stageWiseApStats: any}) => {

    const { stageWiseApStats }  =   props;

    const colors = [
        "#00BAC7",
        "#2D97F4",
        "#E77946",
        "#D051EC",
        "#F0BD26",
        "#0067C7",
        "#F42D79",
        "#77C708",
        "#F05A54",
        "#6879A3"
    ]

    const getColor = (index: number) => colors[index % colors.length];

    const values = [[2, 16],[6, 15], [15, 25], [20, 30], [23, 35], [23, 37], [20, 40], [38, 52], [45, 60], [55, 90], [70, 80], [80, 93], [95, 99], [99, 102], [100, 110], [110, 200]]

    const getValues = (index: number) => values[index % values.length];

    const data: any = [];

    stageWiseApStats.map((_stage: any, index: number) => {
        let stageObj = {
            stage: _stage.simpleStage.title,
            color: getColor(index),
            range: getValues(index)
        }

        data.push(stageObj)
    })

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    const config: any = {
        data: data,
        xField: 'range',
        yField: 'stage',
        colorField: 'stage',
        color: ({ stage }: any) => {
            const stageData = data.find((item: any) => item.stage === stage);
            return stageData?.color || '#ccc';
        },
        isRange: true,
        legend: false,
        axis: {
            x: {
                position: 'top',
            },
        },
        xAxis: {
            grid: null,
            line: null,
            tickLine: null,
            label: {
                formatter: (_: any, __: any, index: number) => {
                    return `${months[index]}`
                },
            },
        },
        yAxis: {
            grid: null,
            line: null,
            tickLine: null,
            label: {
                formatter: (stage: string) => {
                    return truncate(stage, {
                        length: 50,
                        omission: '...',
                    });
                },
                style: {
                    fontSize: 14,
                    color: '#000',
                    fontFamily: 'Inter'
                },
            }
        },
        barWidthRatio: 0.2, 
        barStyle: (datum: any) => ({
            fill: datum.color,
            radius: [6, 6, 6, 6],
        }),
        state: {
            active: {
                style: {
                    stroke: '#e4e4e4',
                    lineWidth: 1,
                }
            }
        },
        columnBackground: {
            style: {
                fill: 'transparent',
            },
        },
        padding: 'auto',
    };

    return (
        <>
            <div className="cm-font-size16 cm-font-fam600 cm-margin-top20">Stage Timeline</div>
            <div className="j-room-stage-timeline-wrapper">
                <Bar {...config}/>
            </div>
        </>
    );
};

export default RoomStageTimeline;
