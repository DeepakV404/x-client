import { FC, useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Divider, Form, Input, Select, Space, Typography } from "antd";
import { toUpper }  from 'lodash';

import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_BUYER_INVITE } from "../../config/buyer-discovery-config";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { BUYER_INVITE_REASONS } from "../../api/buyers-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;
const { Option }    =   Select;
const { TextArea }  =   Input;
const { Text }      =   Typography

interface InviteStakeHolderFormProps
{
    onClose     :   () => void;
    isOpen      :   boolean;
}

const InviteStakeHolderForm: FC<InviteStakeHolderFormProps> = (props) => {

    const { onClose }    =   props;

    const { $buyerData }    =   useContext(BuyerGlobalContext);

    const { translate } = useLocalization();

    const [form]    =   useForm();

    const [submitLoading, setSubmitLoading] =   useState(false);
    const [copy, setCopy]                   =   useState(false);

    const { data, loading, error }  =   useQuery(BUYER_INVITE_REASONS);

    const { touchPoints, setShowInitialPopup }      =   useContext<any>(BuyerDiscoveryContext);

    let $inviteTouchPoints = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

    const handleOnInvite = () => {

        const inviteToBeTriggered = $inviteTouchPoints.filter(
            (_inviteTouchPoint: any) =>
                _inviteTouchPoint.target.when === WHEN_ON_BUYER_INVITE
        );        

        if(inviteToBeTriggered.length){
            setShowInitialPopup({
                visibility      :   true,
                touchpointData  :   inviteToBeTriggered[0]
            })
        }
    }

    const onFinish = (values: any) => {
        setSubmitLoading(true)
        BuyerAgent.inviteBuyer({
            variables:  {
                emailId     :   values.emailId, 
                reasonUuid  :   values.reasonId, 
                message     :   values.message
            },
            onCompletion: () => {
                handleOnInvite()
                onClose();
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.invitation-sent-message" />);                
            },
            errorCallBack: (error: any) => {
                setSubmitLoading(false)
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-modal-header cm-flex-align-center">
                <MaterialSymbolsRounded font="group_add" className="cm-margin-right5"/>
                <div className="cm-font-size16 cm-font-fam500 cm-flex-align-center"><Translate i18nKey={"common-labels.share"}/></div>
            </div>
            <Form className="cm-form cm-modal-content" form={form} onFinish={onFinish} layout="vertical">
                {$buyerData?.properties.roomLink && 
                    <>
                        <div className="j-template-link-root">
                            <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: $buyerData?.properties.roomLink}}>{$buyerData?.properties.roomLink}</Text>
                            <Space size={4} className="cm-cursor-pointer cm-flex-justify-end cm-link-text" onClick={() => copyLink($buyerData?.properties.roomLink)} style={{width: "190px"}} >
                                <MaterialSymbolsRounded className='cm-cursor-pointer' font={copy ? 'done' : 'content_copy'} size='18' />
                                <div className="cm-link-text" style={{width: "65px"}}>{copy ? <Translate i18nKey="common-labels.copied"/> : <Translate i18nKey="common-labels.copy-link"/>}</div>
                            </Space>
                        </div>
                        <Divider orientation="center" className="cm-light-text" style={{marginBottom: "5px"}}>{toUpper(translate("common-labels.or"))}</Divider>
                    </>
                }
                <Form.Item name={"emailId"} label={<div className="cm-font-fam500 cm-font-size16"><Translate i18nKey={"common-labels.emails"}/></div>} rules={[{required: true, message: translate("invite-form.placeholders.invite-mail")}]}>
                    <Select className='cm-width100' placeholder={translate("invite-form.placeholders.invite-mail")} mode='tags' tokenSeparators={[",", " "]} size='large' dropdownStyle={{display: "none"}} suffixIcon={null}></Select>
                </Form.Item>
                <Form.Item name={"reasonId"} label={<div className="cm-font-fam500 cm-font-size16"><Translate i18nKey={"invite-form.invite-reason"}/></div>} rules={[{required: true, message: translate("invite-form.placeholders.invite-reason")}]}>
                    <Select placeholder={translate("invite-form.placeholders.invite-reason")} loading={loading} size="large" disabled={loading} suffixIcon = {<MaterialSymbolsRounded font="expand_more" size="18"/>}>
                        {
                            data && data.buyerInviteReasons.map((_reason: any) => (
                                <Option key={_reason.uuid}>
                                    <div className="cm-flex-align-center" style={{height: "30px"}}>{_reason.name}</div>
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name={"message"} label={<div className="cm-font-fam500 cm-font-size16"><Translate i18nKey={"common-labels.message"}/></div>}>
                    <TextArea rows={5} showCount placeholder={translate("common-placeholder.add-a-message")}/>
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" disabled={submitLoading} onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text"><Translate i18nKey={"common-labels.cancel"}/></div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center ${submitLoading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitLoading}>
                        <Space size={10}>
                            <div className="cm-font-size14"><Translate i18nKey={submitLoading ? "invite-form.sending-invite" : "invite-form.send-invite"}/></div>
                            {
                                submitLoading && <Loading color="#fff"/>
                            }
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </>
    )
}

export default InviteStakeHolderForm