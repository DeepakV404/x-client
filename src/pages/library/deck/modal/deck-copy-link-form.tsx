import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Space, Typography } from "antd";

import { CommonUtil } from "../../../../utils/common-util";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Option }    =   Select;
const { Text }      =   Typography;
const { TextArea }  =   Input;
const { useForm }   =   Form;

const DeckCopyLinkForm = (props: {isInProduct: boolean, baseLink: string, onClose: () => void }) => {

    const { isInProduct, baseLink, onClose }   =   props

    const inputRef     =   useRef<any>(null);
    const [form]        =   useForm();

    const [getLink, setGetLink]             =   useState(false)
    const [copyLink, setCopyLink]           =   useState(false)
    const [generatedLink, setGeneratedLink] =   useState("");

    useEffect(() => {
        if(!isInProduct){
            setTimeout(() => {
                inputRef?.current?.focus({
                    cursor: 'all',
                });
            }, 100);
        }
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            ["finalLink"]    :  generatedLink
        })
    }, [generatedLink])

    const handleCopyLink = () => {
        setCopyLink(true)
        CommonUtil.__copyToClipboard(generatedLink)
        setTimeout(() => {
            onClose()
        }, 2000)
    }

    const handleGetLink = () => {
        form.validateFields().then(values => {

            let link = baseLink;
            const { recipients_email, sender_email, platform } = values;
            
            const queryParams = [];
    
            if (recipients_email) {
                queryParams.push(`bs_email=${recipients_email}`);
            }
            if (sender_email) {
                queryParams.push(`bs_sender=${sender_email}`);
            }
            if (platform) {
                queryParams.push(`bs_platform=${platform}`);
            }
    
            if (queryParams.length > 0) {
                link = `${link}?${queryParams.join('&')}`;
            }
            setGeneratedLink(link);
            setGetLink(true);
        });
    };
    

    const platformConfig: Record<string, {
        key                         :   string;
        displayName                 :   string;
        contactEmailPlaceholder     :   string;
        senderEmailPlaceholder      :   string;
    }> = {
        "APOLLO" : {
            key                     : "APOLLO",
            displayName             : "Apollo",
            contactEmailPlaceholder : "{{contact.email}}",
            senderEmailPlaceholder  : "{{sender.email}}"
        },
        "HUBSPOT" : {
            key                     : "HUBSPOT",
            displayName             : "Hubspot",
            contactEmailPlaceholder : "{{contact.email}}",
            senderEmailPlaceholder  : "{{sender.email}}"
        },
        "OUTREACH" : {
            key                     : "OUTREACH",
            displayName             : "Outreach",
            contactEmailPlaceholder : "{{contact.email}}",
            senderEmailPlaceholder  : "{{sender.email}}"
        },
        "PIPEDRIVE" : {
            key                     : "PIPEDRIVE",
            displayName             : "Pipedrive",
            contactEmailPlaceholder : "{{person.email}}",
            senderEmailPlaceholder  : "{{user.email}}"
        }
    }

    return (
        <>
            <div className="cm-modal-header cm-flex-align-center cm-margin-bottom5">
                <div className="cm-font-fam500 cm-font-size16">Copy Link</div>
            </div>
            <Form 
                form        =   {form} 
                layout      =   "vertical"
                className   =   "cm-height100 cm-form"
            >
                {
                    getLink 
                        ?   
                            <>
                                {
                                    isInProduct ?
                                        <>
                                            <div className='cm-modal-content'>
                                                <Input size="large" value={generatedLink} readOnly/>
                                            </div>
                                            <div className='cm-modal-footer'>
                                                <Button type='primary' block className={`cm-flex-center cm-margin-top15`} onClick={handleCopyLink}>
                                                    {copyLink ? "Copied" : "Copy Link"}
                                                </Button>
                                            </div>
                                        </>
                                    :
                                        <div className='cm-modal-content'>
                                            <Form form={form} layout='vertical' className='cm-form'>
                                                <Form.Item name={"finalLink"} >
                                                    <TextArea
                                                        autoSize
                                                        readOnly
                                                        ref             =   {inputRef}
                                                        className       =   "j-copy-buyer-link cm-padding15"
                                                        style           =   {{
                                                            height: "auto",
                                                            resize: "none",
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Form>
                                        </div>   
                                }
                            </>
                        :   
                            <>
                                <div className='cm-modal-content'>
                                    <Form.Item 
                                        name        =   {"platform"} 
                                        label       =   {<div className='cm-font-opacity-black-65'>Name of the Platform</div>} 
                                        style       =   {{marginBottom: "4px"}}
                                        extra       =   {<Text className="cm-font-size11 cm-font-opacity-black-65">Select the platform where the link will be used</Text>}
                                    >
                                        <Select
                                            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                            onChange            =   {(value) => form.setFieldsValue({ platform: value, recipients_email: platformConfig[value].contactEmailPlaceholder, sender_email: platformConfig[value].senderEmailPlaceholder })}
                                            className           =   "cm-width100"
                                            optionLabelProp     =   "children"
                                            placeholder         =   "Eg: Hubspot"
                                            size                =   "large"
                                        >
                                            {
                                                Object.values(platformConfig).map((_platform) => (
                                                    <Option key={_platform.key} >{_platform.displayName}</Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Row gutter={[15, 15]} className="cm-margin-top15">
                                        <Col span={12}>
                                            <Form.Item name={"recipients_email"} style={{marginBottom: "15px"}} label={<div className='cm-font-opacity-black-65'>Recipients Email</div>}>
                                                <Input 
                                                    size        =   "large" 
                                                    placeholder =   "Eg: {{contact.email}}" 
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name={"sender_email"} style={{marginBottom: "15px"}} label={<div className='cm-font-opacity-black-65'>Sender Email</div>}>
                                                <Input 
                                                    size        =   "large" 
                                                    placeholder =   "Eg: {{contact.email}}"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Space direction="vertical">
                                        <Text className="cm-font-fam600">Note:</Text>
                                        <Space direction="vertical">
                                            <Text>1. Platform details will be added automatically to the link.</Text>
                                            <Text>2. Refer to your platform's guidelines for naming conventions.</Text>
                                        </Space>
                                    </Space>
                                </div>
                                <div className='cm-modal-footer cm-flex-align-center cm-flex-justify-end'>
                                    <Space>
                                        <Form.Item noStyle>
                                            <Button className={`cm-flex-center`} onClick={onClose}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                        <Form.Item noStyle>
                                            <Button type='primary' className={`cm-flex-center`} htmlType="submit" onClick={handleGetLink}>
                                                Get Link
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </div>
                            </>
                }
            </Form>
        </>
    )
}

export default DeckCopyLinkForm