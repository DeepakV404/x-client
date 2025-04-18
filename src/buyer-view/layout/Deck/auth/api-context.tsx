import { FC } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { v4 as uuidv4 } from 'uuid';
import { CommonUtil } from '../../../../utils/common-util';
import { VALID_APP_SUB_DOMAINS } from '../../../../constants/module-constants';

const getApiEndpoint = () => {
    if(VALID_APP_SUB_DOMAINS.includes(CommonUtil.__getSubdomain(window.location.origin))){
        return `${window.location.origin}/graphql`
    }else if(CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
        return `${import.meta.env.VITE_SFDC_APP_ENDPOINT}/graphql`
    }else if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app"){
        return `${import.meta.env.VITE_HS_APP_ENDPOINT}/graphql`
    }else{
        return `${import.meta.env.VITE_API_ENDPOINT}/graphql`
    }
}

const httpLink = new HttpLink({
    uri: getApiEndpoint()
})

const uploadLink = createUploadLink({ 
    uri: getApiEndpoint()
});

const _getXsrfToken = (cookieName: string) => {

    let $cookie = document.cookie;

    var cookies = ` ${$cookie}`.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] == ` ${cookieName}`) {
            return cookie[1];
        }
    }
    return "";
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if(graphQLErrors){
        graphQLErrors.forEach(({ message }) =>
            console.log(`Error : [message]: ${message}`)
        );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const addEmailIdToHeaderLink = new ApolloLink((operation, forward) => {
    const token         =   window.location.pathname.split("/portal/")[1];
    const tenantName    =   window.location.pathname.split("/")[1];
    const portalId      =   window.location.pathname.split("/")[2];

    let headers: any = {
        "j-buyerstage-room-token"   :   token,
        "BS-TENANT-NAME"            :   tenantName
    }

    let localEmail          = localStorage.getItem(`bs_user_email_${portalId}`);
    let localAnonymousId    = localStorage.getItem(`bs_user_id_${portalId}`);
    if(localEmail){
        headers["BS-Deck-EmailId"] = localEmail
    }else if(localAnonymousId){
        headers["BS-Deck-UniqueId"] = localAnonymousId
    }else{
        let anonymousId = uuidv4();
        localStorage.setItem(`bs_user_id_${portalId}`, anonymousId)
        headers["BS-Deck-UniqueId"] = anonymousId
    }

    _getXsrfToken("XSRF-TOKEN") ? (headers["X-XSRF-TOKEN"] = _getXsrfToken("XSRF-TOKEN")) : null
    operation.setContext({
        headers: headers,
    });
    return forward(operation);
});
  
const _getLink = () => {
    return addEmailIdToHeaderLink.concat(uploadLink).concat(httpLink).concat(errorLink)
}

export const client = new ApolloClient({
    link    :   _getLink(),
    cache   :   new InMemoryCache(),
    name    :   '',
    version :   '1.0'
});

interface ApiContextProps
{
    children    :   JSX.Element,
}

const DeckApiContext : FC<ApiContextProps> = (props) => {

    const { children }  =   props;

    return (
        <ApolloProvider client={client}>
           {children}
        </ApolloProvider>
    )

}
export default DeckApiContext