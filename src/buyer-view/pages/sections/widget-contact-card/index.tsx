import { Button, Space } from 'antd';
import { LinkedinFilled } from '@ant-design/icons';

import BuyerWidgetTitle from '../buyer-widget-title';
import { WIDGET_PROFILE_IMAGE_FALLBACK } from '../../../../constants/module-constants';

const BuyerContactCardWidget = (props: {widget: any}) => {

    const { widget }    =   props;

    const contactProfile       =   widget.components[0]?.content?.profileImage;
    const contactName          =   widget.components[0]?.content?.name;
    const contactButton        =   widget.components[0]?.content?.button;
    const contactParagraph     =   widget.components[0]?.content?.paragraph;
    const linkedInButton       =   widget.components[0]?.content?.linkedInButton;

    const getLink = (link: string) => {
        return link && !link.startsWith('http') ? `https://${link}` : link;
    }

    const getParsedString = (html: any) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent;
    }

    return (
         <div className='j-buyer-section-card' id={widget.uuid}>
            <Space direction="vertical" className="cm-width100" size={15}>
                {
                    widget.title.enabled && getParsedString(widget.title.value) ? <BuyerWidgetTitle widget={widget}/> : null
                }
                <div className="cm-height100 cm-width100 cm-flex-center cm-padding20">
                    <Space size={20} align='start'>
                        <div className="j-buyer-contact-card-profile">
                            <img height={"100%"} width={"100%"} className="cm-object-fit-cover cm-border-radius8" src={contactProfile.url !== "" ? contactProfile.url : WIDGET_PROFILE_IMAGE_FALLBACK}/>
                        </div>
                        <Space direction='vertical' size={25} style={{width: "100%"}}>
                            <Space direction='vertical' size={15} style={{lineBreak: "anywhere"}}>
                                <div className='cm-font-size18 cm-font-fam600' style={{color: "#252525"}}>{contactName.value}</div>
                                {
                                    contactParagraph.enabled &&
                                        <div className="tiptap" style={{padding: "0px", minHeight: "fit-content", width: "100%"}} dangerouslySetInnerHTML={{__html: contactParagraph?.value || ""}}></div>   
                                }
                            </Space>
                            <Space size={20}>
                                {
                                    contactButton?.enabled &&
                                        <a href={getLink(contactButton.link) || undefined} target={contactButton.openInNewTab ? "_blank" : "_self"}>
                                            <Button type="primary" className='cm-margin0'>
                                                {contactButton.name || "Contact Me"}
                                            </Button>
                                        </a>
                                }
                                {
                                    linkedInButton?.enabled &&
                                        <a className='j-buyer-linkedin-icon-wrapper' href={getLink(linkedInButton.link) || undefined } target='_blank'>
                                            <LinkedinFilled className='cm-cursor-pointer' style={{color: "#98989F", fontSize: "18px"}}/>
                                        </a>
                                }
                            </Space>
                        </Space>
                    </Space>
                </div>
            </Space>
        </div>
    )
}

export default BuyerContactCardWidget