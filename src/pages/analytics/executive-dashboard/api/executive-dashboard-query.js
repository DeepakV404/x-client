import { gql } from "@apollo/client";


export const ED_OVERALL_INSIGHTS = gql`
    query Ed_OverallInsights($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edOverallInsights(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            dealPipeline
            openDealCount
            dealWinRate
            openDealProgress
            avgDueDateStrike
            totalAPsCompleted
        }
    }
`;

export const ED_DEALS_OVERVIEW = gql`
    query Ed_DealsOverview($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edDealsOverview(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
            }
            overview
        }
    }
`;

export const ED_TASKS = gql`
    query Ed_Tasks($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edTasks(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
            }
            tasks
        }
    }
`;

export const ED_DEAL_PERFORMANCE = gql`
    query _edDealPerformance($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edDealPerformance(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
                regions{
                    name
                }
            }
            dealsCount
            completionPercentage
            notStarted
            inProgress
            completed
            details
        }
    }
`;

export const ED_TASK_COMPLETION_TIME = gql`
    query ED_TaskCompletionTime($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edTaskCompletionTime(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
            }
            totalCompletedTasks
            completionTimeInfo
        }
    }
`;

export const ED_TASK_DUE_DATE_CHANGE = gql`
    query Ed_TaskDueDateChange($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edTaskDueDateChange(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
            }
            dueDateChangeInfo
        }
    }
`;

export const ED_MEETINGS_OVERVIEW = gql`
    query Ed_MeetingsOverview($timeSpan: TimeSpan!, $userUuids: [String], $templateUuids: [String]){
        _edMeetingsOverview(timeSpan: $timeSpan, userUuids: $userUuids, templateUuids: $templateUuids){
            user{
                uuid
                firstName
                lastName
            }
            meetingsByRoom
        }
    }
`;