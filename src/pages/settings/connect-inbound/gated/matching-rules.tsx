import { useState } from "react";
import { Checkbox, Form, Radio, Space } from "antd";

const { useForm }   =   Form;

const MatchingRules = () => {

    const [form]    =   useForm();

    const [currentType, setCurrentType] =   useState("yes");

    return (
        <Form className='cm-form' form={form} layout='vertical'>

            <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 '>Do you want to match leads with their existing rooms?</div>
            <Radio.Group defaultValue={currentType} className="cm-margin-bottom20" onChange={(event: any) => setCurrentType(event.target.value)}>
                <div className="cm-flex" style={{rowGap: "30px"}}>
                    <Radio value={"yes"} style={{width: "400px"}}>
                        <Space direction="vertical" className="cm-margin-left5" size={4}>
                            <div className="cm-font-fam600">Yes (Recommended)</div>
                            <div className="cm-font-size13">Similar leads will be mapped to the existing room</div>
                        </Space>
                    </Radio>
                    <Radio value={"no"}>
                        <Space direction="vertical" className="cm-margin-left5" size={4}>
                            <div className="cm-font-fam600">No</div>
                            <div className="cm-font-size13">Skips mapping leads with existing rooms</div>
                        </Space>
                    </Radio>
                </div>
            </Radio.Group>

            {
                currentType === "yes" ?
                    <>
                        <div className='cm-font-fam600 cm-font-size15 cm-margin-bottom20 cm-margin-top10'>Matching Rules</div>
                        <Space direction="vertical" className="cm-width100 cm-margin-bottom20">
                            <Space>
                                <Form.Item name={"sameLeadMapping"} valuePropName="checked" noStyle initialValue={true}>
                                    <Checkbox />
                                </Form.Item>
                                <div className="cm-font-fam500">Map to the same room for same leads</div>
                            </Space>
                            <div className="cm-font-size12">In the case of a lead resubmitting information, utilize the existing room mapping from their prior submission.</div>
                        </Space>
                        <Space direction="vertical" className="cm-width100">
                            <Space>
                                <Form.Item name={"similarLeadMapping"} noStyle valuePropName="checked" initialValue={false}>
                                    <Checkbox/>
                                </Form.Item>
                                <div className="cm-font-fam500">Map to the same room for similar leads</div>
                            </Space>
                            <div className="cm-font-size12">For leads submitting mail similar to an existing submission, assign the same room as the previous occupant.</div>
                        </Space>
                    </>
                :
                    null
            }

        </Form>
    )
}

export default MatchingRules