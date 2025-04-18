import { FC, createContext, useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client";

import { HUBSPOT_GLOBALS } from "./api/hubspot-query";
import { APIHandler } from "../api-handler";

import Loading from "../utils/loading";

interface HubspotGlobalContextProps 
{
    $sellers    :   any[];
    $orgDetail  :   any;
}

export const HubspotGlobalContext = createContext<HubspotGlobalContextProps>({
    $sellers    :   [],
    $orgDetail  :   null
});

interface GlobalsProps
{
    children    :   JSX.Element
}

const HubspotGlobals : FC<GlobalsProps> = (props) => {

    const { children }  =   props;

    const { data, loading, error }  =   useQuery(HUBSPOT_GLOBALS, {
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
        <HubspotGlobalContext.Provider
            value={{
                ...context
            }}
        >
           {children}
        </HubspotGlobalContext.Provider>
    )

}
export default HubspotGlobals