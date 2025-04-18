export const CONTACTS_ADDED_IN_BS     =   "CONTACTS_ADDED_FROM_BS"
export const CONTACTS_DELETED_IN_BS   =   "CONTACTS_DELETED_IN_BS"
export const ADD_ACTIVITIES_IN_SFDC   =   "ADD_ACTIVITIES_IN_SFDC"
export const LEADS_ADDED_IN_SFDC      =   "LEADS_ADDED_IN_SFDC"
export const LEADS_DELETED_IN_SFDC    =   "LEADS_DELETED_IN_SFDC"

export const SFDC_SYNC_OPTION_CONFIG : Record<string, { 
    key         : string; 
    displayName : string;
    formKey     : string;
}> =
{
    [LEADS_ADDED_IN_SFDC] : {
        key         :   LEADS_ADDED_IN_SFDC,
        formKey     :   "updateContactAdditionWithBS",
        displayName :   "Add contacts to Buyerstage when they are added in Salesforce",
    },
    [CONTACTS_ADDED_IN_BS]  : {
        key         :   CONTACTS_ADDED_IN_BS,
        formKey     :   "updateContactAdditionWithCRM",
        displayName :   "Add contacts to Salesforce when they are added in Buyerstage",
    },
    // [CONTACTS_DELETED_IN_BS] : {
    //     key         :   CONTACTS_DELETED_IN_BS,
    //     formKey     :   "updateContactDeletionWithCRM ",
    //     displayName :   "Remove contacts from Salesforce that are deleted from Buyerstage",
    // },
    [LEADS_DELETED_IN_SFDC]   : {
        key         :   LEADS_DELETED_IN_SFDC,
        formKey     :   "updateContactDeletionWithBS",
        displayName :   "Remove contacts from Buyerstage when they are deleted in Salesforce",
    },
    [ADD_ACTIVITIES_IN_SFDC]  : {
        key         :   ADD_ACTIVITIES_IN_SFDC,
        formKey     :   "postActivityToCRM",
        displayName :   "Push Room Activities with Salesforce",
    },
};