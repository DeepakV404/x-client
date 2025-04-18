import { gql } from "@apollo/client";
import { CATEGORIES_FRAGMENT } from "../../pages/library/api/library-fragments";
import { ACCOUNT_USER_OUTPUT } from "../../pages/accounts/api/accounts-fragment";

export const GLOBALS = gql`
    ${CATEGORIES_FRAGMENT}
    ${ACCOUNT_USER_OUTPUT}
    query Globals{
        betaFeaturePermissions
        categories{
            ...CategoriesFragment
        }
        sellers{
            _id
            uuid
            firstName
            lastName
            profileUrl
            status
            emailId
            calendarUrl
        }
        orgDetail{
            companyName
            logoUrl
            type
            typeCode
            websiteUrl
            linkedInUrl
            twitterUrl
            instagramUrl
            industryType
            subdomain
            tenantName
            apiKey
            owner{
                ...AccountUserFragment
            }
            templateLink
            webhookLink
            customDomain
            planDetail{
                expiryInDays
                currentPlan
                cycle
                purchasedUsers
                remainingUsers
                isTrial
            }
            crmDetail
        }
        me{
            ...AccountUserFragment
            userHash
            type
            designation
        }
    }
`;

export const ALL_ENTITY_COUNT = gql`
    query AllEntityCount{
        allEntityCount
    }
`;