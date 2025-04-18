import { HUBSPOT_ROOMS } from "./hubspot-query";
import { APIHandler } from "../../api-handler";
import { CREATE_ROOM_FROM_CONTACT, CREATE_ROOM_FROM_DEAL, MAP_CONTACT_TO_ROOM, MAP_DEAL_TO_ROOM } from "./hubspot-mutation";


export const HubspotAgent = {};

HubspotAgent.createRoomFromDeal = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_FROM_DEAL,
        variables       :   variables,
        refetchQueries  :   [HUBSPOT_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

HubspotAgent.createRoomFromContact = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_FROM_CONTACT,
        variables       :   variables,
        refetchQueries  :   [HUBSPOT_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

HubspotAgent.mapContactToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MAP_CONTACT_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   [HUBSPOT_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

HubspotAgent.mapDealToRoom = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MAP_DEAL_TO_ROOM,
        variables       :   variables,
        refetchQueries  :   [HUBSPOT_ROOMS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}