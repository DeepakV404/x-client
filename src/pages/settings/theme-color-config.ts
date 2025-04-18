

export const THEME_DEFAULT      =   "#3176CD";
export const THEME_RED          =   "#DF2222";
export const THEME_ORANGE       =   "#F06422";
export const THEME_YELLOW       =   "#F7D664";
export const THEME_GREEN        =   "#2DCE89";
export const THEME_BLUE         =   "#115BEA";
export const THEME_PURPLE       =   "#5E22DF";
export const THEME_PINK         =   "#F01A74";
export const THEME_DARK_BLUE    =   "#0E267B";
export const THEME_MAROON       =   "#81114D";
export const THEME_DARK_GREEN   =   "#0C8443";
export const THEME_BLACK        =   "#000000";

export const THEME_COLOR_CONFIG: Record<string, {
    key             :   string;
    primaryColor    :   string;
    secondaryColor  :   string;
    bgColor         :   string;
}>    =   
{  
    [THEME_BLACK] :   {
        key             :   THEME_BLACK,
        primaryColor    :   THEME_BLACK,
        secondaryColor  :   THEME_BLACK,
        bgColor         :   "#ECECEC"
    },
    [THEME_DEFAULT] :   {
        key             :   THEME_DEFAULT,
        primaryColor    :   THEME_DEFAULT,
        secondaryColor  :   THEME_DEFAULT,
        bgColor         :   "#D9E9FD"
    },
    [THEME_RED] :   {
        key             :   THEME_RED,
        primaryColor    :   THEME_RED,
        secondaryColor  :   THEME_RED,
        bgColor         :   "#FFDFDF"
    },
    [THEME_ORANGE] :   {
        key             :   THEME_ORANGE,
        primaryColor    :   THEME_ORANGE,
        secondaryColor  :   THEME_ORANGE,
        bgColor         :   "#FFEDE4"
    },
    [THEME_YELLOW] :   {
        key             :   THEME_YELLOW,
        primaryColor    :   THEME_YELLOW,
        secondaryColor  :   THEME_YELLOW,
        bgColor         :   "#FEF3CD"
    },
    [THEME_GREEN] :   {
        key             :   THEME_GREEN,
        primaryColor    :   THEME_GREEN,
        secondaryColor  :   THEME_GREEN,
        bgColor         :   "#D7FEED"
    },
    [THEME_BLUE] :   {
        key             :   THEME_BLUE,
        primaryColor    :   THEME_BLUE,
        secondaryColor  :   THEME_BLUE,
        bgColor         :   "#D4E3FF"
    },
    [THEME_PURPLE] :   {
        key             :   THEME_PURPLE,
        primaryColor    :   THEME_PURPLE,
        secondaryColor  :   THEME_PURPLE,
        bgColor         :   "#EAE0FF"
    },
    [THEME_PINK] :   {
        key             :   THEME_PINK,
        primaryColor    :   THEME_PINK,
        secondaryColor  :   THEME_PINK,
        bgColor         :   "#FFDAEA"
    },
    [THEME_DARK_BLUE] :   {
        key             :   THEME_DARK_BLUE,
        primaryColor    :   THEME_DARK_BLUE,
        secondaryColor  :   THEME_DARK_BLUE,
        bgColor         :   "#D5DEFF"
    },
    [THEME_MAROON] :   {
        key             :   THEME_MAROON,
        primaryColor    :   THEME_MAROON,
        secondaryColor  :   THEME_MAROON,
        bgColor         :   "#F5D3E6"
    },
    [THEME_DARK_GREEN] :   {
        key             :   THEME_DARK_GREEN,
        primaryColor    :   THEME_DARK_GREEN,
        secondaryColor  :   THEME_DARK_GREEN,
        bgColor         :   "#CBF6DF"
    }
}