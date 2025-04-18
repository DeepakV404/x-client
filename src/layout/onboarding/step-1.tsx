import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Input, Row, Space, Typography, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input, ONBOARDING_PERSON_IMAGE } from "../../constants/module-constants";
import { OnboardingAgent } from "./api/onboarding-agent";
import { USER_DETAIL } from "./api/onboarding-query";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";

const { useForm }   =   Form;
const { Text }      =   Typography;

interface FormInfoType{
    firstName   :   string;
    lastName    :   string;
    role        :   string;
    email       :   string;
}

interface ComponentProps{
    onNext      :   () => void;
    onSkip      :   () => void;
    type?       :   "dsr" | "dpr" | "gtm";
}

const OnboardingStep1 = (props: ComponentProps) => {

    const { onNext, onSkip, type }                =   props;

    const [ form ]                          =   useForm();

    const [imageUrl, setImageUrl]           =   useState<string | null>();

    const { data }                          =   useQuery(USER_DETAIL);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        getBase64(info.file.originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
    };

    const [formInfo, setFormInfo]   =   useState<FormInfoType>({
        firstName   : "James",
        lastName    : "",
        role        : "Head of Marketing",
        email       : "jamesdoe@acme.io"
    })

    useEffect(() => {
        if (data?.me) {
            setFormInfo({
                firstName   :   data.me.firstName || "",
                lastName    :   data.me.lastName || "",
                role        :   data.me.designation || "",
                email       :   data.me.emailId || ""
            })
            form.setFieldsValue({
                firstName   :   data.me.firstName || "",
                lastName    :   data.me.lastName || "",
                designation :   data.me.designation || "",
            });
            setImageUrl(data.me.profileUrl);
        }
    }, [data]);

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo((prevFormInfo) => ({
            ...prevFormInfo,
            firstName: event.target.value
        }));
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo((prevFormInfo) => ({
            ...prevFormInfo,
            lastName: event.target.value
        }));
    }

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo((prevFormInfo) => ({
            ...prevFormInfo,
            role: event.target.value
        }));
    }

    const handleNext = () => {
        onNext()
    }

    const onFinish = (values: any) => {
        
        OnboardingAgent.updateUserDetail({
            variables: {
                profile: values.profilePic ? values.profilePic.file : null,
                input: {
                    firstName   :   values.firstName,
                    lastName    :   values.lastName,
                    designation :   values.designation
                }
            },
            onCompletion: () => {
            },
            errorCallBack: () => {}
        })
        handleNext()
    }

    return (
        <div className="cm-flex cm-width100" style={{height: "calc(100% - 61px)"}}>
            <div className="j-onboarding-step-1-left-bg">
                <Space direction="vertical" className="cm-height100 cm-flex-center">
                    <Space direction="vertical" className="cm-flex-align-start">
                        <div className="cm-font-fam600 j-onboarding-step-title">It's time to set up! 🎉 </div>
                        <div className="cm-font-fam600 j-onboarding-step-title cm-margin-bottom20">First, tell us about yourself.</div>
                        <Form form={form} layout="vertical" className="j-onboarding-form" onFinish={onFinish}>   
                            <Row className="cm-margin-top20" gutter={20}>
                                <Col span={12}>
                                    <Form.Item label="First Name" name="firstName" rules={[{required: true, message: "First Name is required", whitespace: true}]}>
                                        <Input autoFocus placeholder="James" maxLength={Length_Input} allowClear size="large" onChange={handleFirstNameChange}/>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Last Name" name="lastName">
                                        <Input placeholder="Doe" maxLength={Length_Input} allowClear size="large" onChange={handleLastNameChange}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Designation" name="designation">
                                <Input placeholder={type === "dsr" ? "Head of Sales" : "Head of Marketing"} allowClear size="large" onChange={handleRoleChange}/>
                            </Form.Item>

                            <Form.Item label="Profile Picture" name={"profilePic"}>
                                <Upload 
                                    name                    =   "avatar"
                                    listType                =   "picture-card"
                                    showUploadList          =   {false}
                                    onChange                =   {handleChange}
                                    accept                  =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                    className               =   "j-onboarding-profile-upload"
                                >
                                    {
                                        imageUrl 
                                        ? 
                                            <img src={imageUrl} alt="logo" className="cm-height100 cm-width100 cm-padding5" style={{ borderRadius: "inherit", objectFit: "cover"}} /> 
                                        : 
                                            <div>
                                                <MaterialSymbolsRounded font="add" size="24"/>
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                    }
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Space>
                </Space>
                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                    <div className="cm-secondary-text" style={{paddingLeft: "60px"}}>1 of 4</div>
                    <Space style={{paddingRight: "60px"}} size={10}>
                        <Button size="large" onClick={onSkip}>Skip</Button>
                        <Button size="large" type="primary" onClick={() => form.submit()}>Next</Button>
                    </Space>
                </div>
            </div>
            <div className="j-onboarding-step-1-right-bg">
                <div className="j-onboarding-step-1-element">
                    <Space className="j-onboarding-step-1-card" size={30}> 
                        {
                            imageUrl ? 
                                <img src={imageUrl} width={100} height={100} style={{objectFit: "cover", borderRadius: "16px"}} /> 
                            :
                                <img width={100} height={100} src={ONBOARDING_PERSON_IMAGE} />
                        }
                        <Space direction="vertical" size={6}>
                            <Text className="cm-font-size20 cm-font-fam500">{formInfo.firstName} {formInfo.lastName}</Text>
                            <Text>{data?.me?.designation ?? formInfo.role}</Text>
                            <Text className="cm-font-opacity-black-65 cm-font-size13">{data?.me?.emailId ?? formInfo.email}</Text>
                        </Space>
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default OnboardingStep1