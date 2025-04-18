import { MEET_WITH_BUYERSTAGE } from "../../../constants/module-constants";

export const DSR_PLAN_1     =   "STARTER";
export const DSR_PLAN_2     =   "GROWTH";
export const DSR_PLAN_3     =   "ENTERPRISE";

export const DSR_PRICING_CONFIG: Record<string, {
    planId          :   number;
    key             :   string;
    displayName     :   string;
    monthlyPrice    :   string,
    yearlyPrice     :   string,
    desc            :   string;
    ctaText         :   string;
    listHeader      :   string;
    list            :   any;
    isCurrent       :   boolean;
    href            :   string;
}>    =   
{
    [DSR_PLAN_1]        :   {
        planId      :   1001,
        key         :   DSR_PLAN_1,
        displayName :   "STARTER",
        monthlyPrice    :   "$0",
        yearlyPrice     :   "$0",
        desc        :   "for startups and founder-led sales",
        ctaText     :   "Upgrade",
        listHeader  :   "Key Features",
        isCurrent   :   false,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "3 Users",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Deal Rooms",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Templates",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Notifications, Email Alerts",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Activity Feed",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Content Analytics",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Assets in Library",
                "isComingSoon"  :   false,
                "showInfo"      :   false,
            },
            {
                "item"          :   "5GB File Storage",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "Assets Support: PDF, PPT, Image, Documents, Links, Videos, and third party assets"
            },
        ]
    },
    [DSR_PLAN_2]        :   {
        planId      :   1002,
        key         :   DSR_PLAN_2,
        displayName :   "GROWTH",
        monthlyPrice    :   "$49",
        yearlyPrice     :   "$34",
        desc        :   "for small teams and growth companies",
        ctaText     :   "Upgrade",
        listHeader  :   "Everything in Starter +",
        isCurrent   :   false,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "CRM Integrations",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Account Dashboard",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Custom Domain & Branding",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Password Protection",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Instant Messages",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Sales Hand-off",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "1TB File Storage",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "Assets Support: PDF, PPT, Image, Documents, Links, Videos, and third party assets"
            },
            {
                "item"          :   "Priority Customer Support",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
        ]
    },    
    [DSR_PLAN_3]        :   {
        planId      :   1003,
        key         :   DSR_PLAN_3,
        displayName :   "ENTERPRISE",
        monthlyPrice    :   "$99",
        yearlyPrice     :   "$69",
        desc        :   "for large and regional teams in enterprises",
        ctaText     :   "Upgrade",
        listHeader  :   "Everything in Growth +",
        isCurrent   :   true,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "Slack Integration",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Executive Dashboard",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "APIs and Webhooks",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Two-way Sync in CRM Integration",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Onboarding and Training",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Single Sign-On",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Slack Channel Support",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Dedicated Account Manager",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
        ]
    }
}

export const DPR_STARTER    =   "DPR_STARTER";
export const STARTER        =   "STARTER";
export const GROWTH_V2      =   "GROWTH";
export const ENTERPRISE_V2  =   "ENTERPRISE";
export const ESSENTIAL_V2   =   "DPR_ESSENTIAL";
export const ADVANCED_V2    =   "DPR_ADVANCED";

export const PRICING_CONFIG_V2: Record<string, {
    planId          :   string;
    key             :   string;
    displayName     :   string;
    monthlyPrice    :   string,
    yearlyPrice     :   string,
    desc            :   string;
}>    =   
{
    [GROWTH_V2] : {
        planId      :   GROWTH_V2,
        key         :   GROWTH_V2,
        displayName :   "Growth",
        monthlyPrice:   "$49/user/mo",
        yearlyPrice :   "$34/user/mo",
        desc        :   "For small teams and growth companies"
    },
    [ENTERPRISE_V2] : {
        planId      :   ENTERPRISE_V2,
        key         :   ENTERPRISE_V2,
        displayName :   "Enterprise",
        monthlyPrice:   "$99/user/mo",
        yearlyPrice :   "$69/user/mo",
        desc        :   "For large and regional teams in enterprises"
    },
    [ESSENTIAL_V2] : {
        planId      :   ESSENTIAL_V2,
        key         :   ESSENTIAL_V2,
        displayName :   "Essential",
        monthlyPrice:   "$449",
        yearlyPrice :   "$375",
        desc        :   "for growth companies"
    },
    [ADVANCED_V2] : {
        planId      :   ADVANCED_V2,
        key         :   ADVANCED_V2,
        displayName :   "Advanced",
        monthlyPrice:   "$749",
        yearlyPrice :   "$625",
        desc        :   "for enterprises and agencies"
    }
}