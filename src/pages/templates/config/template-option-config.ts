import { DEMO_SECTION, EMPTY_SECTION, FAQ_SECTION, NEXT_STEPS_SECTION, ONE_PAGER_SECTION, RESOURCES_SECTION, SALES_TEMPLATE_SECTION, TALK_TO_US_SECTION, WELCOME_SECTION } from "../../../constants/module-constants";

export const FROM_SCRATCH        =   "FROM_SCRATCH";
export const ONE_PAGER           =   "ONE_PAGER";
export const SALES_TEMPLATE      =   "SALES_TEMPLATE";
export const WELCOME             =   "WELCOME";
export const DEMO                =   "DEMO";
export const RESOURCES           =   "RESOURCES";
export const TALK_TO_US          =   "TALK_TO_US";
export const NEXT_STEPS          =   "NEXT_STEPS";
export const FAQ                 =   "FAQ";


export const TEMPLATE_OPTION_CONFIG: Record<string, {
    key              :   any;
    title            :   string;
    description      :   string;
    tooltip          :   string;
    emoji?           :   any;
    image            :   any;
}>  =   {
    [FROM_SCRATCH]  :   {
        key          :   FROM_SCRATCH,
        title        :   "Empty Section",
        description  :   "Build a personalized sales experience by adding your decks, links, and next steps.",
        tooltip      :   "Build a personalized sales experience by adding your decks, links, and next steps.",
        image        :   EMPTY_SECTION
    },
    [ONE_PAGER]  :   {
        key          :   ONE_PAGER,
        title        :   "One Pager",
        description  :   "Create a dynamic view with key product information using customizable widgets.",
        tooltip      :   "Create a dynamic view with key product information using customizable widgets.",
        image        :   ONE_PAGER_SECTION
    },
    [SALES_TEMPLATE]  :   {
        key          :   SALES_TEMPLATE,
        title        :   "Sales Template",
        description  :   "Utilize our predefined template designed for a seamless sales process.",
        tooltip      :   "Utilize our predefined template designed for a seamless sales process.",
        image        :   SALES_TEMPLATE_SECTION
    },
    [WELCOME]  :   {
        key          :   WELCOME,
        title        :   "Welcome",
        description  :   "Add a warm welcome message and introductory product video.",
        emoji        :   "👋",
        tooltip      :   "Add a warm welcome message and introductory product video.",
        image        :   WELCOME_SECTION
    },
    [DEMO]  :   {
        key          :   DEMO,
        title        :   "Demo",
        description  :   "Include demo videos and product tour.",
        emoji        :   "🖥️",
        tooltip      :   "Include demo videos and product tour.",
        image        :   DEMO_SECTION
    },
    [RESOURCES]  :   {
        key          :   RESOURCES,
        title        :   "Resources",
        description  :   "Upload sales collaterals, brochures, case studies here.",
        emoji        :   "📂",
        tooltip      :   "Upload sales collaterals, brochures, case studies here.",
        image        :   RESOURCES_SECTION
    },
    [TALK_TO_US]  :   {
        key          :   TALK_TO_US,
        title        :   "Talk to us",
        description  :   "Share your calendar link for scheduling.",
        emoji        :   "💬",
        tooltip      :   "Share your calendar link for scheduling.",
        image        :   TALK_TO_US_SECTION
    },
    [NEXT_STEPS]  :   {
        key          :   NEXT_STEPS,
        title        :   "Next Steps",
        description  :   "Organize and add action items across stages to keep everyone aligned and drive success.",
        emoji        :   "🧭",
        tooltip      :   "Organize and add action items across stages to keep everyone aligned and drive success.",
        image        :   NEXT_STEPS_SECTION
    },
    [FAQ]  :   {
        key          :   FAQ,
        title        :   "FAQ",
        description  :   "Provide answers to common questions for faster decision-making.",
        emoji        :   "💡",
        tooltip      :   "Provide answers to common questions for faster decision-making.",
        image        :   FAQ_SECTION
    },
}

