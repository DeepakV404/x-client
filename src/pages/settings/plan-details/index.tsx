import { useContext, useState } from 'react';
import { Radio, Space } from 'antd';
import { capitalize }  from "lodash";

import { DSR_PRICING_CONFIG } from '../pricing/pricing-config-dsr';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import PricingCard from '../pricing/pricing-card';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { ACCOUNT_TYPE_DSR, ACCOUNT_TYPE_GTM, BUYERSTAGE_PRICING, UPGRADE_OFFER_ARROW } from '../../../constants/module-constants';
import { DPR_PRICING_CONFIG } from '../pricing/pricing-config-dpr';

const PlanDetails = () => {

    const { $orgDetail, $accountType }    =   useContext(GlobalContext);

    const [planType, setPlanType]                       =   useState<string>($orgDetail.planDetail.cycle ?? "YEARLY");

    const options: CheckboxGroupProps<string>['options'] = [
        { label: 'Monthly', value: 'MONTHLY', style: {fontSize: "12.5px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px", width: "80px", textAlign: "center"}},
        { label: 'Yearly', value: 'YEARLY', style: {fontSize: "12.5px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", width: "80px", textAlign: "center"}},
    ];

    return (
        <div className="cm-height100 cm-overflow-auto">
            <div className="cm-width100 j-setting-header cm-flex-align-center cm-flex-space-between">
                <Space>
                    <MaterialSymbolsRounded font="credit_card" size="22" />
                    <div className="cm-font-size16 cm-font-fam500">Billing</div>
                </Space>
                <div className="cm-font-size13 cm-flex-space-between cm-font-opacity-black-67">
                    <a href={BUYERSTAGE_PRICING} target="_blank">See detailed pricing</a>
                </div>
            </div>
            <div className="cm-width100 cm-padding20 cm-flex-center" style={{height: "calc(100% - 45px)", backgroundColor: "#F6F7F9"}}>
                <div className="cm-hide-scrollbar cm-overflow-auto cm-height100 cm-padding-inline20">
                    {
                        $accountType === ACCOUNT_TYPE_GTM
                        ?
                            <Space direction='vertical' className='cm-text-align-center cm-height100 cm-flex-center'>
                                <div>You're currently on a <span className='cm-font-fam600'>Custom Plan</span></div> 
                                <div className='cm-secondary-text cm-font-size14'>To purchase additional licenses or to upgrade/downgrade your plan, please <a href='mailto:support@buyerstage.io'>contact support.</a></div>
                            </Space>
                        :
                            null
                    }
                    <Space direction='vertical' size={30} className='cm-flex-center'>
                        {
                            $accountType !== ACCOUNT_TYPE_GTM &&
                                <Space direction='vertical' className='cm-text-align-center'>
                                    <div>You're on <span className='cm-font-fam600'>{ $accountType === ACCOUNT_TYPE_DSR ? capitalize($orgDetail.planDetail.currentPlan) : capitalize($orgDetail.planDetail.currentPlan.slice(4))} Plan.</span></div>
                                    <div className='cm-font-opacity-black-65 cm-font-size14'>Upgrade your account to get access to unlimited links & advanced features.</div>
                                </Space>
                        }
                        {
                            $accountType !== ACCOUNT_TYPE_GTM &&
                                <>
                                    <Space size={16}>
                                        <Radio.Group
                                            options         =   {options}
                                            defaultValue    =   {planType}
                                            optionType      =   "button"
                                            buttonStyle     =   "solid"
                                            onChange        =   {(event) => setPlanType(event.target.value)}
                                        />
                                        <img src={UPGRADE_OFFER_ARROW} className='j-upgrade-offer-arrow'/>
                                        <div className='cm-font-size16' style={{ background: "linear-gradient(90deg, #4E54F8 0%, #FB3FBC 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",position: "relative", left: "-38px"}}>{$accountType === ACCOUNT_TYPE_DSR ? "30% Off" : "20% Off"}</div>
                                    </Space>
                                    <Space size={15} className="cm-height100" style={{alignItems: "stretch"}}>
                                        {
                                            Object.values($accountType === ACCOUNT_TYPE_DSR ? DSR_PRICING_CONFIG : DPR_PRICING_CONFIG).map((_pricing) => (
                                                <PricingCard info={_pricing} planType={planType} isCurrentPlan={$orgDetail.planDetail.currentPlan && ($orgDetail.planDetail.currentPlan === _pricing.key)}/>
                                            ))
                                        }
                                    </Space>
                                </>
                        }
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default PlanDetails