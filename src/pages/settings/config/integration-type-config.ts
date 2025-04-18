import { HUBSPOT_LOGO_NEW, PIPEDRIVE_LOGO, SALESFORCE_LOGO, SLACK_LOGO } from "../../../constants/module-constants";

// CRM
export const SALESFORCE    =    "SALESFORCE";
export const HUBSPOT       =    "HUBSPOT";
export const PIPEDRIVE     =    "PIPEDRIVE";

// Communication
export const SLACK         =    "SLACK";

export const CRM_INTEGRATION_CONFIG: Record<string, {
    key                         :   string;
    displayName                 :   string;
    productLogo                 :   string;
    "logo-sm-size"              :   number;
    "logo-icon-size"            :   number;
    contact                     :   string;
    deal                        :   string;
    deals                       :   string;
    label                       :   string
}>    =   
{
    [SALESFORCE]  :   {
        key             :   SALESFORCE,
        displayName     :   "Salesforce",
        label           :   "Salesforce Opportunity",
        productLogo     :   SALESFORCE_LOGO,
        "logo-sm-size"  :   20,
        "logo-icon-size":   17,
        contact         :   "Lead",
        deal            :   "Opportunity",
        deals           :   "opportunities"
    },
    [HUBSPOT]  :   {
        key             :   HUBSPOT,
        displayName     :   "HubSpot",
        label           :   "HubSpot Deal",
        productLogo     :   HUBSPOT_LOGO_NEW,
        "logo-sm-size"  :   15,
        "logo-icon-size":   15,
        contact         :   "Contact",
        deal            :   "Deal",
        deals           :   "deals"
    },
    [PIPEDRIVE]  :   {
        key             :   PIPEDRIVE,
        displayName     :   "Pipedrive",
        label           :   "Pipedrive Deal",
        productLogo     :   PIPEDRIVE_LOGO,
        "logo-sm-size"  :   20,
        "logo-icon-size":   16,
        contact         :   "Contact",
        deal            :   "Deal",
        deals           :   "deals"
    },
}

export const COMMUNICATION_INTEGRATION_CONFIG: Record<string, {
    key                         :   string;
    displayName                 :   string;
    productLogo                 :   string;
}>    =   
{
    [SLACK]  :   {
        key             :   SLACK,
        displayName     :   "Slack",
        productLogo     :   SLACK_LOGO
    },
}