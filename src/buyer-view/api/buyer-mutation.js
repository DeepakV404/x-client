import { gql } from "@apollo/client";

export const P_INVITE_BUYER = gql`
    mutation P_InviteBuyer($emailId: [String!]!, $reasonUuid: String!, $message: String){
        _pInviteBuyer(emailId: $emailId, reasonUuid: $reasonUuid, message: $message)
    }
`;

export const P_CREATE_ACTION_POINT = gql`
    mutation P_CreateActionPoint($stageUuid: String!, $input: CreatePortalActionPoint!){
        _pCreateActionPoint(stageUuid: $stageUuid, input: $input)
    }
`;

export const P_ADD_ACTION_POINT_ASSIGNEES = gql`
    mutation P_AddActionPointAssignees($actionPointsUuid: [String!]!, $buyersUuid: [String!]!){
        _pAddActionPointAssignees(actionPointsUuid: $actionPointsUuid, buyersUuid: $buyersUuid)
    }
`;

export const P_REMOVE_ACTION_POINT_ASSIGNEES = gql`
    mutation P_RemoveActionPointAssignees($actionPointsUuid: [String!]!, $buyersUuid: [String!]!){
        _pRemoveActionPointAssignees(actionPointsUuid: $actionPointsUuid, buyersUuid: $buyersUuid)
    }
`;

export const P_UPDATE_ACTION_POINT_STATUS = gql`
    mutation P_UpdateActionPointStatus($actionPointsUuid: [String!]!, $status: ActionPointStatus!){
        _pUpdateActionPointStatus(actionPointsUuid: $actionPointsUuid, status: $status)
    }
`;

export const P_UPDATE_ACTION_POINT_DUE = gql`
    mutation P_UpdateActionPointDue($actionPointsUuid: [String!]!, $dueAt: Long!){
        _pUpdateActionPointDue(actionPointsUuid: $actionPointsUuid, dueAt: $dueAt)
    }
`;

export const P_UPDATE_ACTION_POINT_ORDER = gql`
    mutation P_UpdateActionPointOrder($stageUuid: String!, $actionPointUuid: String!, $order: Int!){
        _pUpdateActionPointOrder(stageUuid: $stageUuid, actionPointUuid: $actionPointUuid, order: $order)
    }
`;

export const P_UPDATE_ACTION_POINT = gql`
    mutation P_UpdateActionPoint($actionPointUuid: String!, $input: UpdatePortalActionPoint!){
        _pUpdateActionPoint(actionPointUuid: $actionPointUuid, input: $input)
    }
`;

export const P_UPDATE_BUYER_PROFILE = gql`
    mutation P_UpdateBuyerProfile($profile: Upload, $input: UpdateBuyerProfileInput!){
        _pUpdateBuyerProfile(profile: $profile, input: $input)
    }
`;

export const P_RESET_ACTION_POINT_TYPE = gql`
    mutation P_ResetActionPointType($actionPointUuid: String!){
        _pResetActionPointType(actionPointUuid: $actionPointUuid)
    }
`;

export const P_MAP_ACTION_POINT_RESOURCE = gql`
    mutation P_MapActionPointResource($actionPointUuid: String!, $resourceUuid: String!){
        _pMapActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const P_ADD_ACTION_POINT_RESOURCE = gql`
    mutation P_AddActionPointResource($actionPointUuid: String!, $content: Upload!, $title: String!){
        _pAddActionPointResource(actionPointUuid: $actionPointUuid, content: $content, title: $title)
    }
`;

export const P_REMOVE_ACTION_POINT_RESOURCE = gql`
    mutation P_RemoveActionPointResource($actionPointUuid: String!, $resourceUuid: String!){
        _pRemoveActionPointResource(actionPointUuid: $actionPointUuid, resourceUuid: $resourceUuid)
    }
`;

export const P_ADD_COMMENT_TO_ACTION_POINT = gql`
    mutation P_CommentActionPoint($actionPointUuid: String!, $comment: String!){
        _pCommentActionPoint(actionPointUuid: $actionPointUuid, comment: $comment)
    }
`; 

export const P_TRACK_EVENT = gql`
    mutation P_TrackEvent($input: EventInput!){
        _pTrackEvent(input: $input)
    }
`;

export const P_ADD_ACTION_POINT_BLOB_RESOURCE = gql`
    mutation P_AddActionPointBlobResource($actionPointUuid: String!, $title: String!, $input: ResourceInput!, $thumbnail: Upload){
        _pAddActionPointBlobResource(actionPointUuid: $actionPointUuid, title: $title, input: $input, thumbnail: $thumbnail)
    }
`;

export const P_ADD_RESOURCE_COMPONENT = gql`
    mutation P_AddResourceComponent($widgetUuid: String!, $blobInput: BlobResourceInput!){
        _pAddResourceComponent(widgetUuid: $widgetUuid, blobInput: $blobInput)
    }
`;

export const P_ADD_ACTION_POINT_LINK_RESOURCE = gql`
    mutation P_AddActionPointLinkResource($actionPointUuid: String!, $url: String!){
        _pAddActionPointLinkResource(actionPointUuid: $actionPointUuid, url: $url)
    }
`;

export const P_REQUEST_RESOURCE = gql`
    mutation P_RequestResource($stageUuid: String!, $input: CreateBuyerActionPoint!){
        _pRequestResource(stageUuid: $stageUuid, input: $input)
    }
`;

export const P_REQUEST_MEETING = gql`
    mutation P_RequestMeeting($stageUuid: String!, $input: CreateBuyerActionPoint!){
        _pRequestMeeting(stageUuid: $stageUuid, input: $input)
    }
`;

export const P_CLEAR_ALL_NOTIFICATIONS = gql`
    mutation P_ClearAllNotifications($filter: NotificationFilterCategory!){
        _pClearAllNotifications(filter: $filter)
    }  
`;

export const P_UPDATE_DISCOVERY_RESPONSE = gql`
    mutation P_UpdateDiscoveryResponse($sessionUuid: String!, $touchPointUuid: String!, $input: [QnResponseInput!]){
        _pUpdateResponse(sessionUuid: $sessionUuid, touchPointUuid:$touchPointUuid, input: $input)
    }
`;

export const P_CREATE_SESSION = gql`
    mutation P_CreateSession($sessionUuid: String!){
        createSession(sessionUuid: $sessionUuid)
    }
`;

export const P_UPDATE_SIDER_QUESTION_RESPONSE = gql`
    mutation P_UpdateSiderQuestionResponse($sessionUuid: String!, $questionUuid: String!, $response: Object!){
        _pUpdateQuestionResponse(sessionUuid: $sessionUuid, questionUuid: $questionUuid, response: $response)
    }
`;

export const P_UPDATE_ALL_QUESTION_RESPONSE = gql`
    mutation P_UpdateAllQuestionResponse($sessionUuid: String!, $responses: Map!){
        _pUpdateQuestionResponses(sessionUuid: $sessionUuid, responses: $responses)
    }
`;
  
export const CLEAR_SESSION = gql`
    mutation P_ClearSession($sessionUuid: String!){
        clearSession(sessionUuid: $sessionUuid)
    }  
`;

export const P_TRACK_PAGE_EVENTS = gql`
    mutation P_TrackPageEvent($input: PageEventInput!){
        _pTrackPageEvent(input: $input)
    }
`;

export const P_TRACK_SECTION_EVENTS = gql`
    mutation P_TrackSectionEvent($input: SectionEventInput!){
        _pTrackSectionEvent(input: $input)
    }
`;

export const P_CHECK_SESSION = gql`
    mutation P_CheckSession($sessionUuid: String!){
        hasSession(sessionUuid: $sessionUuid)
    }
`;

export const P_REMOVE_BUYER_PROFILE_IMAGE = gql`
    mutation P_RemoveBuyerProfileImage{
        _pRemoveBuyerProfileImage
    }
`;

export const P_SELF_INVITE = gql`
    mutation P_SelfInvite($emailId: String!){
        _pSelfInvite(emailId: $emailId)
    }
`;

export const P_COMMENT_IN_ROOM = gql`
    mutation P_CommentInRoom($comment: String!){
        _pCommentInRoom(comment: $comment)
    }
`;

export const SEND_OTP_TO_ACCESS_SECTION = gql`
    mutation SendOtpToAccessSection($sectionUuid: String!){
        sendOtpToAccessSection(sectionUuid: $sectionUuid)
    }
`;

export const SEND_OTP_TO_ROOM = gql`
    mutation SendOtp{
        sendOtp
    }
`;

export const VERIFY_OTP = gql`
    mutation VerifyOtp($otp: String!){
        verifyOtp(otp: $otp)
    }
`;

export const RESEND_BUYER_INVITE = gql`
    mutation P_ResendInvite($buyerUuid: String!){
        _pResendInvite(buyerUuid: $buyerUuid)
    }
`;

export const P_UPDATE_MESSAGE = gql`
    mutation P_UpdateMessage($commentUuid: String!, $comment: String!){
        _pUpdateComment(commentUuid: $commentUuid, comment: $comment)
    }
`;

export const P_DELETE_MESSAGE = gql`
    mutation P_DeleteMessage($commentUuid: String!){
        _pDeleteComment(commentUuid: $commentUuid)
    }
`;

export const P_MARK_AP_NOTI_AS_READ = gql`
    mutation P_MarkAPNofiticationsAsRead($actionPointUuid: String!){
        _pMarkAPNotificationsAsRead(actionPointUuid: $actionPointUuid)
    }
`;

export const P_TRACK_CONTACT_ENTERED_EVENT = gql`
    mutation P_TrackContactEnteredEvent{
        _pTrackContactEnteredEvent
    }
`;

export const P_COMPLETE_BLOB_REQUEST = gql`
    mutation P_CompleteBlobRequest($uploadId: String!, $contentUuid: String!, $input: [CompletedPartInput!]!){
        _pCompleteBlobRequest(uploadId: $uploadId, contentUuid: $contentUuid, input: $input)
    }
`;

export const P_DELETE_COMPONENT = gql`
    mutation P_DeleteComponent($widgetUuid: String!, $componentUuid: String!){
        _pDeleteComponent(widgetUuid: $widgetUuid, componentUuid: $componentUuid)
    }
`;
