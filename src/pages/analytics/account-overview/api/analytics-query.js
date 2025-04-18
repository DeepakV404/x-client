import { gql } from "@apollo/client";
import { ROOM_STAGE_FRAGMENT } from "../../../rooms/api/rooms-fragment";

export const OVER_ALL_REPORT = gql`
    query OverAllReport($timeSpan: TimeSpan, $userUuids: [String]){
        overAllReport(timeSpan: $timeSpan, userUuids: $userUuids){
            createdRooms
            dealsWon
            dealsLost
            winRate
            avgDealCycles
            timeSpentOnResources
            avgInteractions
        }
    }
`

export const ROOMS_BY_STAGE = gql`
    ${ROOM_STAGE_FRAGMENT}
    query RoomsByStage($timeSpan: TimeSpan, $userUuids: [String]){
        roomsByStage(timeSpan: $timeSpan, userUuids: $userUuids){
            roomStage{
                ...RoomStageFragment
            }
            roomsCount
        }
    }
`;

export const ROOMS_BY_STATUS = gql`
    query RoomsByEngagementStatus($timeSpan: TimeSpan, $userUuids: [String]){
        roomsByEngagementStatus(timeSpan: $timeSpan, userUuids: $userUuids){
            notEngaged
            hot
            warm
            cold
        }
    }
`

export const LEADER_BOARD_STATS = gql`
    query LeaderBoardStats($timeSpan: TimeSpan, $pageConstraint: PageConstraint){
        leaderboardStats(timeSpan: $timeSpan, pageConstraint: $pageConstraint){
            seller{
                uuid
                firstName
                lastName
                profileUrl
            }
            totalRooms
            roomsWon
            roomsLost
            winRate
            regions{
                uuid
                name
            }
        }
    }
`

export const TOP_ROOMS_VIEW = gql`
    query TopRoomsByTimeSpent($timeSpan: TimeSpan, $userUuids: [String]){
        topRoomsByTimeSpent(timeSpan: $timeSpan, userUuids: $userUuids){
            room {
                uuid
                title
              accountStub{
                uuid
              }
            }
            timeSpent
        }
    }
`

export const TOP_ROOMS_DEAL_CYCLE = gql`
    query TopRoomsByDealCycle($timeSpan: TimeSpan, $userUuids: [String]){
        topRoomsByDealCycle(timeSpan: $timeSpan, userUuids: $userUuids){
            room {
                title
                uuid
              accountStub{
                uuid
              }
            }
            dealDays
        }
    }
`

export const RESOURCE_STATS = gql`
    query ResourceStats($timeSpan: TimeSpan){
        resourceStats(timeSpan: $timeSpan){
            resource{
                title
                type
                content{
                    thumbnailUrl
                    url
                }
            }
            views
            timeSpent
        }
    }
`

export const RESOURCE_STATS_BY_CATEGORY = gql`
    query ResourceStatsByCategory($timeSpan: TimeSpan){
        resourceStatsByCategory(timeSpan: $timeSpan){
            category{
                uuid
                name
            }
            views
            timeSpent
        }
    }
`

export const ROOM_VIEWS = gql`
    query RoomViews($timeSpan: TimeSpan, $granularity: Granularity!, $userUuids: [String]){
        roomViews(timeSpan: $timeSpan, granularity: $granularity, userUuids: $userUuids){
            key
            label
            views
            uniqueViews
            avgViews
        }
    }
`;

export const RECENT_COMMENTS = gql `
    query RecentComments($timeSpan: TimeSpan, $userUuids: [String]){
        recentComments(timeSpan: $timeSpan, userUuids: $userUuids){
            uuid
            comment
            createdStakeholder{
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
                ...on BuyerContactOutput{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                }
            }
            createdStakeholderType
            createdAt
            metadata
            roomStub{
                uuid
                title
                createdAt
            }
            accountStub{
                uuid
            }
        }
    }
`;

export const RECENT_ACTIVITIES = gql`
    query RecentActivities($timeSpan: TimeSpan, $userUuids: [String]){
        recentActivities(timeSpan: $timeSpan, userUuids: $userUuids){
            type
            activityData
            createdAt
            createdStakeholder{
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
                ...on BuyerContactOutput{
                    uuid
                    emailId
                    firstName
                    lastName
                    profileUrl
                }
            }
            roomStub{
                uuid
                title
                createdAt
            }
            accountStub{
                uuid
                logoUrl
            }
        }
    }
`