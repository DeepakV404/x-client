import { useContext, useEffect, useRef, useState } from "react"
import { Button, Form, Image, Input, InputRef, Space } from "antd";

import { BUYERSTAGE_LOGO, BUYERSTAGE_WEBSITE_URL } from "../../../constants/module-constants";
import { BuyerGlobalContext } from "../../../buyer-globals"

import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;

const EmailGateLayout = () => {

    const { $orgProperties, $buyerData }    =   useContext<any>(BuyerGlobalContext);

    const buyerstageOrg = "buyerstage9";

    const inputRef      =   useRef<InputRef>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [form]    =   useForm();

    let token       =  $buyerData?.linkdata.apiKey;

    const [submitState, setSubmitState] =   useState(false);
    
    const onFinish = (values: any) => {
        
        setSubmitState(true)

        let data = {
            "emailId"           :   values.emailId,
        } 

        fetch(`${import.meta.env.VITE_STATIC_REST_URL}/v1/rooms/${$buyerData?.linkdata?.templateUuid}?source=gated`, { method: 'POST', body: JSON.stringify(data),  headers: {'Content-Type': 'application/json', 'BS-API-KEY' : `${token}`} })
            .then((response: any) => response.json())
            .then((response: any) => window.open(response.link, "_self")) 
    }  

    return (
        <div className="cm-height100 cm-width100 j-buyer-email-gate-root">
            <div className="j-buyer-email-gate-child">
                <div className="j-buyer-email-gate-card">
                    <Space className="cm-margin-bottom20 cm-flex-center" direction="vertical" size={20}>
                        <Space direction="vertical" className="cm-flex-center">
                            <img src={$buyerData?.sellerAccount.logoUrl} alt={"logo"} style={{objectFit: "contain", height: "60px"}}/>
                            <div className="cm-font-fam500 cm-font-size24">{$buyerData?.sellerAccount.title}</div>
                        </Space>
                        {
                            $buyerData.sellerAccount.tenantName === buyerstageOrg ?
                                <div className="cm-font-fam400 cm-font-size24 cm-text-align-center">
                                    Empower your buyers to make confident decisions
                                </div>
                            :
                                null
                        }
                    </Space>
                    <Space direction="vertical" className="cm-width100 cm-flex-center cm-space-inherit cm-margin-top20" size={15}>
                        <div className={`cm-font-fam400 ${$buyerData.sellerAccount.tenantName === buyerstageOrg ? "cm-font-size14 cm-font-opacity-black-67" : "cm-font-size18"} cm-text-align-center`}>
                            {
                                $buyerData.sellerAccount.tenantName === buyerstageOrg ?
                                    null
                                :
                                    <Translate i18nKey={"email-gate.title"}/>
                            }
                        </div>
                        <Form className="cm-width100" form={form} onFinish={onFinish}>
                            <Form.Item name={"emailId"} rules={[{required: true, message: ""}]}>
                                <Input ref={inputRef} placeholder="your@email.com" size="large" style={{height: "42px"}} className="j-gated-input-form"/>
                            </Form.Item>
                            <Form.Item style={{marginTop: "25px"}}>
                                <Button block type="primary" className={`cm-flex-center ${submitState ? "cm-button-loading" : ""}`} disabled={submitState} size="large" htmlType="submit" style={{border: "none"}}>
                                    <Space size={10}>
                                        <div className="cm-font-size15"><Translate i18nKey={submitState ? "common-labels.submitting" : "common-labels.submit"}/></div>
                                        {
                                            submitState && <Loading color="#fff"/>
                                        }
                                    </Space>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </div>
                {
                    !$orgProperties.customDomain &&
                        <>
                            <Space className="cm-margin-bottom20" style={{position: "absolute", bottom: "10px"}}>
                                <div className='cm-font-fam400 cm-font-size10'>Powered by</div>
                                <a href={BUYERSTAGE_WEBSITE_URL} target='_blank'>
                                    <Image preview={false} width={100}  src={BUYERSTAGE_LOGO} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= BUYERSTAGE_LOGO}}/>
                                </a>
                            </Space>
                        </>
                }
            </div>
        </div>
    )
}

export default EmailGateLayout