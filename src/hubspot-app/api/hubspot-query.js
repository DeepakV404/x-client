import { gql } from "@apollo/client";

import { ACCOUNT_USER_FRAGMENT, RESOURCE_REPORT_FRAGMENT } from "../../pages/library/api/library-fragments";
import { ACCOUNT_MEMBER_FRAGMENT, CONTACT_FRAGMENT } from "../../pages/accounts/api/accounts-fragment";
import { BUYER_FRAGMENT } from "../../buyer-view/api/buyers-fragment";
import { HUBSPOT_ROOM_FRAGMENT } from "./hubspot-fragment";

export const HUBSPOT_GLOBALS = gql`
    query HubspotGlobals{
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

export const HUBSPOT_ROOMS = gql`
    ${HUBSPOT_ROOM_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query HubspotRooms($page: String!, $id: String!, $emailId: String!){
        _hsGetRooms(page: $page, id: $id, emailId: $emailId){
            isMapped
            page
            code
            message
            mappedRoom{
                ...HubspotRoomFragment
            }
            availableRooms{
                ...HubspotRoomFragment
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
                ...HubspotRoomFragment
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

export const HUBSPOT_ROOM_TEMPLATES = gql`
    query HubspotRoomTemplates{
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

export const HUBSPOT_CONTACTS_BY_DEAL = gql`
    query HubspotGetContactsByDeal($dealId: String!){
        _hsGetContactsByDeal(dealId: $dealId){
            name
            firstName
            lastName
            emailId
            contactId
            isPrimary    
        }
    }
`;