import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Button, Col, Form, Input, InputRef, Row, Select, Space, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { LinkedinFilled, TwitterOutlined } from '@ant-design/icons';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, CLEARBIT_URL, Length_Input } from '../../../constants/module-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { LOOK_UP_ACCOUNT } from '../api/accounts-query';
import { ACCOUNT_CREATED } from '../../../tracker-constants';
import { AppTracker } from '../../../app-tracker';
import { CommonUtil } from '../../../utils/common-util';
import { AccountsAgent } from '../api/accounts-agent';
import { REGIONS } from '../../settings/api/settings-query';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import UploadButton from '../../../components/profile-uploader/upload-button';
import Loading from '../../../utils/loading';

const { useForm } = Form;

const AccountForm = (props: { onClose: () => void, getCreatedAccount?: any }) => {

    const { onClose, getCreatedAccount } = props;

    const [form] = useForm();

    const inputRef = useRef<InputRef>(null);
    
    const [logoLoading, setLogoLoading]     =   useState(false);
    const [currentUrl, setCurrentUrl]       =   useState("notFound");
    const [submitState, setSubmitState]     =   useState({
        text: "Create",
        loading: false
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [_lookUpAccount, { data, loading }] = useLazyQuery(LOOK_UP_ACCOUNT, {
        fetchPolicy: "network-only"
    });
    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (data && data.lookupAccount.status === "FOUND") {
            form.setFieldsValue({
                ["websiteUrl"]  :   data.lookupAccount.data.websiteUrl,
                ["linkedInUrl"] :   data.lookupAccount.data.linkedInUrl,
                ["industryType"]:   data.lookupAccount.data.industryType,
                ["logo"]        :   undefined,
                ["twitterUrl"]  :   data.lookupAccount.data.twitterUrl
            })
            setCurrentUrl(data.lookupAccount.data.logoUrl)
        }
    }, [data])

    const regions = regionsData?.regions.map((region: any) => ({
        value: region.uuid,
        label: region.name,
    }));

    const onTitleChange = (value: any) => {

        if (value.target.value.trim()) {
            _lookUpAccount({
                variables: {
                    title: value.target.value
                }
            })
        }
    }

    const onFinish = (values: any) => {

        setSubmitState({
            text: "Creating...",
            loading: true
        })
        AccountsAgent.createAccount({
            variables: {
                input: {
                    companyName :   values.account,
                    websiteUrl  :   values.websiteUrl,
                    regionUuid  :   values.region,
                    industryType:   values.industryType,
                    linkedInUrl :   values.linkedInUrl,
                    logoUrl     :   !values.logo ? currentUrl : undefined,
                    twitterUrl  :   values.twitterUrl
                },
                logo: values.logo ? values.logo.file : undefined
            },
            onCompletion: (data: any) => {
                onClose();
                CommonUtil.__showSuccess("Account created successfully")
                getCreatedAccount && getCreatedAccount(data.createAccount)
                AppTracker.trackEvent(ACCOUNT_CREATED, { "account-created": values.account });
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text: "Create",
                    loading: false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    let timeout: any;
    const debounce = function (func: any, delay: any) {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };

    const handleChange = (value: any) => {
        debounce(() => {
            setLogoLoading(true)
            fetch(CLEARBIT_URL + value.target.value + "?size=120")
                .then((response: any) => {
                    if (response.status === 200) {
                        setLogoLoading(false)
                        setCurrentUrl(response.url)
                        form.setFieldsValue({
                            ["logo"]: undefined
                        })
                    }
                })
                .catch(() => {
                    setLogoLoading(false)
                    setCurrentUrl("notFound")
                });
        }, 1000)
    }

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleLogoChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        getBase64(info.file.originFileObj as RcFile, (url) => {
            setCurrentUrl(url);
        });
    };

    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Create Account</div>
            <Form
                form        =   {form}
                layout      =   "vertical"
                className   =   'cm-form cm-modal-content'
                onFinish    =   {onFinish}
            >
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Form.Item label={"Account"} name="account" rules={[{ required: true, message: "Account name is required", whitespace: true }]}>
                            <Input ref={inputRef} maxLength={Length_Input} placeholder="Eg: Acme Inc" size="large" onBlur={onTitleChange} prefix={<MaterialSymbolsRounded font="business_center" size="20" color='#bebebe' />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Industry type" name="industryType">
                            <Input disabled={loading} placeholder="Eg: Software development" size="large" prefix={loading ? <Loading /> : <MaterialSymbolsRounded font="apartment" size="20" color='#bebebe' />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Website" name="websiteUrl" rules={[{ type: "url", message: "Enter a valid url" }]}>
                    <Input disabled={loading} onChange={handleChange} placeholder="Eg: acme.com" size="large" prefix={loading ? <Loading /> : <MaterialSymbolsRounded font="language" size="20" color='#bebebe' />} />
                </Form.Item>

                <Form.Item label="LinkedIn" name="linkedInUrl" rules={[{ type: "url", message: "Enter a valid URL" }]}>
                    <Input disabled={loading} placeholder="Eg: https://www.linkedin.com/company/acme" size="large" prefix={loading ? <Loading /> : <LinkedinFilled style={{ marginRight: "2px", color: '#bebebe' }} />} />
                </Form.Item>

                <Form.Item label="Twitter" name="twitterUrl" rules={[{ type: "url", message: "Enter a valid URL" }]}>
                    <Input disabled={loading} placeholder="Eg: https://x.com/acme" size="large" prefix={loading ? <Loading /> : <TwitterOutlined style={{ marginRight: "2px", color: '#bebebe' }} />} />
                </Form.Item>

                <Form.Item name={"region"} label={"Region"}>
                    <Select options={regions} placeholder="Select region" optionFilterProp='label' showSearch allowClear className="cm-cursor-pointer" suffixIcon={<MaterialSymbolsRounded font="expand_more" size="18" />} size='large' />
                </Form.Item>

                <Space className='cm-margin-top20 cm-margin-bottom20' size={10}>
                    <Space direction='vertical'>
                        <Space>
                            <Form.Item noStyle name={"logo"}>
                                <Upload
                                    className       =   'j-acc-logo-update'
                                    name            =   "avatar"
                                    listType        =   "picture-card"
                                    showUploadList  =   {false}
                                    onChange        =   {handleLogoChange}
                                    beforeUpload    =   {() => { }}
                                    accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                >
                                    {
                                        (loading || logoLoading)
                                            ?
                                            <Loading />
                                            :
                                            (
                                                currentUrl === "notFound"
                                                    ?
                                                    <UploadButton />
                                                    :
                                                    <img src={currentUrl} alt="logo" className="cm-height100 cm-width100" style={{ borderRadius: "8px", objectFit: "scale-down" }} />
                                            )
                                    }
                                </Upload>
                            </Form.Item>
                            <Space direction='vertical' size={4}>
                                {
                                    currentUrl === "notFound"
                                        ?
                                            <div className='cm-font-size13'>Upload a logo here or enter a website we'll fetch the logo</div>
                                        :
                                            <div className='cm-font-size13'>You can change the logo if it's not perfect</div>
                                }
                                <div className='cm-font-size13 cm-light-text'>Image (.png .jpeg) files less than 100MB</div>
                                {
                                    currentUrl === "notFound"
                                        ?
                                            null
                                        :
                                            <div className='cm-font-size11 cm-light-text'>Logos provided by Clearbit</div>
                                }
                            </Space>
                        </Space>
                    </Space>
                </Space>

            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn" disabled={submitState.loading} onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                        <Space size={10}>
                            <div className="cm-font-size14">{submitState.text}</div>
                            {submitState.loading && <Loading color="#fff" />}
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </>
    )
}

export default AccountForm