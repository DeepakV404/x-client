import { gql } from "@apollo/client";

export const P_GET_PORTAL_INFO = gql`
    query P_Get_Portal_Info{
        _pGetPortalInfo{
            portalType
            accessType
            logoUrl
        }
    }
`

export const BUYER_DECK = gql`
    query D_BuyerDeck{
        _dBuyerDeck{
            uuid
            title
            description
            copyLink
            logoUrl
            type
            settings
        }
    }
`;

export const BUYER_DECK_RESOURCES = gql`
    query D_BuyerDeckResources{
        _dBuyerDeckResources{
            uuid
            title
            type
            description
            content{
                type
                url
                extension
                thumbnailUrl
                downloadableUrl
            }
            createdAt
            isNew
        }
    }
`;

export const D_RESOURCE_PAGE_REPORT_BY_BUYER    =   gql`
    query D_Resource_Page_Report_By_Buyer($deckUuid: String, $buyerUuid: String, $resourceUuid: String!){
        _dResourcePageReportByBuyer(deckUuid: $deckUuid, buyerUuid : $buyerUuid, resourceUuid : $resourceUuid){
            page
            timeSpent
        }
    }
`