export const INCREASE      =    "INCREASE";
export const DECREASE      =    "DECREASE";
export const NO_CHANGE     =    "NO_CHANGE";

export const TYPE          =    "TYPE";
export const CATEGORY      =    "CATEGORY";


export const CP_TREND_CONFIG: Record<string, {
    key               :   any;
    status?           :   any;
    icon             :   string;
    color?            :   string;
    displayName?      :   string;
}>  =   {
    [INCREASE]       :    {
        key               :      INCREASE,
        status            :      "success",
        icon              :      "arrow_upward",
        color             :      "#3EB200",
    },
    [DECREASE]       :    {
        key               :      DECREASE,
        status            :      "error",
        icon              :      "arrow_downward",
        color             :      "#DF2222",
    },
    [NO_CHANGE]       :    {
        key               :      NO_CHANGE,
        icon              :      "",
        displayName       :      "No change"
    },
}

export const CP_CONTENT_CONFIG: Record<string, {
    key              :   any;
    displayName      :   string;
}>  =   {
    [TYPE]       :    {
        key               :      TYPE,
        displayName       :      "Type"
    },
    [CATEGORY]       :    {
        key               :      CATEGORY,
        displayName       :      "Category"
    } 
}