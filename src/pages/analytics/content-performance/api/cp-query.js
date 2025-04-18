import { gql } from "@apollo/client";

export const CD_OVERALL_REPORT  =  gql`
    query CDOverAllReport($timeSpan: TimeSpan!, $templateUuids: [String!]){
        _cdOverAllReport(timeSpan: $timeSpan, templateUuids: $templateUuids){
            totalResources
            viewsOutput{
                views
                trend{
                    type
                    value
                }
            }
            uniqueViewsOutput{
                uniqueViews
                trend{
                    type
                    value
                }
            }
            contentEngagementOutput{
                contentEngagement
                trend{
                    type
                    value
                }
            }
            totalDeckOutput{
                count
                trend{
                    type
                    value
                }
            }
        }
    }
    `;
    
export const CD_CONTENT_PERFORMANCE  =  gql`
    query CDContentPerformance($timeSpan: TimeSpan!, $templateUuids: [String!], $filter: CDFilter){
        _cdContentPerformance(timeSpan: $timeSpan, templateUuids: $templateUuids, filter: $filter){
            resource{
                uuid
                title
                type
            }
            views
            timeSpent
            uniqueViews
        }
    }
`;

export const CD_RESOURCE_ACTIVITIES  =  gql`
    query CDResourceActivities($timeSpan: TimeSpan!, $templateUuids: [String!], $pageConstraint: PageConstraint){
        _cdResourceActivities(timeSpan: $timeSpan, templateUuids: $templateUuids, pageConstraint: $pageConstraint){
        resource{
            uuid
            title
            type
        }
        timeSpent
        buyer{
            uuid
            emailId
            firstName
            lastName
        }
        viewedAt
        }
    }
`;

export const CD_TOTAL_RESOURCE_ACTIVITIES = gql`
    query CDTotalResourceActivities($timeSpan: TimeSpan!, $templateUuids: [String!]){
        _cdTotalResourceActivities(timeSpan: $timeSpan, templateUuids: $templateUuids)
    }
`;

export const CD_REGION_CONTENT_PERFORMANCE = gql`
    query CDResourceStats($timeSpan: TimeSpan!, $templateUuids: [String!], $filter: RegionReportFilter){
        _cdResourceRegionReport(timeSpan: $timeSpan, templateUuids: $templateUuids, filter: $filter)
    }
`;

export const CD_RESOURCE_STATS_BY_CATEGORY = gql`
    query CDResourceStatsByCategory($timeSpan: TimeSpan!, $templateUuids: [String!]){
        _cdResourceStatsByCategory(timeSpan: $timeSpan, templateUuids: $templateUuids){
            category{
                uuid
                name
            }
            views
            timeSpent
            totalResources
            roomViews
            deckViews
        }
    }
`;

export const CD_RESOURCE_DETAIL_REPORT = gql`
    query CDResourceDetailReport($timeSpan: TimeSpan!, $templateUuids: [String!], $pageConstraint: PageConstraint){
        _cdResourceDetailReport(timeSpan: $timeSpan, templateUuids: $templateUuids, pageConstraint: $pageConstraint){
            resource{
                uuid
                type
                title
            }
            uniqueViews
            avgTimeSpent
            totalTimeSpent
            totalViews
            decksUsedIn: deckViews
            roomsUsedIn: roomViews
        }
    }
`;

export const CD_TOTAL_RESOURCE_DETAIL_REPORT = gql`
    query CDTotalResourceDetailReport($timeSpan: TimeSpan!, $templateUuids: [String!]){
        _cdTotalResourceDetailReport(timeSpan: $timeSpan, templateUuids: $templateUuids)
    }
`;