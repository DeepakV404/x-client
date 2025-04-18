import { Checkbox, Form, Input, Space } from "antd";

const Step5Form = (props: {form: any}) => {

    const { form }   =   props;

    return (
        <Space direction="vertical" className="cm-height100 cm-flex-center">
            <Space direction="vertical" style={{width: "420px"}}>
                <div className="cm-font-fam600 j-onboarding-step-title" >Personalize</div>
                <Form form={form} layout="vertical" className="j-onboarding-form">   
                    <Form.Item label={<div>What's your top priority? Let us know so we can tailor the experience just for you! <span className="cm-font-size12 cm-font-opacity-black-65">(Optional)</span></div>} name="usecase" className='cm-width100 cm-margin-top20'>
                        <Checkbox.Group>
                            <Space direction="vertical" className="cm-margin-top10" size={15}>
                                <Checkbox value={"salesDealRoom"}>Sales Deal Room</Checkbox>
                                <Checkbox value={"customerOnboarding"}>Customer Onboarding</Checkbox>
                                <Checkbox value={"contentManagement"}>Content Management</Checkbox>
                                <Checkbox value={"somethingElse"}>Something else</Checkbox>
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>
                    {/* <Form.Item label="How did you find us?" name="referral" className='cm-width100 cm-margin-top30'>
                        <Select
                            showSearch
                            allowClear
                            placeholder     =   "Choose"
                            size            =   "large"
                            style           =   {{ width: 350 }}
                            options={[
                                { value: 'search', label: 'Search (Google, Bing)' },
                                { value: 'fiendOrCoWorker', label: 'Friend or Coworker' },
                                { value: 'linkedin', label: 'LinkedIn' },
                                { value: 'email', label: 'Email' },
                                { value: 'reviewSiteG2', label: 'Review site (G2)' },
                                { value: 'onlineCommunity', label: 'Online Community' },
                                { value: 'podcast', label: 'Podcast' },
                                { value: 'webinarOrEvent', label: 'Webinar or event' },
                                { value: 'instagram', label: 'Instagram' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                            
                    </Form.Item> */}

                    <Form.Item label={<div>Phone Number <span className="cm-font-size12 cm-font-opacity-black-65">(Optional)</span></div>} name="referral" className='cm-width100 cm-margin-top30'>
                        <Input placeholder="+1(123)456-7890" />
                    </Form.Item>
                </Form>
            </Space>
        </Space> 
    )
}

export default Step5Form