import { gql } from "@apollo/client";
import { ACCOUNT_MEMBER_FRAGMENT, CONTACT_FRAGMENT } from "./accounts-fragment";
import { ROOM_RESOURCE_FRAGMENT, SIMPLE_PUBLIC_RESOURCE_FRAGMENT } from "../../templates/api/room-template-fragment";
import { ACCOUNT_USER_FRAGMENT, RESOURCE_CONTENT_FRAGMENT, RESOURCE_REPORT_FRAGMENT } from "../../library/api/library-fragments";

export const ACCOUNTS = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query Accounts($filter: AccountFilterInput, $pageConstraint: PageConstraint){
        accounts(filter: $filter, pageConstraint: $pageConstraint){
            _id
            uuid
            companyName
            industryType
            logoUrl
            createdAt
            region{
                uuid
                name
            }
            latestActivity{
                roomStub{
                    _id
                    uuid
                    title
                    welcomeContent
                    createdAt
                }
                type
                activityData
                createdAt
                createdStakeholder{
                    _id
                    uuid
                    ...on AccountUserOutput{
                        ...AccountUserFragment
                    }
                    ...on ContactOutput{
                        ...ContactFragment
                    }
                    ...on AccountMemberOutput{
                        ...AccountMemberFragment
                    }

                }
            }
            websiteUrl
            twitterUrl
            region {
                uuid
                name
            }
            linkedInUrl
            activeRoomUuid
            roomCount
            members{
                ...AccountMemberFragment
            }
        }
    }
`;

export const ACCOUNT = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query Account($accountUuid: String!){
        account(accountUuid: $accountUuid){
            _id
            uuid
            companyName
            industryType
            logoUrl
            industryType
            logoUrl
            region{
                uuid
                name
            }
            websiteUrl
            twitterUrl
            linkedInUrl
            members{
                ...AccountMemberFragment
            }
            rooms{
                _id
                uuid
                title
                createdAt
                previewLink
                buyers{
                    ...ContactFragment
                }
                totalTimeSpent
                totalInteractions
                crmInfo{
                    id
                    name
                    type
                    url
                }
                latestActivity{
                    type
                    activityData
                    createdAt
                    createdStakeholder{
                        _id
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
            latestActivity{
                roomStub{
                   _id
                   uuid
                   title
                   welcomeContent
                   createdAt 
                }
                type
                activityData
                createdAt
                createdStakeholder{
                    _id
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
    }
`;

export const R_JOURNEY_STAGE_RESOURCE = gql`
    query R_JourneyStageResources($roomUuid: String, $stageUuid: String!){
        _rStageResources(roomUuid: $roomUuid, stageUuid: $stageUuid){
            uuid
            title
            type
            description
            createdAt
            resourceOrigin
            categories{
                uuid
                name
            }
            content{
                type
                url
                thumbnailUrl
                extension
            }
        }
    }
`;

export const R_JOURNEY_STAGE_ACTION_POINTS = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    query R_JourneyStageActionPoints($roomUuid: String!, $stageUuid: String!){
        _rActionPoints(roomUuid: $roomUuid, stageUuid: $stageUuid){
            _id
            uuid
            title
            description
            type
            status
            order
            isEnabled
            dueAt
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...AccountUserFragment
            }
            createdStakeholderType
            createdByUuid
            actionPointData
        }
    }
`;

export const R_JOURNEY_STAGE_ACTION_POINT = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    query R_JourneyStageActionPoint($roomUuid: String!, $actionPointUuid: String!){
        _rActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid){
            _id
            uuid
            title
            description
            type
            status
            order
            isEnabled
            dueAt
            calendarInfo{
                type
                linkedUser{
                    uuid
                }
                link
            }
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...AccountUserFragment
            }
            createdStakeholderType
            createdByUuid
            actionPointData
        }
    }
`;

export const R_USECASE = gql`
    ${ROOM_RESOURCE_FRAGMENT}
    query RT_Usecase($usecaseUuid: String!){
        _rUsecase(usecaseUuid: $usecaseUuid){
            uuid
            title
            selfServe{
                ...RoomResourceFragment
            }
            walkthrough{
                ...RoomResourceFragment
            }
            video{
                ...RoomResourceFragment
            }
        }
    }
`;

export const R_USECASE_GROUPS = gql`
    query R_UsecaseGroups($roomUuid: String!){
        _rUsecaseGroups(roomUuid: $roomUuid){
            group{
                name
                uuid
            }
            usecases{
                uuid
                title
            }
        }
    }
`;

// insight queries

export const R_BUYER_PORTAL_LINKS = gql`
    query R_BuyerPortalLinks($roomUuid: String!){
        _rBuyerPortalLinks(roomUuid: $roomUuid){
            _id
            uuid
            emailId
            firstName
            lastName
            profileUrl
            status
            link
            role{
                _id
                uuid
                name
            }
            crmSynced
        }
    }
`;

export const R_CONTENT_REPORT = gql`
    query ContentReports($roomUuid: String!){
        contentReports(roomUuid: $roomUuid){
            timeSpent
            views
            lastViewedAt
            resource{
                _id
                uuid
                title
                type
                content{
                    type
                    thumbnailUrl
                    url
                }
            }
        }
    }
`;

export const LOOK_UP_ACCOUNT = gql`
    query LookUpAccount($title: String){
        lookupAccount(title: $title){
            status
            data{
                name
                domain
                logoUrl
                industryType
                websiteUrl
                linkedInUrl
                twitterUrl
            }
        }
    }
`;

export const SIMPLE_ACCOUNT = gql`
    query SimpleAccount($accountUuid: String!){
        simpleAccount(accountUuid: $accountUuid){
            _id
            uuid
            companyName
            industryType
            logoUrl
            websiteUrl
            linkedInUrl
            twitterUrl
            createdAt
            region {
                uuid
                name
            }
        }
    }
`;

export const GET_TOTAL_ACCOUNTS = gql`
    query GetTotalAccounts($filter: AccountFilterInput){
        getTotalAccounts(filter: $filter)
    }
`