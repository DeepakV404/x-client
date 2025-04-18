import { APIHandler } from "../../../api-handler";
import { DECK } from "../../../pages/library/api/library-query";

import { UPDATE_ORG_DETAILS, UPDATE_PERSONAL_DETAILS } from "../../../pages/settings/api/settings-mutation";
import { CREATE_DECK, CREATE_OR_UPDATE_PROPERTY, CREATE_ROOM_FROM_ONBOARDING } from "./onboarding-mutation";
import { ONBOARDING_META, ORG_DETAIL, USER_DETAIL } from "./onboarding-query";

export const OnboardingAgent = {};

OnboardingAgent.updateUserDetail = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_PERSONAL_DETAILS,
        variables       :   variables,
        refetchQueries  :   [USER_DETAIL]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

OnboardingAgent.updateOrgDetail = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ORG_DETAILS,
        variables       :   variables,
        refetchQueries  :   [ORG_DETAIL]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

OnboardingAgent.createDeck = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_DECK,
        variables       :   variables,
        refetchQueries  :   [DECK]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

OnboardingAgent.createRoomFromOnboarding = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_FROM_ONBOARDING,
        variables       :   variables,
        refetchQueries  :   [ONBOARDING_META]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

OnboardingAgent.createOrUpdateProperty = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_OR_UPDATE_PROPERTY,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}