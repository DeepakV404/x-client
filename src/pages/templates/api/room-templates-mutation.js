import { gql } from "@apollo/client";

export const CREATE_ROOM_TEMPLATE = gql`
    mutation CreateRoomTemplate($input: RoomTemplateInput!){
        createRoomTemplate(input: $input){
            _id
            uuid
        }
    }  
`;

export const UPDATE_ROOM_TEMPLATE = gql`
    mutation UpdateRoomTemplate($templateUuid: String!, $input: RoomTemplateInput!, $sellerLogo: Upload){
        updateRoomTemplate(templateUuid: $templateUuid, input: $input, sellerLogo: $sellerLogo){
            uuid
            calendarUrl
            regions{
                uuid
                name
            }
        }
    }
`;

export const RT_UPDATE_COVER_IMAGE = gql`
    mutation Rt_UpdateCoverImage($templateUuid: String!, $coverImage: Upload!){
        _rtUpdateCoverImage(templateUuid: $templateUuid, coverImage: $coverImage)
    }  
`;

export const RT_REMOVE_COVER_IMAGE = gql`
    mutation Rt_RemoveCoverImage($templateUuid: String!){
        _rtRemoveCoverImage(templateUuid: $templateUuid)
    }  
`;

export const RT_ADD_STAGE = gql`
    mutation Rt_AddStage($templateUuid: String!, $input: StageInput!){
        _rtAddStage(templateUuid: $templateUuid, input: $input){
            uuid
        }
    }
`;

export const RT_ADD_SECTION = gql`
    mutation Rt_AddSection($templateUuid: String!, $input: SectionInput!){
        _rtAddSection(templateUuid: $templateUuid, input: $input){
            uuid
        }
    }
`;

export const RT_ADD_ACTION_POINT = gql`
    mutation RT_AddActionPoint($templateUuid: String!, $stageUuid: String!, $input: RTCreateActionPointInput!){
        _rtCreateActionPoint(templateUuid: $templateUuid, stageUuid: $stageUuid, input: $input){
            _id
            uuid
            title
        }
    }
`;

export const RT_ADD_ACTION_POINT_ORDER = gql`
    mutation RT_UpdateActionPointOrder($templateUuid: String!, $stageUuid: String!, $actionPointUuid: String!, $order: Int!){
        _rtUpdateActionPointOrder(templateUuid: $templateUuid, stageUuid: $stageUuid, actionPointUuid: $actionPointUuid, order: $order)
    }
`;

export const RT_ADD_ACTION_POINT_ASSIGNEES = gql`
    mutation RT_AddActionPointAssignees($actionPointUuid: String!, $sellersUuid: [String!]!){
        _rtAddActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid)
    }
`;

export const RT_REMOVE_ACTION_POINT_ASSIGNEES = gql`
    mutation RT_RemoveActionPointAssignees($actionPointUuid: String!,$sellersUuid: [String!]!){
        _rtRemoveActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid)
    }
`;

export const RT_MAP_STAGE_RESOURCES = gql`
    mutation RT_MapStageResource($templateUuid: String!, $stageUuid: String!, $resourcesUuid: [String!]!){
        _rtMapStageResource(templateUuid: $templateUuid, stageUuid: $stageUuid, resourcesUuid: $resourcesUuid)
    }
`;

export const RT_UPDATE_STAGE = gql`
    mutation RT_UpdateStage($templateUuid: String!, $stageUuid: String!, $input: StageInput!){
        _rtUpdateStage(templateUuid: $templateUuid, stageUuid: $stageUuid, input: $input)
    }
`;

export const RT_DELETE_ACTION_POINT = gql`
    mutation RT_DeleteActionPoint($actionPointUuid: String!){
        _rtDeleteActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const RT_DELETE_STAGE = gql`
    mutation RT_DeleteStage($templateUuid: String!, $stageUuid: String!){
        _rtDeleteStage(templateUuid: $templateUuid, stageUuid: $stageUuid)
    }
`;

export const RT_ADD_RECORD = gql`
    mutation RT_AddRecord($templateUuid: String!,$sectionUuid: String!, $input: RecordInput!, $content: Upload){
        _rtAddRecord(templateUuid: $templateUuid, sectionUuid: $sectionUuid, input: $input, content: $content){
            uuid
        }
    }
`;

export const RT_DELETE_SECTION = gql`
    mutation RT_DeleteSection($sectionUuid: String!){
        _rtDeleteSection(sectionUuid: $sectionUuid)
    }
`;

export const RT_DELETE_RECORD = gql`
    mutation RT_DeleteRecord($sectionUuid: String!, $recordUuid: String!){
        _rtDeleteRecord(sectionUuid: $sectionUuid, recordUuid: $recordUuid)
    }
`;

export const RT_UPDATE_ACTION_POINT = gql`
    mutation RT_UpdateActionPoint($actionPointUuid: String!, $input: RTUpdateActionPointInput!){
        _rtUpdateActionPoint(actionPointUuid: $actionPointUuid, input: $input)
    }
`;

export const RT_RESET_ACTION_POINT_TYPE = gql`
    mutation RT_ResetActionPointType($actionPointUuid: String!){
        _rtResetActionPointType(actionPointUuid: $actionPointUuid)
    }
`;

export const RT_MAP_ACTION_POINT_RESOURCE = gql`
    mutation RT_MapActionPointResource($actionPointUuid: String!, $resourceUuid: String!){
        _rtMapActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const RT_REMOVE_ACTION_POINT_RESOURCE = gql`
    mutation RT_RemoveActionPointResource($actionPointUuid: String!, $resourceUuid: String!){
        _rtRemoveActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const RT_UPDATE_RESOURCES = gql`
    mutation RT_UpdateResources($templateUuid: String!, $resourcesUuid: [String!]!, $action: UpdateAction!,$updateInAllRooms: Boolean!){
        _rtUpdateResources(templateUuid: $templateUuid, resourcesUuid: $resourcesUuid, action: $action, updateInAllRooms: $updateInAllRooms)
    }
`;

export const RT_UPDATE_SELLER_ACCOUNT = gql`
    mutation RT_UpdateSellerAccount($templateUuid: String!, $logo: Upload, $input: SellerAccountInput!){
        _rtUpdateSellerAccount(templateUuid: $templateUuid, logo: $logo, input: $input)
    }
`;

export const RT_UPDATE_BUYING_JOURNEY = gql`
    mutation RT_UpdateBuyingJourney($templateUuid: String!, $enable: Boolean!){
        _rtUpdateBuyingJourney(templateUuid: $templateUuid, enable: $enable)
    }
`;

export const RT_UPDATE_UPLOAD_ACTION_TYPE_IN_ACTION_POINT = gql`
    mutation RT_UpdateUploadTypeInActionPoint($actionPointUuid: String!){
        _rtUpdateUploadTypeInActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT = gql`
    mutation RT_UpdateBlobResourceInActionPoint($templateUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $title: String!, $content: Upload!){
        _rtUpdateBlobResourceInActionPoint(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, type: $type, title: $title, content: $content)
    }
`;

export const RT_UPDATE_LINK_RESOURCE_IN_ACTION_POINT = gql`
    mutation RT_UpdateLinkResourceInActionPoint($templateUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $url: String!){
        _rtUpdateLinkResourceInActionPoint(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, type: $type, url: $url)
    }  
`;

export const RT_UPDATE_RESOURCE_IN_ACTION_POINT = gql`
    mutation RT_UpdateResourceInActionPoint($templateUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $resourcesUuid: [String!]!){
        _rtUpdateResourceInActionPoint(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, type: $type, resourcesUuid: $resourcesUuid)
    }  
`;

export const RT_UPDATE_MEETING_TYPE_IN_ACTION_POINT = gql`
    mutation RT_UpdateMeetingTypeInActionPoint($templateUuid: String!, $actionPointUuid: String!, $meetingNotes: String, $calendarInfoInput: CalendarInfoInput){
        _rtUpdateMeetingTypeInActionPoint(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, meetingNotes: $meetingNotes, calendarInfoInput: $calendarInfoInput)
    }
`;

export const RT_REMOVE_STAGE_RESOURCE = gql`
    mutation RT_RemoveStageResource($templateUuid: String!, $stageUuid: String!, $resourceUuid: String!){
        _rtRemoveStageResource(templateUuid: $templateUuid, stageUuid: $stageUuid, resourceUuid: $resourceUuid)
    }
`;

export const RT_CREATE_TEMPLATE_BLOB_RESOURCE_V2 = gql`
    mutation CreateTemplateBlobResourceV2($templateUuid: String!, $title: String!, $description: String, $categories: [String] ,$input: BlobResourceInput, $thumbnail: Upload, $updateInAllRooms: Boolean!){
        createTemplateBlobResourceV2(templateUuid: $templateUuid, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail, updateInAllRooms: $updateInAllRooms){
            _id
            uuid
            title
        }
    }
`;

export const RT_CREATE_TEMPLATE_LINK_RESOURCE = gql`
    mutation CreateTemplateLinkResource($templateUuid: String!, $title: String, $description: String, $categories: [String], $url: String!, $urlType: String, $thumbnailImage: Upload, $updateInAllRooms: Boolean!, $properties: Map){
        createTemplateLinkResource(templateUuid: $templateUuid, title: $title, description: $description, categories: $categories, url: $url, urlType: $urlType, thumbnailImage: $thumbnailImage, updateInAllRooms: $updateInAllRooms, properties : $properties){
            _id
            uuid
            title
            type
        }
    }
`;

export const RT_UPDATE_ACTION_POINT_TYPE = gql`
    mutation RT_UpdateActionPointType($actionPointUuid: String!, $type: ActionPointType!){
        _rtUpdateActionPointType(actionPointUuid: $actionPointUuid, type: $type)
    }
`;

export const RT_UPDATE_STAGE_ORDER = gql`
    mutation RT_UpdateStageOrder($templateUuid: String!, $stageUuid: String!, $order: Int!){
        _rtUpdateStageOrder(templateUuid: $templateUuid, stageUuid: $stageUuid, order: $order)
    }
`;

export const RT_UPDATE_SECTION = gql`
    mutation RT_UpdateSection($sectionUuid: String!, $input: SectionInput! ){
        _rtUpdateSection(sectionUuid: $sectionUuid, input: $input)
    }
`;

export const RT_UPDATE_SECTION_ORDER = gql`
    mutation RT_UpdateSectionOrder($sectionUuid: String!, $order: Int!){
        _rtUpdateSectionOrder(sectionUuid: $sectionUuid, order: $order)
    }
`;

export const RT_UPDATE_STAGE_META = gql`
    mutation RT_UpdateStageMeta($templateUuid: String!, $section: SectionType!, $title: String, $isEnabled: Boolean){
        _rtUpdateMetadata(templateUuid: $templateUuid, section: $section, title: $title, isEnabled: $isEnabled)
    }
`;

export const DELETE_TEMPLATE = gql`
    mutation DeleteTemplate($templateUuid: String!){
        deleteRoomTemplate(templateUuid: $templateUuid)
    }
`;

export const RT_ADD_USECASE = gql`
    mutation _rtAddUsecaseV2($templateUuid: String!, $input: CreateUsecaseInput!, $updateInAllRooms: Boolean!){
        _rtAddUsecaseV2(templateUuid: $templateUuid, input: $input, updateInAllRooms: $updateInAllRooms){
            uuid
        }
    }
`;

export const RT_UPDATE_USECASE_ORDER = gql`
    mutation RT_UpdateUsecaseOrder($usecaseUuid: String!, $order: Int!){
        _rtUpdateUsecaseOrder(usecaseUuid: $usecaseUuid, order: $order)
    }
`;

export const RT_REMOVE_USECASE = gql`
    mutation RT_Remove_Usecase($usecaseUuid: String!){
        _rtRemoveUsecase(usecaseUuid: $usecaseUuid)
    }
`;

export const RT_UPDATE_USECASE = gql`
    mutation RT_UpdateUsecase($usecaseUuid: String!, $input: UpdateUsecaseInput!){
        _rtUpdateUsecase(usecaseUuid: $usecaseUuid, input: $input)
    }
`;

export const RT_UPDATE_METADATA = gql`
    mutation RT_UpdateMetadata($templateUuid: String!,$section: SectionType!,$title: String,$isEnabled: Boolean){
        _rtUpdateMetadata(templateUuid: $templateUuid, section: $section, title: $title, isEnabled: $isEnabled)
    }
`;

export const RT_REMOVE_PITCH = gql`
    mutation RT_RemovePitch($templateUuid: String!){
        _rtRemovePitch(templateUuid: $templateUuid)
    }
`;

export const CLONE_TEMPLATE_FROM_DEMO_ORG = gql`
    mutation Clone_Template_From_Demo_Org($templateUuid: String!){
        cloneTemplateFromDemoOrg(templateUuid: $templateUuid){
            uuid
        }
    }
`;

export const CLONE_TEMPLATE_FROM_EXISTING = gql`
    mutation CloneRoomTemplate($templateUuid: String!){
        cloneRoomTemplate(templateUuid: $templateUuid){
            uuid
        }
    }
`;

export const RT_UPDATE_RECORD = gql`
    mutation RT_Update_Record($recordUuid: String!, $input: RecordInput!, $content: Upload){
        _rtUpdateRecord(recordUuid: $recordUuid, input: $input, content: $content){
            uuid
        }
    }
`

export const REMOVE_SECTION_CONTENT = gql`
    mutation RemoveSectionContent($recordUuid: String!){
        removeRecordResource(recordUuid: $recordUuid)
    }
`;

export const RT_UPDATE_RECORD_ORDER = gql`
    mutation RT_UpdateRecordOrder($sectionUuid: String!, $recordUuid: String!, $order: Int!){
        _rtUpdateRecordOrder(sectionUuid: $sectionUuid, recordUuid: $recordUuid, order: $order)
    }
`;

export const RT_UPDATE_DISCOVERY = gql`
    mutation RT_UpdateDiscovery($templateUuid: String!, $enable: Boolean!){
        _rtUpdateDiscovery(templateUuid: $templateUuid, enable: $enable)
    }
`;

export const RT_UPDATE_ACTION_POINT_DUEINDAYS = gql`
    mutation RT_UpdateActionPointDueInDays($actionPointUuid: String!, $dueInDays: Int){
        _rtUpdateActionPointDueInDays(actionPointUuid: $actionPointUuid, dueInDays: $dueInDays)
    }
`;

export const RT_UPDATE_TEXT_CONTENT_IN_ACTION_POINT = gql `
    mutation RT_UpdateTextContentInActionPoint($templateUuid: String!, $actionPointUuid: String!, $textContent: String!){
        _rtUpdateTextContentInActionPoint(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, textContent: $textContent)
    }
`;

export const RT_UPDATE_COMPONENT_BY_PROPERTY = gql`
    mutation RT_UpdateComponentByProperty($widgetUuid: String!, $componentUuid: String!, $propertyKey: String!, $propertyContent: Map){
        _rtUpdateComponentByProperty(widgetUuid: $widgetUuid, componentUuid: $componentUuid, propertyKey: $propertyKey, propertyContent: $propertyContent)
    }
`;

export const RT_ADD_RESOURCE_COMPONENT = gql`
    mutation RT_AddResourceComponent($widgetUuid: String!, $resourceInput: ResourceInput){
        _rtAddResourceComponent(widgetUuid: $widgetUuid, resourceInput: $resourceInput)
    }
`;


// 


export const RT_UPDATE_BLOB_RESOURCE_IN_ACTION_POINT_V2 = gql`
    mutation RT_UpdateBlobResourceInActionPointV2($templateUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $title: String!, $description: String, $categories: [String], $input: BlobResourceInput, $thumbnail: Upload){
        _rtUpdateBlobResourceInActionPointV2(templateUuid: $templateUuid, actionPointUuid: $actionPointUuid, type: $type, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail)
    }
`;

export const RT_ADD_FILE_COMPONENT = gql`
    mutation RT_AddFileComponent($widgetUuid: String!, $resourceInput: ResourceInput){
        _rtAddFileComponent(widgetUuid: $widgetUuid, resourceInput: $resourceInput)
    }
`;

export const RT_CREATE_STAGE_RESOURCE = gql`
    mutation Rt_CreateStageResource($templateUuid: String!, $stageUuid: String!, $title: String!, $description: String, $categories: [String], $input: ResourceInput, $thumbnail: Upload){
        _rtCreateStageResource(templateUuid: $templateUuid, stageUuid: $stageUuid, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail)
    }
`;

export const RT_INITIALIZE = gql`
    mutation RT_Initialize($templateUuid: String!, $sectionConfig: SectionConfiguration){
        _rtInitialize(templateUuid: $templateUuid, sectionConfig: $sectionConfig)
    }
`;

export const RT_ADD_DEFAULT_SECTION = gql`
    mutation RT_AddDefaultSection($sectionUuid: String!){
        _rtAddDefaultSection(sectionUuid: $sectionUuid){
            uuid
            type
            title
            emoji
            order
            isHidden
        }
    }
`;

export const RT_UPDATE_HEADER_COMPONENT = gql`
    mutation RT_UpdateHeaderComponent($widgetUuid: String!, $componentUuid: String!, $coverImage: Upload, $primaryImage: Upload, $secImage: Upload){
        _rtUpdateHeaderComponent(widgetUuid: $widgetUuid, componentUuid: $componentUuid, coverImage: $coverImage, primaryImage: $primaryImage, secImage: $secImage)
    }
`;