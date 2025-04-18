import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Avatar, Button, Checkbox, Form, Input, Select, Space } from "antd";
import { GlobalContext } from "../../../../globals";
import { useNavigate } from "react-router-dom";
import { ROOM_TEMPLATES } from "../../../templates/api/room-templates-query";
import { ACCOUNTS } from "../../../accounts/api/accounts-query";
import { RoomsAgent } from "../../api/rooms-agent";
import { CommonUtil } from "../../../../utils/common-util";
import { AppTracker } from "../../../../app-tracker";
import { ROOM_CREATED } from "../../../../tracker-constants";
import { ERROR_CONFIG } from "../../../../config/error-config";
import CRMSearch from "../crm-search";
import { checkPermission } from "../../../../config/role-permission";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import EmptyText from "../../../../components/not-found/empty-text";
import CompanyAvatar from "../../../../components/avatars/company-avatar";
import { ACCOUNT_TYPE_DSR, Length_Input } from "../../../../constants/module-constants";
import Loading from "../../../../utils/loading";
import AccountModal from "../../../accounts/account-form/account-modal";
import { FEATURE_ACCOUNTS } from "../../../../config/role-permission-config";
import { RoomTemplateAgent } from "../../../templates/api/room-template-agent";

const { Option } = Select;
const { useForm } = Form;

const UseRoomTemplateForm = (props: { onClose: () => void, accountId?: string, isTemplateSelected: any }) => {

    const { onClose, accountId, isTemplateSelected } = props;

    const { $user, $orgDetail, $accountType, $limits, $entityCount } = useContext(GlobalContext);

    const [form] = useForm();
    const navigate = useNavigate();

    const [showCreate, setShowCreate] = useState(false)
    const [submitState, setSubmitState] = useState({
        loading: false,
        text: "Create"
    });
    const [selectedValues, setSelectedValues] = useState({
        templateName: "",
        accountName: ""
    });

    const { data, loading, networkStatus } = useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true
    });

    const { data: aData, loading: aLoading} = useQuery(ACCOUNTS, {
        fetchPolicy: "network-only",
        variables: {
            pageConstraint: {
                page: 1,
                limit: 1000
            }
        },
        notifyOnNetworkStatusChange: true
    });

    const handleAccountChange = (_: any, event: any) => {
        setSelectedValues({
            ...selectedValues,
            accountName: event.generateTitle
        })
    }

    useEffect(() => {
        form.setFieldsValue({
            roomName: isTemplateSelected?.templateData?.title && selectedValues?.accountName ? `${selectedValues?.accountName} <> ${isTemplateSelected?.templateData.title}` : selectedValues?.accountName
        });
    }, [selectedValues.accountName])

    useEffect(() => {
        if (accountId && aData) {
            let currentAccount = aData.accounts.filter((_account: any) => _account.uuid === accountId)[0];
            setSelectedValues({
                ...selectedValues,
                accountName: currentAccount.companyName
            })
        }
    }, [data])

    const onFinish = (values: any) => {
        setSubmitState({
            loading: true,
            text: "Creating..."
        })

        if (!isTemplateSelected.id && !isTemplateSelected.isPreBuildTemp) {            
            RoomsAgent.createRoomV2({
                variables: {
                    input: {
                        title: values.roomName,
                        templateUuid: isTemplateSelected.id,
                        accountUuid: values.accountId,
                        enableDiscovery: values.discoveryAutomation ? values.discoveryAutomation : false,
                        crmInfoInput: values.crmEntity ?
                            {
                                type: "deal",
                                id: values.crmEntity.key,
                                name: values.crmEntity.title
                            } : undefined
                    }
                },
                onCompletion: (data: any) => {
                    RoomsAgent.initializeRoom({
                        variables: {
                            roomUuid: data?.createRoomV2?.uuid,
                            sectionConfig: isTemplateSelected.templateType
                        },
                        onCompletion: () => {
                            onClose();
                            CommonUtil.__showSuccess("Room created successfully");
                            AppTracker.trackEvent(ROOM_CREATED, { "Room name": values.roomName });
                            navigate(`/rooms/${values?.accountId}/${data?.createRoomV2?.uuid}/sections`)
                        },
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        loading: false,
                        text: "Create"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } else if (isTemplateSelected.isPreBuildTemp) {

            RoomTemplateAgent.cloneTemplate({
                variables: {
                    templateUuid: isTemplateSelected.id
                },
                onCompletion: (data: any) => {
                    RoomsAgent.createRoomV2({
                        variables: {
                            input: {
                                title: values.roomName,
                                templateUuid: data.cloneTemplateFromDemoOrg.uuid,
                                accountUuid: values.accountId,
                                enableDiscovery: values.discoveryAutomation ? values.discoveryAutomation : false,
                                crmInfoInput: values.crmEntity ?
                                    {
                                        type: "deal",
                                        id: values.crmEntity.key,
                                        name: values.crmEntity.title
                                    } : undefined
                            }
                        },
                        onCompletion: (roomData: any) => {
                            onClose();
                            CommonUtil.__showSuccess("Room created successfully");
                            AppTracker.trackEvent(ROOM_CREATED, { "Room name": values.roomName });
                            navigate(`/rooms/${values?.accountId}/${roomData?.createRoomV2?.uuid}/sections`)
                        },
                        errorCallBack: (error: any) => {
                            setSubmitState({
                                loading: false,
                                text: "Create"
                            })
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
                    onClose()
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } else {
            RoomsAgent.createRoomV2({
                variables: {
                    input: {
                        title: values.roomName,
                        templateUuid: isTemplateSelected.id,
                        accountUuid: values.accountId,
                        enableDiscovery: values.discoveryAutomation ? values.discoveryAutomation : false,
                        crmInfoInput: values.crmEntity ?
                            {
                                type: "deal",
                                id: values.crmEntity.key,
                                name: values.crmEntity.title
                            } : undefined
                    }
                },
                onCompletion: (data: any) => {
                    onClose();
                    CommonUtil.__showSuccess("Room created successfully");
                    AppTracker.trackEvent(ROOM_CREATED, { "Room name": values.roomName });
                    navigate(`/rooms/${values?.accountId}/${data?.createRoomV2?.uuid}/sections`)

                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        loading: false,
                        text: "Create"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const setAccount = (createdAccount: any) => {
        if (networkStatus !== 4 && !loading) {
            form.setFieldsValue({
                ["accountId"]: createdAccount.uuid,
            })
            setSelectedValues({
                ...selectedValues,
                accountName: createdAccount.companyName
            })
        }
    }

    const checkAccountsLimit = () => {
        if ($limits && $limits.accountLimit && parseInt($limits.accountLimit) !== -1) {
            if ($entityCount.accountsCount >= parseInt($limits.accountLimit)) {
                return false
            } else {
                return true
            }
        } else return true
    }

    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">New Room</div>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="cm-form cm-modal-content"
            >
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px"}}>
                    <div className="cm-width100">
                        <Form.Item
                            className="cm-width100"
                            name="accountId"
                            rules={[{
                                required: true,
                                message: "Choose an account"
                            }]}
                            initialValue={accountId}
                            label={
                                <>
                                    Account
                                </>
                            }
                        >
                            <Select
                                showSearch
                                allowClear
                                loading={aLoading}
                                disabled={aLoading}
                                size='large'
                                optionFilterProp='filter'
                                optionLabelProp="label"
                                placeholder="Select account"
                                suffixIcon={<MaterialSymbolsRounded font="expand_more" size="18" />}
                                notFoundContent={
                                    <div style={{ height: "50px" }}>
                                        <EmptyText text="No accounts found" />
                                    </div>
                                }
                                onChange={(value, event) => handleAccountChange(value, event)}
                            >
                                {aData && aData.accounts.map((_account: any) => (
                                    <Option value={_account.uuid} filter={_account.companyName + _account.industryType} generateTitle={_account.companyName}
                                        label={
                                            <Space className="cm-flex">
                                                <Avatar size={25} shape='square' style={{ backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", alignItems: "center" }} src={_account.logoUrl ? <img src={_account.logoUrl} alt={_account.companyName} style={{ borderRadius: "4px" }} /> : ""}>
                                                    {CommonUtil.__getAvatarName(_account.companyName, 1)}
                                                </Avatar>
                                                <div className="cm-font-size14">{_account.companyName}</div>
                                            </Space>
                                        }
                                    >
                                        <Space>
                                            <CompanyAvatar size={35} company={_account} />
                                            <Space direction="vertical" size={0}>
                                                <div className="cm-font-fam500 cm-font-size14">{_account.companyName}</div>
                                                <div className="cm-font-fam300 cm-font-size12">{_account.industryType}</div>
                                            </Space>
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    {
                        checkAccountsLimit() && checkPermission($user.role, FEATURE_ACCOUNTS, 'create') &&
                        <Form.Item label="" noStyle>
                            <Avatar shape='square' style={{marginTop: "15px"}} className='j-acc-template-icon' icon=
                                {
                                    aLoading 
                                        ? <Loading /> 
                                        : <MaterialSymbolsRounded className='cm-cursor-pointer' font={"add"} size={"22"} onClick={() => setShowCreate(true)} />
                                }
                            />
                        </Form.Item>
                    }
                </div>
                {$orgDetail?.crmDetail?.serviceName && <CRMSearch />}
                <Form.Item label="Room Name" name="roomName"
                    rules={[{
                        required: true,
                        message: "Room name is required"
                    }]}
                >
                    <Input className="cm-font-fam500" allowClear maxLength={Length_Input} placeholder="Acme Inc <> Salesforce" size="large" />
                </Form.Item>
                {
                    form.getFieldsValue().templateId && $orgDetail.tenantName !== "kissflow" && !($accountType === ACCOUNT_TYPE_DSR)
                    &&
                    <Form.Item name="discoveryAutomation" valuePropName="checked">
                        <Checkbox className="cm-margin-top20 cm-font-size13 cm-font-fam500">
                            Enable Discovery Automation
                        </Checkbox>
                    </Form.Item>
                }

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
            <AccountModal isOpen={showCreate} onClose={() => setShowCreate(false)} getCreatedAccount={(createdAccount: any) => setAccount(createdAccount)} />
        </>
    )
}

export default UseRoomTemplateForm