import { useContext, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GlobalContext } from "../../../../globals";
import { REGIONS } from "../../../settings/api/settings-query";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { CommonUtil } from "../../../../utils/common-util";
import { TEMPLATE_CREATED } from "../../../../tracker-constants";
import { AppTracker } from "../../../../app-tracker";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { Length_Input } from "../../../../constants/module-constants";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import Loading from "../../../../utils/loading";

const { TextArea } = Input;
const { useForm } = Form;

const UseTemplateForm = (props: {onClose: () => void, isTemplateSelected: any}) => {

    const { onClose, isTemplateSelected }   =   props

    const { $dictionary, $isVendorMode, $isVendorOrg}   =   useContext(GlobalContext);

    const [form] = useForm();
    const navigate = useNavigate();

    const [submitLoading, setSubmitLoading] = useState({
        loading: false,
        text: `Create ${$dictionary.templates.singularTitle}`
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
        if(isTemplateSelected.preBuildTemplate) {
            RoomTemplateAgent.cloneTemplate({
                variables: {
                    templateUuid: isTemplateSelected.id
                },
                onCompletion: (data: any) => {
                    CommonUtil.__showSuccess("Template cloned successfully")
                    onClose()
                    navigate(`/templates/${data.cloneTemplateFromDemoOrg.uuid}`)
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } else {
            RoomTemplateAgent.createRoomTemplate({
                variables: {
                    input: {
                        title: values.title,
                        description: values.description,
                        regionsUuid: values.region
                    }
                },
                onCompletion: (data: any) => {
                    RoomTemplateAgent.initializeTemplate({
                        variables : {
                            templateUuid   :  data.createRoomTemplate.uuid,
                            sectionConfig  :  isTemplateSelected.templateType
                        },
                        onCompletion: () => {
                            onClose
                            navigate(`${data.createRoomTemplate.uuid}`);
                            CommonUtil.__showSuccess(`${$dictionary.templates.singularTitle} created successfully`);
                            AppTracker.trackEvent(TEMPLATE_CREATED, { "Template name": values.title });
                        },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
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
    }

    return (
        <div className="cm-height100">
            {
                <div className="cm-height100 cm-flex-center" style={{ backgroundColor: "#F5F7F9" }}>
                    <div className="cm-template-content">
                        <div className="cm-font-size22 cm-font-fam600">New {$dictionary.templates.singularTitle}</div>
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
            }
        </div>
    )
}

export default UseTemplateForm