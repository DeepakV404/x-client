import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

import { ANALYTICS_IMG } from "../../../constants/module-constants";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const UpgradeAnalytics = () => {

    const navigate      =   useNavigate();

    const items = [
        "Track all the interactions happening between your team and the clients and spot your top performers in the team.",
        "With buyer intelligence, identify which customers are highly engaged with your team to hyper focus your efforts.",
        "Unlock in depth content analytics to precisely know which content is highly performing among your buyers.",
    ];

    return(
        <Space className="cm-width100 cm-padding-block20 cm-flex-align-center" direction="vertical">
            <div className="cm-font-size24 cm-font-fam600">Upgrade to unlock the Analytics</div>
            <div className="cm-font-size16 cm-font-opacity-black-67">Get complete visibility on your team and customers' engagement</div>
            <Space className="cm-width100">
                <img src={ANALYTICS_IMG} style={{ width : "300px"}}/>
                <Space direction="vertical" size={20} className="cm-margin-top20" style={{ width: "400px" }}>
                    {items.map((item) => (
                        <Space className="cm-flex-align-center">
                            <MaterialSymbolsRounded size="28" font="check" color="#0065E5"/>
                            <div className="cm-font-opacity-black-85" style={{lineHeight: "28px"}}>{item}</div>
                        </Space>
                    ))}
                </Space>
            </Space>
            <div className="cm-width100 cm-margin-block20 cm-flex-justify-center">
                <Button type="primary" onClick={() => navigate("/settings/plan-details")}>Upgrade your plan</Button>
            </div>
        </Space>
    )
}

export default UpgradeAnalytics