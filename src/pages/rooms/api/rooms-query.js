
import { gql } from "@apollo/client";
import { ACCOUNT_MEMBER_FRAGMENT, CONTACT_FRAGMENT, ROOM_RESOURCE_FRAGMENT } from "../../accounts/api/accounts-fragment";
import { ROOM_AP_STATS_FRAGMENT, ROOM_SELLER_RESOURCE_FRAGMENT, ROOM_STAGE_FRAGMENT, ROOM_USER_FRAGMENT } from "./rooms-fragment";
import { ACCOUNT_USER_FRAGMENT, RESOURCE_CONTENT_FRAGMENT, RESOURCE_REPORT_FRAGMENT } from "../../library/api/library-fragments";
import { BUYER_FRAGMENT } from "../../../buyer-view/api/buyers-fragment";

export const ROOMS = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    ${ROOM_STAGE_FRAGMENT}
    query Rooms($filter: RoomFilterInput, $pageConstraint: PageConstraint, $sortBy: RoomSortByInput){
        rooms(filter: $filter, pageConstraint: $pageConstraint, sortBy: $sortBy){
            _id
            uuid
            title
            createdAt
            language
            isDiscoveryEnabled
            buyerPortalLink
            isProtected
            crmInfo{
                id
                type
                name
                url
            }
            region{
                uuid
                name
            }
            buyers{
                ...ContactFragment
            }
            sellerAccount{
                title
                logoUrl
                type
            }
            totalTimeSpent
            totalInteractions
            previewLink
            currentStage{
                ...RoomStageFragment
            }
            status
            engagementStatus
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
            createdBy{
                ...AccountUserFragment
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
            buyerAccount{
                _id
                uuid
                companyName
                industryType
                category
                logoUrl
                websiteUrl
                twitterUrl
                linkedInUrl
                createdAt
            }
            template{
                uuid
                title
                isDeleted
            }
            badgeCount
        }
    }
`;

export const ROOM = gql`
    ${CONTACT_FRAGMENT}
    ${ROOM_USER_FRAGMENT}
    ${ROOM_SELLER_RESOURCE_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${ROOM_STAGE_FRAGMENT}
    query RoomInfo($roomUuid: String!){
        room(roomUuid: $roomUuid){
            _id
            uuid
            createdAt
            title
            welcomeContent
            isJourneyEnabled
            isDiscoveryEnabled
            currentStage{
                ...RoomStageFragment
            }
            previewLink
            buyerPortalLink
            metadata
            isProtected
            status
            calendarUrl
            engagementStatus
            crmInfo{
                id
                type
                name
                url
            }
            properties
            region{
                uuid
                name
            }
            pitchVideo{
                ...RoomSellerResourceFragment
            }
            sellerAccount{
                title
                logoUrl
                type
            }
            buyers{
                ...ContactFragment
            }
            owner{
                ...AccountUserFragment
                role
                status
                calendarUrl
                linkedInUrl
            }
            buyerAccount{
                _id
                uuid
                companyName
                industryType
                logoUrl
                websiteUrl
                linkedInUrl
                twitterUrl
                createdAt
            }
            users{
                ...RoomUserFragment
            }
            language
            properties
        }
    }
`;

export const ROOM_PORTAL_LINK = gql`
    query RoomInfo($roomUuid: String!){
        room(roomUuid: $roomUuid){
            buyerPortalLink
        }
    }
`;

export const ROOM_RESOURCES = gql`
    ${RESOURCE_REPORT_FRAGMENT}
    ${RESOURCE_CONTENT_FRAGMENT}
    query Room_Resources($roomUuid: String!, $input: ResourceFilterInput, $sortBy: ResourceSortBy, $pageConstraint: PageConstraint!){
        _rResources(roomUuid: $roomUuid, input: $input, sortBy: $sortBy, pageConstraint: $pageConstraint){
            uuid
            title
            type
            description
            createdAt
            categories{
                uuid
                name
            }
            content{
                ...ResourceContentFragment
            }
            report{
                ...ResourceReportFragment
            }
        }
    }
`;

export const ROOM_RESOURCE = gql`
    ${ACCOUNT_MEMBER_FRAGMENT}
    ${RESOURCE_CONTENT_FRAGMENT}
    query Room_Resource($roomUuid: String!, $resourceUuid: String!){
        _rResource(roomUuid: $roomUuid, resourceUuid: $resourceUuid){
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

export const ROOM_ACTIVITIES = gql`
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query RoomActivities($roomUuid: String!){
        roomActivities(roomUuid: $roomUuid){
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
  
`;

export const OVERALL_ROOM_INSIGHTS = gql`
    query OverallRoomInsights($roomUuid: String!){
        overAllRoomInsight(roomUuid: $roomUuid){
            totalTimeSpent
            timeSpentOnUsecase
            timeSpentOnContent
            timeSpentOnPitchVideo
            totalInteractions
            linksClicked
        }
    }
`;

export const CONTRIBUTIONS_BY_BUYER = gql`
    ${CONTACT_FRAGMENT}
    query ContributionsByBuyer($roomUuid: String!){
        contributionsByBuyer(roomUuid: $roomUuid){
            buyer
            {
                ...ContactFragment
            }
            timeSpent
        }
    }
`;
  
export const ENGAGEMENT_BY_CONTENT = gql`
    query EngagementsByContent($roomUuid: String!){
        engagementsByContent(roomUuid: $roomUuid)
    }
`;

export const ACTION_POINTS_REPORT = gql`
    query ActionPointsReport($roomUuid: String!){
        actionPointsReport(roomUuid: $roomUuid){
            totalActionPoints
            completedActionPoints
        }
    }
`;

export const ENGAGEMENTS_BY_BUYER = gql`
    ${CONTACT_FRAGMENT}
    query EngagementsByBuyer($roomUuid: String!){
        engagementsByBuyer(roomUuid: $roomUuid){
            buyer{
                ...ContactFragment
            }
            timeSpentOnUsecase
            timeSpentOnContent
            timeSpentOnPitchVideo
        }
    }  
`;

export const ROOM_REPORT_BY_BUYER = gql`
    query RoomReportByBuyer($roomUuid: String!, $contactUuid: String!){
        roomReportByBuyer(roomUuid: $roomUuid, contactUuid: $contactUuid){
            totalTimeSpent
            completedActionPoints
            createdActionPoints
            timeSpentOnContent
            timeSpentOnUsecase
            timeSpentOnPitch
            totalInteractions
            linksClicked
        }
    }
`

export const ROOM_ACTIVITIES_BY_BUYER = gql`
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query RoomActivitiesByBuyer($roomUuid: String!, $contactUuid: String!){
        roomActivitiesByBuyer(roomUuid: $roomUuid, contactUuid: $contactUuid){
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
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
            }
        }
    }
`

export const CONTENT_REPORTS_BY_BUYER = gql`
    query ContentReportsByBuyer($roomUuid: String!, $contactUuid: String!){
        contentReportsByBuyer(roomUuid: $roomUuid, contactUuid: $contactUuid){
            resource{
                _id
                uuid
                title
                type
                description
                content{
                type
                url
                thumbnailUrl
                }
                createdAt
            }
            timeSpent
            views
            lastViewedAt
        }
    }
`;

export const R_ACTION_POINTS = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query R_ActionPoints($roomUuid: String!, $stageUuid: String!){
        _rActionPoints(roomUuid: $roomUuid, stageUuid: $stageUuid){
            uuid
            title
            type
            category
            status
            order
            isEnabled
            dueAt
            textContent
            meetingLink
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
                }
                report{
                    downloadCount
                    timeSpent
                    views
                    uniqueViews
                    lastViewedAt
                }
            }
            assignedBuyers{
                ...ContactFragment
            }
            assignedSellers{
                ...AccountUserFragment
            }
            meetingRecording{
                _id
                uuid
                title
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
    }
`;

export const R_ACTION_POINT = gql`
    ${CONTACT_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${BUYER_FRAGMENT}
    query R_ActionPoint($roomUuid: String!, $actionPointUuid: String!){
        _rActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid){
            uuid
            title
            description
            type
            category
            status
            order
            isEnabled
            dueAt
            meetingLink
            meetingNotes
            meetingMom
            meetingJoinLink
            textContent
            totalComments
            calendarInfo{
                type
                linkedUser{
                    uuid
                }
                link
            }
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
                    uploadStatus
                }
                report{
                    downloadCount
                    timeSpent
                    views
                    uniqueViews
                    lastViewedAt
                }
            }
            resources{
                _id
                uuid
                title
                type
                description
                createdAt
                resourceOrigin
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                    uploadStatus
                }
                report{
                    downloadCount
                    timeSpent
                    views
                    uniqueViews
                    lastViewedAt
                }
                createdStakeholder{
                    _id
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
                ...on BuyerContactOutput{
                    ...BuyerFragment
                }
                ...on ContactOutput{
                    ...ContactFragment
                }
            }
        }
    }
`;

export const R_ACTION_POINT_COMMENTS = gql`
    ${ACCOUNT_USER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query R_ActionPointComments($roomUuid: String!, $actionPointUuid: String!){
        _rActionPointComments(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid){
            uuid
            comment
            createdAt
            metadata
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

export const STAGES_REPORT = gql`
    query StagesReport($roomUuid: String!){
        stagesReport(roomUuid: $roomUuid){
            totalStages
        completedStages
        }
    }
`;

export const R_JOURNEY_STAGE = gql`
    query R_JourneyStage($roomUuid: String!, $stageUuid: String!){
        _rJourneyStage(roomUuid: $roomUuid, stageUuid: $stageUuid){
            _id
            uuid
            linkName
            status
            title
            description
            isEnabled
            isHidden
            totalActionPoints
        }
    }
`;


export const R_JOURNEY_STAGE_STUBS = gql`
    query R_JourneyStageStubs($roomUuid: String!){
        _rJourneyStageStubs(roomUuid: $roomUuid){
            uuid
            linkName
            status
            title
            order
            isEnabled
            isHidden
            totalActionPoints
            completedActionPoints
        }
    }
`;

export const R_USECASES = gql`
    query R_Usecases($roomUuid: String!){
        _rUsecases(roomUuid: $roomUuid){
            uuid
            title
            order
            description
            hasSelfServe
            hasWalkthrough
            hasVideo
            categories{
                uuid
                name
            }
        }
    }
`;

export const R_USECASE_CATEGORIES = gql`
    query R_Usecase_Categories($roomUuid: String!){
        _rUsecaseCategories(roomUuid: $roomUuid){
            _id
            uuid
            name
            usecasesCount
        }
    }
`

export const R_USECASE = gql`
    ${ROOM_SELLER_RESOURCE_FRAGMENT}
    query R_Usecase($usecaseUuid: String!){
        _rUsecase(usecaseUuid: $usecaseUuid){
            uuid
            title
            description
            categories{
                uuid
                name
            }
            walkthrough{
                ...RoomSellerResourceFragment
            }
            video{
                ...RoomSellerResourceFragment
            }
        }
    }
`;

export const R_DISCOVERY_QUESTIONS = gql`
    query R_DiscoveryResponses($roomUuid: String!){
        _rDiscoveryResponses(roomUuid: $roomUuid){
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
            status
            response
            respondedAt
        }
    }
`;

export const R_SECTIONS = gql`
    query R_Sections($roomUuid: String!, $filter: SectionFilterInput){
        _rSections(roomUuid: $roomUuid, filter: $filter){
            uuid
            title
            type
            order
            isHidden
            emoji
        }
    }
`;

export const R_SECTION = gql`
    query R_Section($roomUuid: String!, $sectionUuid: String!){
        _rSection(roomUuid: $roomUuid, sectionUuid: $sectionUuid){
            uuid
            title
            order
            isHidden
            emoji
            isProtected
            visibleBuyers{
                uuid
                emailId
                firstName
                lastName
                profileUrl
                status
            }
            widgets{
                uuid
                title
                description
                order
                type
                isHidden
                components{
                    uuid
                    order
                    content
                }
            }
        }
    }
`;

export const SECTION_BY_UUID = gql`
    query R_SectionUuidByType($roomUuid: String!, $type: String!){
        _rSectionUuidByType(roomUuid: $roomUuid, type: $type)
    }
`;

export const GET_TOTAL_ROOMS = gql`
    query GetTotalRooms($filter: RoomFilterInput){
        getTotalRooms(filter: $filter)
    }
`;

export const ROOM_COMMENTS = gql`
    query RoomComments($roomUuid: String!, $filter: CommentFilterInput){
        _rRoomComments(roomUuid: $roomUuid, filter: $filter){
            uuid
            origin
            comment
            createdStakeholderType
            createdAt
            metadata
            createdStakeholder{
                _id
                uuid...on AccountUserOutput{
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
        }
    }
`;

export const USER_ROLES = gql`
    query UserRole{
        userRoles
        {
            uuid
            name
        }
    }
`;

export const R_HANDOFF_HISTORY = gql`
    ${ROOM_STAGE_FRAGMENT}
    query HandoffHistory($roomUuid: String!){
        _rHandoffsHistory(roomUuid: $roomUuid){
            _id
            uuid
            room{
                _id
                uuid
                title
                welcomeContent
                createdAt
                language
            }
            note
            handedFrom{
                _id
                uuid
                firstName
                emailId
                status
                role
                lastName
                profileUrl
            }
            handedTo{
                _id
                uuid
                firstName
                emailId
                status
                role
                lastName
                profileUrl
            }
            type
            fromStage{
                ...RoomStageFragment
            }
            toStage{
                ...RoomStageFragment
            }
            attachments{
                uuid
                title
                blobUrl
                contentType
                extension
            }
            createdBy{
                _id
                uuid
                firstName
                emailId
                status
                role
                lastName
                profileUrl
            }
            createdAt
        }
    }
`

export const R_WIDGET_CATALOG = gql`
    query WidgetCatalog{
        widgetCatalog{
            uuid
            name
            thumbnailUrl
        }
    }
`;

export const R_CRM_GET_CONTACTS_BY_DEAL = gql`
    query CRM_GetContactsByDeal($dealId: String!){
        _crmGetContactsByDeal(dealId: $dealId){
            name
            firstName
            lastName
            emailId
            contactId
            isPrimary
        }
    }
`;


export const ROOM_TASK_PROGRESS = gql`
    query Room_Task_progress($roomUuid: String!){
        _rdTaskCompletionTime(roomUuid: $roomUuid){
            user{
                uuid
                firstName
                lastName
            }
            totalCompletedTasks
            completionTimeInfo
        }
    }
`;

export const ROOM_BUYER_ROLE_MAPPINGS = gql`
    query Room_Buyer_Role_Mappings($roomUuid: String!){
        _rBuyerRoleMappings (roomUuid: $roomUuid){
            role{
                uuid
                name
                properties
            }
            buyers{
                uuid
                firstName
                lastName
            }
        }
    }
`;


export const ROOM_DASHBOARD_OVERALL = gql`
    ${ROOM_AP_STATS_FRAGMENT}
    ${ACCOUNT_MEMBER_FRAGMENT}
    ${ACCOUNT_USER_FRAGMENT}
    ${CONTACT_FRAGMENT}
    query RD_OverAll($roomUuid: String!){
        _rdOverAll(roomUuid: $roomUuid){
            recentSellerActivity{
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
            overAllApStats{
                ...APStats
            }
            sellerWiseApStats{
                sellerStub{
                    uuid
                    firstName
                    lastName
                    emailId
                    profileUrl
                }
                apStats{
                    ...APStats
                }
            }
            stageWiseApStats{
                simpleStage{
                    uuid
                    title
                }
                apStats{
                    ...APStats
                }
                sellerWiseApStats{
                    sellerStub{
                        uuid
                        firstName
                        lastName
                        emailId
                        profileUrl
                    }
                    apStats{
                        ...APStats
                    }
                }
            }
        }
    }
`;

export const R_SECTION_CATALOG = gql`
    query R_SectionCatalog($roomUuid: String!){
        _rSectionCatalog(roomUuid: $roomUuid){
            uuid
            title
            type
            emoji
            isHidden
            isAdded
        }
    }
`