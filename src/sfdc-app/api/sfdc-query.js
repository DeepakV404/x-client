import { gql } from "@apollo/client";

import { ACCOUNT_USER_FRAGMENT, RESOURCE_REPORT_FRAGMENT } from "../../pages/library/api/library-fragments";
import { ACCOUNT_MEMBER_FRAGMENT, CONTACT_FRAGMENT } from "../../pages/accounts/api/accounts-fragment";
import { BUYER_FRAGMENT } from "../../buyer-view/api/buyers-fragment";
import { SFDC_ROOM_FRAGMENT } from "./sfdc-fragment";

export const SFDC_GLOBALS = gql`
    query SFDCGlobals{
        orgDetail{
            tenantName
        }
        sellers{
            _id
            uuid
            firstName
            lastName
            profileUrl
        }
    }
`;

export const SFDC_ROOMS = gql`
    ${SFDC_ROOM_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query SFDCRooms($page: String!, $id: String!, $emailId: String!){
        _sfdcGetRooms(page: $page, id: $id, emailId: $emailId){
            isMapped
            page
            code
            message
            mappedRoom{
                ...SFDCRoomFragment
            }
            availableRooms{
                ...SFDCRoomFragment
                buyers{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                    status
                }
                latestActivity{
                    type
                    activityData
                    createdAt
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
            }
            accountRooms{
                ...SFDCRoomFragment
                buyers{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                    status
                }
                latestActivity{
                    type
                    activityData
                    createdAt
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
            }
        }
    }
`;

export const SFDC_ROOM = gql`
    query SFDCRoom($roomUuid: String!){
        room(roomUuid: $roomUuid){
            _id
            uuid
            isJourneyEnabled
        }
    }
`;

export const SFDC_ROOM_RESOURCES = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    query SFDCResources($roomUuid: String!, $input: ResourceFilterInput, $sortBy: ResourceSortBy, $pageConstraint: PageConstraint!){
        _rResources(roomUuid: $roomUuid, input: $input, sortBy: $sortBy, pageConstraint: $pageConstraint){
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
            }
            report{
                timeSpent
                views
                uniqueViews
                lastViewedAt
                lastViewedBy{
                    ...AccountMemberFragment
                }
            }
        }
    }
`;

export const SFDC_ROOM_TEMPLATES = gql`
    query SFDCRoomTemplates{
        roomTemplates{
            _id
            uuid
            title
            description
            createdAt
        }
    }
`;

export const SFDC_JOURNEY_STAGES = gql`
    query SFDCJourneyStageStubs($roomUuid: String!){
        _rJourneyStageStubs(roomUuid: $roomUuid){
            _id
            uuid
            linkName
            title
            status
            isEnabled
        }
    }
`;

export const SFDC_STAGE_ACTION_POINTS = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query SFDC_ActionPoints($roomUuid: String!, $stageLinkName: String!){
        _rActionPoints(roomUuid: $roomUuid, stageLinkName: $stageLinkName){
            _id
            uuid
            title
            description
            order
            dueAt
            createdStakeholderType
            createdByUuid
            actionPointData
            status
            assignedSellers{
                ...AccountUserFragment
            }
        }
    }
`;

export const SFDC_STAGE_RESOURCES = gql`
    ${RESOURCE_REPORT_FRAGMENT}
    query SFDC_StageResources($roomUuid: String, $stageLinkName: String!){
        _rStageResources(roomUuid: $roomUuid, stageLinkName: $stageLinkName){
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
            }
            report{
                ...ResourceReportFragment
            }
        }
    }
`;

export const SFDC_CONTACTS_BY_OPPORTUNITY = gql`
    query SFDCGetContactsByOpportunity($opportunityId: String!){
        _sfdcGetContactsByOpportunity(opportunityId: $opportunityId){
            name
            firstName
            lastName
            emailId
            contactId
            isPrimary    
        }
    }
`;

export const GET_ROOMS_BY_ACCOUNT   =   gql`
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query GetRoomsByAccount($accountId: String!){
        _crmGetRoomsByAccount(accountId: $accountId) {
            uuid
            title
            engagementStatus
            currentStage{
                uuid
                name
                label
                isCRMDealStageMapped
                properties
            }
            crmInfo{
                id
                type
                url
                name
            }
            buyers{
                uuid
                firstName
                lastName
                profileUrl
                emailId
            }
            buyerAccount{
                uuid
                companyName
            }
            sellers{
                uuid
                firstName
                lastName
                emailId
                profileUrl
                status
                role
                calendarUrl
                isOwner
            } 
            latestActivity{
                type
                activityData
                createdAt
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
        }
    }
`