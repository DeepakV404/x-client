import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Alert, Divider, Select, Space, Typography} from "antd";

import { ROOM_TEMPLATES } from "../../templates/api/room-templates-query";
import { GlobalContext } from "../../../globals";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

const { Option }    =   Select;
const { Text }      =   Typography;

const WebHooks = () => {

    const { $orgDetail }    =   useContext(GlobalContext)

    const [selectedItem, setSelectedItem] =   useState();

    const [apiCopied, setApiCopied]         =   useState(false);
    const [keyCopied, setKeyCopied]         =   useState(false);
    const [copied, setCopied]               =   useState(false);
    const [idCopied, setIdCopied]           =   useState(false);
    const [snippetCopy, setSnippetCopy]     =   useState(false);

    const codeString = `
        <script type="text/javascript" src="https://static.buyerstage.io/gated-scripts/gated-prod/v1.min.js"></script>
        <script type="text/javascript">
            window.buyerstage = new Buyerstage({
                "accessToken"   :   //"your_access_token", 
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
                return //"templateId"
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

    const handleApiCopy = (link: any) => {
        window.navigator.clipboard.writeText(link)
        setApiCopied(true);

        setTimeout(function() {			
            setApiCopied(false)
        }, 2000);
    }

    const handleKeyCopy = (link: any) => {
        window.navigator.clipboard.writeText(link)
        setKeyCopied(true);

        setTimeout(function() {			
            setKeyCopied(false)
        }, 2000);
    }

    const handleCopyLink = (link: any) => {
        window.navigator.clipboard.writeText(link)
        setCopied(true);

        setTimeout(function() {			
            setCopied(false)
        }, 2000);
    }

    const handleIdCopy = (link: any) => {
        window.navigator.clipboard.writeText(link)
        setIdCopied(true);

        setTimeout(function() {			
            setIdCopied(false)
        }, 2000);
    }

    const handleSelectChange = (values: any) => {
        setSelectedItem(values);
    };

    const { data, loading, error } = useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    if (loading) return <Loading />;
    if (error) return <SomethingWentWrong />;    

    let webhookLink =   $orgDetail.webhookLink;
    let apiKey      =   $orgDetail.apiKey;

    return(
        <div className="cm-height100 cm-overflow-auto">
            <div className="cm-width100 j-setting-header">
                <Space>
                    <MaterialSymbolsRounded font="code" size="22" color="#0065E5"/>
                    <div className="cm-font-size16 cm-font-fam500">Developer Settings</div>
                </Space>
            </div>
            <div className="cm-padding20 cm-overflow-auto" style={{height: "calc(100% - 50px"}}>
                <Space direction="vertical" className="cm-width100">
                    <Space className="cm-margin-bottom10">
                        <MaterialSymbolsRounded font="key" size="18"/>
                        <div className="cm-font-fam600 cm-font-size16">API KEY</div>
                    </Space>
                    <Space size={10}>
                        <div className="">Set the API key in your Request Headers </div>
                        <Space className="j-key-selector-wrapper">
                            <div className="j-selector-key cm-font-size16 cm-font-fam500">BS-API-KEY</div>
                            <div className="j-key-selector-copy cm-cursor-pointer">
                                <MaterialSymbolsRounded font={apiCopied ? 'done' : 'content_copy'} size="22" onClick={() => handleApiCopy(`BS-API-KEY`)} />
                            </div>
                        </Space>
                    </Space>
                    <div className={`j-api-card cm-flex-align-center cm-margin-top20`}>
                        <Space>
                            <div className="j-api-key-title cm-font-fam500">API KEY</div>
                            <div className="j-api-key">{apiKey}</div> 
                        </Space>
                        <div className="j-api-key-suffix cm-cursor-pointer">
                            <MaterialSymbolsRounded className="cm-cursor-pointer" font={keyCopied ? 'done' : 'content_copy'} size="22" onClick={() => handleKeyCopy(`${apiKey}`)} />
                        </div>
                    </div>
                </Space>
                <Divider/>
                <Space direction="vertical">
                    <Space className="cm-margin-bottom10">
                        <MaterialSymbolsRounded font="webhook" size="18"/>
                        <div className="cm-font-fam600 cm-font-size16">Webhook</div>
                    </Space>
                    <Space>
                        <div>Choose a</div>
                        <Select style={{minWidth: "300px"}} placeholder="template" allowClear onChange={handleSelectChange} optionLabelProp="label" suffixIcon={<MaterialSymbolsRounded font="expand_more" size="18" color="#5C5A7C"/>} popupMatchSelectWidth={false}>
                            {
                                data.roomTemplates.map((_template: any) => (
                                    <Option key={_template.uuid} value={_template.uuid} label={<div className="cm-font-fam500">{_template.title}</div>}>
                                        <Space direction="vertical" size={0}>
                                            <div className="cm-font-fam500">{_template.title}</div>
                                            {
                                                _template.description 
                                                    ? 
                                                        <Text style={{maxWidth: "500px"}} ellipsis={{tooltip: _template.description}} className="cm-font-size12 cm-secondary-text">{_template.description}</Text>
                                                    : 
                                                        <div className="cm-font-size12 cm-light-text">No description found</div>
                                            }
                                        </Space>
                                    </Option>
                                ))
                            }
                        </Select>
                        <div>to get the webhook</div>
                    </Space>
                </Space>
                <div className={`j-webhook-card ${!selectedItem ? 'disabled' : ''} cm-flex-align-center cm-flex-space-between cm-margin-top20`}>
                    <Space>
                        <div className="j-api-key-title cm-font-fam500">POST</div>
                        <div className="j-api-key">{webhookLink}{selectedItem ? selectedItem : "{template_id}"}</div> 
                    </Space>
                    <div className={`j-api-key-suffix ${selectedItem ? "cm-cursor-pointer" : ""}`}  onClick={() => selectedItem && handleCopyLink(`${webhookLink}${selectedItem}`)}>
                        <MaterialSymbolsRounded font={copied ? 'done' : 'content_copy'} size="22" />
                    </div>
                </div>
                <Space className="cm-width100 cm-margin-top20 cm-margin-bottom10">
                    Use this template id in case you are using different template APIs in your custom code
                    <Space className="j-key-selector-wrapper">
                        {
                            selectedItem ? 
                                <div className="j-selector-key cm-font-size16 cm-font-fam500">{selectedItem}</div>
                            : 
                                <div className="j-selector-key cm-light-text ">Choose a template</div>
                        }
                        <div className={`j-key-selector-copy ${selectedItem ? "cm-cursor-pointer" : "disabled"}`}>
                            <MaterialSymbolsRounded font={idCopied ? 'done' : 'content_copy'} size="22" onClick={() => selectedItem && handleIdCopy(`${selectedItem}`)} />
                        </div>
                    </Space>
                </Space>
                <Space direction="vertical" className="cm-margin-top20">
                    <Alert 
                        message =   {
                            <Space direction="vertical" size={0}>
                                <Space>
                                    <MaterialSymbolsRounded font="info" filled color="#1677ff" size="18"/>
                                    <div>Value for <span className="cm-font-fam600 cm-font-size15">emailId</span> must be set for creating a room using this template. </div>
                                </Space>
                                <div style={{marginLeft: "25px"}} className="cm-margin-top10"><span className="cm-font-size13">For eg: </span><span className="cm-font-fam500 j-api-key">{webhookLink}{selectedItem ? selectedItem : "{template_id}"}?emailId=name@yourcustomerdomain.com</span></div>
                            </Space>
                        } 
                        type    =   "info" 
                    />
                </Space>
                <Divider/>
                <Space direction="vertical">
                    <Space className="cm-margin-bottom10">
                        <MaterialSymbolsRounded font="code" size="18"/>
                        <div className="cm-font-fam600 cm-font-size16">Embed in your website</div>
                    </Space>
                </Space>
                <Space direction="vertical" className="cm-width100">
                    <div className="j-gated-snippet-layout">
                        <SyntaxHighlighter language="html" style={vs}>
                            {codeString}
                        </SyntaxHighlighter>
                        <div className="cm-cursor-pointer j-copy-snippet-icon-wrap cm-icon-wrap" onClick={() => copyLink(codeString)}><MaterialSymbolsRounded font={snippetCopy ? 'done' : 'content_copy'} size={'22'}/></div>
                    </div>
                </Space>
            </div>
        </div>
    )
}

export default WebHooks;

