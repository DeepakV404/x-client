import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, message, Space, Typography } from "antd";
import { startCase } from 'lodash';

import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import Translate from "../../../components/Translate";
import OtpInput from "../../../components/opt-input";

const { Text } = Typography;

const SectionProtected = (props: {onVerify: any, type: string}) => {

    const { onVerify, type }    =   props;

    const { $buyerData }        =   useContext(BuyerGlobalContext);

    const params: any           =   useParams();

    const buyerPortalId: any    =   window.location.pathname.split("/")[2];

    const currentBuyer          =   $buyerData?.buyers.filter((_buyer: any) =>  _buyer.isCurrentBuyer)[0];

    const inputRefs             =   useRef<any>([]);

    const { translate }         =   useLocalization();

    const [loading, setLoading]                         =   useState(false);
    const [sendLoading, setSendLoading]                 =   useState(false);
    const [showEnterCode, setShowEnterCode]             =   useState(false);
    const [reSendCode, setReSentCode]                   =   useState(false)
    const [countDown, setCountdown]                     =   useState(60)

    useEffect(() => {
        if (showEnterCode) {
            const resendOtpTimeOut = setTimeout(() => {
                setReSentCode(true);
            }, 30000);

            return () => {
                clearTimeout(resendOtpTimeOut);
            };
        }
    }, [showEnterCode]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (showEnterCode) {
            intervalId = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 0) {
                        setReSentCode(true)
                        clearInterval(intervalId!);
                        return prev;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [showEnterCode, countDown]);

    const onSubmit = () => {
        setLoading(true)
        let otp = inputRefs.current.map((_item: any) => _item.value).join("")
        BuyerAgent.verifyOtp({
            variables: {
                otp: otp
            },
            onCompletion: (data: any) => {
                if(data.verifyOtp){                   
                    let json = {
                        "sessionCreatedOn"  :   new Date().valueOf()   
                    }
                        localStorage.setItem(buyerPortalId, JSON.stringify(json))
                    onVerify()
                }else{
                    CommonUtil.__showError(translate("section-protected.unable-to-verify"))
                }
                setLoading(false)
            },
            errorCallBack: () => {
                setLoading(true)
            }
        })   
    }

    const onResendOtp = () => {
        if(reSendCode){
            const sendingMessage = message.loading(translate("section-protected.sending-email"), 0)
            setReSentCode(false)
            setCountdown(30)
            if(type === "section-level") {
                BuyerAgent.sendOtpToAccessSection({
                    variables: {
                        sectionUuid: params.sectionId
                    },
                    onCompletion: () => {
                        setSendLoading(false)
                        setShowEnterCode(true)
                        sendingMessage()
                        CommonUtil.__showSuccess(translate("section-protected.email-sent"))
                    },
                    errorCallBack: () => {
                        setSendLoading(false)
                    }
                })
            }
            if(type === "room-level") {
                BuyerAgent.sendOtpToAccessRoom({
                    variables: {
                    },
                    onCompletion: () => {
                        setSendLoading(false)
                        setShowEnterCode(true)
                        sendingMessage()
                        CommonUtil.__showSuccess(translate("section-protected.email-sent"))
                    },
                    errorCallBack: () => {
                        setSendLoading(false)
                    }
                })
            }
        }
    }

    const sendOtp = () => {
        setSendLoading(true)
        setCountdown(30)
        if(type === "section-level") {
            BuyerAgent.sendOtpToAccessSection({
                variables: {
                    sectionUuid: params.sectionId
                },
                onCompletion: () => {
                    setSendLoading(false)
                    setShowEnterCode(true)
                },
                errorCallBack: () => {
                    setSendLoading(false)
                }
            })
        }
        if(type === "room-level") {
            BuyerAgent.sendOtpToAccessRoom({
                variables: {
                },
                onCompletion: () => {
                    setSendLoading(false)
                    setShowEnterCode(true)
                },
                errorCallBack: () => {
                    setSendLoading(false)
                }
            })
        }
    }

    return (
        <div className="cm-width100 cm-height100">
            <div className="j-buyer-section-protected-card cm-height100 cm-flex-center cm-flex-direction-column cm-gap20">
                <div className="cm-border-round cm-padding20">
                    <MaterialSymbolsRounded font="lock" size="30" color="#5F6368"/>
                </div>
                <Space direction="vertical" className="cm-text-align-center">
                    <Text className="cm-font-fam600 cm-font-size18"><Translate i18nKey='section-protected.this-content-is-protected'/></Text>
                    {
                        showEnterCode ? 
                            <Text><Translate i18nKey='section-protected.otp-mail-sent'/> <span className="cm-font-fam500">{currentBuyer && currentBuyer?.emailId}</span></Text>
                        :
                            <Text><Translate i18nKey='section-protected.send-otp-mail'/> <span className="cm-font-fam500">{currentBuyer && currentBuyer?.emailId}</span></Text>
                    }
                </Space>
                {showEnterCode ? <OtpInput length={4} otpRef={inputRefs} onSubmit={onSubmit}/> : null}
                {
                    showEnterCode ?
                        <Button loading={loading} disabled={loading} size="large" type="primary" style={{ width: "250px" }} onClick={() => onSubmit()}><Translate i18nKey='common-labels.verfiy'/></Button>
                    :
                        <Button loading={sendLoading} disabled={sendLoading} size="large" type="primary" style={{ width: "250px" }} onClick={() => sendOtp()}>{startCase(translate("section-protected.get-code"))}</Button>
                }
                {showEnterCode ? <Space size={4}><Text className={`j-hyperlink-text ${reSendCode && "cm-cursor-pointer"}`} onClick={() => onResendOtp()} disabled={!reSendCode}><Translate i18nKey='section-protected.resend-code-to-email'/></Text> {countDown > 0 &&  <span className="cm-font-fam400 cm-font-size13">{`00 : ${countDown < 10 ? `0${countDown}` : countDown}`}</span>}</Space>  : null}
            </div>
        </div>
    );
};

export default SectionProtected;
