import { useState } from "react";
import { Card, Tabs } from "antd";

import HomeRecentActivities from "./home-recent-activities";
import HomeRecentComments from "./home-recent-comments";

const HomeAnalyticsActivities = (props: {from: any, to: any}) => {

    const { from, to }  =   props;

    const [ activeTab, setActiveTab ]   =   useState('comments');

    const handleTabChange = (key: any) => {
        setActiveTab(key);
    }

    const dashboardTabs = [
        {
            key         :   "recentComments",
            label       :   <div>Recent Comments</div>,
            value       :   'comments',
            children    :   <HomeRecentComments from={from} to={to} />
        },
        {
            key         :   "roomActivities",
            label       :   <div>Room Activities</div>,
            value       :   'activities',
            children    :   <HomeRecentActivities from={from} to={to} />
        },
    ];

    return(
        <Card className="j-home-activities-comments">
            <Tabs defaultActiveKey={activeTab} onChange={handleTabChange} className="j-home-dashboard-tab" items={dashboardTabs}/>
        </Card>
    )
}

export default HomeAnalyticsActivities