import { useState } from "react";
import { Col, DatePicker, Dropdown, Row, Space, Typography } from "antd";

import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import HomeAnalyticsActivities from "./home-analytics-activities";
import HomeAnalyticsHeader from "./home-analytics-header";
import dayjs from "dayjs";

const { Text }          =   Typography;
const { RangePicker }   =   DatePicker;

const HomeDashboard = () => {

    const [dataFilter, setDataFilter]                   =   useState('last_month');
    const [customDates, setCustomDates]                 =   useState<any>([]);

    const handleDateChange = (dates: any) => {
        if (dates === null) {
            setDataFilter('today')
        } else {
            setDataFilter("custom");
            setCustomDates([new Date(dates[0]).valueOf(), new Date(dates[1]).valueOf()]) 
        }
    };

    const disabledDate = (current: any) => {
        const currentDate = dayjs();
        return current && current > currentDate.startOf('day');
    }

    const items: any = [
        {
            key     :   "today",
            label   :   "Today",
            onClick :   () => {
                setDataFilter("today");
            }
        },
        {
            key     :   'three_days',
            label   :   "Last 3 Days",
            onClick :   () => {
                setDataFilter("three_days");
            }
        },
        {
            key: "last_week",
            label: "Last 7 Days",
            onClick: () => {
                setDataFilter("last_week");
            }
        },
        {
            key: "last_month",
            label: "Last 30 Days",
            onClick: () => {
                setDataFilter("last_month");
            }
        },
        {
            key: "three_months",
            label: "Last 3 Months",
            onClick: () => {
                setDataFilter("three_months");
            }
        },
        {
            key: "divider",
            type:   'divider'
        },
        {
            key     :   "custom",
            label   :   <div onClick={(event) => event.stopPropagation()}><RangePicker size="small" onChange={handleDateChange} bordered={false} onClick={(event) => event.stopPropagation()} allowClear format={'DD/MM/YYYY'} disabledDate={disabledDate}/></div>,
            onClick :   (event: any) => {
                event.domEvent.preventDefault()
            }
        },
    ];

    const getNewDateAtNoon = (originalDate: any, dateOffset: number) => {
        const offsetInDays = dateOffset * -1;
        const newDate = new Date(originalDate.getTime() + (offsetInDays * 24 * 60 * 60 * 1000));
        newDate.setHours(0, 0, 0, 0);
        return newDate.valueOf();
    };

    const getDays = (type: string) => {
        switch (type) {
            case "today":
                return 0;
            case "three_days":
                return 3;
            case "last_week":
                return 7;
            case "last_month":
                return 30;
            case "three_months":
                return 90;
            default:
                return 60;
        }
    };

    let currentTime =   new Date();
    let from        =   dataFilter === "custom" ? customDates[0] : getNewDateAtNoon(currentTime, getDays(dataFilter))
    let to          =   dataFilter === "custom" ? customDates[1] : currentTime.valueOf()

    return(
        <div className="cm-height100">
            <div className="j-my-analytics-header">
                <div className='cm-font-fam500 cm-font-size18'>Your Dashboard</div>
                <Space size={20}>
                    {
                        dataFilter === "custom" && 
                            (
                                <Text> from <span className="cm-font-fam600">{CommonUtil.__getDateDayYear(customDates[0])}</span> {'\u00A0 - \u00A0'} to <span className="cm-font-fam600">{CommonUtil.__getDateDayYear(customDates[1])}</span> </Text>
                            )
                    }
                    <Dropdown menu={{ items, selectedKeys: [dataFilter] }} className="j-home-dashboard-filter-select" trigger={["click"]}>
                        <Space onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer cm-flex">
                            {dataFilter === "custom" ? <Text className="cm-margin-left5">Custom</Text> : <Text className="cm-margin-left5">{items.find((_item: any) => _item.key === dataFilter)?.label}</Text>}
                            <MaterialSymbolsRounded font="keyboard_arrow_down" size="20" />
                        </Space>
                    </Dropdown>
                </Space>
            </div>
            <Row className="j-analytics-body" gutter={[15, 15]} style={{height: "calc(100% - 50px)"}}>
                <Col span={18} key={"my_room_header"} className="cm-height100 cm-overflow-auto">
                    <HomeAnalyticsHeader from={from} to={to} dataFilter={dataFilter} home={"home"}/>
                </Col>
                <Col span={6} key={"my_room_activities"} className="cm-height100">
                    <HomeAnalyticsActivities from={from} to={to}/>
                </Col>
            </Row>
        </div>
    )
}

export default HomeDashboard