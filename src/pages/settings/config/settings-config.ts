import { ROLE_MANAGER } from '../../../config/role-config';
export const ADMIN             =   "ADMIN";
export const OWNER             =   "OWNER";      
export const USER              =   "USER";
export const CONTENT_EDITOR    =   "CONTENT_EDITOR";
export const VIEWER            =   "VIEWER"

export const SETTING_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
    color           :   string;
    view            :   boolean;
}>    =   
{
    [ADMIN]  :   {
        key             :   ADMIN,
        displayName     :   "Admin",
        color           :   "purple",
        view            :   true,
    },
    [OWNER]  :   {
        key             :   OWNER,
        displayName     :   "Owner",
        color           :   "red",
        view            :   false
    },
    [ROLE_MANAGER]   :  {
        key             :   ROLE_MANAGER,
        displayName     :   "Manager",
        color           :   "gold",
        view            :   true
    },
    [USER]   :  {
        key             :   USER,
        displayName     :   "User",
        color           :   "blue",
        view            :   true
    },
    [CONTENT_EDITOR]   :  {
        key             :   CONTENT_EDITOR,
        displayName     :   "Content Editor",
        color           :   "green",
        view            :   true
    },
    [VIEWER]   :  {
        key             :   VIEWER,
        displayName     :   "Viewer",
        color           :   "cyan",
        view            :   true
    },
}