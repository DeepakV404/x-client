import { useEffect, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client';
import { Avatar, Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { SFDC_CONTACTS_BY_OPPORTUNITY, SFDC_ROOM_TEMPLATES } from '../api/sfdc-query';
import { Length_Input } from '../../constants/module-constants';
import { ERROR_CONFIG } from '../../config/error-config';
import { CommonUtil } from '../../utils/common-util';
import { SFDCAgent } from '../api/sfdc-agent';

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

    const { data: cData, loading: cLoading }  =   useQuery(SFDC_CONTACTS_BY_OPPORTUNITY, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true,
        variables: {
            opportunityId   :   CommonUtil.__getQueryParams(window.location.search).id, 
        }
    });

    const { data, loading, networkStatus, refetch }  =   useQuery(SFDC_ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    })

    useEffect(() => {
        if(cData && page === 'opportunity'){
            form.setFieldsValue({
                ["contactId"]   :  page === "opportunity" ? cData._sfdcGetContactsByOpportunity
                                                                .map((_contact: any) => (_contact.emailId && _contact.emailId !== "") && _contact.emailId).filter(Boolean) : []
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

        if(page === "lead"){
            let leadId      =   CommonUtil.__getQueryParams(window.location.search).id;
            let leadName    =   CommonUtil.__getQueryParams(window.location.search).name;

            SFDCAgent.createRoomFromLead({
                variables: {
                    leadId              :   leadId,
                    name                :   leadName, 
                    roomTemplateUuid    :   values.templateId,
                    roomName            :   values.roomName,
                    input : {
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
        }else{
            let opportunityId      =   CommonUtil.__getQueryParams(window.location.search).id;
            let leadName           =   CommonUtil.__getQueryParams(window.location.search).name;
            
            let contacts: any = [];
            values.contactId.map((_contactId: any) => {
                const contactData = cData._sfdcGetContactsByOpportunity.find((_contact: any) => _contact.emailId === _contactId);
                if (contactData) {
                    contacts.push({ firstName: contactData.firstName, lastName: contactData.lastName, emailId: contactData.emailId });
                }
            });

            SFDCAgent.createRoomFromOpportunity({
                variables: {
                    opportunityId       :   opportunityId,
                    name                :   leadName,
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
        }
    }

    return (
        <>
            <div className="j-sfdc-modal-header cm-flex-align-center">
                <div className="cm-font-size14 cm-font-fam500">Create Room</div>
            </div>
            <Form 
                form        =   {form} 
                onFinish    =   {onFinish} 
                layout      =   "vertical"
                className   =   "sfdc-form cm-height100"
            >
                <div className='cm-modal-content'>
                    <Row gutter={25} className='cm-margin0'>
                        <Col span={22} style={{paddingRight: "0px !important"}} className='cm-padding-left0'>
                            <Form.Item
                                className   =   'j-sfdc-fi-has-extra' 
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
                                    onChange={onTemplateChange}
                                >
                                    {data && data.roomTemplates.map((_template: any) => (
                                        <Option className={"j-sfdc-template-dropdown"} value={_template.uuid} filter={_template.title + _template.description} generateTitle={_template.title}
                                            label   =   {
                                                <div className="cm-font-size12">{_template.title}</div>
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
                                <Avatar shape='square' className='j-sfdc-extra-reload-icon' icon=
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
                        label           =   {"Contact"}
                        initialValue    =   {emailId ? emailId : []}
                    >
                        {
                            page === "opportunity" 
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
                                    maxTagCount         =    {2}
                                    listHeight          =   {150}
                                    notFoundContent     =   {
                                        <div style={{height:"50px", flexDirection: "column"}} className='cm-flex-center'>
                                            <div className='cm-font-opacity-black-85 cm-font-size12'>No contacts found</div>
                                            <div className='cm-font-opacity-black-85 cm-font-size11'>Add contacts to your opportunity</div>
                                        </div>
                                    }
                                    suffixIcon          =   {<MaterialSymbolsRounded font='expand_more' size='18'/>}
                                >
                                    {cData && cData._sfdcGetContactsByOpportunity.map((_contact: any) => (
                                        <Option 
                                            value     =   {_contact.emailId} 
                                            filter    =   {_contact.name + _contact.emailId}
                                            disabled  =   {_contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId}
                                            label     =   {_contact.emailId ? <div className="cm-font-size12">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div> : null}
                                        >
                                            <Space direction='vertical' size={0}>
                                                <div className="cm-font-fam500 cm-font-size13">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div>
                                                <div className="cm-font-size12">{(_contact.emailId && _contact.emailId !== "null" && _contact.emailId !== "") ? _contact.emailId : <span className='cm-font-opacity-black-67'>No email found</span>}</div>
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            :
                                <Input 
                                    className           =   'j-sfdc-email-input'
                                    placeholder         =   "Enter email"
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
                        initialValue    =   {page === "opportunity" ? name : undefined}
                    >
                        <Input rootClassName='j-sfdc-create-room-room-name-input' allowClear maxLength={Length_Input} placeholder="Acme Inc <> Salesforce"/>
                    </Form.Item>
                </div>

                <div className='j-sfdc-modal-footer cm-flex-align-center' style={{justifyContent: "flex-end"}}>
                    <Form.Item noStyle>
                        <Button type='primary' className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} htmlType="submit" disabled={submitState.loading}>
                            <Space size={10}>
                                <div className="cm-font-size14">{submitState.text}</div>
                                {submitState.loading && <Loading color="#fff"/>}
                            </Space>
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    )
}

export default CreateRoomForm