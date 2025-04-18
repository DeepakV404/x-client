import { useQuery } from '@apollo/client';
import { Avatar, Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import { ROOM_TEMPLATES } from '../../templates/api/room-templates-query';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import { Length_Input } from '../../../constants/module-constants';

const { useForm }   =   Form;
const { Option }    =   Select;

const OtherFieldsForm = () => {

    const [form]                        =   useForm();

    const { data, loading, networkStatus, refetch }      =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange : true
    });


    const onFinish = () => {
        // AccountsAgent.createAccount({
        //     variables: {
        //         templateUuid: values.templateId, 
        //         input: {
        //             emailId     :   values.contactEmail,
        //             companyName :   values.companyName,
        //             websiteUrl  :   values.websiteUrl
        //         }
        //     },
        //     onCompletion: () => {
        //         onClose();
        //         CommonUtil.__showSuccess("Account created successfully")
        //     },
        //     errorCallBack: (error: any) => {
        //         CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
        //     }
        // })
    }

    const refetchTemplates = () => {
        refetch()
    }

    return (
        <Form 
            form        =   {form} 
            onFinish    =   {onFinish} 
            layout      =   "vertical"
            className   =   "cm-form cm-height100"
        >
            <Space className='cm-flex-justify-center cm-height100' direction='vertical' size={10}>
                <Row gutter={25}>
                    <Col span={22} style={{paddingRight: "0px !important"}}>
                        <Form.Item
                            className   =   'j-fi-has-extra' 
                            name        =   "templateId"
                            rules       =   {[{
                                required    :   true,
                                message     :   "Choose a room template",
                                whitespace: true
                            }]}
                            label       =   {"Room templates"}
                            
                        >
                            <Select
                                size                =   'large'
                                showSearch
                                allowClear
                                loading             =   {loading}
                                disabled            =   {loading}
                                optionFilterProp    =   'children'
                                placeholder         =   "Select template"
                                notFoundContent     =   {
                                    <div className='cm-flex-center'>
                                        No templates found
                                    </div>
                                }
                            >
                                {data && data.roomTemplates.map((_template: any) => (
                                    <Option value={_template.uuid}>{_template.title}</Option>
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

                <Form.Item label="Company name" name="companyName"
                    rules       =   {[{
                        required    :   true,
                        message     :   "Company name is required",
                        whitespace: true
                    }]}
                >
                    <Input allowClear maxLength={Length_Input} placeholder="Company name" size="large"/>
                </Form.Item>

                <Form.Item label="Email" name="contactEmail"
                    rules       =   {[{
                        required    :   true,
                        message     :   "Email is required",
                        whitespace: true
                    }]}
                >
                    <Input allowClear maxLength={Length_Input} placeholder="Contact email" size="large"/>
                </Form.Item>

                <Form.Item label="Website URL" name="websiteUrl">
                    <Input allowClear placeholder="Website URL" prefix={<MaterialSymbolsRounded font="link" size="20"/>} size="large"/>
                </Form.Item>

                <Form.Item >
                    <Button type='primary' htmlType='submit'>Create</Button>
                </Form.Item>
            </Space>
        </Form>
    )
}

export default OtherFieldsForm