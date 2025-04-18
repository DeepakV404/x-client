import { gql } from "@apollo/client";

export const SFDC_ROOM_FRAGMENT = gql`
    fragment SFDCRoomFragment on RoomOutput{
        _id
        uuid
        title
        buyerAccount{
            uuid
        }
    }
`;