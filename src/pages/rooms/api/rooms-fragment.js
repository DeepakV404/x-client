import { gql } from "@apollo/client";
import { ACCOUNT_USER_FRAGMENT } from "../../accounts/api/accounts-fragment";

export const ROOM_USER_FRAGMENT = gql`
    fragment RoomUserFragment on RoomUserOutput{
        _id
        uuid
        firstName
        lastName
        emailId
        status
        role
        profileUrl
        calendarUrl
        isOwner
    }
`; 

export const ROOM_SELLER_RESOURCE_FRAGMENT = gql`
    fragment RoomSellerResourceFragment on RoomSellerResourceOutput{
        _id
        uuid
        title
        type
        content{
            thumbnailUrl
            type
            url
        }
        createdAt
    }
`;

export const ROOM_STAGE_FRAGMENT = gql`
    fragment RoomStageFragment on RoomStageOutput{
        uuid
        label
        properties
        isCRMDealStageMapped
    }   
`;

export const ROOM_AP_STATS_FRAGMENT = gql`
    fragment APStats on ActionPointStats{
        totalAps
        completedAps
        plannedAps
        pendingAps
        completedAps
        onGoingAps
        completionPercentage
    }
`;