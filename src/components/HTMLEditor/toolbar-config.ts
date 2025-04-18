export interface HeadingStyleProps{
    key         :   string,
    icon        :   string,
    level       :   any,
    iconSize?   :   string
}

export interface TextFormatProps{
    key         :   string,
    icon        :   string,
    text        :   string,
}

export interface FontSizeProps{
    key         :   string,
    size        :   number,
}

export const FONT_SIZE_CONFIG: Record<string, FontSizeProps> = 
{
    "10": {
        key: "10",
        size: 10,
    },
    "12": {
        key: "12",
        size: 12,
    },
    "14": {
        key: "14",
        size: 14,
    },
    "16": {
        key: "16",
        size: 16,
    },
    "18": {
        key: "18",
        size: 18,
    },
    "20": {
        key: "20",
        size: 20,
    },
    "24": {
        key: "24",
        size: 24,
    },
    "28": {
        key: "28",
        size: 28,
    },
    "32": {
        key: "32",
        size: 32,
    },
    "36": {
        key: "36",
        size: 36,
    },
}

export const HEADING_STYLE_CONFIG: Record<string, HeadingStyleProps>    =   
{
    "h1": {
        key: "h1",
        icon: "format_h1",
        level: 1,
        iconSize: "36",
    },
    "h2": {
        key: "h2",
        icon: "format_h2",
        level: 2,
        iconSize: "30",
    },
    "h3": {
        key: "h3",
        level: 3,
        icon: "format_h3",
        iconSize: "26",
    },
    "h4": {
        key: "h4",
        icon: "format_h4",
        level: 4,
        iconSize: "20",
    },
    "h5": {
        key: "h5",
        icon: "format_h5",
        level: 5,
        iconSize: "16",
    },
}

export const TITLE_HEADING_STYLE_CONFIG: Record<string, HeadingStyleProps>    =   
{
    "h1": {
        key: "h1",
        icon: "format_h1",
        level: 1,
        iconSize: "26",
    },
    "h2": {
        key: "h2",
        icon: "format_h2",
        level: 2,
        iconSize: "22",
    },
    "h3": {
        key: "h3",
        level: 3,
        icon: "format_h3",
        iconSize: "18",
    }
}

export const FORMAT_TEXT_CONFIG: Record<string, TextFormatProps>    =   
{
    "left": {
        key: "left",
        icon: "format_align_left",
        text: "Align left",
    },
    "center": {
        key: "center",
        icon: "format_align_center",
        text: "Align center",
    },
    "right": {
        key: "right",
        icon: "format_align_right",
        text: "Align right",
    },
    "justify": {
        key: "justify",
        icon: "format_align_justify",
        text: "Justify",
    }
}