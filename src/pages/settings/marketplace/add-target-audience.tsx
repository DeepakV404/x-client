import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Form, Select, Space, Typography } from 'antd'

import { ERROR_CONFIG } from '../../../config/error-config';
import { MP_TARGET_AUDIENCE } from '../api/settings-query';
import { CommonUtil } from '../../../utils/common-util';
import { SettingsAgent } from '../api/settings-agent';

import CustomFormSubmitButton from '../../../components/custom-submit-button/custom-form-submit-button';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;
const { useForm }   =   Form;
const { OptGroup, Option }  =   Select;

const AddTargetAudience = (props: {onClose: any, template: any}) => {

    const { onClose, template } =   props;

    const [ form ]  =   useForm();

    const [submitState, setSubmitState]     =   useState({
        text: "Add Showcase Page",
        loading: false
    });

    const { data, loading }    =   useQuery(MP_TARGET_AUDIENCE,{
        fetchPolicy: "network-only",
    });

    const onFinish = (values: any) => {
        
        setSubmitState({
            loading :   true,
            text    :   "Adding..."
        })
        SettingsAgent.mpAddPage({
            variables: {
                templateUuid     :   template.uuid,
                targetAudience   :   values.targetAudience ? values.targetAudience : undefined
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Pages added successfully")
                setSubmitState({
                    loading :   false,
                    text    :   "Add Showcase Page"
                })
                onClose();
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    loading :   false,
                    text    :   "Add Showcase Page"
                })
            }
        })
    }

    return (
        <div className="cm-width100">
            <div className="cm-modal-header cm-font-size16 cm-font-fam500 cm-flex-align-center">
                Add Showcase Page
            </div>
            <Form form={form} onFinish={onFinish} layout="vertical" className="cm-form">
                <div className="cm-modal-content">
                    <Space direction='vertical' size={2} className='cm-margin-bottom20'>
                        <div>{template?.title}</div>
                        {
                            template?.description ?
                                <Text className="cm-font-fam300 cm-font-size12" style={{maxWidth: "500px"}} ellipsis={{tooltip: template?.description}}>{template?.description}</Text>
                            :
                                <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                        }
                    </Space>
                    <Form.Item label={<div style={{opacity: "67%"}}>Target Audience</div>} name="targetAudience">
                        <Select 
                            showSearch
                            allowClear
                            size                =   "large" 
                            optionFilterProp    =   "children"
                            className           =   "cm-width100 cm-select cm-cursor-pointer" 
                            mode                =   'multiple'
                            maxTagCount         =   'responsive'
                            placeholder         =   'Eg: Revenue Oerations Managers, Sales Operations Managers, etc.'
                            loading             =   {loading}
                            disabled            =   {loading}
                            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                        >
                            {data?._mpTargetAudience?.map((_audience: any) => (
                                <OptGroup label={_audience.group.name} key={_audience.group.uuid}>
                                    {_audience.tags?.map((tag: any) => (
                                        <Option value={tag.uuid} key={tag.uuid}>{tag.name}</Option>
                                    ))}
                                </OptGroup>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button ghost className="cm-modal-footer-cancel-btn cm-secondary-text" onClick={() => onClose()}>Cancel</Button>
                    </Form.Item>
                    <CustomFormSubmitButton form={form} submitState={submitState}/>
                </Space>
            </Form>
        </div>
    )
}

export default AddTargetAudience