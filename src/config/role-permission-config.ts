export const ROLE_1     =   "1001";
export const ROLE_2     =   "1002";
export const ROLE_3     =   "1003";
export const ROLE_4     =   "1004";
export const ROLE_5     =   "1005";
export const ROLE_6     =   "1006";

export const FEATURES_PEM_ALL           =   "ALL";
export const FEATURES_PEM_RESTRICTED    =   "RESTRICTED";

export const FEATURE_HOME                       =   "HOME";
export const FEATURE_ROOMS                      =   "ROOMS";
export const FEATURE_ACCOUNTS                   =   "ACCOUNTS";
export const FEATURE_TEMPLATES                  =   "TEMPLATES";
export const FEATURE_LIBRARY                    =   "LIBRARY";
export const FEATURE_DECK                       =   "DECK";
export const FEATURE_CONTENT_ANALYTICS          =   "CONTENT_ANALYTICS";
export const FEATURE_EXECUTIVE_ANALYTICS        =   "EXECUTIVE_ANALYTICS";
export const FEATURE_ACCOUNT_ANALYTICS          =   "ACCOUNT_ANALYTICS";

export const SETTINGS_ORG                       =   "SETTINGS_ORG";
export const SETTINGS_BRANDING                  =   "SETTINGS_BRANDING";
export const SETTINGS_TEAMS_AND_PERMISSIONS     =   "SETTINGS_TEAMS_AND_PERMISSOIONS";
export const SETTINGS_CATEGORIES                =   "SETTINGS_CATEGORIES";
export const SETTINGS_INTEGRATIONS              =   "SETTINGS_INTEGRATIONS";
export const SETTINGS_FAQ                       =   "SETTINGS_FAQ";
export const SETTINGS_DISCOVERY_SETTINGS        =   "SETTINGS_DISCOVERY_SETTINGS";
export const SETTINGS_DEVELOPER_SETTINGS        =   "SETTINGS_DEVELOPER_SETTINGS";

export const ROLE_PERMISSON_CONFIG: Record<string, {
    key                     :   string;
    permissions             :   any;
}>    =   
{
    [ROLE_1]  :   {
        // Owner
        key         :   ROLE_1,
        permissions :    {
            hasAllPermission    :   true,
            hasDeleteOrgPem     :   true,
            featuresPermission  :   FEATURES_PEM_ALL,
        }
    },
    [ROLE_2]  :   {
        // Admin
        key         :   ROLE_2,
        permissions :    {
            hasAllPermission    :   false,
            hasDeleteOrgPem     :   false,
            featuresPermisson   :   FEATURES_PEM_ALL
        }
    },
    [ROLE_3]  :   {
        // User
        key         :   ROLE_3,
        permissions :    {
            hasAllPermission    :   false,
            hasDeleteOrgPem     :   false,
            featuresPermisson   :   FEATURES_PEM_RESTRICTED,
            features: {
                [FEATURE_ROOMS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_ACCOUNTS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_TEMPLATES]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_LIBRARY]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_DECK]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [SETTINGS_CATEGORIES]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : false,
                },
                [SETTINGS_FAQ]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : false,
                },
                [SETTINGS_TEAMS_AND_PERMISSIONS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_HOME]: {
                    create  : false,
                    read    : true,
                    update  : true,
                    delete  : false,
                }
            }
        }
    },
    [ROLE_4]  :   {
        // Content editor
        key         :   ROLE_4,
        permissions :    {
            hasAllPermission    :   false,
            hasDeleteOrgPem     :   false,
            featuresPermisson   :   FEATURES_PEM_RESTRICTED,
            features: {
                [FEATURE_ROOMS]: {
                    create  : false,
                    read    : false,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_ACCOUNTS]: {
                    create  : false,
                    read    : false,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_LIBRARY]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_DECK]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_CONTENT_ANALYTICS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_CATEGORIES]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : false,
                },
                
                [SETTINGS_FAQ]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : false,
                },
                [SETTINGS_TEAMS_AND_PERMISSIONS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_HOME]: {
                    create  : false,
                    read    : false,
                    update  : false,
                    delete  : false,
                },
            }
        }
    },
    [ROLE_5]  :   {
        // viewer
        key         :   ROLE_5,
        permissions :    {
            hasAllPermission    :   false,
            hasDeleteOrgPem     :   false,
            featuresPermisson   :   FEATURES_PEM_RESTRICTED,
            features: {
                [FEATURE_ROOMS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_ACCOUNTS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_TEMPLATES]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_LIBRARY]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_DECK]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_ACCOUNT_ANALYTICS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_CONTENT_ANALYTICS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_EXECUTIVE_ANALYTICS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_ORG]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_BRANDING]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_TEAMS_AND_PERMISSIONS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_CATEGORIES]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_INTEGRATIONS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [SETTINGS_FAQ]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_HOME]: {
                    create  : false,
                    read    : false,
                    update  : false,
                    delete  : false,
                },
            }
        }
    },
    [ROLE_6]  :   {
        // Manager
        key         :   ROLE_6,
        permissions :    {
            hasAllPermission    :   false,
            hasDeleteOrgPem     :   false,
            featuresPermisson   :   FEATURES_PEM_RESTRICTED,
            features: {
                [FEATURE_ROOMS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_ACCOUNTS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_TEMPLATES]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_LIBRARY]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_DECK]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [SETTINGS_CATEGORIES]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [SETTINGS_FAQ]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [SETTINGS_TEAMS_AND_PERMISSIONS]: {
                    create  : false,
                    read    : true,
                    update  : false,
                    delete  : false,
                },
                [FEATURE_HOME]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_CONTENT_ANALYTICS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_ACCOUNT_ANALYTICS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                },
                [FEATURE_EXECUTIVE_ANALYTICS]: {
                    create  : true,
                    read    : true,
                    update  : true,
                    delete  : true,
                }
            }
        }
    },
};