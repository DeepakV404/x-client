import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
    mutation CreateRoom($title: String!, $templateUuid: String!, $accountUuid: String!, $enableDiscovery: Boolean!){
        createRoom(title: $title, templateUuid: $templateUuid, accountUuid: $accountUuid, enableDiscovery: $enableDiscovery ){
            _id
            uuid
        }
    }
`;

export const R_ADD_STAGE = gql`
    mutation R_AddStage($roomUuid: String!, $input: StageInput!){
        _rAddStage(roomUuid: $roomUuid, input: $input){
            uuid
        }
    }
`;

export const R_UPDATE_BUYING_JOURNEY = gql`
    mutation R_UpdateBuyingJourney($roomUuid: String!, $enable: Boolean!){
        _rUpdateBuyingJourney(roomUuid: $roomUuid, enable: $enable)
    }
`;

export const R_UPDATE_STAGE_ORDER = gql`
    mutation R_UpdateStageOrder($roomUuid: String!, $stageUuid: String!, $order: Int!){
        _rUpdateStageOrder(roomUuid: $roomUuid, stageUuid: $stageUuid, order: $order)
    }
`;

export const R_ADD_USERS = gql`
    mutation AddUsers($roomUuid: String!, $userUuids: [String!]!){
        _rAddUsers(roomUuid: $roomUuid, userUuids: $userUuids)
    }  
`;

export const R_UPDATE_OWNER = gql`
    mutation R_UpdateOwner($roomUuid: String!, $ownerUuid: String, $roomStageUuid: String, $note: String, $attachments: [AttachmentInput]!){
        _rUpdateOwner(roomUuid: $roomUuid, ownerUuid: $ownerUuid, roomStageUuid: $roomStageUuid, note: $note, attachments: $attachments)
    }
`;  

export const R_REMOVE_USERS = gql`
    mutation R_RemoveUsers($roomUuid: String!, $userUuids: [String!]!){
        _rRemoveUsers(roomUuid: $roomUuid, userUuids: $userUuids)
    }
`;

export const R_REMOVE_USECASE = gql`
    mutation R_Remove_Usecase($usecaseUuid: String!){
        _rRemoveUsecase(usecaseUuid: $usecaseUuid)
    }
`;

export const R_UPDATE_CLOSE_STAGE = gql`
    mutation R_UpdateCloseStage($roomUuid: String!, $roomStatus: RoomStatus!){
        _rCloseRoom(roomUuid: $roomUuid, roomStatus: $roomStatus)
    }
`;

export const R_ADD_ACTION_POINT_ASSIGNEES = gql`
    mutation R_AddActionPointAssignees($actionPointUuid: String!, $sellersUuid: [String!], $buyersUuid: [String!]){
        _rAddActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid, buyersUuid: $buyersUuid)
    }
`;

export const R_REMOVE_ACTION_POINT_ASSIGNEES = gql`
    mutation R_RemoveActionPointAssignees($actionPointUuid: String!, $sellersUuid: [String!], $buyersUuid: [String!]){
        _rRemoveActionPointAssignees(actionPointUuid: $actionPointUuid, sellersUuid: $sellersUuid, buyersUuid: $buyersUuid)
    }
`;

export const R_UPDATE_ACTION_POINTS_STATUS = gql`
    mutation R_UpdateActionPointsStatus($actionPointsUuid: [String!]!, $status: ActionPointStatus!){
        _rUpdateActionPointsStatus(actionPointsUuid: $actionPointsUuid, status: $status)
    }
`;

export const R_DELETE_ACTION_POINT = gql`
    mutation R_DeleteActionPoint($actionPointUuid: String!){
        _rDeleteActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const R_UPDATE_UPLOAD_TYPE_IN_ACTION_POINT = gql`
    mutation R_UpdateUploadTypeInActionPoint($actionPointUuid: String!){
        _rUpdateUploadTypeInActionPoint(actionPointUuid: $actionPointUuid)
    }
`;

export const R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT = gql`
    mutation R_UpdateBlobResourceInActionPoint($roomUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $title: String!, $description: String, $categories: [String], $content: Upload!, $thumbnail: Upload){
        _rUpdateBlobResourceInActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, type: $type, title: $title, description: $description, categories: $categories, content: $content, thumbnail: $thumbnail)
    }
`;

export const R_UPDATE_UPLOAD_LINK_RESOURCE_IN_ACTION_POINT = gql`
    mutation R_UpdateLinkResourceInActionPoint($roomUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $title: String $url: String!){
        _rUpdateLinkResourceInActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, type: $type, title: $title, url: $url)
    }  
`;

export const R_UPDATE_RESOURCE_IN_ACTION_POINT = gql`
    mutation R_UpdateResourceInActionPoint($roomUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $resourcesUuid: [String!]!){
        _rUpdateResourceInActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, type:$type, resourcesUuid: $resourcesUuid)
    }
`;

export const R_REMOVE_RESOURCE_IN_ACTION_POINT = gql`
    mutation R_RemoveResourceInActionPoint($actionPointUuid: String!, $resourceUuid: String!){
        _rRemoveActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const R_UPDATE_MEETING_TYPE_IN_ACTION_POINT = gql`
    mutation R_UpdateMeetingTypeInActionPoint($roomUuid: String!, $actionPointUuid: String!, $meetingNotes: String, $meetingMom: String, $meetingJoinLink: String, $calendarInfoInput: CalendarInfoInput, $recordingInput: ResourceInput, $uploadToCrm: Boolean){
        _rUpdateMeetingTypeInActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, meetingNotes: $meetingNotes, meetingMom: $meetingMom, meetingJoinLink: $meetingJoinLink, calendarInfoInput: $calendarInfoInput, recordingInput : $recordingInput, uploadToCrm: $uploadToCrm)
    }
`;

export const R_RESET_ACTION_POINT = gql`
    mutation R_ResetActionPointType($actionPointUuid: String!){
        _rResetActionPointType(actionPointUuid: $actionPointUuid)
    }
`;

export const R_COMMENT_ACTION_POINT = gql`
    mutation R_CommentActionPoint($roomUuid: String!, $actionPointUuid: String!, $comment: String!){
        _rCommentActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, comment: $comment)
    }
`;

export const CREATE_ROOM_LINK_RESOURCE_FOR_PITCH = gql`
    mutation CreateRoomLinkResourceForPitch($roomUuid: String!, $url: String!){
        createRoomLinkResource(roomUuid: $roomUuid, url: $url){
            _id
            uuid
        }
    }
`;

export const R_REMOVE_STAGE_RESOURCE = gql`
    mutation R_RemoveStageResource($roomUuid: String!, $stageUuid: String!, $resourceUuid: String!){
        _rRemoveStageResource(roomUuid: $roomUuid, stageUuid: $stageUuid, resourceUuid: $resourceUuid)
    }
`;

export const R_UPDATE_ACTION_POINT_TYPE = gql`
    mutation R_UpdateActionPointType($actionPointUuid: String!, $type: ActionPointType!){
        _rUpdateActionPointType(actionPointUuid: $actionPointUuid, type: $type)
    }
`;

export const SEND_HANDOFF_NOTE = gql`
    mutation Send_HandoffNote($roomUuid: String!, $sellerUuid: String!, $note: String!){
        sendHandoffNote(roomUuid: $roomUuid, sellerUuid: $sellerUuid, note: $note)
    }
`;

export const R_UPDATE_STAGE_NAME = gql`
    mutation R_UpdateStage($roomUuid: String!, $stageUuid: String!, $input: StageInput!){
        _rUpdateStage(roomUuid: $roomUuid, stageUuid: $stageUuid, input: $input)
    }
`;

export const R_UPDATE_ACTION_POINT_ORDER = gql`
    mutation R_UpdateActionPointOrder($roomUuid: String!, $stageUuid: String!, $actionPointUuid: String!, $order: Int!){
        _rUpdateActionPointOrder(roomUuid: $roomUuid, stageUuid: $stageUuid, actionPointUuid: $actionPointUuid, order: $order)
    }
`;


export const R_ADD_ACTION_POINT = gql`
    mutation R_AddActionPoint($roomUuid: String!, $stageUuid: String!, $input: RTCreateActionPointInput!){
        _rCreateActionPoint(roomUuid: $roomUuid, stageUuid: $stageUuid, input: $input){
            _id
            uuid
            title
        }
    }
`;

export const R_UPDATE_RESOURCES = gql`
    mutation R_UpdateResources($roomUuid: String!, $resourcesUuid: [String!]!, $action: UpdateAction!){
        _rUpdateResources(roomUuid: $roomUuid, resourcesUuid: $resourcesUuid, action: $action)
    }
`;

export const UPDATE_ROOM = gql`
    mutation UpdateRoom($roomUuid: String!, $input: RoomInput!, $sellerLogo: Upload){
        updateRoom(roomUuid: $roomUuid, input: $input, sellerLogo: $sellerLogo)
    }
`;

export const R_UPDATE_COVER_IMAGE = gql`
    mutation R_UpdateCoverImage($roomUuid: String!, $coverImage: Upload!){
        _rUpdateCoverImage(roomUuid: $roomUuid, coverImage: $coverImage)
    }  
`;

export const R_REMOVE_COVER_IMAGE = gql`
    mutation R_RemoveCoverImage($roomUuid: String!){
        _rRemoveCoverImage(roomUuid: $roomUuid)
    }  
`;

export const DELETE_ROOM = gql`
    mutation DeleteRoom($roomUuid: String!){
        deleteRoom(roomUuid: $roomUuid)
    }
`;

export const R_UPDATE_STAGE_META = gql`
    mutation R_UpdateStageMeta($roomUuid: String!,$section: SectionType!,$title: String,$isEnabled: Boolean){
        _rUpdateMetadata(roomUuid: $roomUuid, section: $section, title: $title, isEnabled: $isEnabled)
    }
`;

export const R_UPDATE_USECASE_ORDER = gql`
    mutation R_UpdateUsecaseOrder($usecaseUuid: String!, $order: Int!){
        _rUpdateUsecaseOrder(usecaseUuid: $usecaseUuid, order: $order)
    }
`;

export const R_ADD_USECASE = gql`
    mutation _rAddUsecaseV2($roomUuid: String!, $input: CreateUsecaseInput!){
        _rAddUsecaseV2(roomUuid: $roomUuid, input: $input){
            uuid
        }
    }
`;

export const R_UPDATE_USECASE = gql`
    mutation R_UpdateUsecase($usecaseUuid: String!, $input: UpdateUsecaseInput!){
        _rUpdateUsecase(usecaseUuid: $usecaseUuid, input: $input)
    }
`;

export const REMOVE_USECASE_CONTENT = gql`
    mutation RemoveUsecaseContent($usecaseUuid: String!, $contentType: UsecaseContentType!){
        removeUsecaseContent(usecaseUuid: $usecaseUuid, contentType: $contentType)
    }
`;

export const R_REMOVE_PITCH = gql`
    mutation R_RemovePitch($roomUuid: String!){
        _rRemovePitch(roomUuid: $roomUuid)
    }
`;

export const R_ADD_STAGE_RESOURCE = gql`
    mutation R_AddStageResource($roomUuid: String!, $stageUuid: String!, $resourcesUuid: [String!]!){
        _rMapStageResource(roomUuid: $roomUuid, stageUuid: $stageUuid, resourcesUuid: $resourcesUuid)
    }
`;

export const R_CREATE_STAGE_RESOURCE = gql`
    mutation R_CreateStageResource($roomUuid: String!, $stageUuid: String!, $title: String!, $description: String, $categories: [String], $input: ResourceInput, $thumbnail: Upload){
        _rCreateStageResource(roomUuid: $roomUuid, stageUuid: $stageUuid, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail)
    }
`

export const CREATE_ROOM_LINK_RESOURCE = gql`
    mutation CreateRoomLinkResource($roomUuid: String!, $title: String, $description: String, $categories: [String], $url: String!, $urlType: String, $thumbnailImage: Upload, $isResourceTab: Boolean){
        createRoomLinkResource(roomUuid: $roomUuid, title: $title, description: $description, categories: $categories, url: $url, urlType: $urlType, thumbnailImage: $thumbnailImage, isResourceTab: $isResourceTab){
            _id
            uuid
            title
            type
        }
    }
`;

export const R_ADD_SECTION = gql`
    mutation R_AddSection($roomUuid: String!, $input: SectionInput!){
        _rAddSection(roomUuid: $roomUuid, input: $input){
            uuid
        }
    }
`;

export const R_UPDATE_SECTION_ORDER = gql`
    mutation R_UpdateSectionOrder($sectionUuid: String!, $order: Int!){
        _rUpdateSectionOrder(sectionUuid: $sectionUuid, order: $order)
    }
`;

export const R_UPDATE_SECTION = gql`
    mutation R_UpdateSection($sectionUuid: String!, $input: SectionInput!){
        _rUpdateSection(sectionUuid: $sectionUuid, input: $input)
    }
`;

export const R_DELETE_SECTION = gql`
    mutation R_DeleteSection($sectionUuid: String!){
        _rDeleteSection(sectionUuid: $sectionUuid)
    }
`;

export const R_ADD_RECORD = gql`
    mutation R_AddRecord($roomUuid: String!,$sectionUuid: String!, $input: RecordInput!, $content: Upload){
        _rAddRecord(roomUuid: $roomUuid, sectionUuid: $sectionUuid, input: $input, content: $content){
            uuid
        }
    }
`;

export const R_UPDATE_RECORD = gql`
    mutation R_UpdateRecord($recordUuid: String!, $input: RecordInput!, $content: Upload){
        _rUpdateRecord(recordUuid: $recordUuid, input: $input, content: $content){
            uuid
        }
    }
`;

export const R_UPDATE_RECORD_ORDER = gql`
    mutation R_UpdateRecordOrder($sectionUuid: String!, $recordUuid: String!, $order: Int!){
        _rUpdateRecordOrder(sectionUuid: $sectionUuid, recordUuid: $recordUuid, order: $order)
    }
`;

export const R_DELETE_RECORD = gql`
    mutation R_DeleteRecord($sectionUuid: String!, $recordUuid: String!){
        _rDeleteRecord(sectionUuid: $sectionUuid, recordUuid: $recordUuid)
    }
`;

export const R_UPDATE_DISCOVERY = gql`
    mutation R_UpdateDiscovery($roomUuid: String!, $enable: Boolean!){
        _rUpdateDiscovery(roomUuid: $roomUuid, enable: $enable)
    }
`;

export const R_COMMENT = gql`
    mutation CommentInRoom($roomUuid: String!, $comment: String!){
        _rCommentInRoom(roomUuid: $roomUuid, comment: $comment)
    }
`;

export const R_REMOVE_BLOB = gql`
    mutation RemoveBlob($attachmentUuid: [String!]!){
        deleteAttachments(attachmentUuid: $attachmentUuid)
    }
`

export const R_ATTACH_BLOB = gql`
    mutation AttachBlob($title: String!, $content: Upload!){
        attachBlob(title: $title, content: $content){
            title
            blobUuid
            contentType
            extension
        }
    }
`;

export const R_ADD_USERROLE = gql`
    mutation R_Add_UserRole($roomUuid: String!, $contactUuid: String!, $userRole: String!){
        _rAddUserRole(roomUuid: $roomUuid, contactUuid: $contactUuid, userRole: $userRole)
    }
`;

export const ADD_SECTION_PERMISSION = gql`
    mutation R_Add_Section_Permission($roomUuid: String!, $sectionUuid: String!, $buyerUuids: [String!]){
        _rAddSectionAccess(roomUuid: $roomUuid, sectionUuid: $sectionUuid, buyerUuids: $buyerUuids)
    }
`;

export const REMOVE_SECTION_PERMISSION = gql`
    mutation R_Remove_Section_Permission($roomUuid: String!, $sectionUuid: String!, $buyerUuids: [String!]){
        _rRemoveSectionAccess(roomUuid: $roomUuid, sectionUuid: $sectionUuid, buyerUuids: $buyerUuids)
    }
`;

export const R_UPDATE_TEXT_CONTENT_IN_ACTION_POINT = gql `
    mutation R_UpdateTextContentInActionPoint($roomUuid: String!, $actionPointUuid: String!, $textContent: String!){
        _rUpdateTextContentInActionPoint(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, textContent: $textContent)
    }
`;

export const R_ADD_ROOM_NOTE = gql`
    mutation R_AddRoomNote($roomUuid: String!, $note: String!, $attachments: [AttachmentInput]!){
        _rAddRoomNote(roomUuid: $roomUuid, note: $note, attachments: $attachments)
    }
`;

export const R_UPDATE_MESSAGE = gql`
    mutation R_UpdateMessage($commentUuid: String!, $comment: String!){
        _rUpdateComment(commentUuid: $commentUuid, comment: $comment)
    }
`;

export const R_DELETE_MESSAGE = gql`
    mutation R_DeleteMessage($commentUuid: String!){
        _rDeleteComment(commentUuid: $commentUuid)
    }
`;

export const R_CLONE_WIDGET = gql`
    mutation WidgetCatalog($sectionUuid: String!, $widgetUuid: String!, $input: WidgetInput){
        cloneWidget(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid, input: $input){
            uuid
        }
    }
`;

export const UPDATE_WIDGET = gql`
    mutation UpdateWidget($sectionUuid: String!, $widgetUuid: String!, $input: WidgetInput!){
        updateWidget(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid, input: $input)
    }
`;

export const UPDATE_RESOURCE_COMPONENT_BY_PAGES = gql`
    mutation UpdateResourceComponentByPages($componentUuid: String!, $widgetUuid: String!, $resourceUuid: String!, $pages: [Int!]!){
        updateResourceComponentByPages(componentUuid: $componentUuid, widgetUuid: $widgetUuid, resourceUuid: $resourceUuid, pages: $pages)
    }
`;

export const DELETE_COMPONENT = gql`
    mutation DeleteComponent($componentUuid: String!, $widgetUuid: String!){
        deleteComponent(componentUuid: $componentUuid, widgetUuid: $widgetUuid)
    }
`;

export const UPDATE_COMPONENT = gql`
    mutation UpdateComponent($componentUuid: String!, $widgetUuid: String!, $content: Map!){
        updateComponent(componentUuid: $componentUuid, widgetUuid: $widgetUuid, content: $content)
    }
`;

export const UPDATE_RESOURCE_COMPONENT = gql`
    mutation UpdateResourceComponent($componentUuid: String!, $widgetUuid: String!, $resourceInput: ResourceInput, $resource: Upload, $isTemplate: Boolean){
        updateResourceComponent(componentUuid: $componentUuid, widgetUuid: $widgetUuid, resourceInput: $resourceInput, resource: $resource, isTemplate: $isTemplate)
    }
`;

export const UPDATE_COMPONENT_PROFILE_IMG =   gql`
    mutation UpdateComponentProfile($componentUuid: String!, $widgetUuid: String!, $profileImage: Upload){
        updateComponentProfile(componentUuid: $componentUuid, widgetUuid: $widgetUuid, profileImage : $profileImage)
    }
`

export const DELETE_WIDGET = gql`
    mutation DeleteWidget($sectionUuid: String!, $widgetUuid: String!){
        deleteWidget(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid)
    }
`;

export const UPDATE_WIDGET_ORDER = gql`
    mutation UpdateWidgetOrder($sectionUuid: String!, $widgetUuid: String!, $targetOrder: Int!){
        updateWidgetOrder(sectionUuid: $sectionUuid, widgetUuid: $widgetUuid, targetOrder: $targetOrder)
    }
`

export const UPDATE_COMPONENT_ORDER = gql`
    mutation UpdateComponentOrder($componentUuid: String!, $widgetUuid: String!, $targetOrder: Int!){
        updateComponentOrder(componentUuid: $componentUuid, widgetUuid: $widgetUuid, targetOrder: $targetOrder)
    }
`

export const R_UPDATE_COMPONENT_BY_PROPERTY = gql`
    mutation R_UpdateComponentByProperty($widgetUuid: String!, $componentUuid: String!, $propertyKey: String!, $propertyContent: Map){
        _rUpdateComponentByProperty(widgetUuid: $widgetUuid, componentUuid: $componentUuid, propertyKey: $propertyKey, propertyContent: $propertyContent)
    }
`;

export const R_ADD_RESOURCE_COMPONENT = gql`
    mutation R_AddResourceComponent($widgetUuid: String!, $resourceInput: ResourceInput){
        _rAddResourceComponent(widgetUuid: $widgetUuid, resourceInput: $resourceInput)
    }
`;

// Blob- Resource

export const R_UPDATE_UPLOAD_BLOB_RESOURCE_IN_ACTION_POINT_V2 = gql`
    mutation R_UpdateBlobResourceInActionPointV2($roomUuid: String!, $actionPointUuid: String!, $type: ActionPointType!, $title: String!, $description: String, $categories: [String], $input: BlobResourceInput, $thumbnail: Upload, $uploadToCrm: Boolean){
        _rUpdateBlobResourceInActionPointV2(roomUuid: $roomUuid, actionPointUuid: $actionPointUuid, type: $type, title: $title, description: $description, categories: $categories, input: $input, thumbnail: $thumbnail, uploadToCrm: $uploadToCrm)
    }
`;

export const UPDATE_RESOURCE_COMPONENT_V2 = gql`
    mutation UpdateResourceComponentV2($componentUuid: String!, $widgetUuid: String!, $resourceInput: ResourceInput!, $isTemplate: Boolean){
        updateResourceComponentV2(componentUuid: $componentUuid, widgetUuid: $widgetUuid, resourceInput: $resourceInput, isTemplate: $isTemplate)
    }
`;

export const CREATE_LEAD_ROOM = gql`
   mutation CreateLeadRoom($input: CreateLeadRoomInput!){
        createLeadRoom(input: $input){
            uuid
            title
            accountStub{
                uuid
            }
        }
    }
`;

export const CREATE_ROOM_V2 = gql`
    mutation CreateRoomV2($input: CreateRoomInput!){
        createRoomV2(input: $input){
            _id
            uuid
        }
    }
`;


export const R_ADD_CONTACT_TO_CRM = gql`
    mutation R_AddContactToCRM($roomUuid: String!, $contactUuid: String!){
        _rAddContactToCRM(roomUuid: $roomUuid, contactUuid: $contactUuid)
    }
`;

export const R_ADD_CONTACT_TO_ROOM = gql`
    mutation R_AddContactsToRoom($roomUuid: String!, $inputs: [CRMContactInput!]){
        _rAddContactsToRoom(roomUuid: $roomUuid, inputs: $inputs)
    }
`;

export const R_ADD_FILE_COMPONENT = gql`
    mutation R_AddFileComponent($widgetUuid: String!, $resourceInput: ResourceInput){
        _rAddFileComponent(widgetUuid: $widgetUuid, resourceInput: $resourceInput)
    }
`;

export const R_INITIALIZE = gql`
    mutation R_Initialize($roomUuid: String!, $sectionConfig: SectionConfiguration){
        _rInitialize(roomUuid: $roomUuid, sectionConfig: $sectionConfig)
    }
`;

export const R_ADD_DEFAULT_SECTION = gql`
    mutation R_AddDefaultSection($sectionUuid: String!){
        _rAddDefaultSection(sectionUuid: $sectionUuid){
            uuid
            type
            title
            emoji
            order
            isHidden
        }
    }
`;

export const R_ADD_DEFAULT_SECTION_BY_TYPE = gql`
    mutation R_AddDefaultSectionByType($roomUuid: String!, $type: SectionType!){
        _rAddDefaultSectionByType(roomUuid: $roomUuid, type: $type){
            uuid
            type
            title
            emoji
            order
            isHidden
        }
    }
`;

export const R_UPDATE_HEADER_COMPONENT = gql`
    mutation R_UpdateHeaderComponent($widgetUuid: String!, $componentUuid: String!, $coverImage: Upload, $primaryImage: Upload, $secImage: Upload){
        _rUpdateHeaderComponent(widgetUuid: $widgetUuid, componentUuid: $componentUuid, coverImage: $coverImage, primaryImage: $primaryImage, secImage: $secImage)
    }
`;

export const UPDATE_ROOM_PROPERTY = gql`
    mutation UpdateRoomProperty($roomUuid: String!, $key: String!, $value: Object!){
        updateRoomProperty(roomUuid: $roomUuid, key: $key, value: $value)
    }
`;