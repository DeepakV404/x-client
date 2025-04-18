
import { APIHandler } from "../../api-handler";
import { BUYER_NOTIFICATIONS_COUNT } from "../../pages/notifications/api/notification-query";

import { CLEAR_SESSION, P_ADD_ACTION_POINT_ASSIGNEES, P_ADD_ACTION_POINT_BLOB_RESOURCE, P_ADD_ACTION_POINT_LINK_RESOURCE, P_ADD_ACTION_POINT_RESOURCE, P_ADD_COMMENT_TO_ACTION_POINT, P_CHECK_SESSION, P_CREATE_ACTION_POINT, P_CREATE_SESSION, P_INVITE_BUYER, P_MAP_ACTION_POINT_RESOURCE, P_REMOVE_ACTION_POINT_ASSIGNEES, P_REMOVE_ACTION_POINT_RESOURCE, P_REQUEST_MEETING, P_REMOVE_BUYER_PROFILE_IMAGE, P_REQUEST_RESOURCE, P_RESET_ACTION_POINT_TYPE, P_TRACK_EVENT, P_TRACK_PAGE_EVENTS, P_UPDATE_ACTION_POINT, P_UPDATE_ACTION_POINT_DUE, P_UPDATE_ACTION_POINT_ORDER, P_UPDATE_ACTION_POINT_STATUS, P_UPDATE_ALL_QUESTION_RESPONSE, P_UPDATE_BUYER_PROFILE, P_UPDATE_DISCOVERY_RESPONSE, P_UPDATE_SIDER_QUESTION_RESPONSE, P_SELF_INVITE, P_COMMENT_IN_ROOM, SEND_OTP_TO_ACCESS_SECTION, VERIFY_OTP, RESEND_BUYER_INVITE, P_UPDATE_MESSAGE, P_DELETE_MESSAGE, P_MARK_AP_NOTI_AS_READ, P_TRACK_SECTION_EVENTS, SEND_OTP_TO_ROOM, P_TRACK_CONTACT_ENTERED_EVENT, P_COMPLETE_BLOB_REQUEST, P_ADD_RESOURCE_COMPONENT, P_DELETE_COMPONENT } from "./buyer-mutation";
import { BUYER_ACTION_POINT, BUYER_GLOBALS, BUYER_JOURNEY_STAGES, P_ACTION_POINT_COMMENTS, P_GET_TOUCH_POINTS, P_ROOM_COMMENTS, P_SECTION, P_TRIGGERED_QUESTIONS, STAGE_ACTION_POINTS, BUYER_JOURNEY_STAGE, P_SECTIONS } from "./buyers-query";

export const BuyerAgent = {};

BuyerAgent.inviteBuyer = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_INVITE_BUYER,
        variables       :   variables,
        refetchQueries  :   [BUYER_GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.createActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_CREATE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_ACTION_POINT_ASSIGNEES,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS, BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.removeActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_REMOVE_ACTION_POINT_ASSIGNEES,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT, STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateActionPointStatus = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_ACTION_POINT_STATUS,
        variables       :   variables,
        refetchQueries  :   [BUYER_JOURNEY_STAGES, BUYER_ACTION_POINT, STAGE_ACTION_POINTS, BUYER_JOURNEY_STAGE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateActionPointDue = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_ACTION_POINT_DUE,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addCommentToActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_COMMENT_TO_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [P_ACTION_POINT_COMMENTS, BUYER_ACTION_POINT, P_ROOM_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateActionPointOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_ACTION_POINT_ORDER,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT, STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateBuyerProfile = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_BUYER_PROFILE,
        variables       :   variables,
        refetchQueries  :   [BUYER_GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.resetActionPointType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_RESET_ACTION_POINT_TYPE,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.mapActionPointResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_MAP_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [BUYER_GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addActionPointResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.removeActionPointResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_REMOVE_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.trackEvent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_TRACK_EVENT,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addActionPointBlobResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_ACTION_POINT_BLOB_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addResourceComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_RESOURCE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [P_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.addActionPointLinkResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ADD_ACTION_POINT_LINK_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [BUYER_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.requestResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_REQUEST_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.requestMeeting = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_REQUEST_MEETING,
        variables       :   variables,
        refetchQueries  :   [STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateDiscoveryResponse = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_DISCOVERY_RESPONSE,
        variables       :   variables,
        refetchQueries  :   [P_GET_TOUCH_POINTS, P_TRIGGERED_QUESTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.createSession = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_CREATE_SESSION,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateSiderQuestionResponse = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_SIDER_QUESTION_RESPONSE,
        variables       :   variables,
        refetchQueries  :   [P_TRIGGERED_QUESTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateAllQuestionResponse = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_ALL_QUESTION_RESPONSE,
        variables       :   variables,
        refetchQueries  :   [P_TRIGGERED_QUESTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.clearSession = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CLEAR_SESSION,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.trackPageEvent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_TRACK_PAGE_EVENTS,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.trackSectionEvent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_TRACK_SECTION_EVENTS,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.checkSession = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_CHECK_SESSION,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.removeBuyerProfileImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_REMOVE_BUYER_PROFILE_IMAGE,
        variables       :   variables,
        refetchQueries  :   [BUYER_GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.selfInvite = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_SELF_INVITE,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.commentInRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_COMMENT_IN_ROOM,
        variables       :   variables,
        refetchQueries  :   [P_ROOM_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.roomComments = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_ROOM_COMMENTS,
        variables       :   variables,
        refetchQueries  :   [P_ROOM_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.sendOtpToAccessSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SEND_OTP_TO_ACCESS_SECTION,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


BuyerAgent.sendOtpToAccessRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SEND_OTP_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.verifyOtp = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   VERIFY_OTP,
        variables       :   variables,
        refetchQueries  :   [P_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.resendBuyerInvite = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RESEND_BUYER_INVITE,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.updateRoomMessage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_UPDATE_MESSAGE,
        variables       :   variables,
        refetchQueries  :   [P_ROOM_COMMENTS, P_ACTION_POINT_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.deleteRoomMessage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_DELETE_MESSAGE,
        variables       :   variables,
        refetchQueries  :   [P_ROOM_COMMENTS, P_ACTION_POINT_COMMENTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.markAPNotiAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_MARK_AP_NOTI_AS_READ,
        variables       :   variables,
        refetchQueries  :   [BUYER_NOTIFICATIONS_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.trackContactEnteredEvent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_TRACK_CONTACT_ENTERED_EVENT,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.completeBlobRequest = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_COMPLETE_BLOB_REQUEST,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

BuyerAgent.deleteComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   P_DELETE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [P_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}