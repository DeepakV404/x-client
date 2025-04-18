import { useContext, useState } from "react";
import { Button, Form, Input, Modal, Space } from "antd";

import { EMAIL_SENT, Length_Input, official_email_regex } from "../../../constants/module-constants";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";

import useLocalization from "../../../custom-hooks/use-translation-hook";
import LocalCache from "../../../config/local-storage";
import Translate from "../../../components/Translate";

const { useForm }   =   Form;

const NonGatedForm = (props: {isOpen: boolean, onClose: () => void}) => {

    const { $buyerData, $sessionId }    =   useContext<any>(BuyerGlobalContext);

    const { translate } = useLocalization();

    let token   =  $buyerData?.linkdata.apiKey;

    const queryParams = CommonUtil.__getQueryParams(window.location.search);

    const { isOpen, onClose }   =   props;

    const [showSuccess, setShowSuccess] =   useState(false);
    const [roomLink, setRoomLink] = useState<any>(null);

    const [submitState, setSubmitState] =   useState({
        text    :   "Submit",
        loading :   false
    })

    const [form]    =   useForm();

    let portalAccessToken       =   window.location.pathname.split("/")[2];

    const onFinish = (values: any) => {
        setSubmitState({
            text    :  "Submitting...",
            loading :   true
        })

        let data = {
            "emailId"           :   values.email,
            "sessionUuid"       :   $sessionId,
            "resourceTracking"  :   LocalCache.getData(portalAccessToken).resourceTracking,
        } 

        const clearData = () => {
            let localData = LocalCache.getData(portalAccessToken)
            localData.resourceTracking = {}
            LocalCache.setData(portalAccessToken, localData)
        }

        fetch(`${import.meta.env.VITE_STATIC_REST_URL}/v1/rooms/${$buyerData?.linkdata?.templateUuid}?isSync=true${queryParams.embed === 'true' ? `&source=gated` : ""}`, { method: 'POST', body: JSON.stringify(data),  headers: {'Content-Type': 'application/json', 'BS-API-KEY' : `${token}`} })
            .then((response) => response.json())
            .then((data: any) => {
                if(data.status === "created" || data.status === "initiated"){
                    clearData()
                    setShowSuccess(true)
                    setSubmitState({
                        text    :  "Submit",
                        loading :   false
                    })
                    setRoomLink(data.link)
                }else if(data.status === "not_created"){
                    setShowSuccess(false)
                    setSubmitState({
                        text    :  "Submit",
                        loading :   false
                    })
                    CommonUtil.__showError("Something went wrong!")
                }
            })
    }

    const handleVisitRoom = () => {
        window.open(roomLink, '_blank');
    };

    return (
        <Modal
            centered
            width           =   {500}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}  
            destroyOnClose  
        >
            {
                showSuccess 
                ?
                    <Space direction="vertical" className="cm-height100 cm-width100 cm-flex-center">
                        <img src={EMAIL_SENT} width={300}/>
                        <div className="cm-font-fam500 cm-font-size26 cm-text-align-center"><Translate i18nKey="non-gated-email-success-modal.response-message"/></div>
                        {
                            queryParams.embed === true ?
                                <div className="cm-text-align-center"><Translate i18nKey={"non-gated-email-success-modal.mail-confirm-message"}/></div>
                            :
                                <div className="cm-text-align-center"><Translate i18nKey={"non-gated-email-success-modal.mail-confirm-message-no-cta"}/></div>
                        }
                        {
                            queryParams.embed === 'true' &&
                                <Button type="primary" className="cm-margin-top20" onClick={handleVisitRoom}>
                                    <Translate i18nKey="common-labels.access-portal"/>
                                </Button>
                        }
                    </Space> 
                :
                    <Space direction="vertical" className="cm-flex-center cm-width100 cm-space-inherit" size={0}>
                        <div className="cm-font-fam600" style={{fontSize: "30px", lineHeight: "42px"}}>
                            <span><Translate i18nKey={"non-gated-email-modal.share-template"}/> {$buyerData.sellerAccount.title}</span>
                        </div>
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item name={"email"} rules={[{required: true, message: "Enter your work email", whitespace: true}, {pattern: official_email_regex, message: "Enter your work email"}]} className="cm-margin-top20">
                                <Input type="email" size="large" maxLength={Length_Input} placeholder={translate("common-labels.enter-your-work-email")} allowClear className="j-get-email-input"/>
                            </Form.Item>
                            <Form.Item className="cm-flex-center" noStyle>
                                <Button size="large" htmlType="submit" type="primary" loading={submitState.loading} disabled={submitState.loading}>
                                    <Translate i18nKey={'common-link.get-access'}/>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
            }
        </Modal>    
    )
}
export default NonGatedForm

// {
//     showSuccess ?
//         <Space direction="vertical" className="cm-height100 cm-width100 cm-flex-center">
//             <img src={EMAIL_SENT} width={300}/>
//             <div className="cm-font-fam500 cm-font-size26"><Translate i18nKey="non-gated-email-success-modal.response-message"/></div>
//             <div><Translate i18nKey={"non-gated-email-success-modal.mail-confirm-message"}/></div>

//         </Space>
//     :
//         <Row className="cm-height100 j-buyer-demo-from-wrapper">
//             <Col span={11} className="cm-height100 j-buyer-demo-form-sider-wrapper" style={{backgroundImage: `url(${EMAIL_SIDER})`, borderRadius: "4px 0px 0px 4px", padding: "100px 80px", backgroundSize: "100%"}}>
//                 <div className="cm-font-fam600 cm-font-size26">
//                     {/* Your digital buying experience starts here! */}
//                     <Translate i18nKey={"non-gated-email-modal.welcome-message"}/> {$buyerData?.sellerAccount.title} 🎉
//                 </div>
//             </Col>
//             <Col span={13} className="j-buyer-demo-form-right-wrapper">
//                 <Form className="cm-form j-buyer-demo-mail-form" form={form} layout="vertical" onFinish={onFinish}>
//                     <Space direction="vertical" className="cm-margin-top20 " size={20}>
//                         <img src={$buyerData?.sellerAccount.logoUrl} alt={$buyerData?.sellerAccount.title} width={100} />
//                         <Space direction="vertical" size={8} className="cm-margin-bottom20" >
//                             <div className="cm-font-fam600" style={{fontSize: "30px"}}>
//                                 {/* Unlock the {$buyerData?.sellerAccount.title} difference! */}
//                                 <Translate i18nKey={'non-gated-email-modal.right-header'}/>
//                             </div>
//                             <div className="cm-font-size16 cm-secondary-text">
//                                 <Translate i18nKey={'non-gated-email-modal.right-sub-header'}/>
//                             </div>
//                         </Space>
//                     </Space>
//                     <Space className="cm-width100" direction="vertical" size={15}>
//                         <Form.Item name={"email"} rules={[{required: true, message: "Enter your work email", whitespace: true}, {pattern: official_email_regex, message: "Enter your work email"}]} className="cm-margin-top20">
//                             <Input type="email" size="large" maxLength={Length_Input} placeholder={translate("common-labels.enter-your-work-email")} allowClear className="j-get-email-input"/>
//                         </Form.Item>
//                         <Form.Item className="cm-flex-center" noStyle>
//                             <Button size="large" htmlType="submit" type="primary" loading={submitState.loading} disabled={submitState.loading}>
//                                 <Translate i18nKey={'common-labels.submit'}/>
//                             </Button>
//                         </Form.Item>
//                     </Space>
//                 </Form>
//             </Col>
//         </Row>         
// }