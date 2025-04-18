import { useState } from 'react';
import { Col, Form, Row, Select, Space } from 'antd';

import { DEFAULT_VALUES, EMAIL, FORM_FIELD_CONFIG } from '../../config/form-field-config';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { useForm }   =   Form;
const { Option }    =   Select;

const MoreFields = () => {

    const [form]    =   useForm();

    const [fields, setFields]   =   useState<any>([{ id: 0}]);

    const onAddField = () => {
        let newField    =   {
            id      :   fields[fields.length - 1] ? fields[fields.length - 1].id + 1 : 1,
        }

        let newFields   =   [
            ...fields,
            newField
        ]
        setFields(newFields)
    }

    return (
        <Form className='cm-form' form={form} layout='vertical'>

            <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom10 cm-margin-top20'>Map Email</div>
            <Row gutter={20}>
                <Col span={24}>
                    <Form.Item label={"Form field in Buyerstage"} name={"formSelector"} rules={[{required: true, message: "Form selector ID is required."}]}>
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
                    <div className='cm-font-fam600 cm-font-size15'>Map Additional Form Inputs</div>
                    <div className='cm-font-size12 cm-light-text'>Map the fields based on which you would linke to setup distribution rules</div>
                </Space>

                {
                    fields.length > 0 ?
                        <Row gutter={20}>
                            {
                                fields.map((_field: any) => (
                                    <>
                                        <Col span={24}>
                                            <Form.Item label={"Form field in Buyerstage"} name={`fieldId_${_field.id}`} rules={[{required: true, message: "Form selector ID is required."}]}>
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
                                    </>
                                ))
                            }
                        </Row>
                    :
                        null
                }

                <Space className='cm-font-fam600 cm-cursor-pointer cm-primary-color' onClick={onAddField}>
                    <MaterialSymbolsRounded font='add_circle' size='20'/>
                    <div>Add more fields</div>
                </Space>
            </Space>
            
        </Form>
    )
}

export default MoreFields