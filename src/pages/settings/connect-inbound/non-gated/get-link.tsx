import { useState } from "react";
import { Space } from "antd";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const GetLink = () => {

    const [copy, setCopy]           =   useState(false);

    const tempalteLink  =   `https://app.buyerstage.io/templates/ede237cd-b875-4cfa-9edb-f3289e5ac575`;

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    return (
        <Space direction="vertical" className="cm-width100">
            <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Link</div>
            <div className="j-non-gated-snippet-layout">
                <div className="cm-link-text">{tempalteLink}</div>
                <div className="cm-cursor-pointer j-copy-snippet-icon-wrap cm-icon-wrap" onClick={() => copyLink(tempalteLink)}><MaterialSymbolsRounded font={copy ? 'done' : 'content_copy'} size="20"/></div>
            </div>
        </Space>
    )
}

export default GetLink