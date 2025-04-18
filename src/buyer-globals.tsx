import { FC, createContext, useEffect, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from 'uuid';

import { BUYER_GLOBALS, P_SECTIONS } from "./buyer-view/api/buyers-query";
import { BuyerAgent } from "./buyer-view/api/buyer-agent";
import { ERROR_CONFIG } from "./config/error-config";
import { CommonUtil } from "./utils/common-util";
import { APIHandler } from "./api-handler";

import SomethingWentWrong from "./components/error-pages/something-went-wrong";
import LocalCache from "./config/local-storage";
import Loading from "./utils/loading";
import i18n from "./i18n";

interface BuyerContextProps {
    $categories :   any[];
    $buyerData  :   {
        buyers  :   any[];
        companyName         :   string;
        metadata            :   any;
        isJourneyEnabled    :   boolean;
        logoUrl             :   string;
        welcomeContent      :   string;
        pitchVideo          :   any;
        sellerAccount       :   any;
        linkdata            :   any;
        portalType          :   any;
        properties          :   any;
    }   |   null;
    $buyerUsecases          :   any;
    $allUsers               :   any[];
    $isDemo                 :   boolean;
    $mailSubmitted          :   boolean;
    $setMailSubmission      :   (arg0: any) => void;
    $companyCategory        :   any;
    $tenantName             :   string;
    $orgProperties          :   any
    $sellers                :   any
    $fileListProps          :   any
    $showPreviewForm        :   boolean,
    $setShowPreviewForm     :   (arg0: any) => void;
    $isMobile               :   boolean
}

export const BuyerGlobalContext = createContext<BuyerContextProps>({
    $categories                 :   [],
    $buyerData                  :   null,
    $buyerUsecases              :   [],
    $allUsers                   :   [],
    $isDemo                     :   false,
    $mailSubmitted              :   false,
    $setMailSubmission          :   () => {},
    $companyCategory            :   null,
    $tenantName                 :   "",
    $orgProperties              :   "",
    $sellers                    :   [],
    $fileListProps              :   {},
    $showPreviewForm            :   false,
    $setShowPreviewForm         :   () => {},
    $isMobile                   :   false,
});

interface BuyerGlobalContextProps
{
    children    :   JSX.Element
}

const BuyerGlobals : FC<BuyerGlobalContextProps> = (props) => {

    const { children }  =   props;

    const [showMailSubmitted, setShowMailSubmitted]         =   useState(false);
    const [showPreviewForm, setShowPreviewForm]             =   useState(false)
    const [sessionId, setSessionId]                         =   useState<any>(null);
    const [isMobile, setIsMobile]                           =   useState(false)
    const [emailParamLoading, setEmailParamLoading]         =   useState(false);

    // Initialize client object

    const $client = useApolloClient();

    let portalAccessToken = window.location.pathname.split("/")[2];

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    useEffect(() => {
        let viewport: any = document.querySelector("meta[name=viewport]");
        
        if (!viewport) {
          viewport = document.createElement("meta");
          viewport.name = "viewport";
          document.head.appendChild(viewport);
        }
    
        viewport.setAttribute("content", "width=device-width, maximum-scale=1.0, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes");
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                setIsMobile(true);
                document.body.classList.add("mobile");
            } else {
                setIsMobile(false);
                document.body.classList.remove("mobile");
            }
        };

        handleResize();
        
        window.addEventListener("resize", handleResize);
    
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);    

    const [fileListForMultipleUpload, setFileListForMultipleUpload]   =   useState([]);

    const fileListProps = {
        fileListForMultipleUpload,
        setFileListForMultipleUpload,
    };
    
    // Get Global context data

    const { data, loading, error }  =   useQuery(BUYER_GLOBALS, {
        fetchPolicy: "network-only",
        variables: {
            isPreview   :   CommonUtil.__getQueryParams(window.location.search).preview ? true : false
        }
    });

    const { data: sData, loading: sLoading, error: sError } = useQuery(P_SECTIONS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        let setupLocalCache = () => {   
            let cache = LocalCache.getData(portalAccessToken)
            if(cache){
                if(!cache.resourceTracking){
                    cache["resourceTracking"]   =   {}
                    LocalCache.setData(portalAccessToken, cache)
                }
            }else{
                LocalCache.setData(portalAccessToken, {"resourceTracking" : {}})
            }
        }

        setupLocalCache()
    }, [])

    useEffect(() => {
        if(data && data.buyerAccount.language){
            i18n.changeLanguage(data.buyerAccount.language)
        }
    }, [data])

    const getSessionId = () => {
        if(data?.buyerAccount?.linkdata?.sessionUuid) {
            const updatedSessionId = data?.buyerAccount?.linkdata?.sessionUuid;
            const cacheData = LocalCache.getData(portalAccessToken);
            cacheData["buyerSessionId"] = updatedSessionId;
            LocalCache.setData(portalAccessToken, cacheData);
            return Promise.resolve(updatedSessionId);
        }else if(LocalCache.getData(portalAccessToken).buyerSessionId){
            return new Promise((resolve, reject) => {
                BuyerAgent.checkSession({
                variables: {
                    sessionUuid: LocalCache.getData(portalAccessToken).buyerSessionId
                },
                onCompletion: (hasSessionData: any) => {
                    if(hasSessionData.hasSession) {
                        resolve(LocalCache.getData(portalAccessToken).buyerSessionId);
                    }else{
                        const buyerSessionId = uuidv4();
                        BuyerAgent.createSession({
                            variables: {
                                sessionUuid: buyerSessionId
                            },
                            onCompletion: () => {
                                const cacheData = LocalCache.getData(portalAccessToken);
                                cacheData["buyerSessionId"] = buyerSessionId;
                                LocalCache.setData(portalAccessToken, cacheData);
                                resolve(buyerSessionId);
                            },
                            errorCallBack: (error: any) => {
                                reject(error);
                            }
                        });
                    }
                },
                errorCallBack: (error: any) => {
                    reject(error);
                }
                });
            });
        }else{
            const buyerSessionId = uuidv4();
            return new Promise((resolve, reject) => {
                BuyerAgent.createSession({
                    variables: {
                        sessionUuid: buyerSessionId
                    },
                    onCompletion: () => {
                        const cacheData = LocalCache.getData(portalAccessToken);
                        cacheData["buyerSessionId"] = buyerSessionId;
                        LocalCache.setData(portalAccessToken, cacheData);
                        resolve(buyerSessionId);
                    },
                    errorCallBack: (error: any) => {
                        reject(error);
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error);
                    }
                });
            });
        }
    };

    useEffect(() => {
        if(data){
            if(data.buyerAccount.linkdata.isDiscoveryEnabled){
                getSessionId()
                    .then((id: string) => setSessionId(id))
                    .catch((error) => {
                        console.error("Error retrieving session ID:", error);
                    })
            }
        }
    }, [data])
   
    const urlParams             =   new URLSearchParams(window.location.search);
    const urlEmail              =   (urlParams.get("bs_emailId") || urlParams.get("bs_email"));

    const createRoom = (templateId: string, token: string, emailId: string) => {
        let data = {
            "emailId"           :   emailId,
        } 
        fetch(`${import.meta.env.VITE_STATIC_REST_URL}/v1/rooms/${templateId}?source=gated`, { method: 'POST', body: JSON.stringify(data),  headers: {'Content-Type': 'application/json', 'BS-API-KEY' : `${token}`} })
            .then((response: any) => response.json())
            .then((response: any) => window.open(response.link, "_self")) 
        }
    
    useEffect(() => {
        if(urlEmail && data){
            setEmailParamLoading(true)
            createRoom(data?.buyerAccount?.linkdata?.templateUuid, data?.buyerAccount?.linkdata?.apiKey, urlEmail)
        }
    }, [data])

    if(loading) return <Loading/>

    // Get Global context data
    
    if(loading || sLoading || emailParamLoading) return <Loading/>
    if(error || sError) return <SomethingWentWrong/>

    // Set Global Context

    const setMailSubmission = (value: boolean) => {
        setShowMailSubmitted(value)
    }

    const context = {
        $categories                 :   data.categories,
        $buyerData                  :   data.buyerAccount,
        $buyerUsecases              :   data.buyerUsecases,
        $allUsers                   :   data.buyerAccount.buyers.concat(data.sellers),
        $isDemo                     :   data.buyerAccount.sellerAccount.type === "DEMO",
        $mailSubmitted              :   showMailSubmitted,
        $setMailSubmission          :   setMailSubmission,
        $companyCategory            :   data.buyerAccount.category,
        $tenantName                 :   data.buyerAccount.sellerAccount.tenantName,
        $orgProperties              :   data._pOrgProperties,
        $sellers                    :   data.sellers,
        $isDiscoveryEnabled         :   data.buyerAccount.linkdata.isDiscoveryEnabled,
        $sessionId                  :   data.buyerAccount.linkdata.isDiscoveryEnabled ? sessionId : null,
        $customSections             :   sData._pSections,
        $fileListProps              :   fileListProps,
        $showPreviewForm            :   showPreviewForm,
        $setShowPreviewForm         :   setShowPreviewForm, 
        $isMobile                   :   isMobile,
    }

    // Set Global Context

    return (
        <BuyerGlobalContext.Provider
            value={{
                ...context
            }}
        >
            {
                children
            }
        </BuyerGlobalContext.Provider>
    )

}
export default BuyerGlobals