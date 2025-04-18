import { useState } from "react";
import { Form, Input, Radio, Select, Space } from "antd";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import TextArea from "antd/es/input/TextArea";
import { CHILLI_PIPER, REVENUE_HERO } from "../../../constants/module-constants";

const { useForm }   =   Form;
const { Option }    =   Select;

const CalendarSettings = () => {

    const [form]    =   useForm();

    const [currentLinkType, setCurrentLinkType] =   useState("teamLink");

    const onFinish = (values: any) => {
        console.log("values",values)
    }

    return (
        <div className="cm-padding20 cm-height100">
            <Form className='cm-form' form={form} layout='vertical' onFinish={onFinish}>

                <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Scheduling Link</div>
                <Radio.Group defaultValue={currentLinkType} className="cm-margin-bottom20" onChange={(event: any) => setCurrentLinkType(event.target.value)}>
                    <div className="cm-flex" style={{rowGap: "30px"}}>
                        <Radio value={"teamLink"} style={{width: "400px"}}>
                            <Space direction="vertical" className="cm-margin-left5" size={4}>
                                <div className="cm-font-fam600">Team Link</div>
                                <div className="cm-font-size13">Use a team calendar link or a individual calendar link </div>
                            </Space>
                        </Radio>
                        <Radio value={"leadRouterLink"}>
                            <Space direction="vertical" className="cm-margin-left5" size={4}>
                                <div className="cm-font-fam600">Lead routing links (Eg: RevenueHero, ChilliPiper etc.)</div>
                                <div className="cm-font-size13">Usea a routing products link.</div>
                            </Space>
                        </Radio>
                    </div>
                </Radio.Group>
                {
                    currentLinkType === "teamLink" 
                    ?
                        <Form.Item label={"Team calendar link"} name={"teamcalendarLink"} rules={[{required: true, message: "Form selector ID is required.", whitespace: true}]}>
                            <Input prefix={<MaterialSymbolsRounded font="link" size="20" />}/>
                        </Form.Item>
                    :
                        <>
                            <Form.Item label={"Lead router"} name={"leadRouter"} rules={[{required: true, message: "Choose a lead router"}]}>
                                <Select optionLabelProp="label" suffixIcon={<MaterialSymbolsRounded font={"expand_more"} size="20"/>} allowClear>
                                    <Option 
                                        value   =   "revenue-hero"
                                        label   =   {
                                            <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                                <img style={{height: "15px", width: "15px"}} src={REVENUE_HERO}/>
                                                <div className="cm-font-fam500">Revenue hero</div>
                                            </div>
                                        }
                                    >
                                        <div className="cm-flex-align-center" style={{columnGap: "15px"}}>
                                            <img style={{height: "25px", width: "25px"}} src={REVENUE_HERO}/>
                                            <div className="cm-font-fam500">Revenue hero</div>
                                        </div>
                                    </Option>
                                    <Option
                                        value   =   "chilli-piper"
                                        label   =   {
                                            <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                                <img style={{height: "15px", width: "15px"}} src={CHILLI_PIPER}/>
                                                <div className="cm-font-fam500">Chili Piper</div>
                                            </div>
                                        }
                                    >
                                        <div className="cm-flex-align-center" style={{columnGap: "15px"}}>
                                            <img style={{height: "25px", width: "25px"}} src={CHILLI_PIPER}/>
                                            <div className="cm-font-fam500">Chili Piper</div>
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name={"snippet"} label={"Router code snippet (Javascript)"} rules={[{required: true, message: "Paste the code snippet"}]}>
                                <TextArea rows={8}/>
                            </Form.Item>
                        </>
                }
            </Form>
        </div>
    )
}

export default CalendarSettings