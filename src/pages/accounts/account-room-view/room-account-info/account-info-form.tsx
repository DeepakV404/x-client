import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Button, Divider, Form, Input, Select, Space, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { useQuery } from "@apollo/client";

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, Length_Input, THUMBNAIL_FALLBACK_ICON } from "../../../../constants/module-constants";
import { FEATURE_ACCOUNTS } from "../../../../config/role-permission-config";
import { checkPermission } from "../../../../config/role-permission";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { REGIONS } from "../../../settings/api/settings-query";
import { CommonUtil } from "../../../../utils/common-util";
import { AccountsAgent } from "../../api/accounts-agent";
import { GlobalContext } from "../../../../globals";
import { useAccountContext } from "../..";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import UploadButton from "../../../../components/profile-uploader/upload-button";
import Loading from "../../../../utils/loading";

const { useForm } = Form;

const AccountInfoForm = () => {

    const params = useParams();
    const [form] = useForm();
    const { account } = useAccountContext();

    const { $user } = useContext(GlobalContext);

    const [imageUrl, setImageUrl] = useState<string>(account.logoUrl);

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
    const [submitState, setSubmitState] = useState({
        text: "Update",
        loading: false
    });

    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    const regions = regionsData?.regions.map((region: any) => ({
        value: region.uuid,
        label: region.name,
    }));

    const onFinish = (values: any) => {

        setSubmitState({
            loading: true,
            text: "Updating..."
        })

        AccountsAgent.updateAccount({
            variables: {
                accountUuid: params.accountId,
                logo: values.profilePic ? values.profilePic.file : null,
                input: {
                    companyName: values.companyName,
                    websiteUrl: values.websiteUrl,
                    regionUuid: values.region,
                    linkedInUrl: values.linkedInUrl,
                    twitterUrl: values.twitterUrl,
                    industryType: values.industryType
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Account details updated successfully")
                setSubmitState({
                    loading: false,
                    text: "Update"
                })
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setSubmitState({
                    loading: false,
                    text: "Update"
                })
            }
        })
    }

    const handleWebsiteClick = () => {
        window.open(account.websiteUrl, "_blank")
    }

    return (
        <div className="cm-padding20 cm-height100">
            <div className="cm-padding20 cm-height100 cm-overflow-auto" style={{ background: "#fff", borderRadius: "8px" }}>
                <Form form={form} layout="vertical" className="cm-form j-settings-form" onFinish={onFinish}>
                    <Space className="cm-margin-bottom10">
                        <Form.Item name={"profilePic"} initialValue={imageUrl} noStyle>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                showUploadList={false}
                                onChange={handleChange}
                                beforeUpload={() => { }}
                                accept={ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                            >
                                {
                                    imageUrl
                                        ?
                                        <img src={imageUrl} alt="logo" className="cm-height100 cm-width100 cm-padding5" style={{ borderRadius: "10px", objectFit: "scale-down" }} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = THUMBNAIL_FALLBACK_ICON }} />
                                        :
                                        <UploadButton />
                                }
                            </Upload>
                        </Form.Item>
                        <Space direction="vertical" size={0}>
                            <div className="cm-font-fam600 cm-font-size20">{account.companyName}</div>
                            {
                                account.websiteUrl || account.linkedInUrl || account.twitterUrl
                                    ?
                                    <Space className="j-social-links" size={0} style={{ paddingLeft: "0px" }}>
                                        {
                                            account.websiteUrl ?
                                                <>
                                                    <MaterialSymbolsRounded font="language" size="17" className="cm-cursor-pointer" onClick={handleWebsiteClick} />
                                                    {
                                                        (account.linkedInUrl || account.twitterUrl) && <Divider type="vertical" />
                                                    }
                                                </>
                                                :
                                                null
                                        }
                                        {
                                            account.linkedInUrl ?
                                                <>
                                                    <a className="cm-flex-center" href={account.linkedInUrl}><img src={`${import.meta.env.VITE_STATIC_ASSET_URL}/linkedin.svg`} style={{ width: "14px" }} /></a>
                                                    {
                                                        (account.twitterUrl) && <Divider type="vertical" />
                                                    }
                                                </>
                                                :
                                                null
                                        }
                                        {
                                            account.twitterUrl ?
                                                <a className="cm-flex-center" href={account.twitterUrl}><img src={`${import.meta.env.VITE_STATIC_ASSET_URL}/twitter.svg`} style={{ width: "16px" }} /></a>
                                                :
                                                null
                                        }
                                    </Space>
                                    :
                                    null
                            }
                        </Space>
                    </Space>

                    <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: "Company Name is required", whitespace: true }]} initialValue={account.companyName}>
                        <Input autoFocus placeholder="Buyerstage" maxLength={Length_Input} size="large" />
                    </Form.Item>

                    <Form.Item label="Industry type" name="industryType" initialValue={account.industryType}>
                        <Input allowClear placeholder="Industry type" size="large" />
                    </Form.Item>

                    <Form.Item label="Website URL" name="websiteUrl" initialValue={account.websiteUrl} rules={[{ type: "url", message: "Enter a valid URL" }]}>
                        <Input allowClear placeholder="Website URL" prefix={<MaterialSymbolsRounded font="link" size="20" />} size="large" />
                    </Form.Item>

                    <Form.Item name={"region"} label={"Region"} initialValue={!account.region ? null : account.region.uuid}>
                        <Select placeholder="Select region" options={regions} size="large" showSearch optionLabelProp="label" allowClear suffixIcon={<MaterialSymbolsRounded font="expand_more" size="18" />} />
                    </Form.Item>

                    <Form.Item label="LinkedIn URL" name="linkedInUrl" initialValue={account.linkedInUrl} rules={[{ type: "url", message: "Enter a valid URL" }]}>
                        <Input allowClear placeholder="LinkedIn URL" prefix={<MaterialSymbolsRounded font="link" size="20" />} size="large" />
                    </Form.Item>

                    <Form.Item label="Twitter URL" name="twitterUrl" initialValue={account.twitterUrl} rules={[{ type: "url", message: "Enter a valid URL" }]}>
                        <Input allowClear placeholder="Twitter URL" prefix={<MaterialSymbolsRounded font="link" size="20" />} size="large" />
                    </Form.Item>

                    {
                        checkPermission($user.role, FEATURE_ACCOUNTS, 'update') &&
                        <Form.Item className="cm-margin-top20">
                            <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                                <Space size={10}>
                                    {submitState.text}
                                    {
                                        submitState.loading && <Loading color="#fff" size='small' />
                                    }
                                </Space>
                            </Button>
                        </Form.Item>
                    }

                </Form>
            </div>
        </div>
    )
}

export default AccountInfoForm