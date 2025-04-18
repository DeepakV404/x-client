import { useState } from "react";
import { Space, Steps } from "antd";

import SelectTemplate from "./select-template";
import MoreFields from "./more-fields";
import GetLink from "./get-link";

const NonGatedSetup = () => {

    const [current, setCurrent] = useState(0);

    let gated_steps = [
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Select templates</div>,
            content :   <SelectTemplate/>
        },
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Add more fields</div>,
            content :   <MoreFields/>
        },
        {
            title   :   <div className="cm-font-size14 cm-font-fam500">Get link</div>,
            content :   <GetLink/>
        }
    ]

    return (
        <div className="cm-padding20 cm-height100">
            <Space size={3} className="cm-width100 cm-margin-bottom20" direction="vertical">
                <div className="cm-font-size16 cm-font-fam500">Non-Gated Flow</div>
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

export default NonGatedSetup