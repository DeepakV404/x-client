import { gql } from "@apollo/client";
import { ACCOUNT_USER_FRAGMENT, RESOURCE_FRAGMENT } from "../../library/api/library-fragments";
import { SIMPLE_PUBLIC_RESOURCE_FRAGMENT, USECASE_FRAGMENT } from "./room-template-fragment";

export const SIMPLE_ROOM_TEMPLATES = gql`
    query RoomTemplates{
        roomTemplates{
            uuid
            title
            description
        }
    }
`;

export const ROOM_TEMPLATES = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query RoomTemplates{
        roomTemplates{
            _id
            uuid
            title
            createdAt
            description
            welcomeContent
            language
            regions{
                uuid
                name
            }
            roomCount
            previewLink
            isDiscoveryEnabled
            createdBy{
                ...AccountUserFragment
            }
            sellerAccount{
                title
                logoUrl
                type
            }
        }
    }
`;

export const ROOM_TEMPLATE = gql`
    ${SIMPLE_PUBLIC_RESOURCE_FRAGMENT}
    query RoomTemplate($uuid: String!){
        roomTemplate(uuid: $uuid){
            _id
            uuid
            title
            welcomeContent
            isJourneyEnabled
            isDiscoveryEnabled
            calendarUrl
            language
            previewLink
            leadGenLink
            isGated
            properties
            regions{
                uuid
                name
            }
            pitchVideo{
                ...SimplePublicResourceFragment
            }
            createdBy{
                uuid
                firstName
                lastName
                calendarUrl
                profileUrl
                linkedInUrl
                emailId
            }
            sellerAccount{
                title
                logoUrl
                type
                calendarUrl
            }
        }
    }
`;

export const RT_JOURNEY_STAGE_STUBS = gql`
    query RT_JourneyStageStubs($templateUuid: String!){
        _rtJourneyStageStubs(templateUuid: $templateUuid){
            _id
            uuid
            linkName
            title
            isEnabled
            isHidden
        }
    }
`;

export const RT_SECTIONS = gql`
    query RT_Sections($templateUuid: String!){
        _rtSections(templateUuid: $templateUuid){
            uuid
            title
            type
            order
            emoji
            isHidden
        }
    }
`;

export const RT_JOURNEY_STAGE = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query RT_JourneyStage($templateUuid: String!, $stageUuid: String!){
        _rtJourneyStage(templateUuid: $templateUuid, stageUuid: $stageUuid){
            _id
            uuid
            linkName
            description
            title
            isEnabled
            isHidden
            totalActionPoints
            assignedSellers{
                ...AccountUserFragment
            }
        }
    }
`;

export const RT_SECTION = gql`
    query RT_Section($templateUuid: String!, $sectionUuid: String!){
        _rtSection(templateUuid: $templateUuid, sectionUuid: $sectionUuid){
            uuid
            title
            order
            emoji
            isHidden
            isProtected
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
`

export const RT_JOURNEY_STAGE_RESOURCES = gql`
    ${SIMPLE_PUBLIC_RESOURCE_FRAGMENT}
    query RT_JourneyStageResources($templateUuid: String!, $stageUuid: String!){
        _rtStageResources(templateUuid: $templateUuid, stageUuid: $stageUuid){
            ...SimplePublicResourceFragment
        }
    }
`;

export const RT_JOURNEY_STAGE_ACTION_POINTS = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query RT_ActionPoints($templateUuid: String!, $stageUuid: String!){
        _rtActionPoints(templateUuid: $templateUuid, stageUuid: $stageUuid){
            _id
            uuid
            title
            description
            order
            type
            category
            isEnabled
            properties
            assignedSellers{
                ...AccountUserFragment
            }
            meetingLink
            meetingNotes
            resources{
                _id
                uuid
                title
                type
                description
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                }
                createdAt
            }
        }
    }
`;

export const RT_JOURNEY_STAGE_ACTION_POINT = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query RT_ActionPoint($actionPointUuid: String!){
        _rtActionPoint(actionPointUuid: $actionPointUuid){
            _id
            uuid
            title
            description
            order
            type
            category
            isEnabled
            actionPointData
            assignedSellers{
                ...AccountUserFragment
            }
        }
    }
`;

export const USECASE_CATEGORIES = gql`
    query UsecaseCategories{
        usecaseCategories{
            _id
            uuid
            name
            usecasesCount
        }
    }
`;


export const ALL_USECASE_CATEGORIES = gql`
    query AllUsecaseCategories{
        allUsecaseCategories{
            _id
            uuid
            name
        }
    }
`;

export const RT_USECASE_GROUPS = gql`
    query RT_UsecaseGroups($templateUuid: String!){
        _rtUsecaseGroups(templateUuid: $templateUuid){
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

export const RT_USECASE = gql`
    ${SIMPLE_PUBLIC_RESOURCE_FRAGMENT}
    query RT_Usecase($usecaseUuid: String!){
        _rtUsecase(usecaseUuid: $usecaseUuid){
            uuid
            title
            description
            order
            categories{
                uuid
                name
            }
            walkthrough{
                ...SimplePublicResourceFragment
            }
            video{
                ...SimplePublicResourceFragment
            }
        }
    }
`;

export const RT_RESOURCES = gql`
    ${SIMPLE_PUBLIC_RESOURCE_FRAGMENT}
    query RT_Resources($templateUuid: String!, $input: ResourceFilterInput, $sortBy: ResourceSortBy, $pageConstraint: PageConstraint!){
        _rtResources(templateUuid: $templateUuid, input: $input, sortBy: $sortBy, pageConstraint: $pageConstraint){
            ...SimplePublicResourceFragment
        }
    }
`;

export const RT_ACTION_POINT = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query RT_ActionPoint($actionPointUuid: String!){
        _rtActionPoint(actionPointUuid: $actionPointUuid){
            _id
            uuid
            title
            description
            order
            type
            category
            isEnabled
            dueInDays
            useOwnerCalendar
            textContent
            properties
            assignedSellers{
                ...AccountUserFragment
            }
            meetingLink
            meetingNotes
            createdBy{
                ...AccountUserFragment
            }
            calendarInfo{
                type
                link
                linkedUser{
                    uuid
                }
            }
            resources{
                _id
                uuid
                title
                type
                description
                content{
                    type
                    url
                    thumbnailUrl
                    downloadableUrl
                }
                createdAt
            }
        }
    }
`;

export const RT_USECASES = gql`
    query RT_Usecases($templateUuid: String!){
        _rtUsecases(templateUuid: $templateUuid){
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

export const RT_USECASES_CATEGORIES = gql`
    query RT_Usecase_Categories($templateUuid: String!){
        _rtUsecaseCategories(templateUuid: $templateUuid){
            _id
            uuid
            name
            usecasesCount
        }
    }
`

export const RT_FROM_DEMO_ORG = gql `
    query RoomTemplatesFromDemoOrg{
        roomTemplatesFromDemoOrg{
            _id
            uuid
            title
            description
            welcomeContent
            previewLink
        }
    }
`;

export const RT_DEPENDENCIES = gql`
    query RT_Dependencies($templateUuid: String!){
        _rtDependencies(templateUuid: $templateUuid)
    }
`;

export const RT_SECTION_CATALOG = gql`
    query RT_Section_Catalog($templateUuid: String!){
        _rtSectionCatalog(templateUuid: $templateUuid){
            uuid
            title
            type
            emoji
            isHidden
            isAdded
        }
    }
`;