import { Alert, Button, Space } from "antd"
import { useContext, useState } from "react";
import { GlobalContext } from "../../../../globals";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";


const VendorShareWebhook = (props: {templateId: any}) => {

    const { templateId }    =   props;

    const { $orgDetail }    =   useContext(GlobalContext)

    const [copied, setCopied]   =   useState(false);

    let webhookLink         =   $orgDetail.webhookLink;

    const handleCopyLink = (link: any) => {
        window.navigator.clipboard.writeText(link)
        setCopied(true);

        setTimeout(function() {			
            setCopied(false)
        }, 2000);
    }

    return(
        <> 
            <div className="cm-padding15">
                <Space direction="vertical" size={4}>
                    <div className="cm-font-size13 cm-font-fam600 cm-flex-align-center">Webhook</div>
                    <div className="cm-font-size13 cm-font-fam400 cm-secondary-text">You’ll need to configure your application with this webhook url</div>
                </Space>
                <div className={`j-vendor-webhook-card cm-flex-align-center cm-flex-space-between cm-margin-top20`}>
                    <Space size={4}>
                        <div className="j-vendor-api-key-title cm-font-fam500 cm-flex-center">POST</div>
                        <div className="cm-font-fam500 cm-padding10">{webhookLink}{templateId}</div> 
                    </Space>
                </div>
                <Button className="j-vendor-copy-link-btn cm-width100 cm-margin-top20" onClick={() => handleCopyLink(`${webhookLink}${templateId}`)}>{copied ? "Copied" : "Copy Code"}</Button>
                <Alert 
                    className   =   "cm-margin-top20 cm-border-none"
                    message     =   {
                        <Space direction="vertical" size={0}>
                            <Space>
                                <MaterialSymbolsRounded font="info" filled size="18"/>
                                <div>Value for <span className="cm-font-fam600 cm-font-size15">emailId</span> must be set for creating a room using this template. </div>
                            </Space>
                            <div style={{marginLeft: "25px"}} className="cm-margin-top10"><span className="cm-font-size13">For eg: </span><span className="cm-font-fam400">{webhookLink}{templateId}<span className="cm-font-fam500" style={{color: "#0065E5"}}>?emailId=name@yourcustomerdomain.com</span></span></div>
                        </Space>
                    } 
                    type       =   "info" 
                />
            </div>
        </>         
    )
}

export default VendorShareWebhook