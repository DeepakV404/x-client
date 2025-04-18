import { APIHandler } from "../../api-handler";
import { ADD_ACTION_POINT, ADD_JOURNEY_STAGE, CREATE_ROOM_FROM_LEAD, CREATE_ROOM_FROM_OPPORTUNITY, DELETE_ACTION_POINT, DELETE_STAGE, MAP_LEAD_TO_ROOM, MAP_OPPORTUNITY_TO_ROOM, SFDC_ADD_ACTION_POINT_ASSIGNEE, UPDATE_ACTION_POINTS_STATUS, UPDATE_BUYING_JOURNEY, UPDATE_STAGE, UPDATE_STAGE_ORDER } from "./sfdc-mutation";
import { SFDC_JOURNEY_STAGES, SFDC_ROOMS, SFDC_ROOM_RESOURCES, SFDC_STAGE_ACTION_POINTS } from "./sfdc-query";

export const SFDCAgent = {};

SFDCAgent.createRoomFromLead = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_FROM_LEAD,
        variables       :   variables,
        refetchQueries  :   [SFDC_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.createRoomFromOpportunity = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_FROM_OPPORTUNITY,
        variables       :   variables,
        refetchQueries  :   [SFDC_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.mapLeadToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MAP_LEAD_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   [SFDC_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.mapOpportunityToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MAP_OPPORTUNITY_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   [SFDC_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.createActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [SFDC_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.addJourneyStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_JOURNEY_STAGE,
        variables       :   variables,
        refetchQueries  :   [SFDC_JOURNEY_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.removeResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [SFDC_ROOM_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.deleteStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_STAGE,
        variables       :   variables,
        refetchQueries  :   [SFDC_JOURNEY_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.updateStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_STAGE,
        variables       :   variables,
        refetchQueries  :   [SFDC_JOURNEY_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.updateStageOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_STAGE_ORDER,
        variables       :   variables,
        refetchQueries  :   [SFDC_JOURNEY_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.deleteActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [SFDC_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.addActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [SFDC_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.updateActionPointStatus = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ACTION_POINTS_STATUS,
        variables       :   variables,
        refetchQueries  :   [SFDC_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.updateJourneyStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_BUYING_JOURNEY,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SFDCAgent.addActionPointAssignee = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SFDC_ADD_ACTION_POINT_ASSIGNEE,
        variables       :   variables,
        refetchQueries  :   [SFDC_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}