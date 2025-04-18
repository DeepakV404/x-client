
export const UPLOAD             =   "UPLOAD";
export const DOWNLOAD           =   "DOWNLOAD";
export const BOOK_MEETING       =   "BOOK_MEETING";
export const VIEW_DOCUMENT      =   "VIEW_DOCUMENT";
export const GOTO_URL           =   "GOTO_URL";
export const WATCH_VIDEO        =   "WATCH_VIDEO";
export const TEXT               =   "TEXT";

export const ACTION_POINT_TYPE_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
    iconName        :   string;
    desc            :   string;
}>    =   
{ 
    [TEXT]    :   {
        key         :   TEXT,
        displayName :   "General",
        iconName    :   "category",
        desc        :   "General action point"
    },  
    [UPLOAD]    :   {
        key         :   UPLOAD,
        displayName :   "Upload",
        iconName    :   "upload",
        desc        :   "Upload a file"
    },
    [DOWNLOAD]    :   {
        key         :   DOWNLOAD,
        displayName :   "Download",
        iconName    :   "download",
        desc        :   "Download the files uploaded"
    },
    [BOOK_MEETING]    :   {
        key         :   BOOK_MEETING,
        displayName :   "Book meeting",
        iconName    :   "event",
        desc        :   "Book a meeting using the below calendar link"
    },
    [VIEW_DOCUMENT]    :   {
        key         :   VIEW_DOCUMENT,
        displayName :   "View Document",
        iconName    :   "draft",
        desc        :   "View this document"
    },
    [GOTO_URL]    :   {
        key         :   GOTO_URL,
        displayName :   "Go to Link",
        iconName    :   "link",
        desc        :   "View the below link"
    },
    [WATCH_VIDEO]    :   {
        key         :   WATCH_VIDEO,
        displayName :   "Watch video",
        iconName    :   "smart_display",
        desc        :   "Watch the videos"
    },
    // [TEXT]    :   {
    //     key         :   TEXT,
    //     displayName :   "Text",
    //     iconName    :   "text_fields",
    //     desc        :   "Enter in the below field"
    // }
}