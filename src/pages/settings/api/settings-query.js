import { gql } from "@apollo/client";
import { ACCOUNT_USER_FRAGMENT } from "../../accounts/api/accounts-fragment";
import { ROOM_STAGE_FRAGMENT } from "../../rooms/api/rooms-fragment";

export const FAQS = gql`
    query Faqs{
        faqs{
            uuid
            question
            answer
        }
    }
`;

export const CATEGORIES = gql`
    query UsecaseCategories{
        usecaseCategories{
            _id
            uuid
            name
        }
    }
`;

export const RESOURCE_CATEGORIES =gql`
    query Categories {
        categories{
            _id
            uuid
            name
        } 
    }  
`;

export const REGIONS = gql`
    query Regions{
        regions{
            uuid
            name
        }
    }
`;

export const USERS = gql`
    query Users{
        users{
            _id
            uuid
            firstName
            lastName
            emailId
            lastName
            profileUrl
            calendarUrl
            status
            role
            regions{
                uuid
                name
            }
        }
    }
`;

export const ORG_INTEGRATIONS = gql`
    query OrgIntegrations{
        orgIntegrations
    }
`;

export const HS_CREATE_CONNECTION_URL = gql`
    query HsCreateConnectionUrl{
        _hsCreateConnectionUrl
    }
`
export const SLACK_CREATE_CONNECTION_URL = gql`
    query SlackCreateConnectionUrl{
        _slackCreateConnectionUrl
    }
`

export const SLACK_LIST_CHANNEL = gql`
    query slackListChannel{
        _slackListChannels
    }
`

export const DELETED_USERS = gql`
    query DeletedUsers{
        deletedUsers{
            _id
            uuid
            firstName
            emailId
            status
            role
            lastName
            profileUrl
            calendarUrl
        }
    }
`;

export const ORG_PROPERTIES = gql`
    query OrgProperties{
        orgProperties
    }
`;

export const MP_OVERVIEW =  gql`
    query MP_Overview{
        _mpOverview{
            tagline
            industries{
                uuid
                name
            }
            categories{
                group{
                   name
                }
                tags{
                   uuid
                   name
                }
            }
            description
        }
    }
`;

export const MP_OVERVIEW_VIDEO = gql`
    query MP_Overview_Video{
        _mpOverview{
            productVideo{
                uuid
                title
                description
                type
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
    }
`;


export const MP_RESOURCES = gql`
    query MP_Resources{
        _mpResources{
            uuid
            title
            description
            type
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
`;

export const MP_PAGES = gql`
    ${ACCOUNT_USER_FRAGMENT}
    query MP_Pages{
        _mpPages{
            uuid
            template{
                uuid
                title
                description
                welcomeContent
                language
                createdAt
                isDeleted
            }
            status
            targetAudience{
                group{
                   name
                }
                tags{
                   uuid
                   name
                }
            }
            createdBy{
                ...AccountUserFragment
            }
            createdAt
        }
    }
`;

export const MP_INDUSTRIES = gql`
    query MP_Industries{
        _mpIndustries{
            uuid
            name
        }
    }
`;

export const MP_CATEGORIES = gql`
    query MP_Categories{
        _mpCategories{
            group{
                name
            }
            tags{
                uuid
                name
            }
        }
    }
`;

export const MP_TARGET_AUDIENCE = gql`
    query MP_TargetAudience{
        _mpTargetAudience{
            group{
                name
            }
            tags{
                uuid
                name
            }
        }
    }
`;

export const ENGAGEMENT_STATUS_SETTINGS = gql`
    query EngagementStatusSettings{
        engagementStatusSettings
    }
`;

export const GET_CONNECTION_URL = gql`
    query GetConnectionUrl($type: IntegrationType!){
        getConnectionUrl(type: $type)
    }
`;

export const ROOM_STAGES = gql`
    ${ROOM_STAGE_FRAGMENT}
    query RoomStages{
        roomStages{
            ...RoomStageFragment
        }      
    }
`;

export const GET_USER_INVITATION_LINK = gql`
    query GetUserInvitationLink($userUuid: String!){
        getUserInvitationLink(userUuid: $userUuid)
    }
`;

export const RESTRICTED_FEATURES = gql`
    query RestrictedFeatures{
        restrictedFeatures
    }
`;

export const GET_CHECKOUT_DETAIL = gql`
    query GetCheckoutDetail($plan: String!, $cycle: BillingCycle!){
        getCheckoutDetail(plan: $plan, cycle: $cycle){
            url
        }
    }
`;