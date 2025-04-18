import { gql } from "@apollo/client";

export const CREATE_FAQ = gql`
    mutation CreateFaq($input: CreateFAQInput){
        createFaq(input: $input)
    }  
`;

export const DELETE_FAQ = gql`
    mutation DeleteFaq($uuid: String!){
        deleteFaq(uuid: $uuid)
    }
`;

export const UPDATE_FAQ = gql`
    mutation UpdateFaq($uuid: String!, $input: UpdateFAQInput){
        updateFaq(uuid: $uuid, input: $input)
    }
`;

export const UPDATE_ORG_DETAILS = gql`
    mutation UpdateOrgDetail($logo: Upload, $input: OrgDetailInput){
        updateOrgDetail(logo: $logo, input: $input)
    }  
`;

export const UPDATE_PERSONAL_DETAILS = gql`
    mutation UpdateUserDetail($profile: Upload, $input: AccountUserInput!){
        updateUserDetail(profile: $profile, input: $input)
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($userUuid: String!, $profile: Upload, $input: UserInput!){
        updateUser(userUuid: $userUuid, profile: $profile, input: $input)
    }
`;

export const CREATE_CATEGORIES = gql`
    mutation CreateUsecaseCategory($name: String!){
        createUsecaseCategory(name: $name)
    }
`;

export const CREATE_REGION = gql`
    mutation CreateRegion($name: String!){
        createRegion(name: $name)
    }
`;


export const CREATE_ROOM_STAGE = gql`
    mutation CreateRoomStage($roomStageInput: CreateTagInputV2!){
        createRoomStage(roomStageInput: $roomStageInput){
            uuid
            label
            properties
        }
    }
`;

export const UPDATE_REGION = gql`
    mutation UpdateRegion($uuid: String!, $name: String!){
        updateRegion(uuid: $uuid, name: $name)
    }
`;

export const UPDATE_CATEGORIES = gql`
    mutation UpdateUsecaseCategory($uuid: String!, $name: String!){
        updateUsecaseCategory(uuid: $uuid, name: $name)
    }
`;

export const UPDATE_ROOM_STAGE = gql`
    mutation UpdateRoomStage($roomStageUuid: String!, $roomStageInput: UpdateTagInput!){
        updateRoomStage(roomStageUuid: $roomStageUuid, roomStageInput: $roomStageInput){
            uuid
            label
            properties
        }
    }
`;

export const UPDATE_ROOM_STAGE_ORDER = gql`
    mutation UpdateRoomStageOrder($roomStageUuid: String!, $order: Int!){
        updateRoomStageOrder(roomStageUuid: $roomStageUuid, order: $order)
    }
`;

export const SFDC_CREATE_CONNECTION = gql`
    mutation SFDC_CreateConnection{
        _sfdcCreateConnection
    }
`;

export const SFDC_DELETE_CONNECTION = gql`
    mutation sfdcDeleteConnection {
        _sfdcDeleteConnection
    }
`

export const SLACK_JOIN_CHANNEL = gql`
    mutation SlackJoinChannel($channelId: String!, $channelName: String!) {
        _slackJoinChannel(channelId: $channelId, channelName: $channelName)
    }
`

export const ADD_USER = gql`
    mutation AddUser($profile: Upload, $input: CreateAccountUserInput!){
        addUser(profile: $profile, input: $input)
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($userUuid: String!){
        deleteUser(userUuid:$userUuid)
    } 
`;

export const UPDATE_GATED_FORM_MAPPING = gql`
    mutation UpdateGatedFormMapping($input: FormMappingInput!){
        updateFormMapping(input: $input)
    }
`;

export const UPDATE_ORG_PROPERTIES = gql`
    mutation UpdateOrgProperties($favicon: Upload, $portalOgImage: Upload, $properties: Map) {
        updateOrgProperties(favicon: $favicon, portalOgImage: $portalOgImage, properties: $properties)
    }
`

export const HS_DELETE_CONNECTION = gql`
    mutation HsDeleteConnection {
        _hsDeleteConnection
    }
`

export const DELETE_CONNECTION = gql`
    mutation DeleteConnection($type: IntegrationType!){
        deleteConnection(type: $type)
    }
`

export const SLACK_DELETE_CONNECTION = gql`
    mutation SlackDeleteConnection {
        _slackDeleteConnection
    }
`

export const DELETE_USECASE_CATEGORY = gql`
    mutation DeleteUsecaseCategory($uuid: String!) {
        deleteUsecaseCategory(uuid: $uuid)
    }
`

export const DELETE_REGION = gql`
    mutation DeleteRegion($uuid: String!) {
        deleteRegion(uuid: $uuid)
    }
`

export const DELETE_ROOM_STAGE = gql`
    mutation DeleteRoomStage($roomStageUuid: String!){
        deleteRoomStage(roomStageUuid: $roomStageUuid)
    }
`;

export const REMOVE_PROFILE_IMAGE = gql`
    mutation RemoveProfileImage {
        removeUserProfileImage
    }
`


export const REMOVE_ORG_LOGO = gql`
    mutation RemoveOrgLogo {
        removeOrgLogo
    }
`

export const REMOVE_FAVICON = gql`
    mutation RemoveFavicon {
        removeFavicon
    }
`

export const RESEND_USER_INVITE = gql`
    mutation ResendUserInvite($userUuid: String!){
        resendUserInvitation(userUuid:$userUuid)
    } 
`;

export const CREATE_RESOURCE_CATEGORY = gql`
    mutation CreateResourceCategory($name: String!){
        createResourceCategory(name:$name) 
    }
`;

export const UPDATE_RESOURCE_CATEGORY = gql`
    mutation UpdateResourceCategory($uuid:String!,$name:String!){
        updateResourceCategory(uuid:$uuid, name:$name)
    }
`;

export const DELETE_RESOURCE_CATEGORY = gql`
    mutation DeleteResourceCategory($uuid: String!){
        deleteResourceCategory(uuid: $uuid)
    }
`

// Buyerstage-Marketplace

export const MP_UPDATE_OVERVIEW = gql`
    mutation MP_UpdateOverview($overviewInput: MPOverviewInput, $videoContent: Upload){
        _mpUpdateOverview(overviewInput: $overviewInput, videoContent: $videoContent)
    }
`;

export const MP_ADD_RESOURCES = gql`
    mutation MP_AddResource($resourceInput: MPResourceInput, $content: Upload){
        _mpAddResource(resourceInput: $resourceInput, content: $content)
    }
`;

export const MP_REMOVE_RESOURCE = gql`
    mutation MP_RemoveResource($resourceUuid: String!){
        _mpRemoveResource(resourceUuid: $resourceUuid)
    }
`;

export const MP_ADD_PAGE = gql`
    mutation MP_AddPage($templateUuid: String!, $targetAudience: [String]){
        _mpAddPage(templateUuid: $templateUuid, targetAudience: $targetAudience)
    }
`;

export const MP_REMOVE_PAGE = gql`
    mutation MP_RemovePage($pageUuid: String!){
        _mpRemovePage(pageUuid: $pageUuid)
    }
`;

export const RE_INVITE_USER = gql`
    mutation ReInviteUser($userUuid: String!){
        reInviteUser(userUuid: $userUuid)
    }
`;

export const UPDATE_USER_ROLE= gql`
    mutation UpdateUserRole($userUuid: String!, $role: AccountUserRole!){
        updateUserRole(userUuid: $userUuid, role: $role)
    }
`;

export const UPDATE_ENGAGEMENT_STATUS_SETTINGS = gql`
    mutation UpdateEngagementStatusSettings($input: EngagementStatusSettingInput!){
        updateEngagementStatusSettings(input: $input)
    }
`;

export const UPDATE_INTEGRATION_SETTINGS  =  gql`
    mutation UpdateIntegrationSetting($type: IntegrationType, $input: Map){
        updateIntegrationSetting(type: $type, input: $input)
    }
`;

// Buyerstage-Marketplace
