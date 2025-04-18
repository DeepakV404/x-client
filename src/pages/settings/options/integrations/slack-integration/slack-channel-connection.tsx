import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Form, Select, Space } from 'antd';

import { ERROR_CONFIG } from '../../../../../config/error-config';
import { BUYERSTAGE_PRODUCT_LOGO, SLACK_LOGO } from '../../../../../constants/module-constants';
import { CommonUtil } from '../../../../../utils/common-util';
import { SettingsAgent } from '../../../api/settings-agent';
import { SLACK_LIST_CHANNEL } from '../../../api/settings-query';

import MaterialSymbolsRounded from '../../../../../components/MaterialSymbolsRounded';
import SomethingWentWrong from '../../../../../components/error-pages/something-went-wrong';

const { useForm }   =   Form;

const SlackChannelConnection = (props: { isOpen: boolean, onClose: () => void, channelId: string}) => {

    const { onClose, channelId } = props
    
    const { data, loading, error }  =   useQuery(SLACK_LIST_CHANNEL, {
        fetchPolicy: "network-only"
    });
    
    const [form]        =   useForm();

    const [submitState, setSubmitState] =   useState({
        text    :   "Join",
        loading :   false
    })

    const onFinish = (values: any) => {
        setSubmitState({
            text    :   "Joining",
            loading :   true
        })
        SettingsAgent.SlackChannelSelection({
            variables: {
                channelId           :   values.channelId,
                channelName         :   data?._slackListChannels ? data._slackListChannels[values.channelId] : ""
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Joined channel successfully");
                onClose()
                setSubmitState({
                    text    :   "Join",
                    loading :   false
                })
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                );
            },
        });
    };  

    if(error) return <SomethingWentWrong />

    return (
        <>
            <Space className='cm-flex-center cm-width100' direction='vertical' size={15}>
                <Space style={{height: "100px"}} className='cm-flex-center'>
                    <div style={{background: "#f2f1f3"}} className='j-settings-integration-icon-wrap'><img style={{width: "55px"}} src={BUYERSTAGE_PRODUCT_LOGO}/></div>
                    <div style={{background: "#f2f1f3", marginLeft: "-25px"}} className='j-settings-integration-icon-wrap'><img style={{width: "60px"}} src={SLACK_LOGO}/></div>
                </Space>
                <Space size={4} direction='vertical' align='center'>
                    <div className='cm-font-fam500 cm-font-size20'>
                        Slack integration
                    </div>
                    <div className='cm-font-fam300 cm-font-size14 cm-text-center cm-margin-bottom20'>
                        Integrate with Slack to get notified instantly
                    </div>
                </Space>
            </Space>  
            <Form className="cm-form" form={form} onFinish={onFinish} layout="vertical">
                <Space direction='vertical' size={10} style={{width: "100%"}}>
                    <Form.Item name={"channelId"} label={<div className="cm-font-fam500 cm-font-size16">Select Channel</div>} rules={[{required: true, message: "Invite reason is required"}]} initialValue={channelId}>
                        <Select optionFilterProp='children' showSearch placeholder="Select channel" loading={loading} disabled={loading} size='large' suffixIcon = {<MaterialSymbolsRounded font="expand_more" size="18"/>}>
                            {data?._slackListChannels && Object.keys(data._slackListChannels).map(channelId => (
                                <Select.Option key={channelId} value={channelId}>{data._slackListChannels[channelId]}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item className='j-integration-modal-footer'>
                        <Button style={{height: "40px"}} block type='primary' htmlType='submit' loading={submitState.loading}>{submitState.text}</Button>
                    </Form.Item>
                </Space>
            </Form>
        </>
    )
}
export default SlackChannelConnection