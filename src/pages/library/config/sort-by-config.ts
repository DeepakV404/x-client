export const TITLE              =   "TITLE";
export const LAST_UPDATED_AT    =   "LAST_UPDATED_AT";
export const LAST_VIEWED_AT     =   "LAST_VIEWED_AT";
export const TIME_SPENT         =   "TIME_SPENT";
export const CREATED_AT         =   "CREATED_AT";
export const VIEWS              =   "VIEWS";
export const UNIQUE_VIEWS       =   "UNIQUE_VIEWS";

export const SORT_BY_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
}>    =   
{
    [TITLE]  :   {
        key             :   TITLE,
        displayName     :   "Title",
    },
    [CREATED_AT]  :   {
        key             :   CREATED_AT,
        displayName     :   "Created at",
    },
    [LAST_UPDATED_AT]  :   {
        key             :   LAST_UPDATED_AT,
        displayName     :   "Last updated at",
    },
    [LAST_VIEWED_AT]  :   {
        key             :   LAST_VIEWED_AT,
        displayName     :   "Last viewed at",
    },
    [TIME_SPENT]  :   {
        key             :   TIME_SPENT,
        displayName     :   "Time spent",
    },
    [VIEWS]  :   {
        key             :   VIEWS,
        displayName     :   "Views",
    },
    [UNIQUE_VIEWS]  :   {
        key             :   UNIQUE_VIEWS,
        displayName     :   "Unique views",
    },
}