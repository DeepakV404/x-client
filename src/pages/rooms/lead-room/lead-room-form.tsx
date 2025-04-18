import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Avatar, Button, Col, Form, Input, InputRef, Row, Select, Space, Typography } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import { ROOM_TEMPLATES } from '../../templates/api/room-templates-query';
import { ACCOUNTS } from '../../accounts/api/accounts-query';
import { FEATURE_ACCOUNTS } from '../../../config/role-permission-config';
import { checkPermission } from '../../../config/role-permission';
import { LEAD_ROOM_CREATED } from '../../../tracker-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { AppTracker } from '../../../app-tracker';
import { GlobalContext } from '../../../globals';
import { RoomsAgent } from '../api/rooms-agent';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CompanyAvatar from '../../../components/avatars/company-avatar';
import AccountModal from '../../accounts/account-form/account-modal';
import EmptyText from '../../../components/not-found/empty-text';
import Loading from '../../../utils/loading';

const { useForm }   =   Form;
const { Option }    =   Select;
const { Text }      =   Typography;

const LeadRoomForm = (props: {onClose: () => void }) => {

    const { onClose }   =   props;

    const [form]            =   useForm();

    const inputRef          =   useRef<InputRef>(null);

    const { $dictionary, $isVendorMode, $isVendorOrg, $user, $limits, $entityCount }   =   useContext(GlobalContext);

    const { data: rtData, loading: rtLoading, networkStatus, refetch }      =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    });

    const refetchTemplates = () => {
        refetch()
    }

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

    const refetchAccounts = () => {
        aRefetch()
    }

    const [showCreate, setShowCreate]           =   useState(false);
    const [submitState, setSubmitState]         =   useState({
        text: "Create",
        loading: false
    });

    const [selectedValues, setSelectedValues]   =   useState({
        templateName    :   "",
        accountName     :   ""
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const onFinish = (values: any) => {
       
        setSubmitState({
            text: "Creating...",
            loading: true
        })

        const discoveryEnabled  = rtData?.roomTemplates.filter((_template: any) => _template.uuid === values.templateId)[0]?.isDiscoveryEnabled;

        RoomsAgent.createLeadRoom({
            variables: {
                input: {
                    templateUuid    :   values.templateId,
                    enableDiscovery :   discoveryEnabled,
                    emailId         :   values.email,
                    accountUuid     :   values.accountId
                },
            },
            onCompletion: (data: any) => {
                setSubmitState({
                    text: "Create",
                    loading: false
                })
                onClose();
                CommonUtil.__showSuccess(`${$dictionary.rooms.title} created successfully`)
                AppTracker.trackEvent(LEAD_ROOM_CREATED, {"lead-room-created" : data.createLeadRoom.title});
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text: "Create",
                    loading: false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })

    }
    
    const navigateToNew = (key: string) => {
        let templateUrl = window.location.origin + window.location.pathname + "#/" + key;
        window.open(templateUrl, "_blank")
    }

    const handleTemplateChange = (event: any) => {
        setSelectedValues({
            ...selectedValues,
            templateName: event.generateTitle,
        })
    }

    const handleAccountChange = (_: any, event: any) => {
        setSelectedValues({
            ...selectedValues,
            accountName: event.generateTitle
        })
    }

    const setAccount  = (createdAccount: any) => {
        if(networkStatus !== 4 && !rtLoading){
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
            if($entityCount.accountsCount >= parseInt($limits.accountLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    const checkTemplatesLimit = () => {
        if($limits && $limits.templateLimit && parseInt($limits.templateLimit) !== -1){
            if($entityCount.templatesCount >= parseInt($limits.templateLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }


    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Create Lead</div>
            <Form
                form        =   {form}
                layout      =   "vertical"
                className   =   'cm-form cm-modal-content'
                onFinish    =   {onFinish}
            >

                <Form.Item label={`${$dictionary.rooms.singularTitle} Email`} name="email" rules={[{ required: true, message: "Enter a work email" }]}>
                    <Input placeholder="Eg: name@workemail.com" size="large" prefix={<MaterialSymbolsRounded font="email" size="20" color='#bebebe'/>}/>
                </Form.Item>

                <Row gutter={25}>
                    <Col span={22} style={{paddingRight: "0px !important"}}>
                        <Form.Item
                            className   =   'j-fi-has-extra' 
                            name        =   "accountId"
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

                <Row gutter={25}>
                    <Col span={22} style={{paddingRight: "0px !important"}}>
                        <Form.Item
                            className   =   'j-fi-has-extra' 
                            name        =   "templateId"
                            label       =   {
                                <>
                                    {$dictionary.templates.title}
                                    {
                                        checkTemplatesLimit() ? 
                                            ($isVendorOrg || $isVendorMode) && <div className="j-fi-extra j-hyperlink-text" onClick={() => navigateToNew("templates")}>Create {$dictionary.templates.singularTitle.toLowerCase()}</div>
                                        :
                                            null
                                    }
                                </>
                            }
                        >
                            <Select
                                showSearch
                                allowClear
                                loading             =   {rtLoading}
                                disabled            =   {rtLoading}
                                size                =   'large'
                                optionFilterProp    =   'filter'
                                optionLabelProp     =   "label"
                                placeholder         =   {`Select ${$dictionary.templates.singularTitle.toLowerCase()}`}
                                suffixIcon              =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                                notFoundContent     =   {
                                    <div style={{height:"50px"}}>
                                        <EmptyText text={`No ${$dictionary.templates.title.toLowerCase()} found`}/>
                                    </div>
                                }
                                onChange            =   {(_, event) => handleTemplateChange(event)}
                            >
                                {rtData && rtData.roomTemplates.map((_template: any) => (
                                    <Option value={_template.uuid} filter={_template.title + _template.description} generateTitle={_template.title}
                                        label   =   {
                                            <div className="cm-font-fam500 cm-font-size14">{_template.title}</div>
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
                                    networkStatus === 4 || rtLoading ?
                                        <SyncOutlined spin />
                                    :
                                        <MaterialSymbolsRounded className='cm-cursor-pointer' font={"refresh"} size={"22"} onClick={refetchTemplates}/>
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn" disabled={submitState.loading} onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                        <Space size={10}>
                            <div className="cm-font-size14">{submitState.text}</div>
                            {submitState.loading && <Loading color="#fff"/>}
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
            <AccountModal isOpen={showCreate} onClose={() => setShowCreate(false)} getCreatedAccount={(createdAccount: any) => setAccount(createdAccount)}/>
        </>
    )
}

export default LeadRoomForm