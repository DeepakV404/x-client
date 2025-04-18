import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Divider, Form, Image, Input, Radio, Space, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";

import { ACCEPTED_FAVICON_TYPE, ACCEPTED_THUMBNAIL_FILES, Length_Input } from "../../../constants/module-constants";
import { SETTINGS_BRANDING } from "../../../config/role-permission-config";
import { PermissionCheckers } from "../../../config/role-permission";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { ORG_PROPERTIES } from "../api/settings-query";
import { SettingsAgent } from "../api/settings-agent";
import { THEME_DEFAULT } from "../theme-color-config";
import { GlobalContext } from "../../../globals";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import NewPricingModal from "../pricing/new-pricing-modal";
import Loading from "../../../utils/loading";
import ColorPallette from "./color-pallette";

const { useForm }   =   Form;

const Branding = () => {
    
    const [form]        =   useForm();

    const { $orgDetail, $user, $featData, }    =   useContext(GlobalContext);

    const showFooter                =   PermissionCheckers.__checkPermission($user.role, SETTINGS_BRANDING, 'update');

    let $isSupportUser  =   $user.emailId === "support@buyerstage.io";

    const [imageUrl, setImageUrl]   =   useState<string | null>();
    const [ogImageUrl, setOgImageUrl] = useState<string | null>();
    const [showPurchase, setShowPurchase]   =   useState(false);

    const [selectedColor, setSelectedColor] = useState<string>(THEME_DEFAULT);

    const { data, loading, error }  =   useQuery(ORG_PROPERTIES, {
        fetchPolicy: "network-only",
        variables: {
            isPreview   :   CommonUtil.__getQueryParams(window.location.search).preview ? true : false
        }
    });

    const [submitState, setSubmitState]     =   useState({
        text: "Update",
        loading: false
    });
    
    useEffect(() => {
        if(data) {
            setImageUrl(data?.orgProperties?.favicon)
            setSelectedColor(data?.orgProperties?.brandColor ? data?.orgProperties?.brandColor : THEME_DEFAULT)
            setOgImageUrl(data?.orgProperties?.portalOgImage)
        }
    },[data])
    
    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    const onFinish = (values: any) => {
        setSubmitState({
            loading :   true,
            text    :   "Updating..."
        })
        
        SettingsAgent.updateOrgProperties({
            variables: {
                favicon       : values.favicon ? values.favicon.file : null,
                portalOgImage : values.ogImage ? values.ogImage.file : null,
                properties    : {
                    portalTitle     :   values.title,
                    supportEmail    :   values.supportEmail,
                    brandColor      :   selectedColor,
                    customDomain    :   values.customDomain,
                    buyerLayout     :   values.buyerLayout
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Branding details updated successfully");
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
            }
        });
    };

    const handleColorChange = (key: string) => {
        setSelectedColor(key)
    }

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

    const handleOgChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        getBase64(info.file as RcFile, (url) => {
            setOgImageUrl(url);
        });
    };

    return (
        <>
            <div className="cm-height100 cm-overflow-auto">
                <div className="cm-width100 j-setting-header"> 
                    <Space>
                        <MaterialSymbolsRounded font='verified' size='22' color="#0065E5"/>
                        <div className="cm-font-size16 cm-font-fam500">Branding</div>
                    </Space>
                </div>
                <div className="cm-padding20 j-setting-body" style={showFooter ? {} : {height: "calc(100% - 43px)"}}> 
                    <Form form={form} layout="vertical" className="cm-form cm-label-text j-settings-form" onFinish={onFinish}>   
                        <Space size={15}>
                            <Form.Item name={"favicon"} initialValue={imageUrl ?? null} noStyle>
                                <Upload 
                                    className       =   "j-favicon-upload cm-image-remove"
                                    name            =   "favicon"
                                    listType        =   "picture-card"
                                    showUploadList  =   {false}
                                    onChange        =   {handleChange}
                                    accept          =   {ACCEPTED_FAVICON_TYPE}
                                    maxCount        =   {1}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="favicon" className="cm-height100 cm-width100 cm-padding5" style={{ borderRadius: "10px" }} /> : <MaterialSymbolsRounded font="upload" size="24"/>}
                                    {/* {
                                        imageUrl &&
                                        <div onClick={(event) => {event.stopPropagation(); handleRemoveImage()}}>
                                            <MaterialSymbolsRounded font="close" className="cm-favicon-remove-close-icon" size="19" />
                                        </div>
                                    } */}
                                </Upload>
                            </Form.Item>
                            <Space direction="vertical" size={0}>
                                <div className="cm-font-fam500">Favicon</div>
                                <div className="cm-light-text cm-font-size12">16x16 px</div>
                            </Space>
                        </Space>

                        <Form.Item className="cm-margin-top20" label="Portal Name" name="title" rules={[{required: true, message: "Portal Name is required", whitespace: true}]} initialValue={data?.orgProperties?.portalTitle}>
                            <Input autoFocus placeholder="Buyerstage" maxLength={Length_Input} size="large" allowClear/>
                        </Form.Item>

                        <Form.Item 
                            label           =   "Support Email" 
                            name            =   "supportEmail" 
                            rules           =   {[{whitespace: true}, {type: "email"}]} 
                            initialValue    =   {data?.orgProperties?.supportEmail} 
                            // extra           =   {<span className="cm-font-size12">This email will be used everywhere in the buyer portal</span>}
                        >
                            <Input placeholder="eg: sales@buyerstage.io" maxLength={Length_Input} size="large" allowClear/>
                        </Form.Item>

                        <Form.Item label="Custom Domain" initialValue={$orgDetail.customDomain} name="customDomain" extra={<span className="cm-font-size12">Write to <a href="mailto: support@buyerstage.io">support@buyerstage.io</a> to configure your domain</span>}>
                            <Input placeholder="Custom Domain" size="large" maxLength={Length_Input} disabled={!$isSupportUser}/>
                        </Form.Item>

                        <Divider/>

                        <ColorPallette defaultColor={selectedColor} handleColorChange={handleColorChange}/>
                        <Divider/>

                        <div className='cm-flex cm-flex-direction-row' style={{columnGap: "20px"}}>
                            <Space direction='vertical' style={{width: "350px"}}>
                                <div className='cm-font-size16 cm-font-fam500'>OG Image</div>
                                <div className="cm-font-opacity-black-65">This image is displayed when you share a link on social media or with others.</div>
                                <Form.Item name={"ogImage"} initialValue={data?.orgProperties?.ogImage}>
                                    <Upload beforeUpload={()=> {return false}} showUploadList={false} multiple={false} onChange={handleOgChange} maxCount={1} accept={ACCEPTED_THUMBNAIL_FILES}>
                                        <Button type="primary" ghost className="cm-margin-block10" disabled={!showFooter}>
                                            <Space>
                                                <MaterialSymbolsRounded font="upload"/>
                                                Upload Image
                                            </Space>
                                        </Button>
                                    </Upload>
                                </Form.Item>
                                <div className="cm-font-size11 cm-light-text">*Image resolution should be 1200x630</div>
                            </Space>
                            <div className="j-setting-og-image">
                                {
                                    ogImageUrl ? 
                                        <Image src={ogImageUrl} width={300} height={180} alt="OG Image" className="cm-height100 cm-width100" rootClassName="cm-resource-viewer-background-black"/>
                                : 
                                    (
                                        <Space className="cm-height100 cm-flex-center" direction="vertical" size={4}>
                                            <div style={{color: "#0065E5"}}>Preview</div>
                                            <div className="cm-font-size12 cm-light-text">You can add png, jpg and etc</div>
                                        </Space>
                                    )
                                }
                            </div>
                        </div>
                        <Divider/>
                        <Space direction="vertical">
                            <div className='cm-font-size16 cm-font-fam500'>Layout</div>
                            <div className="cm-font-opacity-black-65">Choose a layout for your buyers</div>
                            <Form.Item initialValue={data?.orgProperties?.buyerLayout === "2" ? "2" : "1"} name="buyerLayout">
                                <Radio.Group>
                                    <Radio key={"1"} value={"1"}>Classic Layout</Radio>
                                    <Radio key={"2"} value={"2"}>Modern Layout</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Space>
                    </Form>
                </div>
                
                {
                    showFooter ?
                        <div className="j-setting-footer cm-width100">
                            <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => { $featData?.branding?.isRestricted ? setShowPurchase(true) : form.submit()}}>
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
            <NewPricingModal 
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
        </>
    )
}

export default Branding