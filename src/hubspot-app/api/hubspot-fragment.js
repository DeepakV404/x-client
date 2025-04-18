import { gql } from "@apollo/client";

export const HUBSPOT_ROOM_FRAGMENT = gql`
    fragment HubspotRoomFragment on RoomOutput{
        _id
        uuid
        title
        buyerAccount{
            uuid
        }
    }
`;