

export const SINGLE_LINE           =   "SINGLE_LINE";
export const SINGLE_CHOICE         =   "SINGLE_CHOICE";
export const NUMBER                =   "NUMBER";
export const EMAIL                 =   "EMAIL";
export const MULTI_CHOICE          =   "MULTI_CHOICE"
export const MULTI_LINE            =   "MULTI_LINE"

export const FORM_FIELD_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
    icon            :   string;
    operators       :   string[];
}>    =   
{
    [SINGLE_LINE]  :   {
        key             :   SINGLE_LINE,
        displayName     :   "Single line",
        icon            :   "title",
        operators       :   ["contains", "is"]
    },
    [SINGLE_CHOICE]  :   {
        key             :   SINGLE_CHOICE,
        displayName     :   "Single choice",
        icon            :   "radio_button_checked",
        operators       :   ["is"]
    },
    [MULTI_CHOICE]  :   {
        key             :   MULTI_CHOICE,
        displayName     :   "Multiple choice",
        icon            :   " ",
        operators       :   ["is"]
    },
    [MULTI_LINE]  :   {
        key             :   MULTI_LINE,
        displayName     :   "Multiple line",
        icon            :   " ",
        operators       :   ["is"]
    },
    [NUMBER]   :  {
        key             :   NUMBER,
        displayName     :   "Number",
        icon            :   "pin",
        operators       :   ["is"]
    },
    [EMAIL]   :  {
        key             :   EMAIL,
        displayName     :   "Email",
        icon            :   "alternate_email",
        operators       :   ["contains", "is"]
    },
}

export const DEFAULT_VALUES: Record<string, {
    id              :   number;
    type            :   string;
    value           :   string;
    options?        :   string[];
}>  =   {
    "firstName"   : {
        id      :   1,
        type    :   SINGLE_LINE,
        value   :   "First Name"
    },
    "lastName"  : {
        id      :   2,
        type    :   SINGLE_LINE,
        value   :   "Last Name"
    },
    "workEmail": {
        id      :   3,
        type    :   EMAIL,
        value   :   "Work Email"
    },
    "companySize": {
        id      :   4,
        type    :   SINGLE_CHOICE,
        value   :   "Company size",
        options :   ["1-10", "10-100", "100-1000", "above 1000"]
    }
}