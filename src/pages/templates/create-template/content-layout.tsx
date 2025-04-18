import { useContext, useState } from "react";
import { Button, Divider, Form, Input, Select, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { BUYERSTAGE_PRODUCT_LOGO, Length_Input } from "../../../constants/module-constants";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { TEMPLATE_CREATED } from "../../../tracker-constants";
import { REGIONS } from "../../settings/api/settings-query";
import { AppTracker } from "../../../app-tracker";
import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";
import { GlobalContext } from "../../../globals";

const { TextArea } = Input;
const { useForm } = Form;
const { Text } = Typography;

const ContentLayout = (props: { content: string, selectedTemplate: any, onClose(): void }) => {

    const { content, selectedTemplate, onClose } = props;

    const { $dictionary, $isVendorMode, $isVendorOrg}   =   useContext(GlobalContext);

    const [form] = useForm();
    const navigate = useNavigate();

    const [submitLoading, setSubmitLoading] = useState({
        loading: false,
        text: `Create ${$dictionary.templates.singularTitle}`
    });

    const [cloneTemplateLoading, setCloneTemplateLoading] = useState({
        loading: false,
        text: `Use this ${$dictionary.templates.singularTitle}`
    });

    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    const regions = regionsData?.regions.map((region: any) => ({
        value: region.uuid,
        label: region.name,
    }));

    const onFinish = (values: any) => {
        setSubmitLoading({
            loading: true,
            text: "Creating..."
        })
        RoomTemplateAgent.createRoomTemplate({
            variables: {
                input: {
                    title: values.title,
                    description: values.description,
                    regionsUuid: values.region
                }
            },
            onCompletion: (data: any) => {
                navigate(`${data.createRoomTemplate.uuid}`);
                CommonUtil.__showSuccess(`${$dictionary.templates.singularTitle} created successfully`);
                AppTracker.trackEvent(TEMPLATE_CREATED, { "Template name": values.title });
            },
            errorCallBack: (error: any) => {
                setSubmitLoading({
                    loading: false,
                    text: "Create"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const useTemplate = () => {
        setCloneTemplateLoading({
            loading: true,
            text: "Creating..."
        })
        RoomTemplateAgent.cloneTemplate({
            variables: {
                templateUuid: selectedTemplate.uuid
            },
            onCompletion: (data: any) => {
                CommonUtil.__showSuccess("Template cloned successfully")
                onClose()
                setCloneTemplateLoading({
                    loading: false,
                    text: "Use this Template"
                })
                navigate(`/templates/${data.cloneTemplateFromDemoOrg.uuid}`)
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setCloneTemplateLoading({
                    loading: false,
                    text: "Use this Template"
                })
            }
        })
    }

    return (
        <div className="cm-height100">
            {
                content === "from_scratch"
                ?
                    <div className="cm-height100 cm-flex-center" style={{ backgroundColor: "#F5F7F9" }}>
                        <div className="cm-template-content">
                            <div className="cm-font-size22 cm-font-fam600">Create {$dictionary.templates.singularTitle} from scratch</div>
                            <Form
                                className   =   "cm-form"
                                form        =   {form}
                                onFinish    =   {onFinish}
                                layout      =   "vertical"
                                style       =   {{ marginTop: "15px" }}
                            >
                                <Form.Item name={"title"} label={"Title"} rules={[{ required: true, message: "Template name is required", whitespace: true }]}>
                                    <Input maxLength={Length_Input} autoFocus={true} placeholder={($isVendorMode || $isVendorOrg) ?"Eg: Buyerstage Content Hub" : "Eg: Deal room for enterprise"} size="large" />
                                </Form.Item>
                                <Form.Item name={"description"} label={"Description"}>
                                    <TextArea placeholder="Description" rows={5} />
                                </Form.Item>
                                <Form.Item name={"region"} label={"Region"}>
                                    <Select 
                                        showSearch 
                                        allowClear
                                        placeholder     =   "Select region" 
                                        options         =   {regions} 
                                        mode            =   'multiple' 
                                        optionFilterProp=   "label"
                                        size            =   "large" 
                                        suffixIcon      =   {<MaterialSymbolsRounded font="expand_more" size="18" />} 
                                    />
                                </Form.Item>
                                <Form.Item noStyle>
                                    <Button htmlType="submit" type="primary" className={`cm-flex-center cm-float-right cm-margin-top10 ${submitLoading.loading ? "cm-button-loading" : ""}`} disabled={submitLoading.loading}>
                                        <Space size={10}>
                                            <div className="cm-font-size14">{submitLoading.text}</div>
                                            {submitLoading.loading && <Loading color="#fff" />}
                                        </Space>
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                :
                    <div className="cm-padding15 cm-height100">
                        <Space className="cm-flex-space-between" style={{ marginBottom: "15px" }}>
                            <Space direction="vertical" size={3}>
                                <div className="cm-font-size18 cm-font-fam600">{selectedTemplate?.title}</div>
                                <Space size={0}>
                                    {
                                        selectedTemplate &&
                                            <div className="cm-flex-align-center" style={{ height: "22px" }}>
                                                <img height={15} src={BUYERSTAGE_PRODUCT_LOGO} alt="img" />
                                            </div>
                                    }
                                    {
                                        selectedTemplate && selectedTemplate.description && selectedTemplate.description !== "" ?
                                            <>
                                                <Divider type="vertical" />
                                                <Text className="cm-margin0 cm-flex-justify-center cm-dark-grey-text cm-font-size13" ellipsis={{ tooltip: selectedTemplate.description }} style={{ maxWidth: "calc(100vw - 800px)" }}>
                                                    {selectedTemplate.description}
                                                </Text>
                                            </>
                                        :
                                            null
                                    }
                                </Space>
                            </Space>
                            <Space size={25}>
                                {
                                    selectedTemplate?.previewLink &&
                                        <Space className="cm-flex-center cm-secondary-text cm-cursor-pointer" onClick={() => window.open(selectedTemplate.previewLink, "_blank")}>
                                            <MaterialSymbolsRounded font='open_in_new' size='18' />
                                            <div className='cm-font-fam500'>Preview</div>
                                        </Space>
                                }
                                {
                                    <Button onClick={() => useTemplate()} type='primary' className="cm-flex-center" disabled={cloneTemplateLoading.loading || !selectedTemplate}>
                                        <Space size={10}>
                                            <div>{cloneTemplateLoading.text}</div>
                                            {cloneTemplateLoading.loading && <Loading color="#fff" />}
                                        </Space>
                                    </Button>
                                }
                            </Space>
                        </Space>
                        <div style={{ paddingBlock: "15px" }} className="cm-padding15 j-template-image-card cm-flex-center">
                            {selectedTemplate?.previewLink ? <iframe frameBorder={"none"} height={"100%"} width={"100%"} src={selectedTemplate.previewLink} /> : <div className="cm-empty-text">No preview found</div>}
                        </div>
                    </div>
            }
        </div>
    )
}

export default ContentLayout