import { useQuery } from "@apollo/client";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, InputRef, Row, Select, Space, Tooltip } from "antd";

import { Length_Input } from "../../../constants/module-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_PERMISSION, ROLE_USER } from "../../../config/role-config";
import { USERS_ADDED } from "../../../tracker-constants";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { OWNER } from "../config/settings-config";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";
import { REGIONS } from "../api/settings-query";

import Loading from "../../../utils/loading";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { useForm } = Form;

const { Option } = Select;

interface AddUserProps {
    onClose: () => void;
}

const AddUser: FC<AddUserProps> = (props) => {

    const { onClose } = props;

    const [form] = useForm();

    const { $isVendorMode, $isVendorOrg, $orgDetail }   =   useContext(GlobalContext);

    const [selectedRegion, setSelectedRegion] = useState("")

    let remainingUser   =   $orgDetail.planDetail.remainingUsers;

    const { data: regionsData } = useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    const inputRef = useRef<InputRef>(null);
    const [submitState, setSubmitState] = useState({
        text: "Add",
        loading: false
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const regions = regionsData?.regions.map((region: any) => ({
        value: region.uuid,
        label: region.name,
    }));

    const onFinish = (values: any) => {

        setSubmitState({
            text: "Adding...",
            loading: true
        })

        SettingsAgent.addUser({
            variables: {
                input: {
                    emailId: values.emailId,
                    role: values.role,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    regionUuids: values.region
                }
            },
            onCompletion: () => {
                setSubmitState({
                    text: "Add",
                    loading: false
                })
                onClose();
                form.resetFields()
                CommonUtil.__showSuccess("Team Member added successfully");
                form.resetFields()
                AppTracker.trackEvent(USERS_ADDED, { "Added user email": values.emailId });
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text: "Add",
                    loading: false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const checkRoleOrgType = (role: string) => {
        if($isVendorMode || $isVendorOrg){
            if(ROLE_PERMISSION[role].orgTypes.includes("DPR")){
                return true
            }
            else return false
        }else if(ROLE_PERMISSION[role].orgTypes.includes("DSR")){
            return true
        }
        return false
    }

    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Add Team Member</div>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className='cm-form cm-modal-content'
            >
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "First name is required", whitespace: true }]}>
                            <Input ref={inputRef} placeholder="First Name" maxLength={Length_Input} size="large"></Input>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name" name="lastName">
                            <Input placeholder="Last Name" maxLength={Length_Input} size="large"></Input>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={"Email"} name="emailId" rules={[{ required: true, message: "Email is required", whitespace: true }]}>
                    <Input placeholder="Email" maxLength={Length_Input} size="large" />
                </Form.Item>

                {/* <Form.Item label="Calendar URL" name="calendarUrl">
                    <Input placeholder="Calendar URL" prefix={<MaterialSymbolsRounded font="link" size="20"/>} allowClear size="large"/>
                </Form.Item> */}

                <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role" }]}>
                    <Select
                        size                =   "large"
                        placeholder         =   "Select a role"
                        optionLabelProp     =   "label"
                        optionFilterProp    =   "label"
                        suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' />}
                        showSearch
                    >
                        {Object.values(ROLE_PERMISSION).map((_role: any) => {
                            const isDisabled = remainingUser < 1 && [ROLE_USER, ROLE_MANAGER, ROLE_ADMIN].includes(_role.role);
                            if(_role.role !== OWNER && checkRoleOrgType(_role.role)){
                                return (
                                    <Option key={_role.role} value={_role.role} label={_role.displayName} disabled={isDisabled}>
                                        <Tooltip title={isDisabled ? "You have reached the maximum limit of users" : ""} placement="top">
                                            <Space direction="vertical" size={4} className="cm-width100">
                                                <div className={isDisabled ? "cm-font-opacity-black-65" : ""}>{_role.displayName}</div>
                                                <div className={`cm-font-size12 ${isDisabled ? "cm-font-opacity-black-65" : ""}`}>{_role.permissionsDesc}</div>
                                            </Space>
                                        </Tooltip>
                                    </Option>
                                )
                            }
                            else{
                                return null
                            }
                        })}
                    </Select>
                </Form.Item>

                <Form.Item name={"region"} label={"Regions"}>
                    <Select 
                        showSearch 
                        placeholder         =   "Select region" 
                        options             =   {regions} 
                        size                =   "large" 
                        suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" />} 
                        value               =   {selectedRegion} 
                        onChange            =   {(selectedValues) => { setSelectedRegion(selectedValues) }} 
                        mode                =   "multiple" 
                        optionFilterProp    =   "label"
                    />
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" disabled={submitState.loading} onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                        <Space size={10}>
                            <div className="cm-font-size14">{submitState.text}</div>
                            {
                                submitState.loading && <Loading color="#fff" />
                            }
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </>
    );
}

export default AddUser