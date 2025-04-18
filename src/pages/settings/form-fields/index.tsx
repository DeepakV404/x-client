import { useState } from "react";
import { Card, Col, Dropdown, Form, Input, MenuProps, Row, Select, Space } from "antd";

import { DEFAULT_VALUES, FORM_FIELD_CONFIG, SINGLE_CHOICE } from "../config/form-field-config";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"

const { useForm }   =   Form;

const FormFields = () => {

    const [form]   =    useForm();

    const [fields, setFields]   =   useState<any>(Object.values(DEFAULT_VALUES));

    const onAddField = (fieldType: string) => {
        let newField    =   {
            id      :   fields[fields.length - 1] ? fields[fields.length - 1].id + 1 : 1,
            type    :   fieldType
        }

        let newFields   =   [
            newField,
            ...fields
        ]
        setFields(newFields)
    }

    const fieldOptions: MenuProps['items'] = []

    Object.values(FORM_FIELD_CONFIG).map((_field: any) => {
        let field = {
            key     :   _field.key,
            label   :   (
                <Space style={{minWidth: "180px", height: "30px"}} className='cm-flex' >
                    <MaterialSymbolsRounded font={_field.icon} size="20"/>
                    <div className="cm-font-fam500">{_field.displayName} field</div>
                </Space>   
            ),
            onClick :   () => {
                onAddField(_field.key)
            }
        }

        fieldOptions.push(field)
    })

    return (
        <div className="cm-padding20 cm-height100">
            <Space size={3} className="cm-width100 cm-margin-bottom20" direction="vertical">
                <div className="cm-font-size16 cm-font-fam500">Form Fields</div>
                <div className="j-settings-subtitle-border"></div>
            </Space>

            <Space direction="vertical" className='cm-width100'>
                <Form className="cm-form cm-width100" form={form} layout="vertical">
                    <Space className="cm-flex-space-between">
                        <Space direction='vertical' size={4} className='cm-margin-bottom10 cm-margin-top20 '>
                            <div className='cm-font-fam600 cm-font-size15'>Create new fields</div>
                            <div className='cm-font-size12 cm-light-text'>Create from fields to map them in your flow.</div>
                        </Space>
                        <Dropdown menu={{items: fieldOptions}}>
                            <Space className='cm-font-fam600 cm-cursor-pointer cm-primary-color cm-margin-20'>
                                <MaterialSymbolsRounded font='add_circle' size='20'/>
                                <div>Create new field</div>
                            </Space>
                        </Dropdown>
                    </Space>

                    {
                        fields.length > 0 ?
                            <Row gutter={[20, 10]}>
                                {
                                    fields.map((_field: any) => (
                                        <>
                                            <Col span={24}>
                                                <Card className="j-form-field-card">
                                                    <Space direction="vertical" className="cm-width100">
                                                        <Space size={5}>
                                                            <MaterialSymbolsRounded font={FORM_FIELD_CONFIG[_field.type].icon} size="22"/>
                                                            <div className="cm-font-fam600">{FORM_FIELD_CONFIG[_field.type].displayName}</div>
                                                        </Space>
                                                        <div className="cm-width100 cm-flex" style={{columnGap: "30px"}}>
                                                            <Form.Item noStyle name={`fieldName_${_field.id}`} rules={[{required: true, message: "Form field name is required.", whitespace: true}]} initialValue={_field.value}>
                                                                <Input placeholder="Field name" style={{width: "300px"}}/>
                                                            </Form.Item>
                                                            {
                                                                _field.type === SINGLE_CHOICE ?
                                                                    <Form.Item noStyle name={`fieldOption_${_field.id}`} rules={[{required: true, message: "Form field options is required"}]} initialValue={_field.options}>
                                                                        <Select suffixIcon={null} mode="tags" placeholder={"Type and Enter to add options"} style={{minWidth: "400px", maxWidth: "500px"}} notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>Type and Enter to add options</div>}  dropdownStyle={{display: "none"}}>

                                                                        </Select>
                                                                    </Form.Item>
                                                                :
                                                                    null
                                                            }
                                                        </div>
                                                    </Space>
                                                </Card>
                                            </Col>
                                        </>
                                    ))
                                }
                            </Row>
                        :
                            null
                    }
                </Form>
            </Space>
        </div>
    )
}

export default FormFields