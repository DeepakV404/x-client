import { useState } from "react";
import { Space, Tabs } from "antd";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import ShowcasePage from "./showcase-page";
import Screenshots from "./screenshots";
import OverView from "./overview";

const MarketplaceLayout = () => {

    const [ activeTab, setActiveTab ]   =   useState('overview');

    const handleTabChange = (key: any) => {
        setActiveTab(key);
    }

    const MarketplaceTabs = [
        {
            key         :   "overview",
            label       :   <div>Overview</div>,
            value       :   'overview',
            children    :   <OverView/>
        },
        {
            key         :   "screenshots",
            label       :   <div>Screenshots</div>,
            value       :   'screenshots',
            children    :   <Screenshots/>
        },
        {
            key         :   "showcase",
            label       :   <div>Showcase pages</div>,
            value       :   'showcase',
            children    :   <ShowcasePage/>
        },
    ];

    return(
        <>
            <div className="cm-width100 j-setting-header">               
                <Space>
                    <MaterialSymbolsRounded font='storefront' size='22'/>
                    <div className="cm-font-size16 cm-font-fam500">Marketplace</div>
                </Space>         
            </div>
            <Tabs defaultActiveKey={activeTab} onChange={handleTabChange} className="j-settings-marketplace-tab" items={MarketplaceTabs}/>
        </>
    )
}

export default MarketplaceLayout