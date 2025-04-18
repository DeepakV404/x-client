import React, { useContext, useEffect, useMemo, useState } from "react";
import { Col, Row, Space, Typography } from "antd"
import { useOutletContext } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { CommonUtil } from "../../../utils/common-util";
import { CD_OVERALL_REPORT } from "./api/cp-query";
import { GlobalContext } from "../../../globals";
import { CONTENT_DASHBOARD_BLUR } from "../../../constants/module-constants";
import { CP_TREND_CONFIG, NO_CHANGE } from "./config/cp-config";

import ContentPerformance from "./content-performance";
import ResourceActivities from "./resource-activities";
import ResourceByType from "./resource-by-type";
import AllResources from "./all-resources";
import Loading from "../../../utils/loading";
import ResourceByCategory from "./resource-by-category";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import AnalyticsUpgradeModal from "../analytics-upgrade/analytics-upgrade-modal";

const { Text }    =   Typography;

const ContentPerformanceLayout = () => {

    const { from, to, selectedTemplate } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedTemplate: string }>();

    const { $featData }     =   useContext(GlobalContext)

    const memoizedContext = useMemo(() => ({ from, to, selectedTemplate }), [from, to, selectedTemplate]);

    const [ showUpgradeModal, setShowUpgradeModal ]   =   useState(false)

    
    const { data, loading, error } = useQuery(CD_OVERALL_REPORT, {
        variables: {
            timeSpan: {
                from: memoizedContext.from,
                to: memoizedContext.to,
            },
            templateUuids: memoizedContext.selectedTemplate === 'all_templates' ? undefined : [memoizedContext.selectedTemplate],
        },
    });
    
    useEffect(() => {
        if($featData?.content_performance?.isRestricted){
            setShowUpgradeModal(true);
        }
    },[])
    
    const CP_Views              =   data?._cdOverAllReport?.viewsOutput;
    const CP_UniqueViews        =   data?._cdOverAllReport?.uniqueViewsOutput;
    const CP_EngagementOutput   =   data?._cdOverAllReport?.contentEngagementOutput;
    const CP_TotalDeckOutput    =   data?._cdOverAllReport?.totalDeckOutput;

    const getTrendValue = (trend: any, loading: boolean) => {
        if (!trend?.value) return null;
    
        if (trend.type !== NO_CHANGE) {
            return (
                <div className="cm-flex-align-end cm-whitespace-nowrap" style={{color: CP_TREND_CONFIG[trend?.type]?.color}}>
                    <MaterialSymbolsRounded font={CP_TREND_CONFIG[trend?.type]?.icon} size="18"/>
                    {loading ? "" : trend?.value > 100 ? "100% +" : trend?.value % 1 === 0 ? `${trend?.value}%` : `${trend?.value?.toFixed(2)}%`}
                </div>
            );
        }else{
            return <div className="cm-flex-align-end">-</div>;
        }
    };
    
    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong />


    return (
        <>
            {
                $featData?.content_performance?.isRestricted 
                ? 
                    <div className="cm-width100 cm-height100" style={{overflow: "hidden"}}>
                        <img src={CONTENT_DASHBOARD_BLUR} width={"100%"} style={{filter: "blur(6px)"}}/>
                    </div> 
                :
                <div className="j-cp-analytics-body" style={{ padding: "0 20px 40px 20px" }}>
                    <Row gutter={[15, 15]}>
                        <Col span={5}>
                            <Space size={0} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                                <Space direction="vertical" size={15}>
                                    <Text className="cm-font-fam500 cm-secondary-text cm-font-size1">Total No.of Resources</Text>
                                    <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : data?._cdOverAllReport?.totalResources}</Text>
                                </Space>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                                <Space direction="vertical" size={15}>
                                    <Text className="cm-font-fam500 cm-secondary-text">Views</Text>
                                    <Space size={15}>
                                        <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : CP_Views?.views}</Text>
                                        {getTrendValue(CP_Views?.trend, loading)}
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                                <Space direction="vertical" size={15}>
                                    <Text className="cm-font-fam500 cm-secondary-text">Unique Views</Text>
                                    <Space size={15}>
                                        <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : CP_UniqueViews.uniqueViews}</Text>
                                        {getTrendValue(CP_UniqueViews?.trend, loading)}
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                                <Space direction="vertical" size={15}>
                                    <Text className="cm-font-fam500 cm-secondary-text">Content Engagement</Text>
                                    <Space size={15}>
                                        <Text className="cm-font-fam500 cm-font-size24">{ loading || !CP_EngagementOutput?.contentEngagement ? "-" : CommonUtil.__getFormatDuration(CP_EngagementOutput?.contentEngagement).slice(0,2).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}</Text>
                                        {getTrendValue(CP_EngagementOutput?.trend, loading)}
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space size={15} className="j-analytics-overview-card cm-padding15 cm-flex-space-between">
                                <Space direction="vertical" size={15}>
                                    <Text className="cm-font-fam500 cm-secondary-text">No.of Links</Text>
                                    <Space size={15}>
                                        <Text className="cm-font-fam500 cm-font-size24">{ loading ? "-" : CP_TotalDeckOutput?.count}</Text>
                                        {getTrendValue(CP_TotalDeckOutput?.trend, loading)}
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]} className="cm-margin-top20">
                        <Col span={12}>
                            <ContentPerformance/>
                        </Col>
                        <Col span={12}>
                            <ResourceActivities/>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]} className="cm-margin-top20">
                        <Col span={12}>
                            <ResourceByType/>
                        </Col>
                        <Col span={12}>
                            <ResourceByCategory/>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]} className="cm-margin-top20">
                        <Col span={24}>
                            <AllResources/>
                        </Col>
                    </Row>
                </div>
            }
            <AnalyticsUpgradeModal 
                isOpen      =   {showUpgradeModal} 
                onClose     =   {() => setShowUpgradeModal(false)} 
            />
        </>
    )
}

export default React.memo(ContentPerformanceLayout);