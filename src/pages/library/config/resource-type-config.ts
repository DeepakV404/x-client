import { IMAGE_FALLBACK_IMAGE, LINK_FALLBACK_IMAGE, RESOURCE_TYPE_DOC, RESOURCE_TYPE_IMAGE, RESOURCE_TYPE_LINK, RESOURCE_TYPE_VIDEO, VIDEO_FALLBACK_IMAGE, WORD_FALLBACK_IMAGE } from "../../../constants/module-constants";

export const ALL        =   "ALL";
export const DOCS       =   "DOCUMENT";
export const VIDEO      =   "VIDEO";
export const IMAGE      =   "IMAGE";
export const LINK       =   "LINK";

export const RESOURCE_TYPE_CONFIG: Record<string, {
    key              :   string;
    displayName      :   string;
    tag              :   string;
    displayIconName? :   any;
    imageFile        :   string;
    i18Key           :   string;
    color?           :   string;
    resourceTypeImg? :   string;

}>    =   
{
    [ALL]  :   {
        key             :   ALL,
        displayName     :   "All",
        tag             :   "All",
        imageFile       :   WORD_FALLBACK_IMAGE,
        i18Key          :   "all",
    },
    [DOCS]  :   {
        key             :   DOCS,
        displayName     :   "Document",
        tag             :   "DOC",
        displayIconName :   "description",
        imageFile       :   WORD_FALLBACK_IMAGE,
        i18Key          :   "document",
        color           :   "#1890FF",
        resourceTypeImg :   RESOURCE_TYPE_DOC
    },
    [VIDEO]  :   {
        key             :   VIDEO,
        displayName     :   "Video",
        tag             :   "VIDEO",
        displayIconName :   "movie",
        imageFile       :   VIDEO_FALLBACK_IMAGE,
        i18Key          :   "video",
        color           :   "#FACC14",
        resourceTypeImg :   RESOURCE_TYPE_VIDEO
    },
    [IMAGE]  :   {
        key             :   IMAGE,
        displayName     :   "Image",
        tag             :   "IMAGE",
        displayIconName :   "image",
        imageFile       :   IMAGE_FALLBACK_IMAGE,
        i18Key          :   "image",
        color           :   "#2FC25B",
        resourceTypeImg :   RESOURCE_TYPE_IMAGE
    },
    [LINK]  :   {
        key             :   LINK,
        displayName     :   "URL",
        tag             :   "LINK",
        displayIconName :   "link",
        imageFile       :   LINK_FALLBACK_IMAGE,
        i18Key          :   "link",
        color           :   "#223273",
        resourceTypeImg :   RESOURCE_TYPE_LINK
    },
}