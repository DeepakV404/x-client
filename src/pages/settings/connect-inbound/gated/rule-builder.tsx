import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Avatar, Col, Form, Input, Row, Select, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import { DEFAULT_VALUES, FORM_FIELD_CONFIG, SINGLE_LINE } from '../../config/form-field-config';
import { ROOM_TEMPLATES } from '../../../templates/api/room-templates-query';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { Option }    =   Select;

const RuleBuilder = () => {

    const [rules, setRules] =   useState<any>([{id: 0}]);

    const { data, loading, error, networkStatus, refetch }  =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    const onAddRule = () => {

        let rule = {
            id  :   rules[rules.length - 1].id + 1
        }
        setRules([
            ...rules,
            rule
        ])
    }

    const removeRule = (ruleId: number) => {
        let updatedRules = rules.filter((_rule: any) => _rule.id !== ruleId)
        setRules(updatedRules)
    }

    const refetchTemplates = () => {
        refetch()
    }

    const navigateToTemplates = (key: string) => {
        let templateUrl = window.location.origin + window.location.pathname + "#/" + key;
        window.open(templateUrl, "_blank")
    }

    if(error) return <SomethingWentWrong/>

    let templateOptions  = data ? data.roomTemplates : [];
    
    return (
        <Form className='cm-form' layout='vertical'> 
            <div className='j-rule-builder-header'>
                <Space size={20}>
                    <div className='cm-font-fam500 cm-font-size16'>Startup target leads - Software Industry</div>
                    <MaterialSymbolsRounded font='edit' size='18' className='cm-cursor-pointer'/>
                </Space>
            </div>
            <Row gutter={[10, 0]} className="cm-margin-top10 j-rule-builer-body">
                <Col span={24}  >
                    <div className='cm-width100 cm-flex' style={{columnGap: "15px"}}>
                        <Form.Item 
                            extra       =   {<div className='cm-font-size12 cm-margin-top5'>The selected template will be mapped</div>}
                            className   =   'j-fi-has-extra cm-width100'  
                            name        =   "templateId"
                            label       =   {
                                <>
                                    <div className='cm-font-fam500'>Choose Template</div>
                                    <div className="j-fi-extra j-hyperlink-text" onClick={() => navigateToTemplates("templates")}>Create template</div>
                                </>
                            }
                        >
                            <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} showSearch allowClear optionLabelProp='label' optionFilterProp='filter' notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>No templates found</div>} disabled={loading} placeholder={"Template"}>
                                {
                                    templateOptions.map((_template: any) => (
                                        <Option value={_template.uuid} label={_template.title} filter={_template.title}>
                                            <Space direction='vertical' size={0}>
                                                <div className='cm-font-fam500'>{_template.title}</div>
                                                <div className='cm-font-size12'>{_template.description}</div>
                                            </Space>
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label=" ">
                            <Avatar shape='square' className='j-refetch-icon-wrap' icon=
                                {
                                    networkStatus === 4 || loading ?
                                        <SyncOutlined spin />
                                    :
                                        <MaterialSymbolsRounded className='cm-cursor-pointer' font={"refresh"} size={"20"} onClick={refetchTemplates}/>
                                }
                            />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={24} className='cm-margin-top10'>
                    <div className='cm-font-fam500 cm-margin-bottom5'>Conditions</div>
                </Col>
                {
                    rules.map((_rule: any, index: number) => (
                        <>
                            <Col span={9}>
                                <Form.Item name={`formField-${_rule.id}`}>
                                    <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} showSearch optionFilterProp='filter' notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>No operators found</div>} placeholder={"Field"}>
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
                            <Col span={5}>
                                <Form.Item name={`formOperator-${_rule.id}`}>
                                    <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} placeholder={"Operator"}>
                                        {
                                            FORM_FIELD_CONFIG[SINGLE_LINE].operators.map((_operator) => (
                                                <Option value={_operator}>{_operator}</Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item name={`formValue-${_rule.id}`} >
                                    <Input placeholder='Value'/>
                                </Form.Item>
                            </Col>
                            {
                                rules.length > 1 &&
                                    <Col span={1}> 
                                        <Form.Item>
                                            <MaterialSymbolsRounded font="cancel" size="18" color="#3333" filled className="cm-cursor-pointer" onClick={() => removeRule(_rule.id)}/>
                                        </Form.Item>
                                    </Col>
                            }
                            <Col span={24}>
                                {
                                    index === rules.length - 1 ? <Space size={0} className="cm-primary-color cm-font-size12 cm-font-fam500 cm-cursor-pointer" onClick={onAddRule}><MaterialSymbolsRounded font="add" size="20"/>Add Condition</Space> : <div className="cm-font-size13 cm-margin-bottom10">And</div>
                                }
                            </Col>
                        </>
                    ))
                }
            </Row>
        </Form>
    )
}

export default RuleBuilder