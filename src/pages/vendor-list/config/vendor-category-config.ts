export const PUBLISHING                     =   "PUBLISHING";
export const CLOUD_MANAGEMENT               =   "CLOUDMANAGEMENT";      
export const SOFTWARE_AND_SERVICES          =   "SOFTWARE_AND_SERVICES";
export const CUSTOMER_MANAGEMENT            =   "CUSTOMER_MANAGEMENT";
export const IT_MANAGEMENT                  =   "IT_MANAGEMENT";
export const COLLABORATION_AND_DEVELOPMENT  =   "COLLABORATION_AND_DEVELOPMENT";
export const CRM                            =   "CRM";

export const VENDOR_CATEGORY_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
}>    =   
{
    [PUBLISHING]  :   {
        key             :   PUBLISHING,
        displayName     :   "Publishing",
    },
    [CLOUD_MANAGEMENT]  :   {
        key             :   CLOUD_MANAGEMENT,
        displayName     :   "Cloud Management",
    },
    [SOFTWARE_AND_SERVICES]   :  {
        key             :   SOFTWARE_AND_SERVICES,
        displayName     :   "Software & Services",
    },
    [CUSTOMER_MANAGEMENT]  :   {
        key             :   CUSTOMER_MANAGEMENT,
        displayName     :   "Customer Management",
    },
    [IT_MANAGEMENT]  :   {
        key             :   IT_MANAGEMENT,
        displayName     :   "IT Management",
    },
    [COLLABORATION_AND_DEVELOPMENT]  :   {
        key             :   COLLABORATION_AND_DEVELOPMENT,
        displayName     :   "Collaboration & Development",
    },
    [CRM]  :   {
        key             :   CRM,
        displayName     :   "CRM",
    },
}