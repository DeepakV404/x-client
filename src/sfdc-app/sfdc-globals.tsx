import { FC, createContext, useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client";

import { SFDC_GLOBALS } from "./api/sfdc-query";
import { APIHandler } from "../api-handler";

import Loading from "../utils/loading";

interface SFDCGlobalContextProps 
{
    $sellers    :   any[];
    $orgDetail  :   any;
}

export const SFDCGlobalContext = createContext<SFDCGlobalContextProps>({
    $sellers    :   [],
    $orgDetail  :   null
});

interface GlobalsProps
{
    children    :   JSX.Element
}

const SFDCGlobals : FC<GlobalsProps> = (props) => {

    const { children }  =   props;

    const { data, loading, error }  =   useQuery(SFDC_GLOBALS, {
        fetchPolicy: "network-only"
    });

    // Initialize client object

    const $client = useApolloClient();

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    // Initialize client object

    if(loading) return <Loading/>
    if(error) return <div>Error...</div>

    // Set Global Context

    const context = {
        $sellers        :   data.sellers,
        $orgDetail      :   data.orgDetail
    }

    return (
        <SFDCGlobalContext.Provider
            value={{
                ...context
            }}
        >
           {children}
        </SFDCGlobalContext.Provider>
    )

}
export default SFDCGlobals