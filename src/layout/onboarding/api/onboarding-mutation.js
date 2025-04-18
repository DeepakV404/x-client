import { gql } from "@apollo/client";

export const CREATE_DECK = gql`
    mutation CreateDeck($input: CreateDeckInput!){
        createDeck(input: $input){
            uuid
            title
            description
            copyLink
        }
    }
`;

export const CREATE_ROOM_FROM_ONBOARDING = gql`
    mutation CreateRoomFromOnboarding($input: CreateOnboardingRoomInput!){
        createRoomInOnboarding(input: $input){
            uuid
            title
            accountStub{
                uuid
                name
            }
        }
    }
`;

export const CREATE_OR_UPDATE_PROPERTY = gql`
    mutation CreateOrUpdateProperty($key: String!, $value: String!){
        createOrUpdateProperty(key: $key, value: $value)
    }
`;