import { APIHandler } from "../../../api-handler";
import { GLOBALS } from "../../../layout/api/global-query";
import { ONBOARDING_META } from "../../../layout/onboarding/api/onboarding-query";
import { CRM_DEAL_STAGE_MAPPINGS } from "../../common/api/crm-query";
import { R_USECASE_CATEGORIES } from "../../rooms/api/rooms-query";
import { USECASE_CATEGORIES } from "../../templates/api/room-templates-query";

import { CREATE_CATEGORIES, CREATE_FAQ, DELETE_FAQ, UPDATE_FAQ, UPDATE_ORG_DETAILS, UPDATE_PERSONAL_DETAILS, UPDATE_CATEGORIES, SFDC_CREATE_CONNECTION, ADD_USER, DELETE_USER, UPDATE_GATED_FORM_MAPPING, UPDATE_ORG_PROPERTIES, SLACK_JOIN_CHANNEL, DELETE_USECASE_CATEGORY, REMOVE_PROFILE_IMAGE, REMOVE_ORG_LOGO, REMOVE_FAVICON, RESEND_USER_INVITE, CREATE_RESOURCE_CATEGORY, UPDATE_RESOURCE_CATEGORY, MP_UPDATE_OVERVIEW, MP_ADD_RESOURCES, MP_REMOVE_RESOURCE, MP_ADD_PAGE, MP_REMOVE_PAGE, DELETE_RESOURCE_CATEGORY, RE_INVITE_USER, UPDATE_USER_ROLE, CREATE_REGION, UPDATE_REGION, DELETE_REGION, UPDATE_USER, UPDATE_ENGAGEMENT_STATUS_SETTINGS, UPDATE_INTEGRATION_SETTINGS, CREATE_ROOM_STAGE, UPDATE_ROOM_STAGE, DELETE_ROOM_STAGE, UPDATE_ROOM_STAGE_ORDER } from "./settings-mutation";

import { CATEGORIES, DELETED_USERS, FAQS, ORG_INTEGRATIONS, ORG_PROPERTIES, USERS, RESOURCE_CATEGORIES, MP_OVERVIEW, MP_RESOURCES, MP_PAGES, MP_OVERVIEW_VIDEO, REGIONS, ROOM_STAGES } from "./settings-query";

export const SettingsAgent = {};

SettingsAgent.createFaq = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_FAQ,
        variables       :   variables,
        refetchQueries  :   [FAQS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.deleteFaq = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_FAQ,
        variables       :   variables,
        refetchQueries  :   [FAQS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateFaq = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_FAQ,
        variables       :   variables,
        refetchQueries  :   [FAQS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateOrgDetail = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ORG_DETAILS,
        variables       :   variables,
        refetchQueries  :   [GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


SettingsAgent.updateUserDetail = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_PERSONAL_DETAILS,
        variables       :   variables,
        refetchQueries  :   [GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateUser = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_USER,
        variables       :   variables,
        refetchQueries  :   [USERS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


SettingsAgent.createUsecaseCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_CATEGORIES,
        variables       :   variables,
        refetchQueries  :   [CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.createRegion = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_REGION,
        variables       :   variables,
        refetchQueries  :   [REGIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.createRoomStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_STAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateUsecaseCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_CATEGORIES,
        variables       :   variables,
        refetchQueries  :   [CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateRegion = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_REGION,
        variables       :   variables,
        refetchQueries  :   [REGIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateRoomStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM_STAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_STAGES, CRM_DEAL_STAGE_MAPPINGS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateRoomStageOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM_STAGE_ORDER,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.sfdcCreateConnection = ({onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   SFDC_CREATE_CONNECTION,
        refetchQueries  :   [ORG_INTEGRATIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.addUser = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_USER,
        variables       :   variables,
        refetchQueries  :   [USERS, DELETED_USERS, GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


SettingsAgent.deleteUser = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_USER,
        variables       :   variables,
        refetchQueries  :   [USERS, GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateGatedFormMapping = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_GATED_FORM_MAPPING,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateOrgProperties = ({variables, onCompletion, errorCallBack}) => {
    APIHandler.client.mutate({
        mutation        : UPDATE_ORG_PROPERTIES,
        variables       : variables,
        refetchQueries  : [ORG_PROPERTIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.SlackChannelSelection = ({variables, onCompletion, errorCallBack}) => {
    APIHandler.client.mutate({
        mutation        : SLACK_JOIN_CHANNEL,
        variables       : variables,
        refetchQueries  : [ORG_PROPERTIES, ORG_INTEGRATIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.deleteCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_USECASE_CATEGORY,
        variables       :   variables,
        refetchQueries  :   [CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.deleteRegion = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_REGION,
        variables       :   variables,
        refetchQueries  :   [REGIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.deleteRoomStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_ROOM_STAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_STAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.removeProfileImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_PROFILE_IMAGE,
        variables       :   variables,
        refetchQueries  :   [GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.removeOrgLogo = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_ORG_LOGO,
        variables       :   variables,
        refetchQueries  :   [GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.removeFavicon = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_FAVICON,
        variables       :   variables,
        refetchQueries  :   [GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.resendUserInvite = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RESEND_USER_INVITE,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.createResourceCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_RESOURCE_CATEGORY,
        variables       :   variables,
        refetchQueries  :   [RESOURCE_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateResourceCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_CATEGORY,
        variables       :   variables,
        refetchQueries  :   [RESOURCE_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.deleteResourceCategory = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_RESOURCE_CATEGORY,
        variables       :   variables,
        refetchQueries  :   [RESOURCE_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

// Buyerstage - MarketPlace

SettingsAgent.mpUpdateOverview = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_UPDATE_OVERVIEW,
        variables       :   variables,
        refetchQueries  :   [MP_OVERVIEW, ONBOARDING_META]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.mpUpdateOverviewVideo = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_UPDATE_OVERVIEW,
        variables       :   variables,
        refetchQueries  :   [MP_OVERVIEW_VIDEO, ONBOARDING_META]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.mpAddResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_ADD_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [MP_RESOURCES, ONBOARDING_META]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.mpRemoveResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_REMOVE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [MP_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.mpAddPage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_ADD_PAGE,
        variables       :   variables,
        refetchQueries  :   [MP_PAGES, ONBOARDING_META]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.mpRemovePage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MP_REMOVE_PAGE,
        variables       :   variables,
        refetchQueries  :   [MP_PAGES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.reinviteUser = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RE_INVITE_USER,
        variables       :   variables,
        refetchQueries  :   [USERS, DELETED_USERS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateUserRole = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_USER_ROLE,
        variables       :   variables,
        refetchQueries  :   [USERS, GLOBALS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


SettingsAgent.updateEngagementStatusSettings = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ENGAGEMENT_STATUS_SETTINGS,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

SettingsAgent.updateIntegrationSettings = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_INTEGRATION_SETTINGS,
        variables       :   variables,
        refetchQueries  :   [ORG_INTEGRATIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

