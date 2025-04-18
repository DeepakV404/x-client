import { useState } from "react";
import { Space, Steps } from "antd";

import DistributionRules from "./distribution-rules";
import MatchingRules from "./matching-rules";
import FormMapping from "./form-mapping";
import GetSnippet from "./get-snippet";

const GatedSetup = () => {

    const [current, setCurrent] = useState(0);

    let gated_steps = [
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Form mapping</div>,
            content :   <FormMapping/>
        },
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Matching rules</div>,
            content :   <MatchingRules/>
        },
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Distribution rules</div>,
            content :   <DistributionRules/>
        },
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Get snippet</div>,
            content :   <GetSnippet/>
        }
    ]

    return (
        <div className="cm-padding20 cm-height100">
            <Space size={3} className="cm-width100 cm-margin-bottom20" direction="vertical">
                <div className="cm-font-size16 cm-font-fam500">Gated Flow</div>
                <div className="j-settings-subtitle-border"></div>
            </Space>
            <div className="j-settings-gated-layout">
                <Steps
                    direction   =   "vertical"
                    className   =   "j-gated-steps"
                    current     =   {current}
                    items       =   {gated_steps}
                    onChange    =   {(step: number) => setCurrent(step)}
                />
                <div className="j-gated-step-layout">
                    {gated_steps[current].content}
                </div>
            </div>
        </div>
    )
}

export default GatedSetup