import { APIHandler } from "../../../api-handler";
import { ALL_ENTITY_COUNT } from "../../../layout/api/global-query";
import { ROOM, ROOM_ACTIVITIES_BY_BUYER, ROOM_RESOURCES, R_ACTION_POINT, R_ACTION_POINTS, R_JOURNEY_STAGE_STUBS } from "../../rooms/api/rooms-query";
import { CREATE_ROOM_BLOB_RESOURCE, CREATE_ROOM_BLOB_RESOURCE_V2, CREATE_ROOM_LINK_RESOURCE, R_ADD_ACTION_POINT, R_ADD_ACTION_POINT_ASSIGNEE, R_ADD_STAGE, R_ADD_STAGE_RESOURCE, R_ADD_USECASE, R_ADD_USECASES, R_DELETE_ACTION_POINT, R_DELETE_STAGE, R_INVITE_BUYERS, R_REMOVE_ACTION_POINT, R_REMOVE_ACTION_POINT_ASSIGNEE, R_REMOVE_ACTION_POINT_RESOURCE, R_REMOVE_BUYER_PROFILE, R_RESET_ACTION_POINT_TYPE, R_REVOKE_ACCESS, R_SEND_ROOM_LINK, R_UPDATE_ACTION_POINT, R_UPDATE_ACTION_POINTS_STATUS, R_UPDATE_ACTION_POINT_DUE, R_UPDATE_ACTION_POINT_ORDER, R_UPDATE_BUYER_PROFILE, R_UPDATE_BUYING_JOURNEY, R_UPDATE_RESOURCES, R_UPDATE_SELLER_ACCOUNT, R_UPDATE_STAGE, UPDATE_ACCOUNT } from "./account-room-edit-mutation";
import { CREATE_ACCOUNT, DELETE_ACCOUNT } from "./accounts-mutation";
import { ACCOUNT, ACCOUNTS, GET_TOTAL_ACCOUNTS, R_BUYER_PORTAL_LINKS, R_JOURNEY_STAGE_ACTION_POINT, R_JOURNEY_STAGE_ACTION_POINTS, R_JOURNEY_STAGE_RESOURCE, R_USECASE, R_USECASE_GROUPS, SIMPLE_ACCOUNT } from "./accounts-query";

export const AccountsAgent = {};

AccountsAgent.addStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_STAGE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_STAGE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.deleteStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_STAGE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINT, R_ACTION_POINT, R_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateActionPointDue = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINT_DUE,
        variables       :   variables,
        refetchQueries  :   [R_ACTION_POINT, R_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.createRoomBlobResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_BLOB_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [ROOM_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.createRoomLinkResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_LINK_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [ROOM_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.addActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINTS, R_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.addActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_ACTION_POINT_ASSIGNEE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.removeActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_ACTION_POINT_ASSIGNEE,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.deleteActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateActionPointOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINT_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.resetActionPointType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_RESET_ACTION_POINT_TYPE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.removeActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.removeActionResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateAccount = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ACCOUNT,
        variables       :   variables,
        refetchQueries  :   [ACCOUNT, SIMPLE_ACCOUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [ROOM_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.addUsecases = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_USECASES,
        variables       :   variables,
        refetchQueries  :   [R_USECASE_GROUPS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.addUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_USECASE,
        variables       :   variables,
        refetchQueries  :   [R_USECASE_GROUPS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateSellerAccount = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_SELLER_ACCOUNT,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateActionPointStatus = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINTS_STATUS,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS, R_JOURNEY_STAGE_ACTION_POINTS, R_JOURNEY_STAGE_ACTION_POINT, R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.addStageResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_STAGE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateBuyingJourneyStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_BUYING_JOURNEY,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.createAccount = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ACCOUNT,
        variables       :   variables,
        refetchQueries  :   [ACCOUNTS, GET_TOTAL_ACCOUNTS, , ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.inviteBuyers = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_INVITE_BUYERS,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS, ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.sendRoomLink = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_SEND_ROOM_LINK,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.revokeAccess = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REVOKE_ACCESS,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.deleteAccount = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_ACCOUNT,
        variables       :   variables,
        refetchQueries  :   [ACCOUNTS, GET_TOTAL_ACCOUNTS, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.updateBuyerProfile = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_BUYER_PROFILE,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

AccountsAgent.removeBuyerProfileImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_BUYER_PROFILE,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

// Blob-Resource

AccountsAgent.createRoomBlobResourceV2 = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_BLOB_RESOURCE_V2,
        variables       :   variables,
        refetchQueries  :   [ROOM_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

