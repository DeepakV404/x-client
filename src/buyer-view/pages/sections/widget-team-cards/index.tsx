import { Space } from "antd";

import BuyerTeamCard from "./widget-team-card";
import BuyerWidgetTitle from "../buyer-widget-title";

const BuyerTeamCardsWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }
    
    return (
        <div className='j-buyer-section-card j-buyer-team-card-wrapper' id={widget.uuid}>
            <Space direction="vertical" className="cm-width100" size={15}>
                {
                   widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                }
                <div className="cm-height100 cm-width100 j-buyer-team-card-wrapper cm-padding-block20">
                    {widget.components.map((_component: any) => (
                        <BuyerTeamCard component={_component} key={_component.uuid}/>
                    ))}
                </div>
            </Space>
        </div>
    )
}

export default BuyerTeamCardsWidget