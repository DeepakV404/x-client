import { gql } from "@apollo/client";

export const SEND_OTP_TO_ACCESS_DECK = gql`
    mutation SendOtpToAccessDeck{
        sendOtpToAccessDeck
    }
`;

export const VERIFY_DECK_OTP = gql`
    mutation VerifyDeckOtp($otp: String!){
        verifyDeckOtp(otp: $otp)
    }
`;

export const D_CREATE_CONTACT_MAPPING = gql`
    mutation D_CreateDeckContactMapping($campaignInfo: Map){
	    _dCreateDeckContactMapping(campaignInfo: $campaignInfo)
    }
`;

export const D_TrackDeckResource = gql`
    mutation D_TrackDeckEvent($input: EventInput!){
        _dTrackDeckEvent(input: $input)
    }
`;

export const D_SEND_OTP = gql`
    mutation D_SendOTP($emailId: String!){
        _dSendOtp(emailId: $emailId)
    }
`;

export const D_VERIFY_OTP = gql`
    mutation D_VerifyOtp($emailId: String!, $otp: String!){
        _dVerifyOtp(emailId: $emailId, otp: $otp)
    }
`;