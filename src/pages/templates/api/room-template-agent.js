import { APIHandler } from "../../../api-handler";
import { ALL_ENTITY_COUNT } from "../../../layout/api/global-query";
import { R_SECTION } from "../../rooms/api/rooms-query";

import { CREATE_ROOM_TEMPLATE, RT_ADD_ACTION_POINT, RT_ADD_ACTION_POINT_ASSIGNEES, RT_ADD_ACTION_POINT_ORDER, RT_ADD_STAGE, RT_CREATE_TEMPLATE_LINK_RESOURCE, RT_DELETE_ACTION_POINT, RT_DELETE_STAGE, RT_MAP_ACTION_POINT_RESOURCE, RT_MAP_STAGE_RESOURCES, RT_REMOVE_ACTION_POINT_ASSIGNEES, RT_REMOVE_ACTION_POINT_RESOURCE, RT_REMOVE_STAGE_RESOURCE, RT_RESET_ACTION_POINT_TYPE, RT_UPDATE_ACTION_POINT, RT_UPDATE_ACTION_POINT_TYPE, RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT, RT_UPDATE_BUYING_JOURNEY, RT_UPDATE_LINK_RESOURCE_IN_ACTION_POINT, RT_UPDATE_MEETING_TYPE_IN_ACTION_POINT, RT_UPDATE_RESOURCES, RT_UPDATE_RESOURCE_IN_ACTION_POINT, RT_UPDATE_SELLER_ACCOUNT, RT_UPDATE_STAGE, RT_UPDATE_UPLOAD_ACTION_TYPE_IN_ACTION_POINT, RT_UPDATE_USECASE, UPDATE_ROOM_TEMPLATE, RT_UPDATE_STAGE_ORDER, DELETE_TEMPLATE, RT_ADD_USECASE, RT_UPDATE_USECASE_ORDER, RT_REMOVE_USECASE, RT_UPDATE_METADATA, RT_UPDATE_STAGE_META, RT_REMOVE_PITCH, CLONE_TEMPLATE_FROM_DEMO_ORG, CLONE_TEMPLATE_FROM_EXISTING, RT_ADD_SECTION, RT_UPDATE_SECTION_ORDER, RT_DELETE_SECTION, RT_ADD_RECORD, RT_DELETE_RECORD, RT_UPDATE_RECORD, REMOVE_SECTION_CONTENT, RT_UPDATE_RECORD_ORDER, RT_UPDATE_SECTION, RT_UPDATE_DISCOVERY, RT_UPDATE_ACTION_POINT_DUEINDAYS, RT_UPDATE_TEXT_CONTENT_IN_ACTION_POINT, RT_CREATE_TEMPLATE_BLOB_RESOURCE_V2, RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT_V2, RT_UPDATE_COMPONENT_BY_PROPERTY, RT_ADD_RESOURCE_COMPONENT, RT_UPDATE_COVER_IMAGE, RT_REMOVE_COVER_IMAGE, RT_ADD_FILE_COMPONENT, RT_CREATE_STAGE_RESOURCE, RT_INITIALIZE, RT_ADD_DEFAULT_SECTION, RT_UPDATE_HEADER_COMPONENT } from "./room-templates-mutation";
import { ALL_USECASE_CATEGORIES, ROOM_TEMPLATE, ROOM_TEMPLATES, RT_ACTION_POINT, RT_JOURNEY_STAGE, RT_JOURNEY_STAGE_ACTION_POINT, RT_JOURNEY_STAGE_ACTION_POINTS, RT_JOURNEY_STAGE_RESOURCES, RT_JOURNEY_STAGE_STUBS, RT_RESOURCES, RT_SECTION, RT_SECTIONS, RT_SECTION_CATALOG, RT_USECASE, RT_USECASES, RT_USECASES_CATEGORIES, RT_USECASE_GROUPS, USECASE_CATEGORIES } from "./room-templates-query";

export const RoomTemplateAgent = {};

RoomTemplateAgent.createRoomTemplate = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_ROOM_TEMPLATE,
        variables       :   variables,
        refetchQueries  :   [ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplate = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM_TEMPLATE,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE, ROOM_TEMPLATES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateTitleAlignment = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   UPDATE_ROOM_TEMPLATE,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateCoverImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_COVER_IMAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removeCoverImage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_COVER_IMAGE,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateStageMeta = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_STAGE_META,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRoomTemplateStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_STAGE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRoomTemplateSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_SECTION,
        variables       :   variables,
        refetchQueries  :   [RT_SECTIONS, RT_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRoomTemplateActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateActionPointOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_ACTION_POINT_ORDER,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRoomTemplateActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_ACTION_POINT_ASSIGNEES,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removeRoomTemplateActionPointAssignees = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_ACTION_POINT_ASSIGNEES,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRoomTemplateStageResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_MAP_STAGE_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_STAGE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_STUBS, RT_JOURNEY_STAGE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.deleteActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_DELETE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.deleteStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_DELETE_STAGE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.deleteSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_DELETE_SECTION,
        variables       :   variables,
        refetchQueries  :   [RT_SECTIONS, RT_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addRecord = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_RECORD,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINT, RT_JOURNEY_STAGE_ACTION_POINTS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.resetActionPointType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_RESET_ACTION_POINT_TYPE,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.mapActionPointResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_MAP_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removeActionPointResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_ACTION_POINT_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateResources = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_RESOURCES,
        variables       :   variables,
        refetchQueries  :   [RT_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateSellerAccount = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_SELLER_ACCOUNT,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateJourneyStage = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_BUYING_JOURNEY,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateUploadActionTypeInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_UPLOAD_ACTION_TYPE_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateBlobResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateLinkResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_LINK_RESOURCE_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateResourceInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_RESOURCE_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtUpdateMeetingTypeInActionPoint = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_MEETING_TYPE_IN_ACTION_POINT,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.rtRemoveStageResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_STAGE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.createTemplateBlobResourceV2 = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_CREATE_TEMPLATE_BLOB_RESOURCE_V2,
        variables       :   variables,
        refetchQueries  :   [RT_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.createTemplateLinkResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_CREATE_TEMPLATE_LINK_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RT_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateActionPointType = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_ACTION_POINT_TYPE,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT, RT_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateStageOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_STAGE_ORDER,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_STUBS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_SECTION,
        variables       :   variables,
        refetchQueries  :   [RT_SECTIONS, RT_SECTION, RT_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRoomTemplateSectionOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_SECTION_ORDER,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.deleteTemplate = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   DELETE_TEMPLATE,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATES, ALL_ENTITY_COUNT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_USECASE,
        variables       :   variables,
        refetchQueries  :   [RT_USECASES, USECASE_CATEGORIES, RT_USECASES_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


RoomTemplateAgent.updateDemoOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_USECASE_ORDER,
        variables       :   variables,
        refetchQueries  :   [RT_USECASES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removeUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_USECASE,
        variables       :   variables,
        refetchQueries  :   [RT_USECASES, USECASE_CATEGORIES, RT_USECASES_CATEGORIES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateUsecase = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_USECASE,
        variables       :   variables,
        refetchQueries  :   [RT_USECASES, RT_USECASE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}
RoomTemplateAgent.updateMetadata = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_METADATA,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removePitch = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_REMOVE_PITCH,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.cloneTemplate = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CLONE_TEMPLATE_FROM_DEMO_ORG,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.deleteRecord = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_DELETE_RECORD,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.cloneTemplateFromExisting = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CLONE_TEMPLATE_FROM_EXISTING,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_RECORD,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.removeSectionContent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   REMOVE_SECTION_CONTENT,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION, R_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateRecordOrder = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_RECORD_ORDER,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


RoomTemplateAgent.enableOrDisableDiscovery = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_DISCOVERY,
        variables       :   variables,
        refetchQueries  :   [ROOM_TEMPLATES, ROOM_TEMPLATE]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateActionPointDueInDays = ({variables, onCompletion, errorCallBack}) => {
    
    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_ACTION_POINT_DUEINDAYS,
        variables       :   variables,
        refetchQueries  :   [RT_ACTION_POINT]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
        )
    }
    
    RoomTemplateAgent.rtUpdateTextContentInActionPoint = ({variables, onCompletion, errorCallBack}) => {
        
        APIHandler.client.mutate({
            mutation        :   RT_UPDATE_TEXT_CONTENT_IN_ACTION_POINT,
            variables       :   variables,
            refetchQueries  :   [RT_ACTION_POINT]
        }).then(
            (response) => {
                onCompletion && onCompletion(response.data)
            },
            (errors) => errorCallBack && errorCallBack(errors)
            )
        }
        
        
    RoomTemplateAgent.rtUpdateBlobResourceInActionPointV2 = ({variables, onCompletion, errorCallBack}) => {
        
        APIHandler.client.mutate({
            mutation        :   RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT_V2,
            variables       :   variables,
            refetchQueries  :   [RT_ACTION_POINT, RT_JOURNEY_STAGE_RESOURCES]
        }).then(
            (response) => {
                onCompletion && onCompletion(response.data)
            },
            (errors) => errorCallBack && errorCallBack(errors)
            )
        }

RoomTemplateAgent.updateComponentByProperty = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_COMPONENT_BY_PROPERTY,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateComponentByPropertyNoRefetch = ({variables, onCompletion, errorCallBack}) => {
    
    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_COMPONENT_BY_PROPERTY,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.AddResourceComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_RESOURCE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addFileComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_FILE_COMPONENT,
        variables       :   variables,
        refetchQueries  :   [RT_SECTION]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.createTemplateStageResource = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_CREATE_STAGE_RESOURCE,
        variables       :   variables,
        refetchQueries  :   [RT_JOURNEY_STAGE_RESOURCES]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.initializeTemplate = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_INITIALIZE,
        variables       :   variables,
        refetchQueries  :   [RT_SECTIONS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.addDefaultSection = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_ADD_DEFAULT_SECTION,
        variables       :   variables,
        refetchQueries  :   [RT_SECTIONS, RT_SECTION, RT_SECTION_CATALOG]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}

RoomTemplateAgent.updateHeaderComponent = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   RT_UPDATE_HEADER_COMPONENT,
        variables       :   variables,
        refetchQueries  :   []
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}