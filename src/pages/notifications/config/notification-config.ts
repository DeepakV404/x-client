export const RESOURCE_ADDED_IN_ACTION_POINT                 =   "RESOURCE_ADDED_IN_ACTION_POINT";
export const RESOURCE_ADDED_IN_ROOM                         =   "RESOURCE_ADDED_IN_ROOM";
export const MENTION_IN_MESSAGE                             =   "MENTION_IN_MESSAGE";
export const MENTION_IN_COMMENT                             =   "MENTION_IN_COMMENT";
export const STEP_ADDED                                     =   "STEP_ADDED";
export const ACTION_POINT_ADDED                             =   "ACTION_POINT_ADDED";
export const ASSIGNED_TO_ACTION_POINT                       =   "ASSIGNED_TO_ACTION_POINT";
export const ACTION_POINT_DUE_DATE_CHANGED                  =   "ACTION_POINT_DUE_DATE_CHANGED";
export const ACTION_POINT_DUE_DATE_EXCEEDED                 =   "ACTION_POINT_DUE_DATE_EXCEEDED";
export const ACTION_POINT_STATUS_UPDATED                    =   "ACTION_POINT_STATUS_UPDATED";
export const COMMENT_ADDED_IN_ACTION_POINT                  =   "COMMENT_ADDED_IN_ACTION_POINT";
export const MEETING_LINK_ADDED_IN_ASSIGNED_ACTION_POINT    =   "MEETING_LINK_ADDED_IN_ASSIGNED_ACTION_POINT";
export const RECORDING_UPDATED_IN_ACTION_POINT              =   "RECORDING_UPDATED_IN_ACTION_POINT"
export const RESOURCE_ADDED_IN_USE_CASE                     =   "RESOURCE_ADDED_IN_USE_CASE";
export const RESOURCE_ADDED_IN_PITCH                        =   "RESOURCE_ADDED_IN_PITCH";
export const RESOURCE_ADDED_IN_STAGE                        =   "RESOURCE_ADDED_IN_STAGE";
export const ASSIGNEE_REMOVED_FROM_ACTION_POINT             =   "ASSIGNEE_REMOVED_FROM_ACTION_POINT";
export const RESOURCE_REQUEST_FROM_BUYER                    =   "RESOURCE_REQUEST_FROM_BUYER";
export const MEETING_REQUEST_FROM_BUYER                     =   "MEETING_REQUEST_FROM_BUYER";
export const MESSAGE_IN_ROOM                                =   "MESSAGE_IN_ROOM";
export const BUYER_TO_BUYER_RE_INVITE                       =   "BUYER_TO_BUYER_RE_INVITE";
export const BUYER_TO_BUYER_INVITE                          =   "BUYER_TO_BUYER_INVITE";
export const SECTION_ADDED                                  =   "SECTION_ADDED";
export const RESOURCE_ADDED_IN_SECTION                      =   "RESOURCE_ADDED_IN_SECTION";
export const STEP_ENABLED                                   =   "STEP_ENABLED";
export const INVITATION_ACCEPTED_BY_BUYER                   =   "INVITATION_ACCEPTED_BY_BUYER";
export const BUYER_ENTERED_INTO_ROOM                        =   "BUYER_ENTERED_INTO_ROOM";
export const BUYER_UPDATED_PROFILE                          =   "BUYER_UPDATED_PROFILE";
export const NEW_ROOM_CREATED                               =   "NEW_ROOM_CREATED";
export const BUYER_SELF_INVITE                              =   "BUYER_SELF_INVITE";
export const MEETING_DETAILS_UPDATED                        =   "MEETING_DETAILS_UPDATED";
export const SELLER_TO_BUYER_INVITE                         =   "SELLER_TO_BUYER_INVITE"

export const TYPE_RESOURCE          =   "resource";
export const TYPE_ACTION_POINT      =   "actionPoint";
export const TYPE_COMMENT           =   "comment";
export const TYPE_MENTIONS          =   "mentions";
export const TYPE_INVTE             =   "emailId";
export const TYPE_SECTION           =   "section";
export const TYPE_STEP              =   "stage";
export const TYPE_ROOM_ENTRY        =   "room_entry"
export const TYPE_DEFAULT           =   "default";
export const TYPE_MENTION_COMMENT   =   "mention_comments";
export const TYPE_MULTIPLE_INVITE   =   "multiple_invite";

export const NOTIFICATION_CONFIG: Record<string, {
    key             :   string;
    metaKey         :   string;
    compoundText    :   any;
    i18nKey         :   string;
}>    =   
{
    [RESOURCE_ADDED_IN_ACTION_POINT]  :  {
        key             :   RESOURCE_ADDED_IN_ACTION_POINT,
        compoundText    :   "has added new resource in the Action Point",
        i18nKey         :   "buyers-notifications.resource-added-in-ap",
        metaKey         :   TYPE_RESOURCE,
    },
    [RESOURCE_ADDED_IN_ROOM]  :  {
        key             :   RESOURCE_ADDED_IN_ROOM,
        i18nKey         :   "buyers-notifications.added-a-new-resource",
        compoundText    :   "has added new Resource",
        metaKey         :   TYPE_RESOURCE,
    },
    [MENTION_IN_COMMENT]  :  {
        key             :   MENTION_IN_COMMENT,
        i18nKey         :   "buyers-notifications.mentioned-in-a-comment",
        compoundText    :   "has mentioned you in a comment.",
        metaKey         :   TYPE_MENTION_COMMENT,
    },
    [MENTION_IN_MESSAGE]  :  {
        key             :   MENTION_IN_MESSAGE,
        i18nKey         :   "buyers-notifications.mentioned-in-a-message",
        compoundText    :   "has mentioned you in a message.",
        metaKey         :   TYPE_MENTIONS,
    },
    [STEP_ADDED]  :  {
        key             :   STEP_ADDED,
        i18nKey         :   "buyers-notifications.added-new-step",
        compoundText    :   "has added a new Step",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [ACTION_POINT_ADDED]  :   {
        key             :   ACTION_POINT_ADDED,
        i18nKey         :   "buyers-notifications.added-new-ap",
        compoundText    :   "has added a new Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [ASSIGNED_TO_ACTION_POINT]  :  {
        key             :   ASSIGNED_TO_ACTION_POINT,
        i18nKey         :   "buyers-notifications.assigned-you-to-a-ap",
        compoundText    :   "has assigned you to the Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [ACTION_POINT_DUE_DATE_CHANGED]  :  {
        key             :   ACTION_POINT_DUE_DATE_CHANGED,
        i18nKey         :   "buyers-notifications.updated-ap-due-date",
        compoundText    :   "has updated the Action Point's Due date",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [ACTION_POINT_DUE_DATE_EXCEEDED]  :  {
        key             :   ACTION_POINT_DUE_DATE_EXCEEDED,
        i18nKey         :   "buyers-notifications.ap-due-date-exceeded",
        compoundText    :   "Action Point Due date has been exceeded",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [ACTION_POINT_STATUS_UPDATED]  :  {
        key             :   ACTION_POINT_STATUS_UPDATED,
        i18nKey         :   "buyers-notifications.changed-ap-status",
        compoundText    :   "has changed the status of the Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [COMMENT_ADDED_IN_ACTION_POINT]  :  {
        key             :   COMMENT_ADDED_IN_ACTION_POINT,
        i18nKey         :   "buyers-notifications.added-a-comment-in-ap",
        compoundText    :   "has added a comment in the Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [MEETING_LINK_ADDED_IN_ASSIGNED_ACTION_POINT]  :  {
        key             :   MEETING_LINK_ADDED_IN_ASSIGNED_ACTION_POINT,
        i18nKey         :   "buyers-notifications.added-meeting-link-in-ap",
        compoundText    :   "has added a meeting link in the Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [RECORDING_UPDATED_IN_ACTION_POINT] :   {
        key             :   RECORDING_UPDATED_IN_ACTION_POINT,
        i18nKey         :   "buyers-notifications.updated-meeting-recording-in-ap",
        compoundText    :   "has updated the meeting recording in the Action Point",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [RESOURCE_ADDED_IN_USE_CASE] : {
        key             :   RESOURCE_ADDED_IN_USE_CASE,
        i18nKey         :   "buyers-notifications.added-new-demo",
        compoundText    :   "has added a new Demo",
        metaKey         :   TYPE_RESOURCE,
    },
    [RESOURCE_ADDED_IN_PITCH]: {
        key             :   RESOURCE_ADDED_IN_PITCH,
        i18nKey         :   "buyers-notifications.added-new-pitch-content",
        compoundText    :   "has added a new Pitch content",
        metaKey         :   TYPE_RESOURCE,
    },
    [RESOURCE_ADDED_IN_STAGE]: {
        key             :   RESOURCE_ADDED_IN_STAGE,
        i18nKey         :   "buyers-notifications.added-new-resource-in-step",
        compoundText    :   "has added a resource in the Step",
        metaKey         :   TYPE_RESOURCE,
    },
    [ASSIGNEE_REMOVED_FROM_ACTION_POINT]: {
        key             :   ASSIGNEE_REMOVED_FROM_ACTION_POINT,
        i18nKey         :   "buyers-notifications.removed-you-from-ap",
        compoundText    :   "has removed you from the Action point",
        metaKey         :   TYPE_RESOURCE,
    },
    [RESOURCE_REQUEST_FROM_BUYER]:{
        key             :   RESOURCE_REQUEST_FROM_BUYER,
        i18nKey         :   "buyers-notifications.requested-new-resource",
        compoundText    :   "has requested a new resource",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [MEETING_REQUEST_FROM_BUYER]:{
        key             :   MEETING_REQUEST_FROM_BUYER,
        i18nKey         :   "buyers-notifications.requested-new-meeting",
        compoundText    :   "has requested a meeting",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [MESSAGE_IN_ROOM]: {
        key             :   MESSAGE_IN_ROOM,
        i18nKey         :   "buyers-notifications.added-a-message",
        compoundText    :   "has sent a message",
        metaKey         :   TYPE_COMMENT,
    },
    [BUYER_TO_BUYER_RE_INVITE]  :  {
        key             :   BUYER_TO_BUYER_RE_INVITE,
        compoundText    :   "has re-invited",
        i18nKey         :   "buyers-notifications.has-invited",
        metaKey         :   TYPE_INVTE,
    },
    [BUYER_TO_BUYER_INVITE]  :  {
        key             :   BUYER_TO_BUYER_RE_INVITE,
        compoundText    :   "has invited",
        i18nKey         :   "buyers-notifications.has-re-invited",
        metaKey         :   TYPE_INVTE,
    },
    [SECTION_ADDED]  :  {
        key             :   SECTION_ADDED,
        compoundText    :   "has added a new section",
        i18nKey         :   "buyers-notifications.has-added-section",
        metaKey         :   TYPE_SECTION,
    },
    [RESOURCE_ADDED_IN_SECTION]  :  {
        key             :   RESOURCE_ADDED_IN_SECTION,
        compoundText    :   "has added a new resource in the section",
        i18nKey         :   "buyers-notifications.has-added-resource-in-section",
        metaKey         :   TYPE_SECTION,
    },
    [STEP_ENABLED]  :  {
        key             :   STEP_ENABLED,
        compoundText    :   "has enabled the step",
        i18nKey         :   "buyers-notifications.has-enabled-step",
        metaKey         :   TYPE_STEP,
    },
    [INVITATION_ACCEPTED_BY_BUYER]  :   {
        key             :   INVITATION_ACCEPTED_BY_BUYER,
        compoundText    :   "has accepted the room invitation",
        i18nKey         :   "buyers-notifications.has-accepted-invitation",
        metaKey         :   TYPE_DEFAULT,
    },
    [BUYER_ENTERED_INTO_ROOM]  :   {
        key             :   BUYER_ENTERED_INTO_ROOM,
        compoundText    :   "has entered into the room",
        i18nKey         :   "buyers-notifications.has-entered-into-room",
        metaKey         :   TYPE_DEFAULT,
    },
    [BUYER_UPDATED_PROFILE]  :   {
        key             :   BUYER_UPDATED_PROFILE,
        compoundText    :   "has updated their profile",
        i18nKey         :   "buyers-notifications.updated-profile",
        metaKey         :   TYPE_DEFAULT,
    },
    [NEW_ROOM_CREATED]  :  {
        key             :   NEW_ROOM_CREATED,
        compoundText    :   "has created a new room",
        i18nKey         :   "buyers-notifications.has-created-new-room",
        metaKey         :   TYPE_ROOM_ENTRY,
    },
    [BUYER_SELF_INVITE]  :  {
        key             :   BUYER_SELF_INVITE,
        compoundText    :   "has joined the room",
        i18nKey         :   "buyers-notifications.has-created-new-room",
        metaKey         :   TYPE_DEFAULT,
    },
    [MEETING_DETAILS_UPDATED]  :  {
        key             :   MEETING_DETAILS_UPDATED,
        compoundText    :   "has updated the meeting details",
        i18nKey         :   "buyers-notifications.has-updated-meeting-details",
        metaKey         :   TYPE_ACTION_POINT,
    },
    [SELLER_TO_BUYER_INVITE]  :  {
        key             :   SELLER_TO_BUYER_INVITE,
        compoundText    :   "has invited new buyers",
        i18nKey         :   "buyers-notifications.has-updated-meeting-details",
        metaKey         :   TYPE_MULTIPLE_INVITE,
    }
}
