import { APIHandler } from "../../../api-handler";
import { R_SECTION } from "../../rooms/api/rooms-query";

import { ADD_COMPONENT, CLONE_WIDGET, DELETE_COMPONENT, UPDATE_COMPONENT_PROFILE_IMG, UPDATE_RESOURCE_COMPONENT_V2, UPDATE_WIDGET } from "./widgets-mutation";

import { RT_SECTION } from "../../templates/api/room-templates-query";

export const WidgetsAgent = {};

WidgetsAgent.updateWidgetProfileImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT_PROFILE_IMG,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
};

WidgetsAgent.updateWidgetProfileImageNoRefetch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_COMPONENT_PROFILE_IMG,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
};

WidgetsAgent.updateWidget = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_WIDGET,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

WidgetsAgent.updateWidgetNoRefetch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_WIDGET,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

WidgetsAgent.deleteComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

WidgetsAgent.addComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

WidgetsAgent.updateResourceComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_COMPONENT_V2,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

WidgetsAgent.cloneWidget = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CLONE_WIDGET,
        variables       :   variables,
        refetchQueries  :   [R_SECTION, RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}