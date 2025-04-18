import { gql } from "@apollo/client";
import { RESOURCE_FRAGMENT } from "../../library/api/library-fragments";


export const USECASE_FRAGMENT = gql`
    ${RESOURCE_FRAGMENT}
    fragment UsecaseFragment on UsecaseOutput{
        uuid
        title
        selfServe{
            ...ResourceFragment
        }
        walkthrough{
            ...ResourceFragment
        }
        demo{
            ...ResourceFragment
        }
    }
`;

export const SIMPLE_PUBLIC_RESOURCE_FRAGMENT = gql`
    fragment SimplePublicResourceFragment on SimplePublicResourceOutput{
        uuid
        title
        type
        description
        createdAt
        categories{
            uuid
            name
        }
        content{
            type
            url
            thumbnailUrl
            extension
            properties
        }
    }
`;

export const ROOM_RESOURCE_FRAGMENT = gql`
    fragment RoomResourceFragment on RoomSellerResourceOutput{
        _id
        uuid
        title
        type
        description
        createdAt
        content{
            type
            url
            thumbnailUrl
            extension
        }
    }
`;