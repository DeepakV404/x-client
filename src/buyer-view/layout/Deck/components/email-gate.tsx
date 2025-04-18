
import { Button, Form, Input, Space, Typography } from "antd";
import { useState } from "react";

const { useForm }   =   Form;
const { Text }      =   Typography;

interface EmailGatePropType{
    logo            :   string;
    initialEmail    :   string; 
    portalId        :   string;
    via?            :   "otpGate" | "emailGate";
    onSendOpt?      :   (bsEmail: string, callback: () => void) => void;
    onEnterEmail?   :   (bsEmail: string, callback: () => void) => void;
}

const EmailGate = (props: EmailGatePropType) => {

    const { logo, initialEmail, via, onSendOpt, onEnterEmail }      =   props;

    const [form]        =   useForm();

    const [loading, setLoading] =   useState(false);

    const emailRegex    =   /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const onFinish = (values: any) => {    
        setLoading(true)
        onSendOpt && onSendOpt(values.emailId, () => {setLoading(false)})
        onEnterEmail && onEnterEmail(values.emailId, () => {setLoading(false)})
    }

    return (
        <div className='cm-background-black cm-height100 cm-flex-center'>
            <div className='cm-background-white j-deck-gated-form cm-flex-justify-center cm-margin20'>
                <Form form={form} onFinish={onFinish} className="j-deck-email-gate">
                    <Space size={25} direction='vertical' className='cm-text-align-center cm-space-inherit'>
                        <img src={logo} alt="" height={85} width={85} style={{borderRadius: "24px"}}/>
                        <Text className="cm-font-fam600 cm-font-size18">Requests your action to continue</Text>
                        <Form.Item 
                            name            =   {"emailId"} 
                            className       =   "cm-margin0"
                            initialValue    =   {initialEmail}
                            rules           =   {[{pattern: emailRegex, message: "Enter a valid email"}]} 
                        >
                            <Input size='large' placeholder='your@domain.com' style={{height: "45px", width: "100%"}} />
                        </Form.Item>
                        <Form.Item noStyle>
                            <Button type='primary' size='large' block htmlType="submit" loading={loading} disabled={loading}>
                                {via === "otpGate" ? "Send OTP" : "Submit"}
                            </Button>
                        </Form.Item>
                        <Text className='cm-font-size12'>This information will be shared with us. For details on how we use and protect your data, please refer to our <span className='j-hyperlink-text cm-cursor-pointer'>Privacy Policy</span></Text>
                    </Space>
                </Form>
            </div>
        </div>
    )
}   

export default EmailGate