import { Suspense, useEffect } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';

import { P_GET_PORTAL_INFO } from '../layout/Deck/API/deck-query';
import { APIHandler } from '../../api-handler';

import BuyerDiscoveryGlobals from '../context/buyer-discovery-globals';
import BuyerThemeConfig from '../../theme-configs/buyer-theme-config';
import DeckPortalInterceptor from '../layout/Deck/portal-interceptor';
import BuyerGlobals from '../../buyer-globals';
import Loading from '../../utils/loading';
import BuyersLayout from '../layout';

export const DECK_PORTAL    =   "DECK_PORTAL";
export const DECK_PREVIEW   =   "DECK_PREVIEW";
export const ROOM_PORTAL    =   "ROOM_PORTAL";

const BuyerRouter = () => {

    const $client               =   useApolloClient();

    useEffect(() => {
        APIHandler.initialize($client)
    }, [$client]);

    const { data, loading }  =   useQuery(P_GET_PORTAL_INFO, {
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>

    const PORTAL_TYPE   =   data?._pGetPortalInfo?.portalType;
    const ACCESS_TYPE   =   data?._pGetPortalInfo?.accessType;
    const LOGO_URL      =   data?._pGetPortalInfo?.logoUrl;

    const getBuyerChild = () => {
        if(PORTAL_TYPE === DECK_PORTAL || PORTAL_TYPE === DECK_PREVIEW){
            return (
                <DeckPortalInterceptor accessType={ACCESS_TYPE} logo={LOGO_URL}/>
            )
        }else {
            return (
                <BuyerGlobals>
                    <BuyerDiscoveryGlobals>
                        <Suspense fallback={<Loading/>}>
                            <BuyerThemeConfig>
                                <Suspense fallback={<Loading/>}>
                                    <BuyersLayout/>
                                </Suspense>
                            </BuyerThemeConfig>
                        </Suspense>
                    </BuyerDiscoveryGlobals>
                </BuyerGlobals>
            )
        }
    }

    return (
        <>
            {getBuyerChild()}
        </>
    )
}

export default BuyerRouter