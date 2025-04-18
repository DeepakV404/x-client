import { gql } from "@apollo/client";

export const R_ADD_STAGE = gql`
    mutation R_AddStage($roomUuid: String!, $input: StageInput!){
        _rAddStage(roomUuid: $roomUuid, input: $input)
    }
`;

export const R_ADD_ACTION_POINT = gql`
    mutation R_AddActionPoint($roomUuid: String!, $stageUuid: String!, $input: RTCreateActionPointInput!){
        _rCreateActionPoint(roomUuid: $roomUuid, stageUuid: $stageUuid, input: $input){
            _id
            uuid
            title
        }
    }
`;

export const R_DELETE_ACTION_POINT = gql`
    mutation R_DeleteActionPoint($actionPointUuid: String!){
        _rDeleteActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const R_UPDATE_ACTION_POINT = gql`
    mutation R_UpdateActionPoint($actionPointUuid: String!, $input: RTUpdateActionPointInput!){
        _rUpdateActionPoint(actionPointUuid: $actionPointUuid, input: $input)
    }
`;

export const R_UPDATE_ACTION_POINT_DUE = gql`
    mutation R_UpdateActionPointDue($actionPointsUuid: [String!]!, $dueAt: Long!){
        _rUpdateActionPointsDue(actionPointsUuid: $actionPointsUuid, dueAt: $dueAt)
    }
`;

export const R_UPDATE_ACTION_POINT_ORDER = gql`
    mutation R_UpdateActionPointOrder($roomUuid: String!, $stageUuid: String!, $actionPointUuid: String!, $order: Int!){
        _rUpdateActionPointOrder(roomUuid: $roomUuid, stageUuid: $stageUuid, actionPointUuid: $actionPointUuid, order: $order)
    }
`;

export const R_UPDATE_STAGE = gql`
    mutation R_UpdateStage($roomUuid: String!, $stageUuid: String!, $input: StageInput!){
        _rUpdateStage(roomUuid: $roomUuid, stageUuid: $stageUuid, input: $input)
    }
`;

export const R_DELETE_STAGE = gql`
    mutation R_DeleteStage($roomUuid: String!, $stageUuid: String!){
        _rDeleteStage(roomUuid: $roomUuid, stageUuid: $stageUuid)
    }
`;

export const CREATE_ROOM_BLOB_RESOURCE = gql`
    mutation CreateRoomBlobResource($roomUuid: String!, $title: String!, $description: String, $categories: [String] $content: Upload!, $thumbnail: Upload, $isResourceTab: Boolean){
        createRoomBlobResource(roomUuid: $roomUuid, title: $title, description: $description, categories: $categories, content: $content, thumbnail: $thumbnail, isResourceTab: $isResourceTab){
            _id
            uuid
            title
        }
    }
`;

export const CREATE_ROOM_LINK_RESOURCE = gql`
    mutation CreateRoomLinkResource($roomUuid: String!, $title: String, $description: String, $categories: [String], $url: String!, $urlType: String, $thumbnailImage: Upload, $isResourceTab: Boolean, $properties: Map){
        createRoomLinkResource(roomUuid: $roomUuid, title: $title, description: $description, categories: $categories, url: $url, urlType: $urlType, thumbnailImage: $thumbnailImage, isResourceTab: $isResourceTab, properties: $properties){
            _id
            uuid
            title
            type
        }
    }
`;

export const R_ADD_ACTION_POINT_ASSIGNEE = gql`
    mutation R_AddActionPointAssignees($actionPointUuid: String!, $sellersUuid: [String!], $buyersUuid: [String!]){
        _rAddActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid, buyersUuid: $buyersUuid)
    }
`;

export const R_REMOVE_ACTION_POINT_ASSIGNEE = gql`
    mutation R_RemoveActionPointAssignees($actionPointUuid: String!,$sellersUuid: [String!],$buyersUuid: [String!]){
        _rRemoveActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid, buyersUuid: $buyersUuid)
    }
`;

export const R_RESET_ACTION_POINT_TYPE = gql`
    mutation R_ResetActionPointType($actionPointUuid: String!){
        _rResetActionPointType(actionPointUuid: $actionPointUuid)
    }
`;
export const R_REMOVE_ACTION_POINT = gql`
    mutation R_RemoveActionPoint($actionPointUuid: String!){
        _rDeleteActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const R_REMOVE_ACTION_POINT_RESOURCE = gql`
    mutation R_RemoveActionPointResource($actionPointUuid: String!, $resourceUuid: String!){
        _rRemoveActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const UPDATE_ACCOUNT = gql`
    mutation UpdateAccount($accountUuid: String!, $logo: Upload, $input: AccountInput!){
        updateAccount(accountUuid: $accountUuid, logo: $logo, input: $input)
    }
`;

export const R_UPDATE_RESOURCES = gql`
    mutation R_UpdateResources($roomUuid: String!, $resourcesUuid: [String!]!, $action: UpdateAction!){
        _rUpdateResources(roomUuid: $roomUuid, resourcesUuid: $resourcesUuid, action: $action)
    }
`;

export const R_ADD_USECASES = gql`
    mutation R_AddUsecases($roomUuid: String!, $input: [CreateUsecaseInput!]!){
        _rAddUsecases(roomUuid:$roomUuid, input: $input)
    }
`;

export const R_ADD_USECASE = gql`
    mutation R_AddUsecase($roomUuid: String!, $input: CreateUsecaseInput!){
        _rAddUsecase(roomUuid:$roomUuid, input: $input){
            uuid
            title
        }
    }
`;

export const R_UPDATE_SELLER_ACCOUNT = gql`
    mutation R_UpdateSellerAccount($roomUuid: String!, $logo: Upload, $input: SellerAccountInput!){
        updateSellerAccount(roomUuid: $roomUuid, logo: $logo, input: $input)
    }
`;

export const R_UPDATE_ACTION_POINTS_STATUS = gql`
    mutation R_UpdateActionPointsStatus($actionPointsUuid: [String!]!, $status: ActionPointStatus!){
        _rUpdateActionPointsStatus(actionPointsUuid: $actionPointsUuid, status: $status)
    }
`;

export const R_ADD_STAGE_RESOURCE = gql`
    mutation R_AddStageResource($roomUuid: String!, $stageUuid: String!, $resourceUuid: String!){
        _rMapStageResource(roomUuid: $roomUuid, stageUuid: $stageUuid, resourceUuid: $resourceUuid)
    }
`;

export const R_UPDATE_BUYING_JOURNEY = gql`
    mutation R_UpdateBuyingJourney($roomUuid: String!, $enable: Boolean!){
        _rUpdateBuyingJourney(roomUuid: $roomUuid, enable: $enable)
    }
`;

export const R_INVITE_BUYERS = gql`
    mutation R_InviteBuyers($roomUuid: String!, $emailIds: [String!]!, $reasonUuid: String, $message: String){
        _rInviteBuyers(roomUuid: $roomUuid, emailIds: $emailIds, reasonUuid: $reasonUuid, message: $message)
    }
`;

export const R_SEND_ROOM_LINK = gql`
    mutation R_SendRoomLink($roomUuid: String!, $contactUuid: String!){
        _rSendRoomLink(roomUuid: $roomUuid, contactUuid: $contactUuid)
    }
`;

export const R_REVOKE_ACCESS = gql`
    mutation R_RevokeAccess($roomUuid: String!, $contactUuid: String!){
        _rRemoveBuyer(roomUuid: $roomUuid, contactUuid: $contactUuid)
    }
`;

export const R_UPDATE_BUYER_PROFILE = gql`
    mutation R_UpdateBuyerProfile($contactUuid: String!, $profile: Upload, $input: UpdateBuyerProfileInput!) {
        updateBuyerProfile(contactUuid: $contactUuid, profile: $profile, input: $input)
    }
`;

export const R_REMOVE_BUYER_PROFILE = gql`
    mutation R_RemoveBuyerProfile($contactUuid: String!) {
        _rRemoveBuyerProfileImage(contactUuid: $contactUuid)
    }
`;

// Blob-Resource

export const CREATE_ROOM_BLOB_RESOURCE_V2 = gql`
    mutation CreateRoomBlobResourceV2($roomUuid: String!, $title: String!, $description: String, $categories: [String], $input: BlobResourceInput, $thumbnail: Upload, $isResourceTab: Boolean){
        createRoomBlobResourceV2(roomUuid: $roomUuid, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail, isResourceTab: $isResourceTab){
            _id
            uuid
            title
        }
    }
`;