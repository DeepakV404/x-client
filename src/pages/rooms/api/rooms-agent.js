import { APIHandler } from "../../../api-handler";
import { ALL_ENTITY_COUNT, GLOBALS } from "../../../layout/api/global-query";

import { ACCOUNT, R_BUYER_PORTAL_LINKS, R_JOURNEY_STAGE_RESOURCE } from "../../accounts/api/accounts-query";
import { SEARCH_DEALS } from "../../common/api/crm-query";
import { RT_SECTION, RT_SECTIONS, USECASE_CATEGORIES } from "../../templates/api/room-templates-query";

import { R_ADD_USECASE, CREATE_ROOM, CREATE_ROOM_LINK_RESOURCE_FOR_PITCH, DELETE_ROOM, R_ADD_ACTION_POINT, R_ADD_ACTION_POINT_ASSIGNEES, R_ADD_STAGE, R_ADD_USERS, R_COMMENT_ACTION_POINT, R_DELETE_ACTION_POINT, R_REMOVE_ACTION_POINT_ASSIGNEES, R_REMOVE_RESOURCE_IN_ACTION_POINT, R_REMOVE_STAGE_RESOURCE, R_REMOVE_USERS, R_RESET_ACTION_POINT, R_UPDATE_ACTION_POINTS_STATUS, R_UPDATE_ACTION_POINT_ORDER, R_UPDATE_ACTION_POINT_TYPE, R_UPDATE_BUYING_JOURNEY, R_UPDATE_MEETING_TYPE_IN_ACTION_POINT, R_UPDATE_OWNER, R_UPDATE_RESOURCES, R_UPDATE_RESOURCE_IN_ACTION_POINT, R_UPDATE_STAGE_META, R_UPDATE_STAGE_NAME, R_UPDATE_STAGE_ORDER, R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT, R_UPDATE_UPLOAD_LINK_RESOURCE_IN_ACTION_POINT, R_UPDATE_UPLOAD_TYPE_IN_ACTION_POINT, R_UPDATE_USECASE_ORDER, SEND_HANDOFF_NOTE, UPDATE_ROOM, R_REMOVE_USECASE, R_UPDATE_USECASE, REMOVE_USECASE_CONTENT, R_REMOVE_PITCH, R_ADD_STAGE_RESOURCE, CREATE_ROOM_LINK_RESOURCE, R_ADD_SECTION, R_UPDATE_SECTION_ORDER, R_UPDATE_SECTION, R_DELETE_SECTION, R_DELETE_RECORD, R_ADD_RECORD, R_UPDATE_RECORD_ORDER, R_UPDATE_RECORD, R_UPDATE_DISCOVERY, R_UPDATE_CLOSE_STAGE, R_COMMENT, R_ATTACH_BLOB, R_REMOVE_BLOB, R_ADD_USERROLE, ADD_SECTION_PERMISSION, REMOVE_SECTION_PERMISSION, R_CLONE_WIDGET, UPDATE_WIDGET, UPDATE_COMPONENT, DELETE_COMPONENT, UPDATE_RESOURCE_COMPONENT, R_UPDATE_TEXT_CONTENT_IN_ACTION_POINT, R_ADD_ROOM_NOTE, UPDATE_COMPONENT_PROFILE_IMG, DELETE_WIDGET, UPDATE_WIDGET_ORDER, UPDATE_COMPONENT_ORDER, R_UPDATE_MESSAGE, R_DELETE_MESSAGE, UPDATE_RESOURCE_COMPONENT_BY_PAGES, R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT_V2, UPDATE_RESOURCE_COMPONENT_V2, R_UPDATE_COMPONENT_BY_PROPERTY, R_ADD_RESOURCE_COMPONENT, CREATE_LEAD_ROOM, R_UPDATE_COVER_IMAGE, R_REMOVE_COVER_IMAGE, R_ADD_CONTACT_TO_CRM , CREATE_ROOM_V2, R_ADD_CONTACT_TO_ROOM, R_ADD_FILE_COMPONENT, R_CREATE_STAGE_RESOURCE, R_INITIALIZE, R_ADD_DEFAULT_SECTION, R_ADD_DEFAULT_SECTION_BY_TYPE, R_UPDATE_HEADER_COMPONENT, UPDATE_ROOM_PROPERTY } from "./rooms-mutation";

import { GET_TOTAL_ROOMS, ROOM, ROOMS, ROOM_COMMENTS, ROOM_RESOURCES, R_ACTION_POINT, R_ACTION_POINTS, R_ACTION_POINT_COMMENTS, R_JOURNEY_STAGE_STUBS, R_HANDOFF_HISTORY, R_JOURNEY_STAGE, R_SECTION, R_SECTIONS, R_USECASE, R_USECASES, R_USECASE_CATEGORIES, USER_ROLES, R_CRM_GET_CONTACTS_BY_DEAL, R_SECTION_CATALOG } from "./rooms-query";

export const RoomsAgent = {};

RoomsAgent.createRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM,
        variables       :   variables,
        refetchQueries  :   [ROOMS, ACCOUNT, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addStage = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.updateJourneyStage = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.updateStageOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_STAGE_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRoomClosedStatus = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_CLOSE_STAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_USECASE,
        variables       :   variables,
        refetchQueries  :   [R_USECASES, USECASE_CATEGORIES, R_USECASE_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addUsersToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_USERS,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRoomOwner = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_OWNER,
        variables       :   variables,
        refetchQueries  :   [ROOM, R_HANDOFF_HISTORY]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeRoomUser = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_USERS,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_ACTION_POINT_ASSIGNEES,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_ACTION_POINT_ASSIGNEES,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateActionPointStatus = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINTS_STATUS,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_JOURNEY_STAGE, R_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateActionPointType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_ACTION_POINT_TYPE,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


RoomsAgent.updateUploadActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_UPLOAD_TYPE_IN_ACTION_POINT ,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateUploadBlobResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateUploadLinkResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_UPLOAD_LINK_RESOURCE_IN_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_RESOURCE_IN_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_RESOURCE_IN_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateMeetingTypeInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_MEETING_TYPE_IN_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.resetActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_RESET_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.commentActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_COMMENT_ACTION_POINT,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINT_COMMENTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.createRoomLinkResourceForPitch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_LINK_RESOURCE_FOR_PITCH,
        variables       :   variables, 
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeRoomStageResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_STAGE_RESOURCE,
        variables       :   variables, 
        refetchQueries  :   [R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateStageName = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_STAGE_NAME,
        variables       :   variables, 
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS, R_JOURNEY_STAGE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateActionPointOrder = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.addActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_STUBS, R_ACTION_POINTS, R_JOURNEY_STAGE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResources = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.updateRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM,
        variables       :   variables,
        refetchQueries  :   [ROOM, ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRoomTitleAlignment = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateCoverImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_COVER_IMAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeCoverImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_COVER_IMAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_ROOM,
        variables       :   variables,
        refetchQueries  :   [ROOMS, ACCOUNT, GET_TOTAL_ROOMS, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateStageMeta = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_STAGE_META,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateDemoOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_USECASE_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_USECASES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addUseCase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_USECASE,
        variables       :   variables,
        refetchQueries  :   [R_USECASES, USECASE_CATEGORIES, R_USECASE_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_USECASE,
        variables       :   variables,
        refetchQueries  :   [R_USECASES, R_USECASE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeUsecaseContent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_USECASE_CONTENT,
        variables       :   variables,
        refetchQueries  :   [R_USECASE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removePitch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_PITCH,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


RoomsAgent.addStageResources = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.createRoomStageResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_CREATE_STAGE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.createRoomLinkResource = ({variables, onCompletion, errorCallBack}) => {

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

RoomsAgent.addSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_SECTION,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS, R_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateSectionOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_SECTION_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_SECTION,
        variables       :   variables,
        refetchQueries  :   [ROOM, R_SECTIONS, R_SECTION, RT_SECTIONS, RT_SECTION, R_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_SECTION,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS, R_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addRecord = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_RECORD,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRecord = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_RECORD,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRecordOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_RECORD_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteRecord = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_RECORD,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.enableOrDisableDiscovery = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_DISCOVERY,
        variables       :   variables,
        refetchQueries  :   [ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.commentInRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_COMMENT,
        variables       :   variables, 
        refetchQueries  :   [ROOM_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.attachBlob = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ATTACH_BLOB,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeBlob = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_REMOVE_BLOB,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addUserRole = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_USERROLE,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addSectionPermission = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_SECTION_PERMISSION,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.removeSectionPermission = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_SECTION_PERMISSION,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateTextContentInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_TEXT_CONTENT_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addRoomNote = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_ROOM_NOTE,
        variables       :   variables,
        refetchQueries  :   [ROOM, R_HANDOFF_HISTORY]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateMessageInRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_MESSAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_COMMENTS, R_ACTION_POINT_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteMessageInRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_DELETE_MESSAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_COMMENTS, R_ACTION_POINT_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.sectionWidgetLists = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_WIDGET_CATALOG,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.cloneWidget = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_CLONE_WIDGET,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateWidget = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_WIDGET,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResourceComponentByPages = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_COMPONENT_BY_PAGES,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateComponentWithOutRefresh = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResourceComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResourceComponentWithoutRefresh = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateWidgetProfileImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT_PROFILE_IMG,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.deleteWidget = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_WIDGET,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.widgetReOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_WIDGET_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.componentReOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT_ORDER,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateComponentByProperty = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_COMPONENT_BY_PROPERTY,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION],
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateComponentByPropertyNoRefetch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_COMPONENT_BY_PROPERTY,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.AddResourceComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_RESOURCE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

//Blob - Resource

RoomsAgent.updateUploadBlobResourceInActionPointV2 = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT_V2,
        variables       :   variables, 
        refetchQueries  :   [R_ACTION_POINTS, R_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateResourceComponentV2 = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_COMPONENT_V2,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.createLeadRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_LEAD_ROOM,
        variables       :   variables,
        refetchQueries  :   [ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.createRoomV2 = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_V2,
        variables       :   variables,
        refetchQueries  :   [ROOMS, ACCOUNT, SEARCH_DEALS, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addContactToCRM = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_CONTACT_TO_CRM,
        variables       :   variables,
        refetchQueries  :   [R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addContactToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_CONTACT_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   [ROOM, R_BUYER_PORTAL_LINKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addFileComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_FILE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.initializeRoom = ({variables, onCompletion, errorCallBack}) => {
    APIHandler.client.mutate({
        mutation        :   R_INITIALIZE,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS, R_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addDefaultSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_DEFAULT_SECTION,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS, R_SECTION, R_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.addDefaultSectionByType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_ADD_DEFAULT_SECTION_BY_TYPE,
        variables       :   variables,
        refetchQueries  :   [R_SECTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateHeaderComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   R_UPDATE_HEADER_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomsAgent.updateRoomProperty = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM_PROPERTY,
        variables       :   variables,
        refetchQueries  :   [ROOM]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}