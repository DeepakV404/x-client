import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Form, Input, Space, Typography } from 'antd'
import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, ONBOARDING_BANNER_IMAGE, ONBOARDING_OFFICE_IMAGE } from '../../constants/module-constants';
import { OnboardingAgent } from './api/onboarding-agent';
import { ORG_DETAIL } from './api/onboarding-query';

import UploadButton from '../../components/profile-uploader/upload-button';

const { useForm }   =   Form;
const { Text }      =   Typography;

interface FormInfoType{
    companyName   :   string;
    websiteUrl    :   string;
}
interface ComponentProps{
    onNext      :   () => void;
    onPrevious  :   () => void;
    onSkip      :   () => void;
}

const OnboardingStep2 = (props: ComponentProps) => {

    const { onNext, onPrevious, onSkip }                =   props;

    const [ form ]                      =     useForm();
    
    const [currentUrl, setCurrentUrl]   =    useState('notFound');
    
    const { data }      =   useQuery(ORG_DETAIL);
    
    const [formInfo, setFormInfo]   =   useState<FormInfoType>({
        companyName    :  "Acme Inc",
        websiteUrl     :  "www.acme.in",
    })

    useEffect(() => {
        form.setFieldsValue({
            companyName: data?.orgDetail?.companyName,
            websiteUrl: data?.orgDetail?.websiteUrl,
        });
        setCurrentUrl(data?.orgDetail?.logoUrl);
    }, [data, form]);

    const handleCompanyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo((prevFormInfo) => ({
            ...prevFormInfo,
            companyName: event.target.value
        }));
    };

    const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo((prevFormInfo) => ({
            ...prevFormInfo,
            websiteUrl: event.target.value
        }));
    };

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

    const handleNext = () => {
        onNext()
    }

    const onFinish = (values: any) => {
        OnboardingAgent.updateOrgDetail({
            variables: { 
                logo:   values.profilePic ? values.profilePic.file : null,
                input: {
                    companyName     :   values.companyName,
                    websiteUrl      :   values.websiteUrl,
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
        handleNext()
    }

    const handlePrevious = () => {
        onPrevious()
    }

    return (
        <div className="cm-flex cm-width100" style={{height: "calc(100% - 61px)"}}>
            <div className="j-onboarding-step-1-left-bg">
                <Space direction="vertical" className="cm-height100 cm-flex-center">
                    <Space direction="vertical" className="cm-width100">
                        <div className="cm-font-fam600 j-onboarding-step-title cm-margin-bottom20" style={{width: "400px"}}>Next, tell us about your organization </div>
                        <Form form={form} layout="vertical" className="j-onboarding-form" onFinish={onFinish}>
                            <Form.Item label="Company Name" name="companyName" className='cm-width100' rules={[{required: true, message: "Company Name is required", whitespace: true}]}>
                                <Input autoFocus placeholder="Acme Inc" allowClear size="large" onChange={handleCompanyNameChange}/>
                            </Form.Item>

                            <Form.Item label="Website" name="websiteUrl">
                                <Input placeholder="www.acme.io" allowClear size="large" onChange={handleWebsiteChange}/>
                            </Form.Item>

                            <Form.Item label="Company Logo" name={"profilePic"}>
                                <Upload 
                                    name                    =   "avatar"
                                    listType                =   "picture-card"
                                    showUploadList          =   {false}
                                    onChange                =   {handleLogoChange}
                                    accept                  =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                    className               =   "j-onboarding-profile-upload"
                                >
                                    {
                                        (
                                            currentUrl === "notFound"
                                            ?
                                                <UploadButton />
                                            :
                                                <img src={currentUrl ?? ONBOARDING_OFFICE_IMAGE} alt="logo" className="cm-height100 cm-width100" style={{ borderRadius: "inherit", objectFit: "scale-down" }} />
                                        )
                                    }
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Space>
                </Space>
                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                    <div className="cm-secondary-text" style={{paddingLeft: "60px"}}>2 of 4</div>
                    <Space style={{paddingRight: "60px"}} size={10}>
                        <Button size="large" onClick={onSkip}>Skip</Button>
                        <Button size="large" onClick={handlePrevious}>Previous</Button>
                        <Button size="large" type="primary" onClick={() => form.submit()}>Next</Button>
                    </Space>
                </div>
            </div>
            <div className="j-onboarding-step-1-right-bg">
                <div className="j-onboarding-step-1-element">
                    <div className="j-onboarding-step-2-card-1 marker"> 
                        <img width={100} height={100} src={ (!currentUrl || currentUrl === "notFound") ? ONBOARDING_OFFICE_IMAGE : currentUrl} style={{objectFit: "cover", borderRadius: "16px"}} />
                        <Space direction="vertical" size={6}>
                            <Text className="cm-font-size20 cm-font-fam500">{data?.orgDetail?.companyName ?? formInfo.companyName}</Text>
                            <Text className="cm-font-opacity-black-65 cm-font-size13">{data?.orgDetail?.websiteUrl ?? formInfo.websiteUrl}</Text>
                        </Space>
                    </div>
                    <div className="j-onboarding-step-2-card-2 marker" > 
                        <img className='cm-width100' src={ONBOARDING_BANNER_IMAGE}/>
                        <div className='cm-flex j-onboarding-step-2-logos-wrapper'>
                            <div className='j-onboarding-buyer-logo cm-font-size13 cm-font-fam600'>BUYER LOGO</div>
                            <div className='cm-flex-center'>
                                <img width={80} height={80} src={(!currentUrl || currentUrl === "notFound") ? ONBOARDING_OFFICE_IMAGE : currentUrl} style={{borderRadius: "50%",  marginLeft: "-10px"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingStep2