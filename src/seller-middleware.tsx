import { useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client";

import { ONBOARDING_META } from "./layout/onboarding/api/onboarding-query";
import { ACCOUNT_TYPE_DPR, ACCOUNT_TYPE_DSR, ACCOUNT_TYPE_GTM } from "./constants/module-constants";
import { APIHandler } from "./api-handler";

import SomethingWentWrong from "./components/error-pages/something-went-wrong";
import DSROnboarding from "./layout/onboarding/dsr-onboarding";
import Onboarding from "./layout/onboarding";
import AppLayout from "./layout";
import Globals from "./globals";
import Loading from "./utils/loading";

const SellerMiddleware = () => {

    const $client = useApolloClient();

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    const { data, loading, error }  =   useQuery(ONBOARDING_META, {
        fetchPolicy: "network-only"
    });

    if(loading) {
        return (
            <Loading/>
        )
    }

    const isOnboarded   = data?.onboardingDetails?.isOnboarded === "true";
    const tenantName    = data?.orgDetail?.tenantName;
    const accountType   = data?.orgDetail?.typeCode;
    const accountLogo   = data?.orgDetail?.logoUrl;
    const emailId       = data?.me?.emailId;

    const getStep = () => {
        if(data?.onboardingDetails?.hasPersonalDataUpdated !== "true"){
            return 0
        }else if(data?.onboardingDetails?.hasPersonalDataUpdated === "true" && data?.onboardingDetails?.hasOrgDataUpdated !== "true"){
            return 1
        }else{
            return 2
        }
    }

    const buildAccountLimitEntity = () => {
        if (!data?.onboardingDetails) return {};
        let limits: any = {};
        limits["linkLimit"]        =    data?.onboardingDetails?.linksLimit ?? -1;
        limits["roomLimit"]        =    data?.onboardingDetails?.roomLimit ?? -1;
        limits["accountLimit"]     =    data?.onboardingDetails?.accountLimit ?? -1;
        limits["templateLimit"]    =    data?.onboardingDetails?.templateLimit ?? -1;
        return limits
    } 

     const getAccountType = (accountType: number) => {
        switch(accountType){
            case 1001:
                return ACCOUNT_TYPE_GTM;
            case 1005:
                return ACCOUNT_TYPE_DPR;
            case 1007:
                return ACCOUNT_TYPE_DSR;
            default:
                return null;
        }
    }

    if(error) return <SomethingWentWrong/>;
        
    return(
        isOnboarded ? 
            <Globals limits={buildAccountLimitEntity()}>
                <AppLayout/>
            </Globals>
        :
        (
            getAccountType(accountType) === ACCOUNT_TYPE_DPR 
            ?
                <Onboarding 
                    step        =   {getStep()} 
                    tenantName  =   {tenantName} 
                    emailId     =   {emailId}
                />  
            :
                <DSROnboarding
                    step        =   {0} 
                    tenantName  =   {tenantName} 
                    emailId     =   {emailId}
                    accountLogo =   {accountLogo}
                />   
        ) 
    )
                
}

export default SellerMiddleware
