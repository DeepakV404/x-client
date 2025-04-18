import { Space } from "antd";

import BuyerWidgetTitle from "./buyer-widget-title";

const BuyerSectionText = (props: {widget: any}) => {

    const { widget }   =   props;

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return(
        <div className='j-buyer-section-card' id={widget.uuid}>
            <Space direction="vertical" className="cm-width100">
                {
                    widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                }
                {
                    widget.components.map((_textComponent: any) => (
                        <div className="tiptap" style={{paddingInline: "0px", minHeight: "0"}} dangerouslySetInnerHTML={{__html: _textComponent?.content?.paragraph?.value || ""}}></div>
                    ))
                }
            </Space>
        </div>
    )
}

export default BuyerSectionText