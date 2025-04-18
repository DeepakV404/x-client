import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Form, Select, Space} from 'antd';

import { ROOM_TEMPLATES } from '../../templates/api/room-templates-query';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { useForm }   =   Form;
const { Option }    =   Select;

const WebhookForm = () => {

    const { $orgDetail }                =   useContext(GlobalContext);

    const [copy, setCopy]               =   useState(false);
    const [form]                        =   useForm();

    const [currentTemplate, setCurrentTemplate] =   useState();

    let webhookLink     =   `${$orgDetail.webhookLink}?`;

    const { data, loading }      =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    });

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }


    const onFinish = (values: any) => {
        console.log("formValues",values)
    }


    let url = `<p><span style="font-size: 14px; color: rgb(0, 0, 0);">${webhookLink}</span><span style="font-size: 14px; color: rgb(102, 163, 224);">id=${currentTemplate ? currentTemplate : "{templateId}"}</span><span style="font-size: 14px; color: rgb(136, 136, 136);">&emailId={emailId}</span></p>`

    return (
        <Form 
            form        =   {form} 
            onFinish    =   {onFinish} 
            layout      =   "vertical"
            className   =   'cm-form cm-height100 cm-pad-left50 j-acc-from-scratch-content'
        >
            <Space className='cm-flex-justify-center cm-height100' direction='vertical' size={20}>
                <div className='ats-h0'>Choose a template to generate webhook</div>
                <Form.Item
                    className   =   'j-fi-has-extra' 
                    name        =   "templateId"
                    label       =   {
                        <>
                            Room templates
                        </>
                    }
                    
                >
                    <Select
                        allowClear
                        showSearch
                        onChange            =   {setCurrentTemplate}
                        size                =   'large'
                        loading             =   {loading}
                        disabled            =   {loading}
                        optionFilterProp    =   'children'
                        placeholder         =   "Select template"
                        notFoundContent     =   {
                            <div className='cm-flex-center'>
                                No templates found
                            </div>
                        }
                    >
                        {data && data.roomTemplates.map((_template: any) => (
                            <Option value={_template.uuid}>{_template.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Space direction='vertical' className='cm-width100'>
                    <Space size={0} direction='vertical'>
                        <div style={{color: "#000"}}>Select template to generate webhook</div>
                        <div className='cm-font-size12 cm-light-text'>{`{emailId}`} must be replaced with a proper email in the placeholder</div>
                    </Space>
                    <div className={`j-plink-card cm-font-size14`} dangerouslySetInnerHTML={{__html: url}}></div>
                </Space>
                <Form.Item>
                    <Button onClick={() => copyLink(`${webhookLink}id=${currentTemplate}&emailId={emailId}`)} disabled={!currentTemplate} className='cm-flex-center' type='primary' icon={<MaterialSymbolsRounded font={copy ? 'done' : 'content_copy' } size='18'/>}> 
                        {copy ? "Webhook copied" : "Copy webhook"}
                    </Button>
                </Form.Item>
            </Space>
        </Form>
    )
}

export default WebhookForm