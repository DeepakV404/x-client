import { Col, Row } from "antd";
import AnalyticsOverviewHeader from "./analytics-overview-header";
import AnalyticsGraphLayout from "./account-overview-graph/account-overview-graph-layout";
import { useOutletContext } from "react-router-dom";
import { ACCOUNT_OVERVIEW_BLUR } from "../../../constants/module-constants";
import { GlobalContext } from "../../../globals";
import { useContext, useEffect, useState } from "react";
import AnalyticsUpgradeModal from "../analytics-upgrade/analytics-upgrade-modal";

const AccountOverview = () => {

    const { $featData }     =   useContext(GlobalContext)

    const { from, to, selectedDates } = useOutletContext<{ from: number, to: number, selectedDates: string }>();

    const [ showUpgradeModal, setShowUpgradeModal ]   =   useState(false)

    useEffect(() => {
        if($featData?.account_dashboard?.isRestricted){
            setShowUpgradeModal(true);
        }
    },[])

    return (
        <>
            {
                $featData?.account_dashboard?.isRestricted 
                ? 
                    <div className="cm-width100 cm-height100" style={{overflow: "hidden"}}>
                        <img src={ACCOUNT_OVERVIEW_BLUR} width={"100%"} style={{filter: "blur(6px)"}}/>
                    </div> 
                :
                    <Row className="j-analytics-body cm-overflow-auto" gutter={[0, 15]} style={{padding: "0 15px 15px 15px"}}>
                        <Col span={24}>
                            <AnalyticsOverviewHeader from={from} to={to} />
                        </Col>
                        <Col span={24}>
                            <AnalyticsGraphLayout from={from} to={to} dataFilter={selectedDates} />
                        </Col>
                    </Row>
            }
            <AnalyticsUpgradeModal 
                isOpen      =   {showUpgradeModal} 
                onClose     =   {() => setShowUpgradeModal(false)} 
            />
        </>
    );
};

export default AccountOverview;
