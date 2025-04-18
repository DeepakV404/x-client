import { ROLE_PERMISSON_CONFIG } from "./role-permission-config";

export const ROLE_1     =   "1001";
export const ROLE_2     =   "1002";
export const ROLE_3     =   "1003";
export const ROLE_4     =   "1004";
export const ROLE_5     =   "1005";
export const ROLE_6     =   "1006";

export const ROLE_OWNER             =   "OWNER";
export const ROLE_ADMIN             =   "ADMIN";
export const ROLE_USER              =   "USER";
export const ROLE_CONTENT_EDITOR    =   "CONTENT_EDITOR";
export const ROLE_VIEWER            =   "VIEWER";
export const ROLE_MANAGER            =   "MANAGER";

export const ROLE_PERMISSION: Record<string, {
    key                     :   string;
    role                    :   string;
    displayName             :   string;
    permissions             :   any;
    permissionsDesc         :   string;
    orgTypes                :   string[];
}>    =   
{
    [ROLE_OWNER]  :   {
        key                     :   ROLE_1,
        role                    :   ROLE_OWNER,
        displayName             :   "Owner",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_1].permissions,
        permissionsDesc         :   "Full access",
        orgTypes                :   ["DSR", "DPR"]
    },
    [ROLE_ADMIN]  :   {
        key                     :   ROLE_2,
        role                    :   ROLE_ADMIN,
        displayName             :   "Admin",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_2].permissions,
        permissionsDesc         :   "Full feature access except organization delete option",
        orgTypes                :   ["DSR", "DPR"]
    },
    [ROLE_MANAGER]  :   {
        key                     :   ROLE_6,
        role                    :   ROLE_MANAGER,
        displayName             :   "Manager",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_6].permissions,
        permissionsDesc         :   "All permissions other than admin org settings and user settings",
        orgTypes                :   ["DSR", "DPR"]
    },
    [ROLE_USER]  :   {
        key                     :   ROLE_3,
        role                    :   ROLE_USER,
        displayName             :   "User",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_3].permissions,
        permissionsDesc         :   "Access dashboard • Manage rooms • View library • View template",
        orgTypes                :   ["DSR"]
    },
    [ROLE_CONTENT_EDITOR]  :   {
        key                     :   ROLE_4,
        role                    :   ROLE_CONTENT_EDITOR,
        displayName             :   "Content Editor",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_4].permissions,
        permissionsDesc         :   "Manage library • Access content analytics",
        orgTypes                :   ["DSR"]
    },
    [ROLE_VIEWER]  :   {
        key                     :   ROLE_5,
        role                    :   ROLE_VIEWER,
        displayName             :   "Viewer",
        permissions             :   ROLE_PERMISSON_CONFIG[ROLE_5].permissions,
        permissionsDesc         :   "Read only access for all the features",
        orgTypes                :   ["DSR"]
    },
}