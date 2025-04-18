import { APIHandler } from "../../../api-handler";
import { BUYER_CLEAR_ALL_NOTIFICATIONS, BUYER_MARK_ALL_AS_READ, BUYER_MARK_ALL_AS_VIEWED, BUYER_MARK_AS_READ, ROOM_NOTIFICATIONS_AS_READ, SELLER_CLEAR_ALL_NOTIFICATIONS, SELLER_MARK_ALL_AS_READ, SELLER_MARK_ALL_AS_VIEWED, SELLER_MARK_AS_READ } from "./notification-mutation";
import { BUYER_NOTIFICATIONS, BUYER_NOTIFICATIONS_COUNT, NOTIFICATIONS, NOTIFICATION_STATS } from "./notification-query";


export const NotificationAgent = {};

NotificationAgent.markAllAsViewed = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   BUYER_MARK_ALL_AS_VIEWED,
        variables       :   variables,
        refetchQueries  :   [BUYER_NOTIFICATIONS_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.s_markAllAsViewed = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SELLER_MARK_ALL_AS_VIEWED,
        variables       :   variables,
        refetchQueries  :   [NOTIFICATION_STATS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.markAllAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   BUYER_MARK_ALL_AS_READ,
        variables       :   variables,
        refetchQueries  :   [BUYER_NOTIFICATIONS, BUYER_NOTIFICATIONS_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


NotificationAgent.s_markAllAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SELLER_MARK_ALL_AS_READ,
        variables       :   variables,
        refetchQueries  :   [NOTIFICATION_STATS, NOTIFICATIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.markAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   BUYER_MARK_AS_READ,
        variables       :   variables,
        refetchQueries  :   [BUYER_NOTIFICATIONS, BUYER_NOTIFICATIONS_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.s_markAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SELLER_MARK_AS_READ,
        variables       :   variables,
        refetchQueries  :   [NOTIFICATIONS, NOTIFICATION_STATS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.clearAllNotifications = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   BUYER_CLEAR_ALL_NOTIFICATIONS,
        variables       :   variables,
        refetchQueries  :   [BUYER_NOTIFICATIONS, BUYER_NOTIFICATIONS_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.s_clearAllNotifications = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SELLER_CLEAR_ALL_NOTIFICATIONS,
        variables       :   variables,
        refetchQueries  :   [NOTIFICATIONS, NOTIFICATION_STATS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

NotificationAgent.s_roomNotificationsAsRead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ROOM_NOTIFICATIONS_AS_READ,
        variables       :   variables,
        refetchQueries  :   [NOTIFICATIONS, NOTIFICATION_STATS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

