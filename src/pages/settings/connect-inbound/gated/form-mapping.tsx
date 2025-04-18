import { Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { DEFAULT_VALUES, EMAIL, FORM_FIELD_CONFIG } from '../../config/form-field-config';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { SettingsAgent } from '../../api/settings-agent';

const { useForm }   =   Form;
const { Option }    =   Select;

const FormMapping = () => {

    const [form]    =   useForm();

    let initialValue = {
        "formSelector": "demo-form",
        "emailFieldId": "work_email",
        "buyerStageEmailFieldId": 3,
        "otherFields": [
            {
                "formFieldId": "firstName",
                "buyerstageFieldId": 2
            },
            {
                "buyerstageFieldId": 2,
                "formFieldId": "secondName"
            }
        ]
    }

    const onFinish = () => {

        SettingsAgent.updateGatedFormMapping({
            variables: {

            },
            onCompletion: () => {

            },
            errorCallBack: () => {
                
            }
        })
    }

    return (
        <Form className='cm-form' form={form} layout='vertical' initialValues={initialValue} onFinish={onFinish}>
            <Space className='cm-width100 cm-flex-space-between'>
                <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom10'>Form Details</div>
                <Form.Item noStyle>
                    <Button type='primary' htmlType='submit'>Update</Button>
                </Form.Item>
            </Space>
            <Form.Item 
                label   =   {"Form Selector"} 
                name    =   {"formSelector"} 
                rules   =   {[{required: true, message: "Form selector ID is required.", whitespace: true}]} 
                extra   =   {<Space size={5} className='cm-margin-top5'><div className='cm-font-size12'>Form Selector ID helps to identify which form on your page should be used</div><MaterialSymbolsRounded font='help' size='16' className='cm-cursor-pointer' /></Space>}
            >
                <Input prefix={"#"}/>
            </Form.Item>


            <Space className='cm-margin-bottom10 cm-margin-top20'>
                <div className='cm-font-fam600 cm-font-size15'>
                    Map Email
                </div>
                <div className='cm-light-text cm-font-size12'>(Required)</div>
            </Space>

            <Row gutter={20}>
                <Col span={12}>
                    <Form.Item label={"Email field ID"} name={"emailFieldId"} rules={[{required: true, message: "Email field ID is required.", whitespace: true}]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={"Email field in Buyerstage"} name={"buyerStageEmailFieldId"} rules={[{required: true, message: "Form selector ID is required."}]}>
                        <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} showSearch optionFilterProp='filter' notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>No fields found</div>}>
                            {
                                Object.values(DEFAULT_VALUES).filter((_filterField: any) => _filterField.type === EMAIL).map((_field: any) => (
                                    <Option value={_field.id} filter={_field.value} >
                                        <Space className='cm-flex-align-center' size={5}>
                                            <MaterialSymbolsRounded font={FORM_FIELD_CONFIG[_field.type].icon} size='18'/>
                                            <div className='cm-font-fam500'>{_field.value}</div>
                                        </Space>
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Space direction="vertical" className='cm-width100'>
                <Space direction='vertical' size={4} className='cm-margin-bottom10 cm-margin-top20'>
                    <div className='cm-font-fam600 cm-font-size15'>Map additional form inputs</div>
                    <div className='cm-font-size12 cm-light-text'>Map the fields based on which you would linke to setup distribution rules</div>
                </Space>
                <Row gutter={20}>
                    <Form.List name="otherFields">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <>
                                        <Col span={11}>
                                            <Form.Item {...restField} label={"Form field Id"} name={[name, 'formFieldId']} rules={[{required: true, message: "Form field Id is required.", whitespace: true}]}>
                                                <Input placeholder={`Field ${key}`}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={11}>
                                            <Form.Item {...restField} label={"Form field in Buyerstage"} name={[name, 'buyerstageFieldId']} rules={[{required: true, message: "Form selector ID is required."}]}>
                                                <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} showSearch optionFilterProp='filter' notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>No fields found</div>}>
                                                    {
                                                        Object.values(DEFAULT_VALUES).map((_field: any) => (
                                                            <Option value={_field.id} filter={_field.value} >
                                                                <Space className='cm-flex-align-center' size={5}>
                                                                    <MaterialSymbolsRounded font={FORM_FIELD_CONFIG[_field.type].icon} size='18'/>
                                                                    <div className='cm-font-fam500'>{_field.value}</div>
                                                                </Space>
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Form.Item label={" "}>
                                                <MaterialSymbolsRounded font="cancel" size="18" color="#3333" filled className="cm-cursor-pointer" onClick={() => remove(name)}/>
                                            </Form.Item>
                                        </Col>
                                    </>
                                ))}
                                <Space className='cm-font-fam600 cm-cursor-pointer cm-primary-color cm-margin-top10' onClick={() => add()} style={{marginLeft: "8px"}}>
                                    <MaterialSymbolsRounded font='add_circle' size='20'/>
                                    <div>Add more fields</div>
                                </Space>
                            </>
                        )}
                    </Form.List>
                </Row>
            </Space>
            
        </Form>
    )
}

export default FormMapping