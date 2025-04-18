import { useState } from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';

import { BUYERSTAGE_PRODUCT_LOGO, Length_Input, SALESFORCE_LOGO } from '../../../constants/module-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { ORG_INTEGRATIONS } from '../api/settings-query';
import { CommonUtil } from '../../../utils/common-util';
import { SettingsAgent } from '../api/settings-agent';
import { useApolloClient } from '@apollo/client';

const { useForm }   =   Form;

const SFDCIntegrationForm = (props: { isOpen: boolean, onClose: () => void }) => {

    const { isOpen, onClose }    =   props;

    const $client = useApolloClient();

    const [form]    =   useForm();

    const [submitState, setSubmitState] =   useState({
        text    :   "Connect",
        loading :   false
    })

    const onFinish = () => {
        setSubmitState({
            text: "Connecting...",
            loading:   true
        })
        SettingsAgent.sfdcCreateConnection({
            onCompletion: (data: any) => {
                setSubmitState({
                    text    :   "Connect",
                    loading :   false
                })

                onClose()
                form.resetFields()

                var oauthWindow:any 	= 	window.open(data._sfdcCreateConnection, "_blank", "width=800,height=600");
                var closeTimer          =   setInterval(checkClose, 300); 

                function checkClose() {
                    if(oauthWindow.closed) {  
                        clearInterval(closeTimer);  
                        $client.refetchQueries({
                            include: [ORG_INTEGRATIONS]
                        })
                    }  
                    if(String(oauthWindow.document?.documentElement?.outerHTML).includes("Callback request processed successfully"))
                    {
                        clearInterval(closeTimer);
                        oauthWindow.close();
                        $client.refetchQueries({
                            include: [ORG_INTEGRATIONS]
                        })
                    }
                }
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text    :   "Connect",
                    loading :   false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <Modal  
			centered
            destroyOnClose
			open        = 	{isOpen}  
			footer 	    = 	{null}
			onCancel    =   {onClose}
        >
			<Form 
				form		=	{form} 
				onFinish	=	{onFinish} 
				layout		=	"vertical" 
				className	=	'cm-form'
			>
				<Space className='cm-flex-center' direction='vertical' size={15}>
					<Space style={{height: "100px"}} className='cm-flex-center'>
						<div style={{background: "#f2f1f3"}} className='j-settings-integration-icon-wrap'><img style={{width: "55px"}} src={BUYERSTAGE_PRODUCT_LOGO}/></div>
						<div style={{background: "#f2f1f3", marginLeft: "-25px"}} className='j-settings-integration-icon-wrap'><img style={{width: "60px"}} src={SALESFORCE_LOGO}/></div>
					</Space>
                    <Space direction='vertical' align='center'>
                        <div className='cm-font-fam500 cm-font-size20'>
                            Salesforce integration
                        </div>
                        <div className='cm-font-fam300 cm-font-size14 cm-text-center cm-margin-bottom20'>
                            Integrate with Salesforce to create a seamless sales pipeline
                        </div>
                    </Space>
				</Space>
                <Form.Item name={"sfdcInstanceUrl"} label={"SFDC instance URL"} rules={[{required: true, message: "SFDC instance URL is required", whitespace: true}]}>
                    <Input allowClear maxLength={Length_Input} size='large'/>
                </Form.Item>
                <Form.Item name={"sfdcClientId"} label={"SFDC client id"} rules={[{required: true, message: "SFDC client id is required", whitespace: true}]}>
                    <Input type='password' maxLength={Length_Input} allowClear size='large'/>
                </Form.Item>
                <Form.Item name={"sfdcClientSecret"} label={"SFDC client secret"} rules={[{required: true, message: "SFDC client secret is required", whitespace: true}]}>
                    <Input type='password' maxLength={Length_Input} allowClear size='large'/>
                </Form.Item>
                <Form.Item className='j-integration-modal-footer'>
                    <Button style={{height: "40px"}} block type='primary' htmlType='submit' loading={submitState.loading}>{submitState.text}</Button>
                </Form.Item>
			</Form>
		</Modal>
    )
}

export default SFDCIntegrationForm