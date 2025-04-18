import { useState } from "react";
import { Space } from "antd";

import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const GetSnippet = () => {

    const [copy, setCopy]           =   useState(false);

    const codeString = `
        <script type="text/javascript" src="https://assets.buyerstage.io/gated.min.js"></script>
        <script type="text/javascript">
            window.stage = new BuyerStage({ connectorId: '123' })
            stage.connect('ede237cd-b875-4cfa-9edb-f3289e5ac575')
        </script>
    `;

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    return (
        <Space direction="vertical" className="cm-width100">
            <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Snippet (Javascript)</div>
            <div className="j-gated-snippet-layout">
                <SyntaxHighlighter language="html" style={vs}>
                    {codeString}
                </SyntaxHighlighter>
                <div className="cm-cursor-pointer j-copy-snippet-icon-wrap cm-icon-wrap" onClick={() => copyLink(codeString)}><MaterialSymbolsRounded font={copy ? 'done' : 'content_copy'} size={'20'}/></div>
            </div>
        </Space>
    )
}

export default GetSnippet