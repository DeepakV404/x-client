import { gql } from "@apollo/client";

export const CREATE_ROOM_FROM_DEAL = gql`
    mutation HubspotCreateRoomByDeal($dealId: String!, $name: String, $roomName: String!, $roomTemplateUuid: String, $input: [CRMContactInput!]!){
        _hsCreateRoomByDeal(dealId: $dealId, name: $name, roomName: $roomName, roomTemplateUuid: $roomTemplateUuid, input: $input)
    }
`;

export const CREATE_ROOM_FROM_CONTACT = gql`
    mutation HubspotCreateRoomByContact($contactId: String!, $name: String, $roomTemplateUuid: String, $input: CRMContactInput! $roomName: String!){
        _hsCreateRoomByContact(contactId: $contactId, name: $name, roomTemplateUuid: $roomTemplateUuid, input: $input, roomName: $roomName)
    }
`;

export const MAP_CONTACT_TO_ROOM = gql`
    mutation HubspotMapContactToRoom($contactId: String, $name: String, $roomUuid: String, $input: CRMContactInput){
        _hsMapContactToRoom(contactId: $contactId, name: $name, roomUuid: $roomUuid, input: $input)
    }
`;

export const MAP_DEAL_TO_ROOM = gql`
    mutation HubspotMapDealToRoom($dealId: String, $name: String, $roomUuid: String, $input: [CRMContactInput!]){
        _hsMapDealToRoom(dealId: $dealId, name: $name, roomUuid: $roomUuid, input: $input)
    }
`;