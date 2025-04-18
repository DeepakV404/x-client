import { Button, Space } from 'antd';
import { LinkedinFilled } from '@ant-design/icons';
import { WIDGET_PROFILE_IMAGE_FALLBACK } from '../../../../constants/module-constants';


const BuyerTeamCard = (props: {component: any}) => {

    const { component } =   props;

    const contactProfile       =   component?.content?.profileImage;
    const contactName          =   component?.content?.name;
    const contactButton        =   component?.content?.button;
    const contactDesignation   =   component?.content?.designation;
    const linkedInButton       =   component?.content?.linkedInButton;

    const getLink = (link: string) => {
        return link && !link.startsWith('http') ? `https://${link}` : link;
    }
    
    return (
        <Space size={25} direction='vertical'>
            <div className="j-buyer-contact-card-profile">
                <img height={"100%"} width={"100%"} className="cm-object-fit-cover cm-border-radius8" src={contactProfile.url !== "" ? contactProfile.url : WIDGET_PROFILE_IMAGE_FALLBACK}/>
            </div>
            <Space direction='vertical' size={15}>
                <Space direction='vertical' size={4}>
                    <div className='cm-font-size18 cm-font-fam600' style={{color: "#252525"}}>{contactName.value}</div>
                    {
                        contactDesignation.enabled &&
                            <div className="tiptap" style={{paddingInline: "0px", minHeight: "fit-content"}} dangerouslySetInnerHTML={{__html: contactDesignation?.value || ""}}></div>   
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
    )
}

export default BuyerTeamCard