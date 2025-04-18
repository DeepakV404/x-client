import { Button, Card, Space, Tag, Tooltip } from "antd";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import { useContext, useState } from "react";
import { GlobalContext } from "../../../globals";
import { DPR_STARTER, STARTER } from "./pricing-config-dsr";
import { useLazyQuery } from "@apollo/client";
import { GET_CHECKOUT_DETAIL } from "../api/settings-query";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";
import Loading from "../../../utils/loading";

const PricingCard = (props: {info: any, isCurrentPlan: boolean, planType?: string}) => {

    const { info, isCurrentPlan, planType }  =   props;

    const { $orgDetail }    =   useContext(GlobalContext);

    const [loading, setLoading]    =   useState<boolean>(false);

    const currentPlan = $orgDetail.planDetail.currentPlan;

    const [fetchCheckout] = useLazyQuery(GET_CHECKOUT_DETAIL, { });

    const handleUpgrade = () => {
        setLoading(true)
        fetchCheckout({
            variables: {
                plan    :   info.key,
                cycle   :   planType
            },
            onCompleted: (data) => {
                setLoading(false)
                if (data?.getCheckoutDetail?.url) {
                    window.open(data.getCheckoutDetail.url, "_blank");
                }
            },
            onError: (error: any) => {
                setLoading(false)
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };
    
    const TalkToUsButton = () => {
        return (
            <a href="mailto:support@buyerstage.io">
                <Button 
                    className  =    "j-pricing-btn cm-font-fam500" 
                    type       =   "primary"
                >
                    Talk to us
                </Button>
            </a>
        )
    }

    const CurrentPlanButton: any = () => {
        return (
            <Button 
                className  =    "j-pricing-btn cm-font-fam500" 
            >
                Current Plan
            </Button>
        )
    }

    const UpgradeButton: any = () => {
        return(
            <Button 
                onClick    =    {handleUpgrade} 
                className  =    "j-pricing-btn cm-font-fam500" 
                type       =   "primary"
            >
                Upgrade
                {loading ? <Loading color="#fff"/> : null}
            </Button>
        )
    }


    return(
        <Card className={`j-pricing-card ${isCurrentPlan ? "current" : ""}`}>
            <Space direction="vertical" className="cm-flex-align-center cm-margin-top20" size={15}>
                <Space direction="vertical" size={4} className="cm-flex-center">
                    <Space>
                        <span className="j-pricing-card-title cm-font-fam600 cm-font-size18">{info.displayName}</span>
                        {/* {$orgDetail.planDetail.isTrial && isCurrentPlan ? <span className="cm-font-size12">(Trial)</span> : null} */}
                    </Space>
                    <span className="cm-light-text">{info.desc}</span>
                </Space>
                <Space direction="vertical" size={0} className="cm-flex-center">
                    <span className="j-pricing cm-font-fam600">{planType === "YEARLY" ? info.yearlyPrice : info.monthlyPrice}</span>
                    <span className="cm-dark-grey-text cm-font-fam500">/User/mo</span>
                </Space>
                {
                    isCurrentPlan ? <CurrentPlanButton/> : (currentPlan === DPR_STARTER || currentPlan === STARTER) ? <UpgradeButton/> : <TalkToUsButton/>
                }
            </Space>
            <Space className="cm-margin-top20 cm-width100 cm-text-align-start cm-space-inherit" direction="vertical">
                <div className="cm-font-fam600 cm-margin-top10 cm-margin-bottom5">{info.listHeader}</div>
                {info.list.map((_listItem: any, index: number) => (
                    <div key={_listItem.item} className="cm-font-size13 cm-width100" style={{borderBottom: index !== info.list.length - 1 ? "1px solid white" : ""}}>
                        <Space className="cm-width100 cm-flex-space-between">
                            <Space style={{paddingBottom: "8px"}}>
                                {_listItem.item}
                                {_listItem.isComingSoon && <Tag>Coming Soon</Tag>}
                            </Space>
                            {_listItem.showInfo && <Tooltip title={_listItem.tooltipText}><div style={{cursor: "help"}}><MaterialSymbolsRounded font="info" filled size="15" className="cm-secondary-text"/></div></Tooltip>}
                        </Space>
                    </div>
                ))}
            </Space>
        </Card>
    )
}

export default PricingCard