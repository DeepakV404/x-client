import { gql } from "@apollo/client";

export const CONTACT_FRAGMENT = gql`
    fragment ContactFragment on ContactOutput{
        uuid
        emailId
        firstName
        status
        lastName
        profileUrl
    }
`;

export const ROOM_RESOURCE_FRAGMENT = gql`
    fragment RoomResourceFragment on RoomResourceOutput{
        _id
        uuid
        title
        type
        description
        content{
            type
            url
            thumbnailUrl
            extension
        }
        createdAt
    }
`;

export const ACCOUNT_USER_OUTPUT = gql`
    fragment AccountUserFragment on  AccountUserOutput{
        _id
        uuid
        firstName
        lastName
        profileUrl
        emailId
        calendarUrl
        linkedInUrl
        role
    }
`;

export const ACCOUNT_MEMBER_FRAGMENT = gql`
    fragment AccountMemberFragment on AccountMemberOutput{
        _id
        uuid
        emailId
        firstName
        lastName
        profileUrl
    }
`;

export const ACCOUNT_USER_FRAGMENT = gql`
    fragment AccountUserFragment on  AccountUserOutput{
        _id
        uuid
        firstName
        lastName
        profileUrl
        emailId
        calendarUrl
        status
        role
    }
`;
