import { useEffect, useRef, useState } from 'react';
import { Button, Space, Typography } from 'antd';

import { CommonUtil } from '../../../../utils/common-util';
import { DeckAgent } from '../API/deck-agent';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../../custom-hooks/use-translation-hook';
import Translate from '../../../../components/Translate';
import OtpInput from '../../../../components/opt-input';
import Loading from '../../../../utils/loading';
import EmailGate from './email-gate';

const { Text }  =   Typography;

interface OtpGateInterface{
    logo            :   string; 
    initialEmail    :   string; 
    portalId        :   string;
    onOTPverified   :   () => void;
}

const OtpGate = (props: OtpGateInterface) => {

    const { initialEmail, portalId, onOTPverified }  =   props;

    const { translate }                         =   useLocalization();
    const inputRefs                             =   useRef<(HTMLInputElement | null)[]>([]);

    const [countDown, setCountdown]             =   useState<number>(60);
    const [otpLoading, setOtpLoading]           =   useState<boolean>(false);

    const [otpSent, setOptSent]                 =   useState<{status: boolean, toEmail: string}>({
        status: false,
        toEmail: ""
    });

    const onSubmit = () => {
        setOtpLoading(true)
        let otp = inputRefs.current.map((_item: any) => _item.value).join("")
        DeckAgent.verifyOtp({
            variables: {
                emailId :   otpSent.toEmail,
                otp     :   otp
            },
            onCompletion: (data: any) => {
                if(data._dVerifyOtp){                   
                    let json = {
                        "sessionCreatedOn"  :   new Date().valueOf()   
                    }
                    localStorage.setItem(portalId, JSON.stringify(json))
                    onOTPverified()
                }else{
                    CommonUtil.__showError(translate("section-protected.unable-to-verify"))
                }
                setOtpLoading(false)
            },
            errorCallBack: () => {
                setOtpLoading(false)
            }
        }) 
    }

    useEffect(() => {                    
        const intervalId = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 0) {
                    clearInterval(intervalId!);
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [countDown]);

    const onResendOtp = () => {
        setCountdown(30)
        handleOnSendOtp(otpSent.toEmail, () => {})
    }

    const handleOnSendOtp = (bsEmail: string, callback: () => void) => {
        DeckAgent.sendOtp({
            variables: {
                emailId     :   bsEmail
            },
            onCompletion: () => {
                localStorage.setItem(`bs_user_email_${portalId}`, bsEmail);
                callback()
                setOptSent({
                    status  :   true,
                    toEmail :   bsEmail
                })
            },
            errorCallBack: () => {}
        })
    }

    if(!otpSent.status){
        return <EmailGate {...props} via={"otpGate"} onSendOpt={handleOnSendOtp}/>
    }else{
        return (
            <div className="cm-background-black cm-height100 cm-flex-center">
                <div className="cm-background-white j-buyer-section-protected-card cm-flex-center cm-flex-direction-column cm-gap20 cm-margin20" style={{padding: "20px", minHeight: "450px", aspectRatio: "1"}}>
                    {
                        otpLoading 
                            ?   
                                <Loading />
                            :   
                                <>
                                    <div className="cm-border-round cm-padding20">
                                        <MaterialSymbolsRounded font="lock" size="30" color="#5F6368"/>
                                    </div>
                                    <Text className="cm-font-fam600 cm-font-size18"><Translate i18nKey='section-protected.this-content-is-protected'/></Text>
                                    <Text className='cm-whitespace-no-wrap'>
                                        <Translate i18nKey='section-protected.otp-mail-sent'/>
                                        &nbsp;
                                        <span className='cm-font-fam500' style={{whiteSpace: "pre-wrap"}}>{otpSent.toEmail ? otpSent.toEmail : initialEmail}</span>
                                    </Text>
                                    <OtpInput length={4} otpRef={inputRefs} onSubmit={onSubmit}/>
                                    <Button loading={otpLoading} disabled={otpLoading} size="large" type="primary" style={{ width: "250px" }} onClick={() => onSubmit()} className='cm-button-disabled'>
                                        <Translate i18nKey='common-labels.verfiy'/>
                                    </Button>
                                    <Space size={8}>
                                        <Text className={`j-hyperlink-text cm-cursor-pointer`} onClick={() => onResendOtp()} disabled={countDown > 0}>
                                            Resend OTP
                                        </Text> 
                                        {countDown > 0 && <span className="cm-font-fam400 cm-font-size13">{`00 : ${countDown < 10 ? `0${countDown}` : countDown}`}</span>}
                                    </Space>
                                </>
                    }
                </div>
            </div>
        )
    }
}

export default OtpGate