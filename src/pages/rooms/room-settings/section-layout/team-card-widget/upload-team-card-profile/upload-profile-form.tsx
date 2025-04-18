import { useContext, useState } from "react";
import { Avatar, Button, Form, Radio, RadioChangeEvent, Select, Space, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, MODULE_TEMPLATE, WIDGET_PROFILE_IMAGE_FALLBACK } from "../../../../../../constants/module-constants";
import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";
import { WidgetsAgent } from "../../../../../custom-sections/api/widgets-agent";
import { CommonUtil } from "../../../../../../utils/common-util";
import { GlobalContext } from "../../../../../../globals";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded";
import Loading from "../../../../../../utils/loading";
import { RoomsAgent } from "../../../../api/rooms-agent";
import { ERROR_CONFIG } from "../../../../../../config/error-config";

const { Option }    =   Select;
const { Dragger }   =   Upload;
const { useForm }   =   Form;

export const PROFILE_TYPE_USER      =   "PROFILE_TYPE_USER";
export const PROFILE_TYPE_CUSTOM    =   "PROFILE_TYPE_CUSTOM";

const UploadProfileForm = (props: {profileFormProps: any, onClose: any, module: any}) => {

    const { onClose, profileFormProps, module }   =   props;

    const component     =   profileFormProps.component;
    const widget        =   profileFormProps.widget;
    
    const __isTeamUser  =   component.content?.teamCard?.teamUser;
    const __profileUrl  =   component.content?.profileImage?.url;
    const __userUuid    =   component.content?.teamCard?.userUuid ? component.content?.teamCard?.userUuid : undefined

    const [form]        =   useForm();

    const { $sellers }  =   useContext(GlobalContext)

    const [submitState, setSubmitState] =   useState({
        loading :   false,
    });

    const [profileType, setProfileType]             =   useState(__isTeamUser ? PROFILE_TYPE_USER : PROFILE_TYPE_CUSTOM);

    const [profileUrl, setProfileUrl]               =   useState<string | null | undefined>(__profileUrl);

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        setProfileType(PROFILE_TYPE_CUSTOM)
        form.setFieldsValue({
            ["existingProfile"] : undefined
        })
        getBase64(info.file as RcFile, (url) => {
            setProfileUrl(url);
        });
    };

    const onFinish = (values: any) => {
        setSubmitState({
            loading: false
        })

        let propertyMap = {...component.content.teamCard}

        if(module === MODULE_TEMPLATE){
            if(profileType === PROFILE_TYPE_CUSTOM){
                propertyMap["teamUser"]   =   false;
                
                RoomTemplateAgent.updateComponentByProperty({
                    variables: {
                        widgetUuid      :   widget.uuid,
                        componentUuid   :   component.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   propertyMap
                    },
                    onCompletion: () => {
                        WidgetsAgent.updateWidgetProfileImage({
                            variables: {
                                widgetUuid      :   widget.uuid,
                                componentUuid   :   component.uuid,
                                profileImage    :   values?.customProfile?.file
                            },
                            onCompletion: () => {
                                onClose()
                            },
                            errorCallBack: () => {}
                        })
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }else{

                propertyMap["teamUser"]   =   true;
                propertyMap["userUuid"]     =   values.existingProfile
                
                RoomTemplateAgent.updateComponentByProperty({
                    variables: {
                        widgetUuid      :   widget.uuid,
                        componentUuid   :   component.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   propertyMap
                    },
                    onCompletion: () => {
                        onClose()
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
        }else{
            if(profileType === PROFILE_TYPE_CUSTOM){
                propertyMap["teamUser"]   =   false;
                
                RoomsAgent.updateComponentByProperty({
                    variables: {
                        widgetUuid      :   widget.uuid,
                        componentUuid   :   component.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   propertyMap
                    },
                    onCompletion: () => {
                        WidgetsAgent.updateWidgetProfileImage({
                            variables: {
                                widgetUuid      :   widget.uuid,
                                componentUuid   :   component.uuid,
                                profileImage    :   values?.customProfile?.file
                            },
                            onCompletion: () => {
                                onClose()
                            },
                            errorCallBack: () => {}
                        })
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }else{
    
                propertyMap["teamUser"]   =   true;
                propertyMap["userUuid"]     =   values.existingProfile
                
                RoomsAgent.updateComponentByProperty({
                    variables: {
                        widgetUuid      :   widget.uuid,
                        componentUuid   :   component.uuid,
                        propertyKey     :   "teamCard",
                        propertyContent :   propertyMap
                    },
                    onCompletion: () => {
                        onClose()
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
        }
    }

    const onUploadTypeChange = (event: RadioChangeEvent) => {
        setProfileType(event.target.value);
    }

    const UploadedImage = () => {
        return (
            <div className ="cm-margin-top10 cm-flex-center">
                <div style={{height: "170px", width: "170px"}} className="cm-border-radius12" >
                    {profileUrl ? <img src={profileUrl} style={{width: "100%", height: "100%", borderRadius: "12px", objectFit: "cover"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= WIDGET_PROFILE_IMAGE_FALLBACK}}/> : WIDGET_PROFILE_IMAGE_FALLBACK}
                </div>
            </div>
        )
    }

    return (
        <div className='cm-height100'>
            <div className='j-slider-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Upload/Choose
                    <MaterialSymbolsRounded font='close' size='22' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-slider-body cm-padding15'>
                <Form form={form} onFinish={onFinish} className="cm-form">
                    <Radio.Group onChange={onUploadTypeChange} value={profileType} className="cm-width100">
                        <Space direction="vertical" size={20} className="cm-width100">
                            <Space direction="vertical" size={15}>
                                <Radio value={PROFILE_TYPE_USER} className="j-choose-profile-radio-wrapper">
                                    <Space direction="vertical" size={0}>
                                        <div className="cm-font-fam600 cm-font-size15 cm-font-opacity-black-85">Choose an existing user</div>
                                        <div className="cm-font-size13 cm-font-opacity-black-65">You cannot modify the personal data by choosing this option</div>
                                    </Space>
                                </Radio>
                                <Form.Item 
                                    name        =   {"existingProfile"} 
                                    style       =   {{paddingLeft: "24px"}} 
                                    initialValue=   {__isTeamUser ? __userUuid : undefined}
                                    rules       =   {[{required: profileType === PROFILE_TYPE_USER ? true : false, message: "Select an user"}]}
                                >
                                    <Select 
                                        showSearch 
                                        allowClear 
                                        placeholder     =   {"Select User"} 
                                        optionLabelProp =   "label" 
                                        optionFilterProp=   "label" 
                                        disabled        =   {profileType !== "PROFILE_TYPE_USER"}
                                        onChange        =   {(_: any) => {setProfileType(PROFILE_TYPE_USER)}}
                                    >
                                        {
                                            $sellers.map((_seller: any) => (
                                                <Option key={_seller.uuid} label={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)} profileUrl={_seller.profileUrl}>
                                                    <Space>
                                                        <Avatar shape="square" size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "30px" }} src={_seller.profileUrl ? <img src={_seller.profileUrl} alt={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}/> : ""}>
                                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_seller.firstName, _seller.lastName), 1)}
                                                        </Avatar>
                                                        {CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}
                                                    </Space>
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Space>
                            <Space direction="vertical" className="cm-width100" size={20}>
                                <Radio value={PROFILE_TYPE_CUSTOM} className="j-choose-profile-radio-wrapper">
                                    <Space direction="vertical" size={0}>
                                        <div className="cm-font-fam600 cm-font-size15 cm-font-opacity-black-85">Upload Image</div>
                                        <div className="cm-font-size13 cm-font-opacity-black-65">You can upload .png, .jpg, .jpeg, etc</div>
                                    </Space>
                                </Radio>
                                <Form.Item name="customProfile" rules={[{required: profileType === PROFILE_TYPE_CUSTOM ? true : false, message: "Upload an image"}]}>
                                    <Dragger listType="picture" className="j-upload-option-wrapper" beforeUpload={()=> {return false}} onChange={handleChange} disabled={false} accept={ACCEPTED_PROFILE_IMAGE_FILE_TYPES} maxCount={1} showUploadList={false}>
                                        <div className="cm-flex-center">
                                            <Space className="j-marketplace-res-upload-card cm-flex-center" direction="vertical">
                                                <MaterialSymbolsRounded font="upload"/>
                                                <div className="cm-font-fam400 cm-font-size14">from Device</div>
                                            </Space>
                                        </div>
                                    </Dragger>
                                </Form.Item>
                            </Space>
                        </Space>
                    </Radio.Group>
                    {
                        profileUrl && profileType === PROFILE_TYPE_CUSTOM ? <UploadedImage /> : null
                    }
                </Form>
            </div>
            <div className='j-slider-footer'>
                <Space>
                    <Button className='cm-modal-footer-cancel-btn' onClick={() => onClose()}>
                        <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                    </Button>
                    <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                        <Space size={10}>
                            <div className="cm-font-size14">{submitState.loading ? "Saveing" : "Save"}</div>
                            {
                                submitState.loading && <Loading color="#fff" size='small'/>
                            }
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default UploadProfileForm