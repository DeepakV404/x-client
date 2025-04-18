import { useContext, useState } from "react";
import { Button, Col, Form, Input, Row, Space, Tag, Typography, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input } from "../../../constants/module-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { SETTING_CONFIG } from "../config/settings-config";
import { PERSONAL_DETAILS_UPDATED } from "../../../tracker-constants";
import { AppTracker } from "../../../app-tracker";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;
const { Text }      =   Typography;

const PersonalInfo = () => {
    
    const { $user }    =   useContext(GlobalContext);

    const [form]       =   useForm();

    const [imageUrl, setImageUrl]                   =   useState<string | null>($user.profileUrl);

    const [submitState, setSubmitState]     =   useState({
        text: "Update",
        loading: false
    });

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

    // const handleRemoveImage = () => {
    //     SettingsAgent.removeProfileImage({
    //         variables: {
    //         },
    //         onCompletion: () => {
    //             CommonUtil.__showSuccess("Profile image removed successfully");
    //             form.setFieldsValue({ profilePic: null });
    //             setImageUrl(null);
    //         },
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     })  
    // }

    const onFinish = (values: any) => {

        setSubmitState({
            loading :   true,
            text    :   "Updating..."
        })

        SettingsAgent.updateUserDetail({
            variables: {
                profile: values.profilePic ? values.profilePic.file : null,
                input: {
                    firstName   :   values.firstName,
                    lastName    :   values.lastName,
                    calendarUrl :   values.calendarUrl,
                    linkedInUrl :   values.linkedInUrl,
                    designation :   values.designation
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Personal details updated successfully")
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
                AppTracker.trackEvent(PERSONAL_DETAILS_UPDATED, {});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
            }
        })
    }

    const uploadButton = (
        <div>
            <MaterialSymbolsRounded font="add" size="24"/>
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
            <div className="cm-height100 cm-overflow-auto">
                <div className="cm-width100 j-setting-header">
                    <Space>
                        <MaterialSymbolsRounded font="person" size="22" color="#0065E5"/>
                        <div className="cm-font-size16 cm-font-fam500">Personal Details</div>
                    </Space>
                </div>
                <div className="cm-padding20 j-setting-body">
                    <Form form={form} layout="vertical" className="cm-form j-settings-form" onFinish={onFinish}>   
                        <Space size={10}>
                            <Form.Item name={"profilePic"} initialValue={imageUrl} noStyle>
                                <Upload 
                                    name                    =   "avatar"
                                    listType                =   "picture-card"
                                    showUploadList          =   {false}
                                    onChange                =   {handleChange}
                                    accept                  =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                    className               =   "cm-image-remove"
                                >
                                    {
                                        imageUrl 
                                        ? 
                                            <img src={imageUrl} alt="logo" className="cm-height100 cm-width100 cm-padding5" style={{ borderRadius: "10px", objectFit: "scale-down"}} /> 
                                        : 
                                            uploadButton
                                    }
                                    {/* {
                                        imageUrl &&
                                        <div onClick={(event) => {event.stopPropagation(); handleRemoveImage()}}>
                                            <MaterialSymbolsRounded font="close" className="cm-image-remove-close-icon" size="19" />
                                        </div>
                                    } */}
                                </Upload>
                            </Form.Item>
                            <Space direction='vertical' size={6}>
                                <Text style={{maxWidth: "500px"}} ellipsis={{tooltip: CommonUtil.__getFullName($user.firstName, $user.lastName)}} className='cm-font-fam500 cm-font-size18'>{CommonUtil.__getFullName($user.firstName, $user.lastName)}</Text>
                                <Tag color="volcano">{SETTING_CONFIG[$user.role].displayName}</Tag>
                                <Space size={4} className="cm-light-text">
                                    <MaterialSymbolsRounded font="mail" filled size="18" /> 
                                    <div>{$user.emailId}</div>
                                </Space>
                            </Space>
                        </Space>
                        
                        <Row className="cm-margin-top20" gutter={20}>
                            <Col span={12}>
                                <Form.Item label="First Name" name="firstName" initialValue={$user.firstName} rules={[{required: true, message: "First Name is required", whitespace: true}]}>
                                    <Input autoFocus placeholder="First Name" maxLength={Length_Input} allowClear size="large"/>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Last Name" name="lastName" initialValue={$user.lastName}>
                                    <Input placeholder="Last Name" maxLength={Length_Input} allowClear size="large"/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Designation" name="designation" initialValue={$user.designation}>
                            <Input placeholder="Designation" allowClear size="large"/>
                        </Form.Item>

                        <Form.Item label="Calendar Link" name="calendarUrl" initialValue={$user.calendarUrl}  rules={[{ type: "url", message: "Please enter a valid URL for Calendar Link"}]}>
                            <Input placeholder="Calendar Link" prefix={<MaterialSymbolsRounded font="link" size="20"/>} allowClear size="large"/>
                        </Form.Item>

                        <Form.Item label="LinkedIn URL" name="linkedInUrl" initialValue={$user.linkedInUrl} rules={[{type: "url", message: "Enter a valid URL"}]}>
                            <Input allowClear placeholder="LinkedIn URL" prefix={<MaterialSymbolsRounded font="link" size="20"/>} size="large"/>
                        </Form.Item>
                        
                    </Form>
                </div>
                <div className="j-setting-footer cm-width100">
                    <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => form.submit()}>
                    <Space size={10}>
                        {submitState.text}
                        {
                            submitState.loading && <Loading color="#fff"/>
                        }
                    </Space>
                    </Button>
                </div>
            </div>    
    );
}

export default PersonalInfo;