
export const VIEWED_PITCH                   =   "VIEWED_PITCH";
export const VIEWED_RESOURCE                =   "VIEWED_RESOURCE";
export const VIEWED_USE_CASE                =   "VIEWED_USE_CASE";
export const CREATED_ACTION_POINT           =   "CREATED_ACTION_POINT";
export const UPDATED_ACTION_POINT           =   "UPDATED_ACTION_POINT";
export const UPDATED_ACTION_POINT_ORDER     =   "UPDATED_ACTION_POINT_ORDER";
export const UPDATED_ACTION_POINT_ASSIGNEE  =   "UPDATED_ACTION_POINT_ASSIGNEE";
export const UPDATED_ACTION_POINT_STATUS    =   "UPDATED_ACTION_POINT_STATUS";
export const UPDATED_ACTION_POINT_DUE       =   "UPDATED_ACTION_POINT_DUE";
export const ACCEPTED_ROOM_INVITATION       =   "ACCEPTED_ROOM_INVITATION";
export const COMMENTED_ACTION_POINT         =   "COMMENTED_ACTION_POINT";
export const DELETED_ACTION_POINT           =   "DELETED_ACTION_POINT";
export const INVITED_STAKEHOLDER            =   "INVITED_STAKEHOLDER";
export const ENTERED_INTO_ROOM              =   "ENTERED_INTO_ROOM";
export const RE_INVITED_STAKEHOLDER         =   "RE_INVITED_STAKEHOLDER";
export const ENTERED_CUSTOM_SECTION         =   "ENTERED_CUSTOM_SECTION";
// Default Sections
export const ENTERED_WELCOME_SECTION        =   "ENTERED_WELCOME_SECTION";
export const ENTERED_RESOURCE_SECTION       =   "ENTERED_RESOURCE_SECTION";
export const ENTERED_DEMO_SECTION           =   "ENTERED_DEMO_SECTION";
export const ENTERED_NEXT_STEPS_SECTION     =   "ENTERED_NEXT_STEPS_SECTION";
export const ENTERED_TALK_TO_US_SECTION     =   "ENTERED_TALK_TO_US_SECTION";
export const ENTERED_FAQ_SECTION            =   "ENTERED_FAQ_SECTION"

export const ACTIVITY_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
}>    =   
{
    [VIEWED_PITCH]  :   {
        key             :   VIEWED_PITCH,
        displayName     :   "Viewed Pitch",
    }
}