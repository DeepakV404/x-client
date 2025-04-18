import { useContext, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Button, Divider, Radio, Space } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";

import { ADVANCED_V2, DPR_STARTER, ENTERPRISE_V2, ESSENTIAL_V2, GROWTH_V2, PRICING_CONFIG_V2, STARTER } from "./pricing-config-dsr";
import { ACCOUNT_TYPE_DPR, ACCOUNT_TYPE_DSR, BUYERSTAGE_PRICING, UPGRADE_OFFER_ARROW } from "../../../constants/module-constants";
import { GET_CHECKOUT_DETAIL } from "../api/settings-query";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";

const NewPricing = (props: any) => {

    const { onClose }   =   props;

    const { $accountType, $orgDetail }    =   useContext(GlobalContext);

    const [currentSelectedPlan, setCurrentSelectedPlan] =   useState<string>($orgDetail.planDetail.currentPlan);

    const [planType, setPlanType]                       =   useState<string>($orgDetail.planDetail.cycle ?? "YEARLY");

    const [loading, setLoading]                         =   useState<boolean>(false);

    const [fetchCheckout] = useLazyQuery(GET_CHECKOUT_DETAIL, { });

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const clickedCard = target.closest(".j-dpr-plan-card") as HTMLElement | null;

        if (!clickedCard) return;

        const planKey = clickedCard.getAttribute("data-key");
        if (planKey) {
            setCurrentSelectedPlan(planKey)
        }
    }

    const handleUpgrade = () => {
        setLoading(true)
        fetchCheckout({
            variables: {
                plan    :   currentSelectedPlan,
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

    const config = $accountType === ACCOUNT_TYPE_DPR ? [PRICING_CONFIG_V2[ESSENTIAL_V2], PRICING_CONFIG_V2[ADVANCED_V2]] : [PRICING_CONFIG_V2[GROWTH_V2], PRICING_CONFIG_V2[ENTERPRISE_V2]]

    const options: CheckboxGroupProps<string>['options'] = [
        { label: 'Monthly', value: 'MONTHLY', style: {fontSize: "12.5px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px", width: "80px", textAlign: "center"}},
        { label: 'Yearly', value: 'YEARLY', style: {fontSize: "12.5px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", width: "80px", textAlign: "center"}},
    ];


    return (
        <>
            <div style={{padding: "30px"}}>
                <Space direction="vertical" size={10} >
                    <div className="cm-font-size24 cm-font-fam500 cm-font-opacity-black-87">Upgrade your plan</div>
                    <div className="cm-font-size16 cm-font-fam400 cm-font-opacity-black-67" style={{width: "70%"}}>
                        You are currently on the Starter/Free plan. Please upgrade your account to continue.
                    </div>
                </Space>
                <Space size={16}>
                    <Radio.Group
                        className       =   "cm-margin-top20"
                        size            =   "small"
                        options         =   {options}
                        defaultValue    =   {planType}
                        optionType      =   "button"
                        buttonStyle     =   "solid"
                        onChange        =   {(event) => setPlanType(event.target.value)}
                    />
                    <img src={UPGRADE_OFFER_ARROW} className='j-modal-upgrade-offer-arrow'/>
                    <div style={{ background: "linear-gradient(90deg, #4E54F8 0%, #FB3FBC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",position: "relative", left: "-38px", top: "12px"}}>{$accountType === ACCOUNT_TYPE_DSR ? "30% Off" : "20% Off"}</div>
                </Space>
                <Space direction="vertical" className="cm-width100 cm-margin-top30" size={20} onClick={handleCardClick}>
                    {
                        config.map((plan: any) => {
                            return (
                                <div data-key={plan.key} key={plan.key} className={`cm-cursor-pointer j-dpr-plan-card ${currentSelectedPlan === plan.key ? "selected" : ""}`}>
                                    <Space className="cm-flex-space-between">
                                        <div>
                                            <div className="cm-font-size18 cm-font-fam500 cm-font-opacity-black-87">{plan.displayName}</div>
                                            <div className="cm-font-size14 cm-font-fam400 cm-font-opacity-black-67">{plan.desc}</div>
                                        </div>
                                        <div className="cm-font-size16 cm-font-fam300 cm-font-opacity-black-87">{planType === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice}</div>
                                    </Space>
                                </div>
                            )
                        })
                    }
                    <div className="cm-font-size13 cm-flex-space-between cm-font-opacity-black-67">
                        <a href={BUYERSTAGE_PRICING} target="_blank">See detailed pricing</a>
                        <div>By continuing, you agree to our&nbsp;<a href="https://www.buyerstage.io/terms" target="_blank" style={{textDecoration: "underline"}}>Terms</a></div>
                    </div>
                </Space>
            </div>
            <Divider className="cm-margin0"/>
            <Space className="cm-padding20 cm-flex-space-between">
                <Space size={4} className="cm-flex-center cm-font-opacity-black-67 cm-font-weight300 cm-font-size12"><MaterialSymbolsRounded font="lock" size="18" className="cm-margin-bottom2"/>Payment secured by Stripe</Space>
                <Space size={15}>
                    <Button size="large" onClick={onClose}>Cancel</Button>
                    {
                        $orgDetail.planDetail.isTrial ?
                            <Button type="primary" className={(!currentSelectedPlan || currentSelectedPlan === STARTER || currentSelectedPlan === DPR_STARTER || loading) ? "cm-button-disabled" : ""} size="large" onClick={handleUpgrade} disabled={!currentSelectedPlan || currentSelectedPlan === STARTER || currentSelectedPlan === DPR_STARTER || loading} style={{width: "120px"}}>
                                <Space>
                                    Upgrade
                                    {loading ? <Loading color="#fff"/> : null}
                                </Space>
                            </Button>
                        :
                            <a href="mailto:support@buyerstage.io" target="_blank"><Button type="primary" size="large" style={{width: "120px"}}>Talk to us</Button></a>
                    }
                </Space>
            </Space>
        </>
    )
}

export default NewPricing