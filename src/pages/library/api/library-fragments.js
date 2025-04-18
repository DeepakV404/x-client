import { gql } from "@apollo/client";

export const ACCOUNT_USER_FRAGMENT = gql`
    fragment AccountUserFragment on AccountUserOutput{
        uuid
        firstName
        lastName
        emailId
        profileUrl
    }
`;

export const RESOURCE_REPORT_FRAGMENT = gql`
    fragment ResourceReportFragment on ResourceReport{
        shareCount
        downloadCount
        timeSpent
        views
        uniqueViews
        lastViewedAt
    }
`;

export const CATEGORIES_FRAGMENT = gql`
    fragment CategoriesFragment on TagOutput{
        uuid
        name
    }
`;

export const RESOURCE_FRAGMENT = gql`
    fragment ResourceFragment on PublicResourceOutput{
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
        report{
            shareCount
            downloadCount
        }
    }
`;

export const RESOURCE_CONTENT_FRAGMENT = gql`
    fragment ResourceContentFragment on ResourceContent{
        type
        url
        extension
        uploadStatus
        thumbnailUrl
        downloadableUrl
        properties
    }
`;