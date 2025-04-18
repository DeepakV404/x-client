
export const ACCOUNTS       =   "ACCOUNTS";
export const ANALYTICS      =   "ANALYTICS";
export const VENDORS        =   "VENDORS";
export const LIBRARY        =   "LIBRARY";
export const LINKS          =   "LINKS";

export const ORG_TYPE_VENDOR                    =   "VENDOR";
export const ORG_TYPE_RESELLER                  =   "RESELLER";

export const USER_TYPE_BS_MARKET_PLACE_USER     =   "BS_MARKET_PLACE_USER";
export const USER_TYPE_NORMAL_USER              =   "NORMAL_USER";

const checkIsInVendorOrg = (orgType: string, userType: string) => {
    return orgType === ORG_TYPE_VENDOR && userType === USER_TYPE_NORMAL_USER
}

const checkIsIsResellerOrg = (orgType: string, _: string) => {
    return orgType === ORG_TYPE_RESELLER
}

export const HEADER_FEATURE_PERMISSION: Record<string, {
    key             :   string;
    displayName     :   string;
    toPath          :   string;
    permission      :   (orgType: string, userType: string) => boolean;
}>    =   
{
    [ACCOUNTS]  :   {
        key         :   ACCOUNTS,
        displayName :   "Accounts",
        toPath      :   "/accounts",
        permission  :   (orgType: string, userType: string) => {
            return !checkIsInVendorOrg(orgType, userType)
        }
    },
    [ANALYTICS]  :   {
        key         :   ANALYTICS,
        displayName :   "Analytics",
        toPath      :   "/analytics",
        permission  :   (orgType: string, userType: string) => {
            return !checkIsInVendorOrg(orgType, userType)
        }
    },
    [LIBRARY]  :   {
        key         :   LIBRARY,
        displayName :   "Library",
        toPath      :   "/library",
        permission  :   (orgType: string, userType: string) => {
            return !checkIsInVendorOrg(orgType, userType)
        }
    },
    [LINKS]  :   {
        key         :   LINKS,
        displayName :   "Links",
        toPath      :   "/links",
        permission  :   (orgType: string, userType: string) => {
            return !checkIsInVendorOrg(orgType, userType)
        }
    },
    [VENDORS]  :   {
        key         :   VENDORS,
        displayName :   "Vendors",
        toPath      :   "/vendors",
        permission  :   (orgType: string, userType: string) => {
            return checkIsIsResellerOrg(orgType, userType)
        }
    }
}