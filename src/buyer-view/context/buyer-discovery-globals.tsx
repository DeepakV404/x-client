import { createContext, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { P_GET_TOUCH_POINTS } from "../api/buyers-query";
import { BuyerGlobalContext } from "../../buyer-globals";

import SomethingWentWrong from "../../components/error-pages/something-went-wrong";

export const BuyerDiscoveryContext: any = createContext(null);

const BuyerDiscoveryGlobals = (props: any) => {

    const { children }  =   props;

    const { $isDiscoveryEnabled, $sessionId }   =   useContext<any>(BuyerGlobalContext);

    const [_getTouchPoints, { data, error }]  =   useLazyQuery(P_GET_TOUCH_POINTS, {
        fetchPolicy: "network-only",
    })

    const [showInitalPopup, setShowInitialPopup]    =   useState({
        visibility      :   false,
        touchpointData  :   null  
    });

    const [showPopup, setShowPopup] =   useState({
        visibility  :   true, 
        triggerId   :   ""
    });
    
    useEffect(() => {
        if($isDiscoveryEnabled && $sessionId){
            _getTouchPoints({
                variables: {
                    sessionUuid:    $sessionId
                }
            })
        }
    }, [$sessionId])

    if(error) return <SomethingWentWrong/>

    const context: any = {
        touchPoints :   data ? data._pTouchPoints : [],
        showPopup,
        setShowPopup,
        showInitalPopup,
        setShowInitialPopup 
    }

    return (
        <BuyerDiscoveryContext.Provider
            value={{
                ...context
            }}
        >
            {children}
        </BuyerDiscoveryContext.Provider>
    )
}

export default BuyerDiscoveryGlobals