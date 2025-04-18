import { gql } from "@apollo/client";

export const CREATE_ROOM_FROM_LEAD = gql`
    mutation SFDCCreateRoomByLead($leadId: String!, $name: String, $roomName: String!, $roomTemplateUuid: String, $input: CRMContactInput!){
        _sfdcCreateRoomByLead(leadId: $leadId, name: $name, roomName: $roomName, roomTemplateUuid: $roomTemplateUuid, input: $input)
    }
`;

export const CREATE_ROOM_FROM_OPPORTUNITY = gql`
    mutation SFDCCreateRoomByOpportunity($opportunityId: String!, $name: String, $roomTemplateUuid: String, $roomName: String!, $input: [CRMContactInput!]){
        _sfdcCreateRoomByOpportunity(opportunityId: $opportunityId, name: $name, roomTemplateUuid: $roomTemplateUuid, roomName: $roomName, input: $input)
    }
`;

export const MAP_LEAD_TO_ROOM = gql`
    mutation MapLeadToRoom($leadId: String!, $name: String, $roomUuid: String!, $input: CRMContactInput){
        _sfdcMapLeadToRoom(leadId: $leadId, name: $name, roomUuid: $roomUuid, input: $input)
    }
`;

export const MAP_OPPORTUNITY_TO_ROOM = gql`
    mutation MapOpportunityToRoom($opportunityId: String!, $name: String, $roomUuid: String!, $input : [CRMContactInput!]){
        _sfdcMapOpportunityToRoom(opportunityId: $opportunityId, name: $name, roomUuid: $roomUuid, input: $input)
    }
`;

export const CREATE_ACTION_POINT = gql`
    mutation SFDCCreateActionPoint($roomUuid: String!, $stageLinkName: String!, $input: RTCreateActionPointInput!){
        _rCreateActionPoint(roomUuid: $roomUuid, stageLinkName: $stageLinkName, input: $input)
    }
`;

export const ADD_JOURNEY_STAGE = gql`
    mutation SFDCAddJourneyStage($roomUuid: String!, $input: StageInput!){
        _rAddStage(roomUuid: $roomUuid, input: $input)
    }
`;

export const DELETE_STAGE = gql`
    mutation SFDCDeleteStage($roomUuid: String!, $stageLinkName: String!){
        _rDeleteStage(roomUuid: $roomUuid, stageLinkName: $stageLinkName)
    }
`;

export const UPDATE_STAGE = gql`
    mutation SFDCUpdateStage($roomUuid: String!, $stageLinkName: String!, $input: StageInput!){
        _rUpdateStage(roomUuid: $roomUuid, stageLinkName: $stageLinkName, input: $input)
    }
`;

export const UPDATE_STAGE_ORDER = gql`
    mutation SFDCUpdateStageOrder($roomUuid: String!, $stageLinkName: String!, $order: Int!){
        _rUpdateStageOrder(roomUuid: $roomUuid, stageLinkName: $stageLinkName, order: $order)
    }
`;

export const DELETE_ACTION_POINT = gql`
    mutation SFDCDeleteActionPoint($actionPointUuid: String!){
        _rDeleteActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const ADD_ACTION_POINT = gql`
    mutation SFDCAddActionPoint($roomUuid: String!, $stageLinkName: String!, $input: RTCreateActionPointInput!){
        _rCreateActionPoint(roomUuid: $roomUuid, stageLinkName: $stageLinkName, input: $input)
    }
`;

export const UPDATE_ACTION_POINTS_STATUS = gql`
    mutation SFDCUpdateActionPointsStatus($actionPointsUuid: [String!]!, $status: ActionPointStatus!){
        _rUpdateActionPointsStatus(actionPointsUuid: $actionPointsUuid, status: $status)
    }
`;

export const UPDATE_BUYING_JOURNEY = gql`
    mutation SFDCUpdateBuyingJourney($roomUuid: String!, $enable: Boolean!){
        _rUpdateBuyingJourney(roomUuid: $roomUuid, enable: $enable)
    }
`;

export const SFDC_ADD_ACTION_POINT_ASSIGNEE = gql`
    mutation SFDCAddActionPointAssignees($actionPointUuid: String!, $sellersUuid: [String!], $buyersUuid: [String!]){
        _rAddActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid, buyersUuid: $buyersUuid)
    }
`;