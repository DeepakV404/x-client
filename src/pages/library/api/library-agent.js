import { APIHandler } from "../../../api-handler";
import { RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES, RT_RESOURCES } from "../../templates/api/room-templates-query";
import { ROOM_RESOURCES, R_ACTION_POINT } from "../../rooms/api/rooms-query";

import { CREATE_BLOB_RESOURCE, CREATE_FOLDER, CREATE_LINK_RESOURCE, DELETE_FOLDER, DELETE_RESOURCE, UPDATE_FOLDER, UPDATE_RESOURCE_INFO, REMOVE_RESOURCE_THUMBNAIL, MOVE_RESOURCES, DELETE_DECK, INVITE_TO_DECK, ADD_DECK_RESOURCES, DELETE_DECK_RESOURCES, UPDATE_DECK_RESOURCES, ADD_DECK_RESOURCE_BY_PAGES, UPDATE_DECK, COMPLETE_BLOB_REQUEST, CREATE_RESOURCE, DECK_RESOURCE_REORDER, D_CREATE_TAG, D_CREATE_AND_ASSOCIATE_TAG, D_ASSOCIATE_TAG, D_REMOVE_TAG, CREATE_DECK, D_CREATE_TAGS } from "./library-mutation";
import { D_TAGS, DECK, DECK_RESOURCES, DECKS, DECKS_V2, FOLDER, FOLDERS, GET_FOLDER_PATH, HOME_RESOURCES_COUNT, RESOURCES } from "./library-query";
import { R_JOURNEY_STAGE_RESOURCE } from "../../accounts/api/accounts-query";
import { ALL_ENTITY_COUNT } from "../../../layout/api/global-query";

export const LibraryAgent = {};

LibraryAgent.createBlobResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_BLOB_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, FOLDER, HOME_RESOURCES_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.createLinkResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_LINK_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, FOLDER, HOME_RESOURCES_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.deleteResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, FOLDER, HOME_RESOURCES_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.updateResourceInfo = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_RESOURCE_INFO,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, RT_RESOURCES, ROOM_RESOURCES, R_ACTION_POINT, RT_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.removeResourceThumbnail = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_RESOURCE_THUMBNAIL,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, RT_RESOURCES, ROOM_RESOURCES, R_ACTION_POINT, RT_ACTION_POINT, R_JOURNEY_STAGE_RESOURCE, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.createFolder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_FOLDER,
        variables       :   variables,
        refetchQueries  :   [FOLDERS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.deleteFolder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_FOLDER,
        variables       :   variables,
        refetchQueries  :   [FOLDERS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.updateFolder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_FOLDER,
        variables       :   variables,
        refetchQueries  :   [FOLDERS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.moveResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MOVE_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [FOLDER, FOLDERS, RESOURCES, HOME_RESOURCES_COUNT, GET_FOLDER_PATH]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

// DECK


LibraryAgent.addDeck = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_DECK,
        variables       :   variables,
        refetchQueries  :   [DECKS, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.addDeckResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_DECK_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [DECK_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.updateDeckResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_DECK_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [DECK_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.DeleteDeckResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_DECK_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [DECK_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.inviteToDeck = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   INVITE_TO_DECK,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.updateDeck = ({variables, onCompletion, errorCallBack, refetch}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_DECK,
        variables       :   variables,
        refetchQueries  :   refetch ? [DECKS, DECK] : []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.deleteDeck = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_DECK,
        variables       :   variables,
        refetchQueries  :   [DECKS_V2, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.addDeckResourceByPages = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   ADD_DECK_RESOURCE_BY_PAGES,
        variables       :   variables,
        refetchQueries  :   [DECK_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.updateDeckResourceOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DECK_RESOURCE_REORDER,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.completeBlobRequest = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   COMPLETE_BLOB_REQUEST,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent.createResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RESOURCES, FOLDER, HOME_RESOURCES_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent._dCreateTag = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_CREATE_TAG,
        variables       :   variables,
        refetchQueries  :   [D_TAGS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent._dCreateTags = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_CREATE_TAGS,
        variables       :   variables,
        refetchQueries  :   [D_TAGS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent._dCreateAndAssociateTag = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_CREATE_AND_ASSOCIATE_TAG,
        variables       :   variables,
        refetchQueries  :   [D_TAGS, DECKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent._dAssociateTag = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_ASSOCIATE_TAG,
        variables       :   variables,
        refetchQueries  :   [D_TAGS, DECKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

LibraryAgent._dRemoveTag = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   D_REMOVE_TAG,
        variables       :   variables,
        refetchQueries  :   [D_TAGS, DECKS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}