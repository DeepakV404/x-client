import { gql } from "@apollo/client";

export const CREATE_VENDOR = gql`
    mutation CreateVendor($input: VendorInput){
        createVendor(input: $input)
    }
`;

export const MARK_USER_AS_VENDOR = gql`
    mutation MarkUserAsVendor($emailId: String!){
        markUserAsVendor(emailId: $emailId)
    }
`;