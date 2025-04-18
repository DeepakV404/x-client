import { Button, Space} from 'antd';

import BuyerWidgetTitle from '../buyer-widget-title';

const BuyerButtonWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const getLink = (link: string) => {
        return link && !link.startsWith('http') ? `https://${link}` : link;
    }

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
        <div className='j-buyer-section-card' id={widget.uuid}>
            <Space direction="vertical" className="cm-width100 cm-margin-bottom20 cm-margin-top10" size={15}>
                {
                   widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                }
                <div className="cm-cursor-pointer cm-height100 cm-width100 cm-flex-center cm-padding1">
                    {widget.components.map((_component: any, index: number) => (
                        _component.content.button.enabled && (
                            <a key={index} href={getLink(_component.content.button.link) || undefined} target={_component.content.button.openInNewTab ? "_blank" : "_self"}>
                                <Button type="primary">
                                    {_component.content.button.name || "Button Name"}
                                </Button>
                            </a>
                        )
                    ))}
                </div>
            </Space>
        </div>
    )
}

export default BuyerButtonWidget