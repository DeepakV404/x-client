import { gql } from "@apollo/client";

import { ACCOUNT_MEMBER_FRAGMENT } from "../../accounts/api/accounts-fragment";
import { ACCOUNT_USER_FRAGMENT, RESOURCE_CONTENT_FRAGMENT, RESOURCE_REPORT_FRAGMENT } from "./library-fragments";

export const RESOURCES = gql`
    ${RESOURCE_REPORT_FRAGMENT}
    query Resources($input: ResourceFilterInput!, $sortBy: ResourceSortBy, $pageConstraint: PageConstraint!, $includeAllResource: Boolean){
        resources(input: $input, sortBy: $sortBy, pageConstraint: $pageConstraint, includeAllResource: $includeAllResource){
            _id
            uuid
            title
            createdAt
            type
            report{
                ...ResourceReportFragment
            }
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
        }
    }  
`;

export const CATEGORIES = gql`
    query Categories{
        categories{
            uuid
            name
        }
    }
`;

export const GET_LINK_META_DATA = gql`
    query GetLinkMetaData($link: String!){
        _pGetLinkMetadata(link: $link){
            ogTitle
            ogImage
        }
    }
`;

export const RESOURCE = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    query Resource($resourceUuid: String!){
        resource(resourceUuid: $resourceUuid){
            _id
            uuid
            title
            description
            type
            content{
                type
                url
                thumbnailUrl
                properties
            }
            categories{
                uuid
                name
            }
            createdAt
            report{
                shareCount
                downloadCount
                timeSpent
                views
                uniqueViews
                lastViewedAt
                lastViewedBy{
                    ...AccountMemberFragment
                }
            }
            roomReports{
                roomStub{
                    _id
                    uuid
                    title
                    accountStub{
                        uuid
                    }
                }
                report{
                    timeSpent
                    viewDetails{
                        viewer{
                            ...AccountMemberFragment
                        }
                        timeSpent
                        views
                        firstViewedAt
                        lastViewedAt
                    }
                }
            }
        }
    }
`;

export const RESOURCE_REPORT = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    query ResourceReport($resourceUuid: String!){
        resourceReport(resourceUuid: $resourceUuid){
            _id
            uuid
            title
            description
            type
            content{
                type
                url
                thumbnailUrl
                properties
            }
            categories{
                uuid
                name
            }
            createdAt
            report{
                shareCount
                downloadCount
                timeSpent
                views
                uniqueViews
                lastViewedAt
                lastViewedBy{
                    ...AccountMemberFragment
                }
            }
            roomReports{
                roomStub{
                    _id
                    uuid
                    title
                    accountStub{
                        uuid
                    }
                }
                report{
                    timeSpent
                    viewDetails{
                        viewer{
                            ...AccountMemberFragment
                        }
                        timeSpent
                        views
                        firstViewedAt
                        lastViewedAt
                    }
                }
            }
        }
    }
`;

export const FOLDERS = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query Folders($folderUuid: String){
        folders(folderUuid: $folderUuid){
            _id
            uuid
            title
            description
            subfoldersCount
            resourcesCount
            createdBy{
                ...AccountUserFragment
            }
            createdAt
        }
    }
`;

export const GET_FOLDER_PATH = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query GetFolderPath($folderUuid: String!){
        getFolderPath(folderUuid: $folderUuid){
            _id
            uuid
            title
            description
            subfoldersCount
            resourcesCount
            createdBy{
                ...AccountUserFragment
            }
            createdAt
        }
    }
`;

export const RESOURCE_DEPENDENCIES = gql`
    query ResourceDependencies($resourceUuid: String!){
        resourceDependencies(resourceUuid: $resourceUuid)
    }
`;
export const FOLDER = gql`
    query Folder($folderUuid: String!){
        folder(folderUuid: $folderUuid){
            uuid
            title
            description
            subfoldersCount
            resourcesCount
        }
    }
`;

export const HOME_RESOURCES_COUNT = gql`
    query HomeResourcesCount{
        getLibraryRootCounts
    }
`;


// DECK


export const DECKS = gql`
    query Decks($filter: DeckFilterInput!){
        decks(filter: $filter){
            uuid
            title
            description
            previewLink
            copyLink
            resourcesCount
            createdAt
            isDeckEnabled
            tags{
                uuid
                name
                properties
            }
            createdBy{
                uuid
                firstName
                emailId
                lastName
                profileUrl
                status
            }
            type
            settings
            tags{
                uuid
                name
            }
        }
    }
`;

export const DECKS_V2 = gql`
    query DecksV2($filter: DeckFilterInput!){
        decksV2(filter: $filter)
    }
`;

export const DECKS_COUNT = gql`
    query Decks($filter: DeckFilterInput!){
        decks(filter: $filter){
            uuid
        }
    }
`;

export const DECK = gql`
    query Deck($deckUuid: String!){
        deck(deckUuid: $deckUuid){
            uuid
            title
            description
            previewLink
            copyLink
            resourcesCount
            createdAt
            isDeckEnabled
            createdBy{
                uuid
                firstName
                emailId
                lastName
                profileUrl
                status
            }
            isDeckEnabled
            type
            settings
        }
    }
`;

export const DECK_ANALYTICS = gql`
    query DeckAnalytics ($deckUuid: String!){
        deckAnalytics(deckUuid: $deckUuid) {
            sharedWith
            timeSpent
            views
            uniqueViews
            downloadCount
            reshareCount
        }
    }
`;

export const DECK_VIEWS = gql`
    query deckViews($deckUuid: String!){
        deckViews(deckUuid: $deckUuid) {
            buyer{
                uuid
                emailId
                firstName
                lastName
                profileUrl
                status
                type
                company
                buyerContext
            }
            timeSpent
            lastViewedAt
            views
            resourceViews{
                resource{
                    uuid
                    title
                    type
                }
                timeSpent
                lastViewedAt
                views
                downloadCount
            }
        }
    }
`;

export const DECK_RESOURCES = gql`
    query deckResources($deckUuid: String!){
        deckResources(deckUuid: $deckUuid){
            uuid
            title
            type
            description
            categories{
                uuid
                name
            }
            content{
                type
                url
                extension
                uploadStatus
                thumbnailUrl
                downloadableUrl
            }
            createdAt
            isHidden
            report{
                shareCount
                downloadCount
                timeSpent
                views
                uniqueViews
                lastViewedAt
                lastViewedBy{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                }
            }
        }
    }
`;

export const DECK_RESOURCE = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    ${RESOURCE_CONTENT_FRAGMENT}
    query DeckResource($deckUuid: String!, $resourceUuid: String!){
        deckResource(deckUuid: $deckUuid, resourceUuid: $resourceUuid){
            _id  
            uuid
            title
            type
            description
            content{
                ...ResourceContentFragment
            }
            createdAt
            categories{
                uuid
                name
            }
            report{
                timeSpent
                views
                uniqueViews
                lastViewedAt
                lastViewedBy{
                    ...AccountMemberFragment
                }
                viewDetails{
                    viewer{
                        ...AccountMemberFragment
                    }
                    timeSpent
                    views
                    firstViewedAt
                    lastViewedAt
                }
            }
        }
    }
`;

export const D_TAGS = gql`
    query D_Tags{
        _dTags{
            uuid
            name
            properties
        }
    }
`;

export const D_RESOURCE_TIMELINE_REPORT_BY_BUYER = gql`
    query D_ResourceTimelineReportByBuyer($deckUuid: String, $resourceUuid: String!, $buyerUuid: String){
        _dResourceTimelineReportByBuyer(deckUuid: $deckUuid, resourceUuid: $resourceUuid, buyerUuid: $buyerUuid)
    }
`

// DECK ⬆️

// FileUpload Query

export const REQUEST_BLOB_URLS = gql`
    query RequestBlobUrls($contentType: String!, $numberOfParts: Int!){
        requestBlobUrls(contentType: $contentType, numberOfParts: $numberOfParts){
            uploadId
            contentUuid
            urls   
        }
    }
`;