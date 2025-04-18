import { MEET_WITH_BUYERSTAGE } from "../../../constants/module-constants";

export const DPR_PLAN_1     =   "DPR_STARTER";
export const DPR_PLAN_2     =   "DPR_ESSENTIAL";
export const DPR_PLAN_3     =   "DPR_ADVANCED";

export const DPR_PRICING_CONFIG: Record<string, {
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
    [DPR_PLAN_1]        :   {
        planId      :   2001,
        key         :   DPR_PLAN_1,
        displayName :   "STARTER",
        monthlyPrice    :   "$0",
        yearlyPrice     :   "$0",
        desc        :   "for early-stage startups",
        ctaText     :   "Upgrade",
        listHeader  :   "Key Features",
        isCurrent   :   false,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "Up to 3 Users",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "3 Collateral Pods",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Engage Up To 500 Leads",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Storage up to 5 GB",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "25 MB File Upload Limit",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Basic Collateral Distribution",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "Links, Embed Code"
            },
            {
                "item"          :   "Integrate Basic Apps",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "CRM and MArketing Tools"
            },
            {
                "item"          :   "Lead Insights",
                "isComingSoon"  :   false,
                "showInfo"      :   false,
            },
            {
                "item"          :   "Chrome Extension for CRM and Email",
                "isComingSoon"  :   true,
                "showInfo"      :   false,
            },
        ]
    },
    [DPR_PLAN_2]        :   {
        planId      :   2002,
        key         :   DPR_PLAN_2,
        displayName :   "ESSENTIAL",
        monthlyPrice    :   "$449",
        yearlyPrice     :   "$375",
        desc        :   "for growth companies",
        ctaText     :   "Upgrade to Growth",
        listHeader  :   "Everything in Starter +",
        isCurrent   :   false,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "Up to 25 Users",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Collateral Pods",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Leads Engagement",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Storage up to 100 GB",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "500 MB File Upload Limit",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Advanced Collateral Distribution",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "Links, Embed Code, QR, JS Snippet, Webhook "
            },
            {
                "item"          :   "Integrate More Apps",
                "isComingSoon"  :   false,
                "showInfo"      :   true,
                "tooltipText"   :   "CRM, Marketing, Collaboration, Drive tools"
            },
            {
                "item"          :   "Collateral Analytics",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Backup Support",
                "isComingSoon"  :   true,
                "showInfo"      :   false,
            },
            {
                "item"          :   "AI Features",
                "isComingSoon"  :   true,
                "showInfo"      :   false,
            },
            {
                "item"          :   "Dedicated Slack Channel Support",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Single Single-On",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
        ]
    },    
    [DPR_PLAN_3]        :   {
        planId      :   2003,
        key         :   DPR_PLAN_3,
        displayName :   "ADVANCED",
        monthlyPrice    :   "$749",
        yearlyPrice     :   "$625",
        desc        :   "for enterprises and agencies",
        ctaText     :   "Upgrade to Enterprise",
        listHeader  :   "Everything in Essential +",
        isCurrent   :   true,
        href        :   MEET_WITH_BUYERSTAGE,
        list        :   [
            {
                "item"          :   "Unlimited Users",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Unlimited Storage",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Multiple Workspaces",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Dedicated Client Portals",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Users Management",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Custom Roles & Profiles",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            },
            {
                "item"          :   "Dedicated Account Manager",
                "isComingSoon"  :   false,
                "showInfo"      :   false
            }
        ]
    }
}