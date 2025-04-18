import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Avatar, Col, Form, Radio, Row, Select, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import { ROOM_TEMPLATES } from '../../../templates/api/room-templates-query';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { useForm }   =   Form;
const { Option }    =   Select;

const SelectTemplate = () => {

    const [form] =   useForm();

    const [currentType, seturrentType]  =   useState();

    const { data, loading, error, networkStatus, refetch }  =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    if(error) return <SomethingWentWrong/>

    let templateOptions  = data ? data.roomTemplates : [];

    const navigateToTemplates = (key: string) => {
        let templateUrl = window.location.origin + window.location.pathname + "#/" + key;
        window.open(templateUrl, "_blank")
    }

    const refetchTemplates = () => {
        refetch()
    }

    return (
        <Form className='cm-form' form={form} layout='vertical'>

            <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Select a template</div>
            <Radio.Group defaultValue={"landing"} className="cm-margin-bottom20" onChange={(event: any) => seturrentType(event?.target.value)}>
                <div className="cm-flex" style={{rowGap: "30px"}}>
                    <Radio value={"landing"} style={{width: "400px"}}>
                        <Space direction="vertical" className="cm-margin-left5" size={4}>
                            <div className="cm-font-fam600">Landing Page</div>
                            <div className="cm-font-size13">The lead will be directed to a page with all the templates. They can select a template of their choice.</div>
                        </Space>
                    </Radio>
                    <Radio value={"template"}>
                        <Space direction="vertical" className="cm-margin-left5" size={4}>
                            <div className="cm-font-fam600">Specific template</div>
                            <div className="cm-font-size13">The lead will be instantly directed to the specific template you have chosen.</div>
                        </Space>
                    </Radio>
                </div>
            </Radio.Group>

            {
                currentType === "template" ?
                    <>
                        <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Choose a template</div>
                        <Row gutter={10} className='cm-width100'>
                            <Col flex="auto" style={{maxWidth: "calc(100% - 35px)"}}>
                                <Form.Item 
                                    className   =   'j-fi-has-extra'  
                                    name        =   "templateId"
                                    label       =   {
                                        <>
                                            Templates
                                            <div className="j-fi-extra j-hyperlink-text" onClick={() => navigateToTemplates("templates")}>Create template</div>
                                        </>
                                    }
                                >
                                    <Select suffixIcon={<MaterialSymbolsRounded font='expand_more' size='20'/>} showSearch allowClear optionLabelProp='label' optionFilterProp='filter' notFoundContent={<div style={{minHeight: "50px"}} className='cm-flex-center cm-empty-text cm-font-size12'>No templates found</div>} disabled={loading}>
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
                            </Col>
                            <Col flex={"35px"} className="cm-float-right">
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
                            </Col>
                        </Row>
                    </>
                :
                    null
            }
        </Form>
    )
}

export default SelectTemplate