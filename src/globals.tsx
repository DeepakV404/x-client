import { FC, createContext, useEffect, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";

import { ACCOUNT_TYPE_DPR, ACCOUNT_TYPE_DSR, ACCOUNT_TYPE_GTM, BUYERSTAGE_FAVICON } from "./constants/module-constants";
import { ALL_ENTITY_COUNT, GLOBALS } from "./layout/api/global-query";
import { CommonUtil } from "./utils/common-util";
import { APIHandler } from "./api-handler";

import DefaultDictionary from './dictionary/default-dictionary.json';
import VendorDictionary from './dictionary/vendor-dictionary.json'
import SomethingWentWrong from "./components/error-pages/something-went-wrong";
import Loading from "./utils/loading";
import { RESTRICTED_FEATURES } from "./pages/settings/api/settings-query";

interface GlobalContextProps {
    $categories         :   any[];
    $sellers            :   any[];
    $orgDetail          :   any;
    $user               :   any;
    $showHeader         :   boolean;
    __hasPermission     :   any;
    $isVendorMode       :   boolean;
    $isVendorOrg        :   boolean;
    $fileListProps      :   any;
    $dictionary         :   any;
    $accountType        :   any;
    $limits             :   any;
    $entityCount        :   any;
    $featData           :   any;
    hidebackinAP        :   any;
    setHidebackinAP     :   any;
}

export const GlobalContext = createContext<GlobalContextProps>({
    $categories         :   [],
    $sellers            :   [],
    $orgDetail          :   null,
    $user               :   null,    
    $showHeader         :   false,
    __hasPermission     :   () => {},
    $isVendorMode       :   false,
    $isVendorOrg        :   false,
    $fileListProps      :   {},
    $dictionary         :   DefaultDictionary,
    $accountType        :   null,
    $limits             :   null,
    $entityCount        :   null,
    $featData           :   null,
    hidebackinAP        :   null,
    setHidebackinAP     :   () => {},
});

interface GlobalsProps
{
    children    :   JSX.Element,
    limits?     :   any
}

export const BS_MARKET_PLACE_USER   =   "BS_MARKET_PLACE_USER";
export const VENDOR                 =   "VENDOR";
export const NORMAL_USER            =   "NORMAL_USER";
export const SUPPORT_USER           =   "SUPPORT_USER";

const Globals : FC<GlobalsProps> = (props) => {

    const { children, limits }  =   props;

    // Initialize client object

    const $client = useApolloClient();

    let domain = CommonUtil.__getSubdomain(window.location.origin);

    // File upload Handler

    const [fileListForMultipleUpload, setFileListForMultipleUpload]   =   useState([]);

    const [hidebackinAP, setHidebackinAP]            =   useState(false);

    const fileListProps = {
        fileListForMultipleUpload,
        setFileListForMultipleUpload,
    };

    // File upload Handler

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    useEffect(() => {
        const faviconLink   =   document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if(!faviconLink){
            var favicon     =   document.createElement('link');
            favicon.rel     =   "icon";
            favicon.href    =   BUYERSTAGE_FAVICON
            document.getElementsByTagName('head')[0].appendChild(favicon);
        }
    }, [])

    // Initialize client object

    // Get Global context data

    const { data, loading, error }  =   useQuery(GLOBALS, {
        fetchPolicy: "network-only"
    });

    const { data: countData, loading: countLoading, error: countError } =   useQuery(ALL_ENTITY_COUNT, {
        fetchPolicy: "network-only"
    })

    const { data: featData, loading: featLoading, error: featError } =   useQuery(RESTRICTED_FEATURES, {
        fetchPolicy: "network-only"
    })

    // Get Global context data
    
    if(loading || countLoading || featLoading) return <Loading/>
    if(error || countError || featError) return <SomethingWentWrong/>
    
    const hasPermission = (module: string) => {
        if(
            import.meta.env.DEV ||
                (data.betaFeaturePermissions.all && data.betaFeaturePermissions.all.includes(data.orgDetail.tenantName)) ||
                    (data.betaFeaturePermissions.hasOwnProperty(module) && data.betaFeaturePermissions[module].includes(data.orgDetail.tenantName))
        ){
            return true;
        } else {
            return false;
        }
    }

    const checkIsInVendorMode = () => {
        return data.orgDetail.type === VENDOR && (data.me.type === BS_MARKET_PLACE_USER  || data.me.type === SUPPORT_USER)
    }

    const checkIsInVendorOrg = () => {
        return data.orgDetail.type === VENDOR && (data.me.type === NORMAL_USER || data.me.type === SUPPORT_USER)
    }

    const getDictionary = () => {
        return checkIsInVendorOrg() || checkIsInVendorMode() ? VendorDictionary : DefaultDictionary
    }

    const getAccountType = () => {
        switch(data.orgDetail.typeCode){
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

    // Set Global Context

    const context = {
        $categories         :   data.categories,
        $sellers            :   data.sellers.filter((seller: any) => seller.status !== "DELETED"),
        $orgDetail          :   data.orgDetail,
        $accountType        :   getAccountType(),
        $user               :   data.me,
        $showHeader         :   !(domain === "hs-app" || domain === "sfdc-app"),
        __hasPermission     :   hasPermission,
        $isVendorMode       :   checkIsInVendorMode(),
        $isVendorOrg        :   checkIsInVendorOrg(),
        $fileListProps      :   fileListProps,
        $dictionary         :   getDictionary(),
        $limits             :   limits,
        $entityCount        :   countData.allEntityCount,
        $featData           :   featData.restrictedFeatures,
        hidebackinAP        :   hidebackinAP,
        setHidebackinAP     :   setHidebackinAP
    }

    // Set Global Context

    return (
        <GlobalContext.Provider
            value={{
                ...context
            }}
        >
           {children}
        </GlobalContext.Provider>
    )

}
export default Globals