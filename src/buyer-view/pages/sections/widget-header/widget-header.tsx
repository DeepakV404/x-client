import { Typography } from 'antd';
import { CAROUSEL_FALLBACK_IMAGE1 } from '../../../../constants/module-constants';

const BuyerWidgetHeader = (props: {component: any}) => {

    const { component } =   props;

    const coverImage            =   component?.content?.coverImage;
    const primaryImage          =   component?.content?.primaryImage;
    const secondaryImage        =   component?.content?.secondaryImage;
    const title                 =   component?.content?.title;

    const { Text }  =   Typography;
    
    return (
        <div style={{minHeight: "50px"}}>
            {
                coverImage.enabled &&
                    <div style={{overflow: "hidden"}}>
                        <img src={coverImage?.url ?? CAROUSEL_FALLBACK_IMAGE1} className="cm-border-radius6 slide-in-top j-buyer-home-banner" alt="Cover Image" width={"100%"} style={{objectFit: "cover"}}/>                       
                    </div>
            }
            <div className={`cm-position-relative cm-flex j-buyer-company-logos-wrapper cm-padding-inline10 ${coverImage.enabled ? "has-cover" : ""}`} style={{justifyContent: title.alignment === "middle" ? "center" : title.alignment === "right" ? "flex-end" : "flex-start"}}>
                {
                    primaryImage?.enabled &&
                        <div className={`j-buyer-company-logo`}>
                            <img src={primaryImage?.url} alt={primaryImage?.value} className="j-setup-logo-home" />
                        </div>
                }
                {
                    secondaryImage?.enabled &&
                        <div className="j-buyer-customer-company-logo" style={{position: "relative", left: "-10px"}}>
                            <img src={secondaryImage?.url} alt="update_logo" className="j-setup-logo-home"/>
                        </div>
                }
            </div>
            {
                title?.enabled &&
                    <div style={{display: "flex", justifyContent: title.alignment === "middle" ? "center" : title.alignment === "right" ? "flex-end" : "flex-start"}} className={!coverImage.enabled || (!primaryImage?.enabled && !secondaryImage?.enabled) ? `cm-margin-top20` : ""}>
                        <Text className="cm-font-fam700 cm-font-size28">{title?.value}</Text>
                    </div>
            }
        </div>
    )
}

export default BuyerWidgetHeader