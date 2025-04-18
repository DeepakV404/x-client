import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Input, Segmented, Select, Space, Tooltip } from 'antd';

import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import HtmlEditor from '../../../components/HTMLEditor';
import { Length_Input } from '../../../constants/module-constants';

const ShareRoomTemplate = () => {

    const { $orgDetail }    =   useContext(GlobalContext);

    const params    =   useParams();

    const [currentType, setCurrentType] =   useState("copy");
    const [copied, setCopied]           =   useState(false);

    const handleCopyLink = (link: any) => {

        window.navigator.clipboard.writeText(link)
        setCopied(true);

        setTimeout(function() {			
            setCopied(false)
        }, 2000);
    }

    const accountTabs = [
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item"><MaterialSymbolsRounded font="content_copy" size="19"/>Copy link</Space>,
            value   :   'copy',
        },
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item"><MaterialSymbolsRounded font="mail" size="19"/>Share via email</Space>,
            value   :   'edit',
        },
        {
            label   :   <Space className="cm-flex-center cm-font-size13 j-account-segment-item"><MaterialSymbolsRounded font="webhook" size="19"/>Webhook</Space>,
            value   :   'webhook',
        },
    ];

    const handleSegmentChange = (key: any) => {
        setCurrentType(key)
    }

    let templateLink    =   `${$orgDetail.templateLink}?id=${params.roomTemplateId}`;
    let webhookLink     =   `${$orgDetail.webhookLink}?id=${params.roomTemplateId}&emailId={emailId}`;

    return (
        <div className="j-share-room-link-wrap cm-width100">
            <Space direction="vertical" size={5} className="cm-margin-bottom20 cm-width100">
                <div className="cm-font-size16 cm-font-fam500">Share</div>
                <div className="j-settings-subtitle-border"></div>
            </Space>
            <div className='j-copy-link-wrap'>
                <Segmented style={{width: "390px"}} options={accountTabs} onChange={handleSegmentChange} defaultValue={"copy"}/>
                <div className='cm-height100'>
                    {
                        currentType === "copy" ?
                            <Space direction='vertical' className='cm-height100 cm-flex-center'>
                                <div className='cm-font-fam500 cm-font-size18 cm-flex-center cm-margin-bottom20'>Copy template link</div>
                                <Tooltip title={copied ? <Space size={0}>Link copied<MaterialSymbolsRounded font='done' size='20'/></Space> : <Space size={4}>Click to copy<MaterialSymbolsRounded font='content_copy' size='16'/></Space>}>
                                    <div className='cm-flex-center j-room-template-link cm-cursor-pointer' onClick={() => handleCopyLink(templateLink)}>
                                        <div className='cm-font-size14'>
                                            {templateLink}
                                        </div>
                                    </div>
                                </Tooltip>
                            </Space>
                        :
                            currentType === "edit" 
                            ?
                                <Form className="cm-width100 cm-form" layout='vertical'>
                                    <Space direction='vertical' className='cm-width100 cm-space-inherit'>
                                        <Form.Item name={"to"} label={'To'} rules={[{required: true}]}>
                                            <Select className='cm-width100' placeholder="To: " mode='tags' >
                                                
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name={"subject"} label={"Subject"}>
                                            <Input maxLength={Length_Input} placeholder='Subject'/>
                                        </Form.Item>
                                        <Form.Item name="mailContent" initialValue={""} label={"Body"}>
                                            <HtmlEditor />
                                        </Form.Item>
                                        <Form.Item >
                                            <Button type='primary'>Send</Button>
                                        </Form.Item>
                                    </Space>
                                </Form>
                            :
                            <Space direction='vertical' className='cm-height100 cm-flex-center'>
                                <div className='cm-font-fam500 cm-font-size18 cm-flex-center cm-margin-bottom20'>Copy webhook link</div>
                                <Tooltip title={copied ? <Space size={0}>Link copied<MaterialSymbolsRounded font='done' size='20'/></Space> : <Space size={4}>Click to copy<MaterialSymbolsRounded font='content_copy' size='16'/></Space>}>
                                    <div className='cm-flex-center j-room-template-link cm-cursor-pointer' onClick={() => handleCopyLink(webhookLink)}>
                                        <div className='cm-font-size14'>
                                            {webhookLink}
                                        </div>
                                    </div>
                                </Tooltip>
                            </Space>
                    }
                </div>
            </div>
        </div>
    )
}

export default ShareRoomTemplate