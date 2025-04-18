import { useContext } from "react";
import { Space } from "antd";

import { DSR_PRICING_CONFIG } from "./pricing-config-dsr";
import { GlobalContext } from "../../../globals";

import PricingCard from "./pricing-card";

const Pricing = () => {

    const { $orgDetail }    =   useContext(GlobalContext);
    

    return(
        <>
            <div className="j-pricing-header cm-font-fam600 cm-text-align-center">Choose a Plan that's right for you</div>
                <div className="cm-hide-scrollbar cm-overflow-auto cm-padding15" style={{height: "calc(100% - 70px)", textAlign: "center"}}>
                    <Space size={15} className="cm-height100">
                        {
                            Object.values(DSR_PRICING_CONFIG).map((_pricing) => (
                                <PricingCard info={_pricing} isCurrentPlan={$orgDetail.planDetail.currentPlan && ($orgDetail.planDetail.currentPlan === _pricing.key)}/>
                            ))
                        }
                    </Space>
                </div>
        </>
    )
}

export default Pricing