import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Avatar, Button, Checkbox, Col, Form, Input, Row, Select, Space, Typography } from "antd";
import { SyncOutlined } from '@ant-design/icons';

import { FEATURE_ACCOUNTS, FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { ROOM_TEMPLATES } from "../../templates/api/room-templates-query";
import { ACCOUNT_TYPE_DSR, Length_Input } from "../../../constants/module-constants";
import { checkPermission } from "../../../config/role-permission";
import { ACCOUNTS } from "../../accounts/api/accounts-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { ROOM_CREATED } from "../../../tracker-constants";
import { CommonUtil } from "../../../utils/common-util";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";
import { useNavigate } from "react-router-dom";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import CompanyAvatar from "../../../components/avatars/company-avatar";
import AccountModal from "../../accounts/account-form/account-modal";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";
import CRMSearch from "./crm-search";

const { Option }    =   Select;
const { useForm }   =   Form;
const { Text }      =   Typography;

const RoomForm = (props: {onClose: () => void, accountId?: string}) => {

    const { onClose, accountId }   =   props;

    const { $user, $orgDetail, $accountType, $limits, $entityCount }    =   useContext(GlobalContext);

    const [form]    =   useForm();
    const navigate  =   useNavigate();
    
    const [showCreate, setShowCreate]           =   useState(false);
    const [submitState, setSubmitState]         =   useState({
        loading :   false,
        text    :   "Create"
    });
    const [selectedValues, setSelectedValues]   =   useState({
        templateName    :   "",
        accountName     :   ""
    });

    const { data, loading, networkStatus, refetch }      =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    });

    const { data: aData, loading: aLoading, networkStatus: aNetworkStatus, refetch: aRefetch }      =   useQuery(ACCOUNTS, {
        fetchPolicy: "network-only",
        variables: {
            pageConstraint: {
                page: 1,
                limit: 1000
            }
        },
        notifyOnNetworkStatusChange : true
    });

    const refetchTemplates = () => {
        refetch()
    }

    const refetchAccounts = () => {
        aRefetch()
    }

    const handleTemplateChange = (templateId: string, event: any) => {
        setSelectedValues({
            ...selectedValues,
            templateName: event.generateTitle,
        })
        form.setFieldsValue({
            ["discoveryAutomation"]  : data.roomTemplates.filter((_template: any) => _template.uuid === templateId)[0].isDiscoveryEnabled
        })
    }

    const handleAccountChange = (_: any, event: any) => {
        setSelectedValues({
            ...selectedValues,
            accountName: event.generateTitle
        })
    }

    useEffect(() => {
        if(accountId && aData){    
            let currentAccount = aData.accounts.filter((_account: any) => _account.uuid === accountId)[0];
            setSelectedValues({
                ...selectedValues,
                accountName : currentAccount.companyName
            })
        }
    }, [data])

    useEffect(() => {
        if(selectedValues.accountName && selectedValues.templateName){
            form.setFieldsValue({
                ["roomName"]    :   selectedValues.accountName + " <> " + selectedValues.templateName
            })
        }
    }, [selectedValues.templateName, selectedValues.accountName])
    
    const onFinish = (values: any) => {
        
        setSubmitState({
            loading: true,
            text:   "Creating..."
        })

        RoomsAgent.createRoomV2({
            variables: {
                input : {
                    title           :   values.roomName, 
                    templateUuid    :   values.templateId, 
                    accountUuid     :   values.accountId,
                    enableDiscovery :   values.discoveryAutomation ? values.discoveryAutomation : false,
                    crmInfoInput    :   values.crmEntity ?
                    {
                        type  :   "deal",
                        id    :   values.crmEntity.key,
                        name  :   values.crmEntity.title
                    }   :   undefined
                }
            },
            onCompletion: (data: any) => {
                onClose();
                CommonUtil.__showSuccess("Room created successfully");
                AppTracker.trackEvent(ROOM_CREATED, {"Room name": values.roomName});
                navigate(`/rooms/${values?.accountId}/${data?.createRoomV2?.uuid}/sections`)
                
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading: false,
                    text:   "Create"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const navigateToNew = (key: string) => {
        let templateUrl = window.location.origin + window.location.pathname + "#/" + key;
        window.open(templateUrl, "_blank")
    }

    const setAccount  = (createdAccount: any) => {
        if(networkStatus !== 4 && !loading){
            form.setFieldsValue({
                ["accountId"]      :   createdAccount.uuid,
            })
            setSelectedValues({
                ...selectedValues,
                accountName: createdAccount.companyName
            })
        }
    }

    const checkAccountsLimit = () => {
        if($limits && $limits.accountLimit && parseInt($limits.accountLimit) !== -1){
            if( $entityCount.accountsCount >= parseInt($limits.accountLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    const checkTemplatesLimit = () => {
        if($limits && $limits.templateLimit && parseInt($limits.templateLimit) !== -1){
            if( $entityCount.templatesCount >= parseInt($limits.templateLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    return (
        <>                
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Create Room</div>
            <Form 
                form        =   {form} 
                onFinish    =   {onFinish} 
                layout      =   "vertical"
                className   =   "cm-form cm-modal-content"
            >
                { $orgDetail?.crmDetail?.serviceName && <CRMSearch/> }
                <Row gutter={25}>
                    <Col span={22} style={{paddingRight: "0px !important"}}>
                        <Form.Item
                            className   =   'j-fi-has-extra' 
                            name        =   "templateId"
                            label       =   {
                                <>
                                    Templates
                                    {
                                        checkTemplatesLimit() ? 
                                            checkPermission($user.role, FEATURE_TEMPLATES, 'create') && <div className="j-fi-extra j-hyperlink-text" onClick={() => navigateToNew("templates")}>Create Template</div>
                                        :   
                                            null
                                    }
                                </>
                            }
                        >
                            <Select
                                showSearch
                                allowClear
                                loading             =   {loading}
                                disabled            =   {loading}
                                size                =   'large'
                                optionFilterProp    =   'filter'
                                optionLabelProp     =   "label"
                                placeholder         =   "Select template"
                                suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                notFoundContent     =   {
                                    <div style={{height:"50px"}}>
                                        <EmptyText text="No templates found"/>
                                    </div>
                                }
                                onChange            =   {(value, event) => handleTemplateChange(value, event)}
                            >
                                {data && data.roomTemplates.map((_template: any) => (
                                    <Option value={_template.uuid} filter={_template.title + _template.description} generateTitle={_template.title}
                                        label   =   {
                                            <div className="cm-font-size14">{_template.title}</div>
                                        }
                                    >
                                        <Space direction="vertical" className="cm-width100" size={2}>
                                            <div className="cm-font-fam500 cm-font-size14">{_template.title}</div>
                                            {
                                                _template.description ?
                                                    <Text className="cm-font-fam300 cm-font-size12" style={{maxWidth: "calc(100% - 10px)"}} ellipsis={{tooltip: _template.description}}>{_template.description}</Text>
                                                :
                                                    <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                                            }
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={2} className="cm-float-right">
                        <Form.Item label=" ">
                            <Avatar shape='square' className='j-acc-template-icon' icon=
                                {
                                    networkStatus === 4 || loading ?
                                        <SyncOutlined spin />
                                    :
                                        <MaterialSymbolsRounded className='cm-cursor-pointer' font={"refresh"} size={"22"} onClick={refetchTemplates}/>
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={25}>
                    <Col span={22} style={{paddingRight: "0px !important"}}>
                        <Form.Item
                            className   =   'j-fi-has-extra' 
                            name        =   "accountId"
                            rules       =   {[{
                                required    :   true,
                                message     :   "Choose an account"
                            }]}
                            initialValue=   {accountId}
                            label       =   {
                                <>
                                    Account
                                    {
                                        checkAccountsLimit() ? 
                                            checkPermission($user.role, FEATURE_ACCOUNTS, 'create') && <div className="j-fi-extra j-hyperlink-text" onClick={() => setShowCreate(true)}>Create account</div>
                                        :
                                            null
                                    }
                                </>
                            } 
                        >
                            <Select
                                showSearch
                                allowClear
                                loading             =   {aLoading}
                                disabled            =   {aLoading}
                                size                =   'large'
                                optionFilterProp    =   'filter'
                                optionLabelProp     =   "label"
                                placeholder         =   "Select account"
                                suffixIcon              =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                notFoundContent     =   {
                                    <div style={{height:"50px"}}>
                                        <EmptyText text="No accounts found"/>
                                    </div>
                                }
                                onChange            =   {(value, event) => handleAccountChange(value, event)}
                            >
                                {aData && aData.accounts.map((_account: any) => (
                                    <Option value={_account.uuid} filter={_account.companyName + _account.industryType} generateTitle={_account.companyName}
                                        label   =   {
                                            <Space className="cm-flex">
                                                <Avatar size={25} shape='square' style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", alignItems: "center" }} src={_account.logoUrl ? <img src={_account.logoUrl} alt={_account.companyName} style={{borderRadius: "4px"}}/> : ""}>
                                                    {CommonUtil.__getAvatarName(_account.companyName,1)}
                                                </Avatar>
                                                <div className="cm-font-size14">{_account.companyName}</div>
                                            </Space>
                                        }
                                    >
                                        <Space>
                                            <CompanyAvatar size={35} company={_account}/>
                                            <Space direction="vertical" size={0}>
                                                <div className="cm-font-fam500 cm-font-size14">{_account.companyName}</div>
                                                <div className="cm-font-fam300 cm-font-size12">{_account.industryType}</div>
                                            </Space>
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={2} className="cm-float-right">
                        <Form.Item label=" ">
                            <Avatar shape='square' className='j-acc-template-icon' icon=
                                {
                                    aNetworkStatus === 4 || aLoading ?
                                        <SyncOutlined spin />
                                    :
                                        <MaterialSymbolsRounded className='cm-cursor-pointer' font={"refresh"} size={"22"} onClick={refetchAccounts}/>
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Room Name" name="roomName"
                    rules       =   {[{
                        required    :   true,
                        message     :   "Room name is required"
                    }]}
                >
                    <Input className="cm-font-fam500" allowClear maxLength={Length_Input} placeholder="Acme Inc <> Salesforce" size="large"/>
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
                                submitState.loading && <Loading color="#fff"/>
                            }
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
            <AccountModal isOpen={showCreate} onClose={() => setShowCreate(false)} getCreatedAccount={(createdAccount: any) => setAccount(createdAccount)}/>
        </>
    )
}

export default RoomForm