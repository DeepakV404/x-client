import { Space } from 'antd';

import BuyerWidgetTitle from '../buyer-widget-title';

const BuyerEmbedWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const getIframeLink = (embededCode: any) => {
        if (embededCode.includes("iframe")) {
            const match = embededCode.match(/src="([^"]+)"/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return embededCode;
    }

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
        <div className='j-buyer-section-card' id={widget.uuid}>
            <Space direction="vertical" className="cm-width100" size={15}>
                {
                    widget.title.enabled && getParsedString(widget.title.value)? <BuyerWidgetTitle widget={widget}/> : null
                }
                <div className="cm-cursor-pointer cm-height100 cm-width100 cm-flex-center cm-padding1 j-buyer-resource-record-wrapper">
                    {
                        widget.components.map((_component: any) => (
                            _component?.content?.embedCode?.value && 
                                <iframe  src={getIframeLink(_component?.content?.embedCode?.value)} loading="lazy" style={{ width: "100%", height: "100%", minHeight: "600px", colorScheme: "light", border: "0px" }} frameBorder={0} title={widget.title.value}/>
                        ))
                    }
                </div>
            </Space>
        </div>
    )
}

export default BuyerEmbedWidget