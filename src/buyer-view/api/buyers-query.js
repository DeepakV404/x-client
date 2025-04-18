import { gql } from "@apollo/client";
import { ACCOUNT_USER_FRAGMENT, BUYER_FRAGMENT, BUYER_RESOURCE_FRAGMENT, MANAGER_FRAGMENT, PORTAL_RESOURCE_FRAGMENT, RESOURCE_CONTENT_FRAGMENT, SELLER_ACCOUNT_FRAGMENT, SELLER_FRAGMENT, USECASE_GROUP_FRAGMENT } from "./buyers-fragment";
import { CATEGORIES_FRAGMENT } from "../../pages/library/api/library-fragments";
import { CONTACT_FRAGMENT } from "../../pages/accounts/api/accounts-fragment";
import { ORG_PROPERTIES } from "../../pages/settings/api/settings-query";

export const BUYER_GLOBALS = gql`
    ${SELLER_ACCOUNT_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${MANAGER_FRAGMENT}
    ${BUYER_RESOURCE_FRAGMENT}
    ${CATEGORIES_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    query BuyerGlobals($isPreview: Boolean){
        categories{
            ...CategoriesFragment
        }
        buyerUsecases{
            uuid
            title
            order
            description
            hasWalkthrough
            hasVideo
            hasWatched
            hasViewed
            categories{
                uuid
                name
            }
        }
        buyerAccount(isPreview: $isPreview){
            _id
            uuid
            metadata
            companyName
            category
            logoUrl
            isJourneyEnabled
            welcomeContent
            portalType
            calendarUrl
            linkdata
            language
            properties
            buyers{
                ...BuyerFragment
            }
            sellerAccount{
                ...SellerAccountFragment
            }
            pitchVideo{
                ...BuyerResourceFragment
            }
            owner{
                ...AccountUserFragment
            }
            properties
        } 
        sellers{
            ...ManagerFragment
        }
        _pOrgProperties
    }
`;

export const BUYER_USECASE = gql`
    ${BUYER_RESOURCE_FRAGMENT}
    query BuyerUsecase($usecaseUuid: String!){
        buyerUsecase(usecaseUuid: $usecaseUuid){
            uuid
            title
            selfServe{
                ...BuyerResourceFragment
            }
            walkthrough{
                ...BuyerResourceFragment
            }
            video{
                ...BuyerResourceFragment
            }
        }
    }
`;

export const BUYER_RESOURCE = gql`
    ${RESOURCE_CONTENT_FRAGMENT}
    query BuyerResource($resourceUuid: String!){
        buyerResource(resourceUuid: $resourceUuid){
            uuid
            title
            type
            description
            categories{
                uuid
                name
            }
            createdAt
            content{
                ...ResourceContentFragment
            }
        }
    }
`;

export const BUYER_RESOURCES = gql`
    ${RESOURCE_CONTENT_FRAGMENT}
    query BuyerResources($input:  ResourceFilterInput, $sortBy: ResourceSortBy $pageConstraint: PageConstraint!){
        buyerResources(input: $input, sortBy: $sortBy, pageConstraint: $pageConstraint){
            uuid
            title
            type
            description
            categories{
                uuid
                name
            }
            createdAt
            content{
                ...ResourceContentFragment
            }
        }
    }
`;

export const BUYER_JOURNEY_STAGES = gql`
    query JourneyStages{
        buyerJourneyStages{
            uuid
            linkName
            title
            totalActionPoints
            completedActionPoints
            isEnabled
        }
    }
`;

export const STAGE_ACTION_POINTS = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query ActionPoints($stageUuid: String!){
        buyerActionPointsStub(stageUuid: $stageUuid){
            uuid
            title
            description
            type
            status
            order
            isEnabled
            dueAt
            totalComments
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...AccountUserFragment
            }
            createdStakeholder{
                uuid
                ...on AccountUserOutput{
                    ...AccountUserFragment
                }
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
                ...on ContactOutput{
                    ...ContactFragment
                }
            }
            meetingLink
            meetingNotes
            meetingJoinLink
            meetingMom
            resources{
                uuid
                title
                type
                description
                createdAt
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                }
            }
            meetingRecording{
                uuid
                title
                type
                description
                createdAt
                content{
                    type
                    url
                    thumbnailUrl
                    properties
                }
            }
        }
    }
`;

export const STAGE_RESOURCES = gql`
    ${PORTAL_RESOURCE_FRAGMENT}
    query StageResources($stageUuid: String!){
        buyerStageResources(stageUuid: $stageUuid){
            ...PortalResourceFragment
        }
    }
`;

export const BUYER_JOURNEY_STAGE = gql`
    ${CONTACT_FRAGMENT}
    ${MANAGER_FRAGMENT}
    query BuyerJourneyStage($stageUuid: String!){
        buyerJourneyStage(stageUuid: $stageUuid){
            _id
            uuid
            linkName
            description
            status
            title
            totalActionPoints
            completedActionPoints
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...ManagerFragment
            }
        }
    }
`;

export const BUYER_ACTION_POINT = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query BuyerActionPoint($actionPointUuid: String!){
        buyerActionPoint(actionPointUuid: $actionPointUuid){
            uuid
            title
            description
            type
            status
            order
            isEnabled
            dueAt
            meetingLink
            meetingNotes
            meetingJoinLink
            meetingMom
            totalComments
            textContent
            meetingRecording{
                _id
                uuid
                title
                type
                description
                createdAt
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                    properties
                }
            }
            resources{
                _id
                uuid
                title
                type
                description
                createdAt
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                }
                createdStakeholder{
                    uuid
                    ...on AccountUserOutput{
                        ...AccountUserFragment
                    }
                    ...on BuyerContactOutput{
                        ...BuyerFragment
                    }
                    ...on ContactOutput{
                        ...ContactFragment
                    }
                }
            }
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...AccountUserFragment
            }
            createdStakeholder{
                uuid
                ...on AccountUserOutput{
                    ...AccountUserFragment
                }
                ...on ContactOutput{
                    ...ContactFragment
                }
            }
        }
    }
`;

export const BUYER_INVITE_REASONS = gql`
    query BuyerInviteReasons{
        buyerInviteReasons{
            _id
            uuid
            name
        }
    }
`;

export const BUYER_FAQS = gql`
    query Faqs{
        faqs{
            uuid
            question
            answer
        }
    }
`;

export const P_ACTION_POINT_COMMENTS = gql`
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query P_ActionPointComments($actionPointUuid: String!){
        _pActionPointComments(actionPointUuid: $actionPointUuid){
            uuid
            comment
            metadata
            createdAt
            createdStakeholderType
            createdStakeholder{
                _id
                uuid
                ...on AccountUserOutput{
                    ...AccountUserFragment
                }
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
            }
        }
    }
`;

export const BUYER_LANDING = gql`
    query BuyerLanding($isPreview: Boolean){
        _pBuyerPortalLinks{
            _id
            uuid
            emailId
            firstName
            lastName
            profileUrl
            status
            link
        }
        _pBuyerAccount(isPreview: $isPreview){
            uuid
            companyName
            logoUrl
            language
            genericRoomLinkTitle
            sellerAccount{
                title
                logoUrl
                type
                customDomain
            }
        }
    }
`;

export const BUYER_USECASES = gql`
    query BuyerUsecases{
        buyerUsecases{
            uuid
            title
            order
            description
            hasWalkthrough
            hasVideo
            categories{
                uuid
                name
            }
            hasWatched
            hasViewed
        }
    }
`;

export const P_USECASE_CATEGORIES = gql`
    query P_Usecase_Categories{
        _pUsecaseCategories{
            _id
            uuid
            name
            usecasesCount
        }
    }
`;

export const P_GET_TOUCH_POINTS = gql`
    query P_GetTouchPoints($sessionUuid: String!){
        _pTouchPoints(sessionUuid: $sessionUuid){
            uuid
            type: category
            target
        }
    }
`;

export const P_GET_TOUCH_POINT_QUESTION = gql`
    query P_GetTouchPointsQuestion($sessionUuid: String!, $touchPointUuid: String!){
        _pGetTouchPointQuestion(sessionUuid: $sessionUuid, touchPointUuid: $touchPointUuid){
            _id
            uuid
            question
            type
            options{
                uuid
                value
            }
        }
    }
`;

export const P_TRIGGERED_QUESTIONS = gql`
    query P_TriggeredQuestions($sessionUuid: String!){
        _pTriggeredQuestions(sessionUuid: $sessionUuid){
            uuid
            questionUuid
            question{
                uuid
                question
                type
                options{
                    uuid
                    value
                }
                isMandatory
            }
                    status
            respondedAt
                    response
                    responseUuid
                    respondedBy
                    {
                    uuid
            emailId
            firstName
            lastName
            profileUrl
            status
                    }
        }
    }
`;

export const P_ALL_QUESTIONS = gql`
    query P_AllQuestions($sessionUuid: String!){
        _pAllQuestions(sessionUuid: $sessionUuid){
            uuid
            question{
                uuid
                question
                type
                options{
                    uuid
                    value
                }
            isMandatory
            }
            response
            status
        }
    }
`;

export const P_DISCOVERY_STATS = gql`
    query P_DiscoveryStats($sessionUuid: String!){
        _pDiscoveryStats(sessionUuid: $sessionUuid)
    }
`;

export const P_SECTIONS = gql`
    query P_Sections{
        _pSections{
            _id
            uuid
            title
            type
            order
            isEnabled
            emoji
            isNew
        }
    }
`;

export const P_SECTION = gql`
    query P_Section($sectionUuid: String!){
        _pSection(sectionUuid: $sectionUuid){
            _id
            uuid
            title
            order
            isEnabled
            emoji
            isProtected
            records{
                uuid
                order
                title
                type
                richText{
                    content
                    title
                }
                resource{
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
                        extension
                        uploadStatus
                        thumbnailUrl
                        downloadableUrl
                    }
                    createdAt
                }
            }
            widgets{
                uuid
                title
                description
                order
                type
                components{
                    uuid
                    order
                    content
                }
            }
        }
    }
`;

export const P_ORG_PROPERTIES = gql`
query P_OrgProperties{
    _pOrgProperties
}`

export const P_ROOM_COMMENTS = gql`
    query P_RoomComments($filter: CommentFilterInput){
        _pRoomComments(filter: $filter){
            uuid
            origin
            comment
            createdStakeholderType
            createdStakeholder{
                _id
                uuid
                ...on AccountUserOutput{
                    uuid
                    firstName
                    lastName
                    profileUrl
                    emailId
                    role
                }
                ...on ContactOutput{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                }
                ...on BuyerContactOutput{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                }
            }
            createdAt
            metadata
        }
    }
`;

export const BUYER_UNREAD_NOTIFICATIONS = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query P_UnreadCommentsAndMessages{
        _pUnreadComments{
            uuid
            comment
            createdStakeholderType
            createdStakeholder{
                uuid
                ...on AccountUserOutput{
                    ...AccountUserFragment
                }
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
                ...on ContactOutput{
                    ...ContactFragment
                }
            }
            createdAt
            metadata
        }
        _pUnreadMessages{
            uuid
            comment
            createdStakeholderType
            createdStakeholder{
                uuid
                ...on AccountUserOutput{
                    ...AccountUserFragment
                }
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
                ...on ContactOutput{
                    ...ContactFragment
                }
            }
            createdAt
            metadata
        }
    }   
`;

export const GET_PORTAL_TYPE = gql`
    query GetPortalType{
        _pGetPortalType
    }
`;

export const P_REQUEST_BLOB_URLS = gql`
    query P_RequestBlobUrls($contentType: String!, $numberOfParts: Int!){
        _pRequestBlobUrls(contentType: $contentType, numberOfParts: $numberOfParts){
            uploadId
            contentUuid
            urls   
        }
    }
`;