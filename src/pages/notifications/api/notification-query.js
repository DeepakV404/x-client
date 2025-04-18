import { gql } from "@apollo/client";
import { ACCOUNT_USER_FRAGMENT, CONTACT_FRAGMENT } from "../../accounts/api/accounts-fragment";

export const BUYER_NOTIFICATIONS = gql`
    query Buyer_Notifications($filter: NotificationFilterCategory!){
        _pNotifications(filter: $filter){
            uuid
            category
            type
            metadata
            status
            createdAt
            createdBy{
                _id
                uuid
                ...on AccountUserOutput{
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
            }
        }
    }
`;

export const BUYER_NOTIFICATIONS_COUNT = gql`
    query Buyer_Notifications_Count($filter: NotificationFilterCategory!){
        _pNotificationStats(filter: $filter)
    }
`;

export const NOTIFICATION_STATS = gql`
    query Seller_Notifications_Count($filter: NotificationFilterCategory!, $roomUuid: String){
        notificationStats(filter: $filter, roomUuid: $roomUuid)
    }
`

export const NOTIFICATIONS = gql`
    query Notifications($filter: NotificationFilterCategory!) {
        notifications(filter: $filter){
            uuid
            category
            type
            metadata
            status
            createdAt
            createdBy{
                _id
                uuid
                ...on AccountUserOutput{
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
            }
        }
    }
`;