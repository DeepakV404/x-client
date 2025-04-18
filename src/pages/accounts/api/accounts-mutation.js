import { gql } from "@apollo/client";

export const CREATE_ACCOUNT = gql`
    mutation CreateAccount($input: CreateAccountInput!, $logo: Upload){
        createAccount(input: $input, logo: $logo){
            _id
            uuid
            companyName
        }
    }
`;

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount($accountUuid: String!){
        deleteAccount(accountUuid: $accountUuid)
    }
`;