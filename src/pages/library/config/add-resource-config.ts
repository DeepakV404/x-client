import { ACCPETED_OFFICE_FILES, ARCADE_LOGO, CALENDLY_LOGO, EXCEL_LOGO, LOOM_LOGO, POWERPOINT_LOGO, STORYLANE_LOGO, VIMEO_LOGO, WISITIA_LOGO, WORD_LOGO, YOUTUBE_LOGO } from "../../../constants/module-constants";

export const UPLOAD_BLOB                =   "upload_blob";
export const UPLOAD_OTHER_LINKS         =   "upload_other_links";
export const UPLOAD_LINK                =   "upload_link";
export const UPLOAD_LOOM                =   "upload_loom";
export const UPLOAD_VIMEO               =   "upload_vimeo";
export const UPLOAD_YOUTUBE             =   "upload_youtube";
export const UPLOAD_WISITA              =   "upload_wisita";
export const UPLOAD_ARCADE              =   "upload_arcade";
export const UPLOAD_STORYLANE           =   "upload_storylane";
export const UPLOAD_CALENDLY            =   "upload_calendly";
export const UPLOAD_EXCEL               =   "upload_excel";
export const UPLOAD_WORD                =   "upload_word";
export const UPLOAD_POWERPOINT          =   "upload_powerpoint";
export const UPLOAD_EMBED_LINK          =   "upload_embed"


export const ADD_RESOURCE_CONFIG: Record<string, {
    key             :   string;
    displayName     :   string;
    type?           :   string;
    imageFile?      :   string;
    imageIcon?      :   string;
    view            :   string;
    acceptedFiles?  :   string;
    description     :   string;
    domain?          :   string;

}>    =   
{
    [UPLOAD_BLOB]  :   {
        key             :   UPLOAD_BLOB,
        displayName     :   "File Upload",
        imageIcon       :   "upload",
        view            :   UPLOAD_BLOB,
        description     :   "Upload pdf, jpeg, png, mp4. Max. file size 100MB"
    },
    [UPLOAD_LOOM]  :   {
        key             :   UPLOAD_LOOM,
        displayName     :   "Loom",
        imageFile       :   LOOM_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Loom video link",
        domain          :    ".com"       
    },
    [UPLOAD_VIMEO]  :   {
        key             :   UPLOAD_VIMEO,
        displayName     :   "Vimeo",
        imageFile       :   VIMEO_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Vimeo video link",
        domain          :   ".com"
    },
    [UPLOAD_YOUTUBE]  :   {
        key             :   UPLOAD_YOUTUBE ,
        displayName     :   "Youtube",
        imageFile       :   YOUTUBE_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Youtube video link",
        domain          :   ".com"
    },
    [ UPLOAD_WISITA]  :   {
        key             :    UPLOAD_WISITA ,
        displayName     :   "Wisitia",
        imageFile       :   WISITIA_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Wisita video link",
        domain          :   ".com"
    },
    [UPLOAD_ARCADE]  :   {
        key             :   UPLOAD_ARCADE,
        displayName     :   "Arcade",
        imageFile       :   ARCADE_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Arcade tour link",
        domain          :   ".com"
    },
    [UPLOAD_STORYLANE]  :   {
        key             :   UPLOAD_STORYLANE ,
        displayName     :   "Storylane",
        imageFile       :   STORYLANE_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Storylane tour link",
        domain          :   ".io"
    },
    [UPLOAD_CALENDLY]  :   {
        key             :   UPLOAD_CALENDLY ,
        displayName     :   "Calendly",
        imageFile       :   CALENDLY_LOGO,
        view            :   UPLOAD_LINK,
        description     :   "Paste your Calendly link",
        domain          :   ".com"
    },
    [UPLOAD_EXCEL]  :   {
        key             :   UPLOAD_EXCEL ,
        displayName     :   "Excel",
        imageFile       :   EXCEL_LOGO,
        view            :   UPLOAD_BLOB,
        description     :   "Upload your excel sheet",
        acceptedFiles   :   ACCPETED_OFFICE_FILES
    },
    [UPLOAD_WORD]  :   {
        key             :   UPLOAD_WORD  ,
        displayName     :   "Word",
        imageFile       :   WORD_LOGO,
        view            :   UPLOAD_BLOB,
        description     :   "Upload your word document",
        acceptedFiles   :   ACCPETED_OFFICE_FILES
    },
    [UPLOAD_POWERPOINT]  :   {
        key             :   UPLOAD_POWERPOINT ,
        displayName     :   "Powerpoint",
        imageFile       :   POWERPOINT_LOGO,
        view            :   UPLOAD_BLOB,
        description     :   "Upload your powerpoint",
        acceptedFiles   :   ACCPETED_OFFICE_FILES
    },
    [UPLOAD_OTHER_LINKS]  :   {
        key             :   UPLOAD_OTHER_LINKS,
        displayName     :   "Other URLs",
        imageIcon       :   "link",
        view            :   UPLOAD_LINK,
        description     :   "Paste your URL",
    },
    [UPLOAD_EMBED_LINK]  :   {
        key             :   UPLOAD_EMBED_LINK,
        displayName     :   "Embed Link",
        imageIcon       :   "code",
        view            :   UPLOAD_LINK,
        description     :   "Paste your URL",
    },
}