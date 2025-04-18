import { APIHandler } from "../../../../api-handler";
import { D_SEND_OTP, D_TrackDeckResource, D_VERIFY_OTP, SEND_OTP_TO_ACCESS_DECK, VERIFY_DECK_OTP } from "./deck-mutation";

export const DeckAgent = {};

DeckAgent.deckResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_TrackDeckResource,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

DeckAgent.sendOtp = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_SEND_OTP,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

DeckAgent.verifyOtp = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_VERIFY_OTP,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}