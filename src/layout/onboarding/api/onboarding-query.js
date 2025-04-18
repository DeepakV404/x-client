import { gql } from "@apollo/client";


export const ONBOARDING_META = gql`
    query OnboardingMeta{
        onboardingDetails
        orgDetail{
            tenantName
            typeCode
            logoUrl
        }
        me{
            emailId
        }
    }
`;

export const USER_DETAIL = gql`
    query UserDetail{
        me{
            uuid
            firstName
            lastName
            emailId
            designation
            profileUrl
        }
    }
`;

export const ORG_DETAIL = gql`
    query OrgDetail{
        orgDetail{
            companyName
            websiteUrl
            logoUrl
        }
    }
`;

export const LINK = gql`
    query Deck($deckUuid: String!){
        deck(deckUuid: $deckUuid){
            uuid
            title
        }
    }
`;