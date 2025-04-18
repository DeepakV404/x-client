export const WELCOME                    =   "welcome";
export const DEMO                       =   "demo";
export const RESOURCES                  =   "resources";
export const TALK_TO_US                 =   "next-steps";
export const SERVICE                    =   "service";

export const BUYER_STAGES_CONFIG: Record<string, {
    [key: string]   :   any
}> =   
{   
    [WELCOME] :   {
        key         :   WELCOME,
        icon        :   "👋",
        label       :   "Welcome",
        isEnabled   :   true,
        isVisible   :   true,
        metaKey     :   "welcomeSection",
    },
    [DEMO] :   {
        key         :   DEMO,
        icon        :   "🎯",
        label       :   "Demo",
        isEnabled   :   true,
        isVisible   :   true,
        metaKey     :   "demoSection",
    },
    [RESOURCES] :   {
        key         :   RESOURCES,
        icon        :   "💡",
        label       :   "Resources",
        isEnabled   :   true,
        isVisible   :   true,
        metaKey     :   "resourceSection",
    },
    [TALK_TO_US] :   {
        key         :   TALK_TO_US,
        icon        :   "🚀",
        label       :   "Talk to Us",
        isEnabled   :   true,
        isVisible   :   true,
        metaKey     :   "talkToUsSection",
    },
}