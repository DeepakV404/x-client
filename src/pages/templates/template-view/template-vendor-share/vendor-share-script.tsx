import { Button, Space } from "antd"
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { useContext, useState } from "react";
import { GlobalContext } from "../../../../globals";



const VendorShareScript = (props: {templateId: any}) => {

    const { templateId }    =   props;

    const { $orgDetail }    =   useContext(GlobalContext);

    let apiKey      =   $orgDetail.apiKey;

    const [snippetCopy, setSnippetCopy]     =   useState(false);

    const codeString = `
        <script type="text/javascript" src="https://static.buyerstage.io/gated-scripts/gated-prod/v1.min.js"></script>
        <script type="text/javascript">
            window.buyerstage = new Buyerstage({
                "accessToken"   :   "${apiKey}", 
                "formId"        :   //"#form_Id", 
                "emailFieldId"  :   //"email",
                "onSuccess"     :   //"redirect/open_in_modal", 
                "modalInfo"     :   
                {
                    "header"        :   "Thank you for choosing us", 
                    "actionText"    :   "Access your portal"
                }
            })

            buyerstage.handleSubmit((formData) => {
                // your custom logic goes here
                return "${templateId}"
            });
        </script>
    `;

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setSnippetCopy(true);
        setTimeout(function() {			
            setSnippetCopy(false)
        }, 2000);
    }

    return(
        <>
            <div className="cm-padding15">
                <Space direction="vertical" size={4}>
                    <div className="cm-font-size13 cm-font-fam600 cm-flex-align-center">Script</div>
                    <div className="cm-font-size13 cm-font-fam400 cm-secondary-text">Use this script for your custom logic</div>
                </Space>
                <div className="j-vendor-gated-snippet-layout">
                    <SyntaxHighlighter language="html" style={dark}>
                        {codeString}
                    </SyntaxHighlighter> 
                </div>
                <Button className="j-vendor-copy-link-btn cm-width100 cm-margin-top20" onClick={() => copyLink(codeString)}>{snippetCopy ? "Copied" : "Copy Code"}</Button>
            </div>
        </>
    )
}

export default VendorShareScript