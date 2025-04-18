import "./deck.css";
import { useEffect, useState } from "react";

import BuyerDeckViewMiddleware from "./middleware";
import EmailGate from "./components/email-gate";
import DeckApiContext from "./auth/api-context";
import OtpGate from "./components/otp-gate";

interface DeckPortalInterceptorType{
    accessType  :   "PUBLIC" | "OTP_PROTECTED" | "EMAIL_PROTECTED";
    logo        :   string;
}

const DeckPortalInterceptor = (props: DeckPortalInterceptorType) => {

    const { accessType, logo }   =   props;

    const urlParams             =   new URLSearchParams(window.location.search);
    const portalId              =   window.location.pathname.split("/")[2];
    const unparsedPortalData    =   localStorage.getItem(portalId);
    const emailInLocalStorage   =   localStorage.getItem(`bs_user_email_${portalId}`);
    const portalData            =   unparsedPortalData ? JSON.parse(unparsedPortalData) : null;
    const urlEmail              =   (urlParams.get("bs_emailId") || urlParams.get("bs_email") || urlParams.get("bs_code"));

    const checkEmailGate = () => {
        if(emailInLocalStorage){
            if(urlEmail){
                if(emailInLocalStorage === urlEmail){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        }else{
            return false
        }
    }

    const checkSessionExpired = (sessionCreatedOn: any) => {
        var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
        return (sessionCreatedOn - new Date().valueOf()) >= OneDay
    }

    const getEmail = () => {
        if(urlEmail){
            if(urlEmail === emailInLocalStorage){
                return emailInLocalStorage
            }else{
                return urlEmail
            }
        }else{
            if(emailInLocalStorage){
                return emailInLocalStorage
            }else{
                return ""
            }
        }
    }

    const [emailGate, setEmailGate]         =   useState(checkEmailGate());
    const [bsEmail]                         =   useState<string>(getEmail());
    const [isOTPVerified, setOTPVerified]   =   useState<boolean>((!portalData || !portalData.sessionCreatedOn || checkSessionExpired(portalData.sessionCreatedOn)) ? false : true);

    useEffect(() => {
        if(accessType === 'OTP_PROTECTED'){
            let unparsedPortalData: any =   localStorage.getItem(portalId);
            let portalData              =   unparsedPortalData ? JSON.parse(unparsedPortalData) : null;

            if(!portalData || !portalData.sessionCreatedOn || checkSessionExpired(portalData.sessionCreatedOn)){
                setOTPVerified(false)
            }else{
                setOTPVerified(true)
            }
        }
    }, [accessType])

    const handleOnOTPVerified = () => {
        setOTPVerified(true)
    }

    const handleOnEnterEmail = (bsEmail: string, callback: () => void) => {
        localStorage.setItem(`bs_user_email_${portalId}`, bsEmail);
        callback()
        setEmailGate(true)
    }

    if(accessType === 'EMAIL_PROTECTED'){
        if(emailGate){
            return(
                <DeckApiContext>
                    <BuyerDeckViewMiddleware/>
                </DeckApiContext>
            )
        }else{
            return (
                <EmailGate logo={logo} initialEmail={bsEmail} portalId={portalId} onEnterEmail={handleOnEnterEmail}/>
            )
        }
    }else if(accessType === 'OTP_PROTECTED'){
        if(isOTPVerified){
            return(
                <DeckApiContext>
                    <BuyerDeckViewMiddleware/>
                </DeckApiContext>
            )
        }else{
            return <OtpGate logo={logo} initialEmail={bsEmail} portalId={portalId} onOTPverified={handleOnOTPVerified}/>
        }
    }else {
        localStorage.setItem(`bs_user_email_${portalId}`, bsEmail);
        return (
            <DeckApiContext>
                <BuyerDeckViewMiddleware/>
            </DeckApiContext>
        )
    }
}

export default DeckPortalInterceptor