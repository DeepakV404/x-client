import { useContext, useState } from "react";
import { Button, Space, Form, Upload, Input, Tag } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { LinkedinFilled, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, COMPANY_FALLBACK_ICON, Length_Input } from "../../../constants/module-constants";
import { SETTINGS_ORG } from "../../../config/role-permission-config";
import { PermissionCheckers } from "../../../config/role-permission";
import { ORG_DETAILS_UPDATED } from "../../../tracker-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;

const OrgDetails = () => {

    const [form]                    =   useForm();
    const { $orgDetail, $user }     =   useContext(GlobalContext);

    const showFooter                =   PermissionCheckers.__checkPermission($user.role, SETTINGS_ORG, 'update');

    const [submitState, setSubmitState]     =   useState({
        text: "Update",
        loading: false
    });

    const [imageUrl, setImageUrl]   =   useState<string | null>($orgDetail.logoUrl);

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

    const onFinish = (values: any) => {

        setSubmitState({
            loading :   true,
            text    :   "Updating..."
        })

        SettingsAgent.updateOrgDetail({
            variables: { 
                logo:   values.profilePic ? values.profilePic.file : null,
                input: {
                    companyName     :   values.companyName,
                    websiteUrl      :   values.websiteUrl,
                    linkedInUrl     :   values.linkedInUrl,
                    twitterUrl      :   values.twitterUrl,
                    instagramUrl    :   values.instagramUrl,
                    industryType    :   values.industryType
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Organization details updated successfully")
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
                AppTracker.trackEvent(ORG_DETAILS_UPDATED, {});
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

    // const handleRemoveImage = () => {
    //     SettingsAgent.removeOrgLogo({
    //         variables: {
    //         },
    //         onCompletion: () => {
    //             CommonUtil.__showSuccess("Organization logo removed successfully")
    //             setImageUrl("");
    //             form.setFieldsValue({ profilePic: null });
    //         },
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     })
    // }
    
    const uploadButton = (
        <div>
            <MaterialSymbolsRounded font="add" size="24"/>
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )
    
    return(
        <div className="cm-height100 cm-overflow-auto">
            <div className="cm-width100 j-setting-header">               
                <Space>
                    <MaterialSymbolsRounded font='corporate_fare' size='22' color="#0065E5"/>
                    <div className="cm-font-size16 cm-font-fam500">Organization Details</div>
                </Space>         
            </div>
            <div className="cm-padding20 j-setting-body" style={showFooter ? {} : {height: "calc(100% - 43px)"}}>
                <Form form={form} layout="vertical" className="cm-form j-settings-form" onFinish={onFinish}>   
                    <Space size={10}>
                        <Form.Item name={"profilePic"} initialValue={imageUrl ?? null} noStyle>
                            <Upload 
                                className       =   "j-settings-avatar cm-image-remove"
                                name            =   "avatar"
                                listType        =   "picture-card"
                                showUploadList  =   {false}
                                onChange        =   {handleChange}
                                beforeUpload    =   {() => {}}
                                accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                maxCount        =   {1}
                            >
                                {
                                    imageUrl 
                                    ? 
                                        <img src={imageUrl} alt="logo" className="cm-height100 cm-width100 cm-padding5 cm-object-fit-scale-down" style={{ borderRadius: "10px" }} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/> 
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
                        <Space direction='vertical' size={5}>
                            <div className="cm-font-fam600 cm-font-size18">{$orgDetail.companyName}</div>
                            {$orgDetail.industryType && <Tag color="volcano">{$orgDetail.industryType}</Tag>}
                            <Space size={4} className="cm-light-text">
                                <MaterialSymbolsRounded font="mail" filled size="18" /> 
                                <div>{$orgDetail.owner.emailId}</div>
                            </Space>
                        </Space>
                    </Space>

                    <Form.Item className="cm-margin-top20" label="Company Name" name="companyName" rules={[{required: true, message: "Company Name is required", whitespace: true}]} initialValue={$orgDetail.companyName}>
                        <Input autoFocus placeholder="Buyerstage" maxLength={Length_Input} size="large" allowClear/>
                    </Form.Item>

                    <Form.Item label="Industry Type" name="industryType" rules={[{whitespace: true}]} initialValue={$orgDetail.industryType}>
                        <Input placeholder="Eg: Subscription Billing" maxLength={Length_Input} size="large" allowClear/>
                    </Form.Item>

                    <Form.Item label="Website URL" name="websiteUrl" initialValue={$orgDetail.websiteUrl} rules={[{ type: "url", message: "Enter a valid URL"}]}>
                        <Input allowClear placeholder="Website URL" prefix={<MaterialSymbolsRounded font="captive_portal" size="20" color ='#bebebe'/>} size="large"/>
                    </Form.Item>

                    <Form.Item label="LinkedIn URL" name="linkedInUrl" initialValue={$orgDetail.linkedInUrl} rules={[{ type: "url", message: "Enter a valid URL"}]}>
                        <Input allowClear placeholder="LinkedIn URL" prefix={<LinkedinFilled style={{color: '#bebebe'}}/>} size="large"/>
                    </Form.Item>

                    <Form.Item label="Twitter URL" name="twitterUrl" initialValue={$orgDetail.twitterUrl} rules={[{ type: "url", message: "Enter a valid URL"}]}>
                        <Input allowClear placeholder="Twitter URL" prefix={<TwitterOutlined style={{color: '#bebebe'}}/>} size="large"/>
                    </Form.Item>

                    <Form.Item label="Instagram URL" name="instagramUrl" initialValue={$orgDetail.instagramUrl} rules={[{ type: "url", message: "Enter a valid URL"}]}>
                        <Input allowClear placeholder="Instagram URL" prefix={<InstagramOutlined style={{color: '#bebebe'}}/>} size="large"/>
                    </Form.Item> 
                </Form>
            </div>
            {
                showFooter ?
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
                :
                    null
            }
         </div>
    );
}

export default OrgDetails;