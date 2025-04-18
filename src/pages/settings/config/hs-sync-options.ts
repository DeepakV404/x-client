export const CONTACTS_ADDED_IN_BS     =   "CONTACTS_ADDED_FROM_BS"
export const CONTACTS_DELETED_IN_BS   =   "CONTACTS_DELETED_IN_BS"
export const ADD_ACTIVITIES_IN_HS     =   "ADD_ACTIVITIES_IN_HS"
export const CONTACTS_ADDED_IN_HS     =   "CONTACTS_ADDED_IN_HS"
export const CONTACTS_DELETED_IN_HS   =   "CONTACTS_DELETED_IN_HS"

export const RESOURCE_ADDED_BY_SELLER    =   "RESOURCE_ADDED_BY_SELLER"
export const RESOURCE_ADDED_BY_BUYER     =   "RESOURCE_ADDED_BY_BUYER"

export const UPDATE_DEAL_CLOSURE_STAGE_WITH_ROOM    =   "UPDATE_DEAL_CLOSURE_STAGE_WITH_ROOM"

export const ADD_NOTES_IN_HS                =   "ADD_NOTES_IN_HS"

export const HS_SYNC_OPTION_CONFIG : Record<string, { 
    key         : string; 
    formKey     : string;
    displayName : string;
    tooltip?    : string;
}> =
{
    [CONTACTS_ADDED_IN_HS] : {
        key         :   CONTACTS_ADDED_IN_HS,
        formKey     :   "updateContactAdditionWithBS",
        displayName :   "Add Contacts to Buyerstage when they are added in HubSpot",
    },
    [CONTACTS_ADDED_IN_BS]  : {
        key         :   CONTACTS_ADDED_IN_BS,
        formKey     :   "updateContactAdditionWithCRM",
        displayName :   "Add Contacts to HubSpot when they are added in Buyerstage",
    },
    [CONTACTS_DELETED_IN_HS]   : {
        key         :   CONTACTS_DELETED_IN_HS,
        formKey     :   "updateContactDeletionWithBS",
        displayName :   "Remove contacts from Buyerstage when they are deleted in HubSpot",
    },
    [ADD_ACTIVITIES_IN_HS]  : {
        key         :   ADD_ACTIVITIES_IN_HS,
        formKey     :   "postActivityToCRM",
        displayName :   "Push Room Activities to HubSpot",
    },
    [ADD_NOTES_IN_HS]  : {
        key         :   ADD_NOTES_IN_HS,
        formKey     :   "addNotesToCRM",
        displayName :   "Add notes to HubSpot",
    },
    [RESOURCE_ADDED_BY_SELLER]  : {
        key         :   RESOURCE_ADDED_BY_SELLER,
        formKey     :   "addResourcesBySellerToCRM",
        displayName :   "All documents uploaded by the Seller will be pushed to HubSpot",
    },
    [RESOURCE_ADDED_BY_BUYER]  : {
        key         :   RESOURCE_ADDED_BY_BUYER,
        formKey     :   "addResourcesByBuyerToCRM",
        displayName :   "All documents uploaded by the Buyer will be pushed to HubSpot",
    },
    [UPDATE_DEAL_CLOSURE_STAGE_WITH_ROOM]  : {
        key         :   UPDATE_DEAL_CLOSURE_STAGE_WITH_ROOM,
        formKey     :   "updateDealClosureStageWithRoom",
        displayName :   "Sync CRM stages with Room",
        tooltip     :   "Automatically update room stages in Buyerstage when a deal is marked as Closed Won or Closed Lost in your CRM."
    },
};