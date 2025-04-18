export const TODO           =   "TO_DO";
export const IN_PROGRESS    =   "IN_PROGRESS";
export const COMPLETED      =   "COMPLETED";
export const CANCELLED      =   "CANCELLED";

export const STAGE_STATUS_CONFIG: Record<string, {
    key             :   string;
    displayName     :   any;
    tag             :   string;
    backgroundColor :   string; 
    i18nkey         :   string;
    
}>    =   
{   
    [TODO] :   {
        key             :   TODO,
        displayName     :   "To-Do",
        tag             :   "#3e1db0",
        backgroundColor :   "#eae4ff",
        i18nkey         :   "to-do",
    },
    [IN_PROGRESS] :   {
        key             :   IN_PROGRESS,
        displayName     :   "In Progress",
        tag             :   "#005bda",
        backgroundColor :   "#deeffd",
        i18nkey         :   "in-progress",
    },
    [COMPLETED] :   {
        key             :   COMPLETED,
        displayName     :   "Completed",
        tag             :   "#2c9203",
        backgroundColor :   "#e5f4d6",
        i18nkey         :   "completed",
    },
    [CANCELLED] :   {
        key             :   CANCELLED,
        displayName     :   "Cancelled",
        tag             :   "#ff4d4f",
        backgroundColor :   "#ffded9",
        i18nkey         :   "cancelled",
    }
}