import { gql } from "@apollo/client";

export const SELLER_FRAGMENT = gql`
    fragment SellerFragment on OrgDetailOutput{
        title
        logoUrl
        type
    }
`;

export const SELLER_ACCOUNT_FRAGMENT = gql`
    fragment SellerAccountFragment on SellerAccount{
        title
        logoUrl
        type
        calendarUrl
        tenantName
    }
`;

export const BUYER_FRAGMENT = gql`
    fragment BuyerFragment on BuyerContactOutput{
        _id
        uuid
        firstName
        lastName
        emailId
        profileUrl
        isCurrentBuyer
        status
    }
`;

export const MANAGER_FRAGMENT = gql`
    fragment ManagerFragment on  AccountUserOutput{
        _id
        uuid
        firstName
        lastName
        profileUrl
        emailId
        status
    }
`;

export const ACCOUNT_USER_FRAGMENT = gql`
    fragment AccountUserFragment on  AccountUserOutput{
        _id
        uuid
        firstName
        lastName
        emailId
        profileUrl
        role
        linkedInUrl
    }
`;

export const BUYER_RESOURCE_FRAGMENT = gql`
    fragment BuyerResourceFragment on PortalSellerResourceOutput{
        _id
        uuid
        title
        type
        content{
            type
            url
            thumbnailUrl
            extension
        }
        createdAt
    }
`;

export const PORTAL_RESOURCE_FRAGMENT = gql`
    fragment PortalResourceFragment on PortalResourceOutput{
        uuid
        title
        type
        categories{
            uuid 
            name
        }
        content{
            type
            url
            thumbnailUrl
            downloadableUrl
            extension
            properties
        }
        createdAt
    }
`;

export const USECASE_GROUP_FRAGMENT = gql`
    fragment UsecaseGroupFragment on UsecaseCategory{
        uuid
        name
    }
`;

export const RESOURCE_CONTENT_FRAGMENT = gql`
    fragment ResourceContentFragment on ResourceContent{
        type
        url
        thumbnailUrl
        extension
        properties
    }
`;