import { useEffect, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client';
import { Avatar, Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { HUBSPOT_CONTACTS_BY_DEAL, HUBSPOT_ROOM_TEMPLATES } from '../api/hubspot-query';
import { Length_Input } from '../../constants/module-constants';
import { ERROR_CONFIG } from '../../config/error-config';
import { CommonUtil } from '../../utils/common-util';
import { HubspotAgent } from '../api/hubspot-agent';
import { DEAL } from '../hubspot-constants';

import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';
import Loading from '../../utils/loading';

const { useForm }   =   Form;
const { Option }    =   Select; 

const CreateRoomForm = (props: {onClose: () => void}) => {

    const { onClose }   =   props;

    const [form]        =   useForm();

    let page            =   CommonUtil.__getQueryParams(window.location.search).page;
    let emailId         =   CommonUtil.__getQueryParams(window.location.search).email;
    let firstName       =   CommonUtil.__getQueryParams(window.location.search).firstName;
    let lastName        =   CommonUtil.__getQueryParams(window.location.search).lastName;
    let name            =   decodeURIComponent((CommonUtil.__getQueryParams(window.location.search).name + '').replace(/\+/g, '%20'))

    const [submitState, setSubmitState]         =   useState({
        loading :   false,
        text    :   "Create Room"
    });

    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [selectedEmail, setSelectedEmail] = useState(emailId);

    const { data: cData, loading: cLoading }  =   useQuery(HUBSPOT_CONTACTS_BY_DEAL, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true,
        variables: {
            dealId   :   CommonUtil.__getQueryParams(window.location.search).id
        }
    });

    const { data, loading, networkStatus, refetch }  =   useQuery(HUBSPOT_ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    })

    useEffect(() => {
        if(cData && page  === DEAL){
            form.setFieldsValue({
                ["contactId"]    :  page === DEAL ? cData._hsGetContactsByDeal.map((_contact: any) => _contact.emailId) : []
            })
        }
    }, [cData])

    useEffect(() => {
        if (selectedEmail && selectedTemplate) {
            const account = selectedEmail.split('@')[1]?.split('.')[0];
            const accountName = account ? account.charAt(0).toUpperCase() + account.slice(1) : '';
            form.setFieldsValue({
                roomName: `${accountName} <> ${selectedTemplate}`
            });
        }
    }, [selectedEmail, selectedTemplate]);

    const onTemplateChange = (_: any, option: any) => {
        const templateTitle = option?.generateTitle;
        setSelectedTemplate(templateTitle);
    };

    const refetchTemplates = () => {
        refetch()
    }

    const onFinish = (values: any) => {

        setSubmitState({
            loading: true,
            text:   "Creating..."
        })

        if(page === DEAL){
            let dealId      =   CommonUtil.__getQueryParams(window.location.search).id;
            let dealName    =   CommonUtil.__getQueryParams(window.location.search).name;

            let contacts: any = [];
            values.contactId.map((_contactId: any) => {
                const contactData = cData._hsGetContactsByDeal.find((_contact: any) => _contact.emailId === _contactId);
                if (contactData) {
                    contacts.push({ firstName: contactData.firstName, lastName: contactData.lastName, emailId: contactData.emailId });
                }
            });

            HubspotAgent.createRoomFromDeal({
                variables: {
                    dealId              :   dealId, 
                    name                :   dealName,
                    roomTemplateUuid    :   values.templateId,
                    roomName            :   values.roomName,
                    input               :   contacts.length > 0 ? contacts : null
                },
                onCompletion: () => {
                    setSubmitState({
                        loading: false,
                        text:   "Create room"
                    })
                    onClose()
                    CommonUtil.__showSuccess("Room created successfully")
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        loading: false,
                        text:   "Create room"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            let contactId      =   CommonUtil.__getQueryParams(window.location.search).id;
            let contactName    =   CommonUtil.__getQueryParams(window.location.search).name;
            
            HubspotAgent.createRoomFromContact({
                variables: {
                    contactId           :   contactId, 
                    name                :   contactName,
                    roomTemplateUuid    :   values.templateId,
                    roomName            :   values.roomName,
                    input               :   {
                        emailId     :    emailId,
                        firstName   :    firstName,
                        lastName    :    lastName 
                    }
                },
                onCompletion: () => {
                    setSubmitState({
                        loading: false,
                        text:   "Create room"
                    })
                    onClose()
                    CommonUtil.__showSuccess("Room created successfully")
                },
                errorCallBack: (error: any) => {
                    setSubmitState({
                        loading: false,
                        text:   "Create room"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    return (
        <>
            <div className="cm-modal-header cm-flex-align-center cm-margin-bottom5">
                <div className="cm-font-fam500 cm-font-size14">Create Room</div>
            </div>
            <Form 
                form        =   {form} 
                onFinish    =   {onFinish} 
                layout      =   "vertical"
                className   =   "hubspot-form cm-height100"
            >
                <div className='cm-modal-content'>
                    <Row gutter={25} className='cm-margin0'>
                        <Col span={22} style={{paddingRight: "0px !important"}} className='cm-padding-left0'>
                            <Form.Item
                                className   =   'j-hubspot-fi-has-extra' 
                                name        =   "templateId"
                                label       =   {"Templates"}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    style               =   {{height: "34px"}}
                                    loading             =   {loading}
                                    disabled            =   {loading}
                                    optionFilterProp    =   'filter'
                                    optionLabelProp     =   "label"
                                    placeholder         =   "Select template"
                                    listHeight          =   {150}
                                    notFoundContent     =   {
                                        <div style={{height:"50px"}} className='cm-flex-center'>
                                            <div className='cm-empty-text cm-font-size12'>No templates found</div>
                                        </div>
                                    }
                                    suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                                    onChange            =   {onTemplateChange}
                                >
                                    {data && data.roomTemplates.map((_template: any) => (
                                        <Option className={"j-hubspot-template-dropdown"} value={_template.uuid} filter={_template.title + _template.description} generateTitle={_template.title}
                                            label   =   {
                                                <div className="cm-font-size13">{_template.title}</div>
                                            }
                                        >
                                            <Space direction="vertical" size={0}>
                                                <div className="cm-font-fam500 cm-font-size13">{_template.title}</div>
                                                {
                                                    _template.description ?
                                                        <div className="cm-font-fam300 cm-font-size12">{_template.description}</div>
                                                    :
                                                        <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                                                }
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2} className="cm-float-right" style={{paddingLeft: "7px"}}>
                            <Form.Item label=" ">
                                <Avatar shape='square' className='j-hubspot-extra-reload-icon' icon=
                                    {
                                        networkStatus === 4 || loading ?
                                            <SyncOutlined spin />
                                        :
                                            <MaterialSymbolsRounded className='cm-cursor-pointer' font={"refresh"} size={"20"} onClick={refetchTemplates}/>
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name            =   "contactId"
                        rules           =   {[{
                            required    :   true,
                            message     :   "Choose a contact"
                        }]}
                        label           =   {"Contacts"}
                        initialValue    =   {emailId}
                    >
                        {
                            page === DEAL 
                            ?
                                <Select
                                    showSearch
                                    allowClear
                                    style               =   {{height: "34px"}}
                                    loading             =   {cLoading}
                                    disabled            =   {cLoading}
                                    optionFilterProp    =   'filter'
                                    optionLabelProp     =   "label"
                                    placeholder         =   "Select contact"
                                    mode                =   'multiple'
                                    maxTagCount         =   {2}
                                    listHeight          =   {150}
                                    notFoundContent     =   {
                                        <div style={{height:"50px"}} className='cm-flex-center'>
                                            <div className='cm-empty-text cm-font-size12'>No contacts found</div>
                                        </div>
                                    }
                                    suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                                >
                                    {cData && cData._hsGetContactsByDeal.map((_contact: any) => (
                                        <Option 
                                            value       =   {_contact.emailId} filter={_contact.name + _contact.emailId}
                                            disabled    =   {_contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId}
                                            label       =   {
                                                _contact.firstName ? <div className="cm-font-size12">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div> : <div className="cm-font-size12">{_contact.emailId}</div>
                                            }
                                        >
                                            <Space direction='vertical' size={0}>
                                                <div className="cm-font-fam500 cm-font-size13">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div>
                                                <div className="cm-font-size12">{(_contact.emailId && _contact.emailId !== "null" && _contact.emailId !== "") ? _contact.emailId : ""}</div>
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            :
                                <Input 
                                    style               =   {{height: "34px"}}
                                    placeholder         =   "Contact's email will be auto filled"
                                    onChange            =   {(e) => setSelectedEmail(e.target.value)}
                                    disabled            =   {true}
                                />
                        }   
                    </Form.Item>
                    <Form.Item 
                        label           =   "Room Name" 
                        name            =   "roomName"
                        rules           =   {[{
                            required    :   true,
                            message     :   "Room name is required"
                        }]}
                        initialValue    =   {page === DEAL ? name : undefined}
                    >
                        <Input allowClear maxLength={Length_Input} placeholder="Acme Inc <> Salesforce"/>
                    </Form.Item>
                </div>

                <div className='cm-modal-footer cm-flex-align-center'>
                    <Form.Item noStyle>
                        <Button type='primary' className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} htmlType="submit" disabled={submitState.loading}>
                            <Space size={10}>
                                <div>{submitState.text}</div>
                                {
                                    submitState.loading && <Loading color="#fff"/>
                                }
                            </Space>
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    )
}

export default CreateRoomForm