import { Button, Checkbox, Form, Space } from "antd";
import { useState } from "react";
import { SFDC_SYNC_OPTION_CONFIG } from "../../../config/sfdc-sync-options";
import { SettingsAgent } from "../../../api/settings-agent";
import { CommonUtil } from "../../../../../utils/common-util";
import { ERROR_CONFIG } from "../../../../../config/error-config";

const { useForm }   =   Form;

const SfdcSyncOptions = (props: {crmType: string, settings: any, onClose: () => void}) => {

    const { crmType, settings, onClose }  =   props;

    const [form ]   =   useForm()

    const [submitState, setSubmitState] =   useState({
        text    :   "Save",
        loading :   false
    })

    const onFinish = (values: any) => {

        const selectedOptions = values.syncOptions;

        const updatedSettings = { ...settings };

        selectedOptions.forEach((option: any) => {
            updatedSettings[option] = true;
        });

        Object.keys(updatedSettings).forEach(option => {
            if (!selectedOptions.includes(option)) {
                updatedSettings[option] = false;
            }
        });        
        
        setSubmitState({
            text    :   "Saving",
            loading :   false
        })

        SettingsAgent.updateIntegrationSettings({
            variables: {
                type  :  crmType,
                input :  updatedSettings
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Salesforce Integration updated successfully");
                setSubmitState({
                    loading :   false,
                    text    :   "Save"
                })
                onClose();
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    loading :   false,
                    text    :   "Save"
                })
            }
        });
    }

    const initialSelectedOptions = Object.keys(settings).filter(
        (key) => settings[key] === true
    );

    return(
        <Form className="cm-form" form={form} onFinish={onFinish} layout="vertical">
            <Space direction='vertical' size={10} style={{width: "100%"}}>
                <Form.Item name="syncOptions" initialValue={initialSelectedOptions} label={<div className="cm-font-size16 cm-font-fam600">Sync Configuration</div>}>
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                Object.values(SFDC_SYNC_OPTION_CONFIG).map((_option) => (
                                    <Checkbox className='cm-flex-align-center' key={_option.formKey} value={_option.formKey}><Space className='cm-margin-left5 cm-flex-center'><span>{_option.displayName}</span></Space></Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item className='j-integration-modal-footer'>
                    <Button style={{height: "40px"}} block type='primary' htmlType='submit' loading={submitState.loading}>{submitState.text}</Button>
                </Form.Item>
            </Space>
        </Form>
    )
}

export default SfdcSyncOptions