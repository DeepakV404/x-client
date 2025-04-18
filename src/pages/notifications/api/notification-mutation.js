import { gql } from "@apollo/client";

export const BUYER_MARK_ALL_AS_VIEWED = gql`
    mutation Buyer_MarkAllAsViewed($filter: NotificationFilterCategory!){
        _pMarkAllAsViewed(filter: $filter)
    }
`;

export const SELLER_MARK_ALL_AS_VIEWED = gql`
    mutation Seller_MarkAllAsViewed($filter: NotificationFilterCategory!){
        markAllAsViewed(filter: $filter)
    }
`

export const BUYER_MARK_ALL_AS_READ = gql`
    mutation Buyer_MarkAllAsRead($filter: NotificationFilterCategory!){
        _pMarkAllAsRead(filter: $filter)
    }
`;

export const SELLER_MARK_ALL_AS_READ = gql`
    mutation Seller_MarkAllAsRead($filter: NotificationFilterCategory!){
        markAllAsRead(filter: $filter)
    }
`

export const BUYER_MARK_AS_READ = gql`
    mutation Buyer_MarkAsRead($notificationUuid: String!){
        _pMarkAsRead(notificationUuid: $notificationUuid)
    }
`;

export const SELLER_MARK_AS_READ = gql`
    mutation Seller_MarkAsRead($notificationUuid: String!){
        markAsRead(notificationUuid: $notificationUuid)
    } 
`;

export const BUYER_CLEAR_ALL_NOTIFICATIONS = gql`
    mutation P_ClearAllNotifications($filter: NotificationFilterCategory!){
        _pClearAllNotifications(filter: $filter)
    }  
`;

export const SELLER_CLEAR_ALL_NOTIFICATIONS = gql`
    mutation ClearAllNotifications($filter: NotificationFilterCategory!){
        clearAllNotifications(filter: $filter)
    }
`;

export const ROOM_NOTIFICATIONS_AS_READ = gql`
    mutation R_MarkRoomNotificationsAsRead($roomUuid: String!, $filter: NotificationFilterCategory!){
        markRoomNotificationsAsRead(roomUuid: $roomUuid, filter: $filter)
    }
`;