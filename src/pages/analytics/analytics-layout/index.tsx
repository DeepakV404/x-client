import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { DatePicker, Dropdown, Space, Tabs, Typography } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { USERS } from "../../settings/api/settings-query";
import { ROOM_TEMPLATES } from "../../templates/api/room-templates-query";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { CommonUtil } from "../../../utils/common-util";


const { TabPane }       =   Tabs;
const { Text }          =   Typography;
const { RangePicker }   =   DatePicker;

const AnalyticsLayout = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { data }  =   useQuery(USERS, {
        fetchPolicy: "network-only"
    });

    const { data: templateListData }  =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    const [selectedDates, setSelectedDates]             =   useState('last_month');
    const [selectedUser, setSelectedUser]               =   useState('all_agent');
    const [selectedTemplate, setSelectedTemplate]       =   useState('all_templates')
    const [customDates, setCustomDates]                 =   useState<any>([]);

    const pathname = location.pathname.split("/")[2];

    const handleSegmentChange = (key: any) => {        
        navigate(key)
    }

    const analyticTabs = [
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item">Account Overview</Space>,
            value   :   'account-overview',
        },
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item">Executive Dashboard</Space>,
            value   :   'executive-dashboard',
        },
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item">Content Performance</Space>,
            value   :   'content-performance',
        }
    ];

    const handleDateChange = (dates: any) => {
        if (dates === null) {
            setSelectedDates('today')
        } else {
            setSelectedDates("custom");
            setCustomDates([new Date(dates[0]).valueOf(), new Date(dates[1]).valueOf()]) 
        }
    };

    const disabledDate = (current: any) => {
        const currentDate = dayjs();
        return current && current > currentDate.startOf('day');
    }

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

    const items: any = [
        {
            key     :   "today",
            label   :   "Today",
            onClick :   () => {
                setSelectedDates("today");
            }
        },
        {
            key     :   'three_days',
            label   :   "Last 3 Days",
            onClick :   () => {
                setSelectedDates("three_days");
            }
        },
        {
            key: "last_week",
            label: "Last 7 Days",
            onClick: () => {
                setSelectedDates("last_week");
            }
        },
        {
            key: "last_month",
            label: "Last 30 Days",
            onClick: () => {
                setSelectedDates("last_month");
            }
        },
        {
            key: "three_months",
            label: "Last 3 Months",
            onClick: () => {
                setSelectedDates("three_months");
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

    const usersList: any    =   [
        {
            key     :   "all_agents",
            label   :   "All Agents",
            onClick :   () => {
                setSelectedUser("all_agents");
            }
        },
    ]

    usersList.push(
        ...(data?.users.filter((user: any) => user.status === "ACTIVE").map((user: any) => ({
            key: user.uuid, 
            label: (user.firstName + " " + user.lastName), 
            onClick: () => {
                setSelectedUser(user.uuid); 
            }
        })) || [])
    );

    const templatesList: any    =   [
        {
            key     :   "all_templates",
            label   :   "All Templates",
            onClick :   () => {
                setSelectedTemplate("all_templates");
            }
        },
    ]

    templatesList.push(
        ...(templateListData?.roomTemplates.map((template: any) => ({
            key: template.uuid, 
            label: template.title, 
            onClick: () => {
                setSelectedTemplate(template.uuid); 
            }
        })) || [])
    );

    let currentTime =   new Date();
    let from        =   selectedDates === "custom" ? customDates[0] : getNewDateAtNoon(currentTime, getDays(selectedDates))
    let to          =   selectedDates === "custom" ? customDates[1] : currentTime.valueOf()

    const renderAnalyticsHeader = () => (
        <Space size={20} className="j-analytics-header cm-width100">
            <div className='cm-font-fam500 cm-font-size14'>Filter</div>
            {selectedDates === "custom" && (
                <Text> from <span className="cm-font-fam600">{CommonUtil.__getDateDayYear(customDates[0])}</span> {'\u00A0 - \u00A0'} to <span className="cm-font-fam600">{CommonUtil.__getDateDayYear(customDates[1])}</span> </Text>
            )}
            <Dropdown menu={{ items, selectedKeys: [selectedDates] }} className="icon-border cm-background-white" trigger={["click"]}>
                <Space onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer cm-flex">
                    {selectedDates === "custom" ? <Text className="cm-margin-left5">Custom</Text> : <Text className="cm-margin-left5">{items.find((_item: any) => _item.key === selectedDates)?.label}</Text>}
                    <MaterialSymbolsRounded font="keyboard_arrow_down" size="20" />
                </Space>
            </Dropdown>
            {
                pathname !== "content-performance" &&
                    <Dropdown menu={{ items: usersList, selectedKeys: [selectedUser]}} className="icon-border cm-background-white" trigger={["click"]}>
                        <Space onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer cm-flex">
                            <Text className="cm-margin-left5" style={{width: "200px"}} ellipsis={{tooltip: usersList.find((_item: any) => _item.key === selectedUser)?.label || "All Agents"}}>{usersList.find((_item: any) => _item.key === selectedUser)?.label || "All Agents"}</Text>
                            <MaterialSymbolsRounded font="keyboard_arrow_down" size="20" />
                        </Space>
                    </Dropdown>
            }
            <Dropdown menu={{ items: templatesList, selectedKeys: [selectedTemplate]}} className="icon-border cm-background-white" trigger={["click"]}>
                <Space onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer cm-flex">
                    <Text className="cm-margin-left5" style={{width: "150px"}} ellipsis={{tooltip: templatesList.find((_item: any) => _item.key === selectedTemplate)?.label || "All Templates"}}>{templatesList.find((_item: any) => _item.key === selectedTemplate)?.label || "All Templates"}</Text>
                    <MaterialSymbolsRounded font="keyboard_arrow_down" size="20" />
                </Space>
            </Dropdown>
        </Space>
    );

    return (
        <div style={{height: "100%", width: "100%", overflow: "auto"}}>
            <div className="j-analytics-layout-header cm-width100">
                <Tabs className="j-analytics-tabs cm-width100" onChange={handleSegmentChange} defaultActiveKey={location.pathname.split("/")[2]} activeKey={location.pathname.split("/")[2]}>
                    {analyticTabs.map((tab) => (
                        <TabPane className='cm-width100' tab={tab.label} key={tab.value} style={{background: "#f5f7f9"}}/>
                    ))}
                </Tabs>
            </div>
            {renderAnalyticsHeader()}
            <Outlet context={{ from, to, selectedDates, selectedUser,  selectedTemplate}}/>
        </div>
    )
}

export default AnalyticsLayout