export const BUYER      =   "BUYER";
export const SELLER     =   "SELLER";

export const ORG_TYPE_INTERNAL      =   "INTERNAL";
export const ORG_TYPE_DEMO          =   "DEMO";
export const ORG_TYPE_USER          =   "USER";

export const PAGE_TYPE_WELCOME          =   "WELCOME";
export const PAGE_TYPE_DEMO             =   "DEMO";
export const PAGE_TYPE_RESOURCE         =   "RESOURCE";
export const PAGE_TYPE_NEXT_STEPS       =   "NEXT_STEPS";
export const PAGE_TYPE_TALK_TO_US       =   "TALK_TO_US";
export const PAGE_TYPE_CUSTOM_SECTION   =   "CUSTOM_SECTION";
export const PAGE_TYPE_FAQ              =   "FAQ";

export const Length_Input               =   150;
export const RESOURCE_COUNT             =   1000;
export const ROOMS_PAGINATION_COUNT     =   20;
export const ACCOUNTS_PAGINATION_COUNT  =   20;
export const ANALYTICS_RESOURCE_LIMIT   =   20;

export const VALID_APP_SUB_DOMAINS  =   ["app", "preapp"];

export const URL_PARSER_REGEX       =   /(https?:\/\/[^\s]+)/g;

export const official_email_regex   = /^([\w-\.]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)(?!yahoo\.co\.in)(?!aol\.com)(?!abc\.com)(?!xyz\.com)(?!pqr\.com)(?!rediffmail\.com)(?!live\.com)(?!outlook\.com)(?!me\.com)(?!msn\.com)(?!ymail\.com)([\w-]+\.)+[\w-]{2,10})?$/;

export const hubspot_form_url       = "https://api.hsforms.com/submissions/v3/integration/submit/22210509/b9b84e17-708c-4338-9fc6-bde341e913f8";

export const CLEARBIT_URL           = "https://logo.clearbit.com/";

export const ACCEPTED_PROFILE_IMAGE_FILE_TYPES = "image/png, image/jpeg"

export const ACCEPTED_THUMBNAIL_FILES   = "image/png, image/gif, image/jpeg";

export const ACCEPTED_IMAGE_FILES       = "image/png, image/gif, image/jpeg";

export const ACCEPTED_DOC_TYPES         =   "application/pdf";

export const RESOURCE_TYPE_PDF          =   "application/pdf";

export const ACCEPTED_VIDEO_TYPES       = "video/mp4"

export const ACCEPTED_FAVICON_TYPE      = 'image/vnd.microsoft.icon, image/png'

export const OFFICE_FILES               =   ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint"];

export const ACCPETED_OFFICE_FILES      =   "application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export const COMPANY_FALLBACK_ICON      =   `${import.meta.env.VITE_STATIC_ASSET_URL}/account-fallback.svg`

export const ACME_FALLBACK_ICON         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/acme_bs_logo.svg`

export const THUMBNAIL_FALLBACK_ICON    =   `${import.meta.env.VITE_STATIC_ASSET_URL}/fallback-thumbnail.svg`

export const PREVIEW_USER_ICON          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/previewuser.svg`

export const BUYERSTAGE_LOGO            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-logo.svg`

export const EMPTY_CONTENT_ACCOUNT_IMG  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty-search.svg`

export const NO_ROOMS_SFDC              =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no_rooms_sfdc.svg`;

export const NO_PITCH_VIDEO             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_pitch_content.svg`;

export const NO_USE_CASE                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no_usecase.svg`;

export const REVENUE_HERO               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/revenuehero.svg`;

export const CHILLI_PIPER               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/chilli-piper.svg`;

export const BUYERSTAGE_WEBSITE_URL     =   "https://www.buyerstage.io?utm_source=inapp"

export const BUYERSTAGE_PRIVACY_POLICY  =   "https://www.buyerstage.io/privacy"

export const BUYERSTAGE_PRICING         =   "https://www.buyerstage.io/pricing"

export const BUYERSTAGE_MARKETPLACE_LIBRARY  =   "https://www.buyerstage.io/library"

export const ACCEPTED_FILE_TYPES        =   "image/png, image/gif, image/jpeg, application/pdf, video/mp4, video/x-matroska, .mkv, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const BUYERSTAGE_FAVICON         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/favicon.ico`

export const HUBSPOT_LOGO               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/hubspot-logo.svg`

export const HUBSPOT_LOGO_NEW           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/hubspot-logo-new.svg`

export const SALESFORCE_LOGO            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/salesforce.svg`

export const PIPEDRIVE_LOGO             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/pipedrive-logo.svg`

export const FALL_BACK_RESOURCE         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/fallback_video.svg`

export const EMAIL_SIDER                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/template-email-form.svg`;

export const EMAIL_SENT                 =   `${import.meta.env.VITE_STATIC_ASSET_URL}/mail_sent.svg`;

export const SLACK_LOGO                 =   `${import.meta.env.VITE_STATIC_ASSET_URL}/slack-logo.svg`;

export const ONBOARDING_BANNER          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-banner.svg`; 

export const NO_RESULT_FOUND            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no-result-found.svg`; 

export const DISCOVERY_ICON             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/discovery-icon.svg`; 

export const GO_TO_DISCOVERY_ICON       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/go-to-discovery.svg`;

export const TALK_TO_US_ICON            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/talk-to-us.svg`; 

export const NO_DECKS_SHARED            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no-decks-shared.svg`; 

export const MEET_WITH_BUYERSTAGE       =   "https://www.buyerstage.io/talk-to-us?utm_source=inapp"

export const BUYERSTAGE_PRODUCT_LOGO    =   `${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-product-logo.svg`

export const FOLDER_IMAGE               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/folder.svg`

export const VIMEO_LOGO                 =   `${import.meta.env.VITE_SERVICE_ASSESTS}/vimeo-logo.svg`

export const LOOM_LOGO                  =   `${import.meta.env.VITE_SERVICE_ASSESTS}/loom-logo.svg`

export const YOUTUBE_LOGO               =   `${import.meta.env.VITE_SERVICE_ASSESTS}/youtube-logo.svg`

export const WISITIA_LOGO               =   `${import.meta.env.VITE_SERVICE_ASSESTS}/wisitia-logo.svg`

export const ARCADE_LOGO                =   `${import.meta.env.VITE_SERVICE_ASSESTS}/arcade-logo.svg`

export const STORYLANE_LOGO             =   `${import.meta.env.VITE_SERVICE_ASSESTS}/storylane-logo.svg`

export const CALENDLY_LOGO              =   `${import.meta.env.VITE_SERVICE_ASSESTS}/calendly-logo.svg`

export const EXCEL_LOGO                 =   `${import.meta.env.VITE_SERVICE_ASSESTS}/excel-logo.svg`

export const WORD_LOGO                  =   `${import.meta.env.VITE_SERVICE_ASSESTS}/word-logo.svg`

export const OWNER_PLACEHOLDER          =    `${import.meta.env.VITE_STATIC_ASSET_URL}/owner-placeholder.svg`

export const POWERPOINT_LOGO            =   `${import.meta.env.VITE_SERVICE_ASSESTS}/powerpoint-logo.svg`

export const NO_WIDGETS_ADDED           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no-widgets-added.svg`;

export const DECK_EMPTY_RESOURCE_IMAGE  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/deck-empty-resource-image.svg`

export const RESOURCE_TYPE_DOC          =    `${import.meta.env.VITE_STATIC_ASSET_URL}/res-type/res_type_doc.svg`

export const RESOURCE_TYPE_IMAGE        =    `${import.meta.env.VITE_STATIC_ASSET_URL}/res-type/res_type_image.svg`

export const RESOURCE_TYPE_LINK         =    `${import.meta.env.VITE_STATIC_ASSET_URL}/res-type/res_type_link.svg`

export const RESOURCE_TYPE_VIDEO        =    `${import.meta.env.VITE_STATIC_ASSET_URL}/res-type/res_type_video.svg`

export const PLAY_VIDEO_IMAGE           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/play_video_icon.svg`

export const EMPTY_SECTION              =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_section.svg`

export const ONE_PAGER_SECTION          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/one_pager_section.svg`

export const SALES_TEMPLATE_SECTION     =   `${import.meta.env.VITE_STATIC_ASSET_URL}/sales_template_section.svg`

export const WELCOME_SECTION            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/welcome_section.svg`

export const DEMO_SECTION               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/demo_section.svg`

export const RESOURCES_SECTION          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resources_section.svg`

export const NEXT_STEPS_SECTION         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/next_steps_section.svg`

export const TALK_TO_US_SECTION         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/talk_to_us_section.svg`

export const FAQ_SECTION                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/faq_section.svg`

export const NO_NOTES_FOUND             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_notes.svg`

export const TEMPLATE_FAQ               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/template-faq.svg`

export const ROOM_ED_BLUR               =   `${import.meta.env.VITE_STATIC_ASSET_URL}/room-ed-blur.svg`;

export const UPGRADE_OFFER_ARROW            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/upgrade-offer-arrow.svg`;

export const EXECUTIVE_DASHBOARD_BLUR       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/executive-dashboard-blur.svg`;

export const CONTENT_DASHBOARD_BLUR         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/content-dashboard-blur.svg`;

export const ACCOUNT_OVERVIEW_BLUR          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/account-overview-blur.svg`;

export const ANALYTICS_IMG          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/analytics-img.svg`;

// Icons

export const CHROME_ICON                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/chrome-icon.svg`;
export const SAFARI_ICON                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/safari-icon.svg`;
export const EDGE_ICON                  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/edge-icon.svg`;


// Onboarding Videos and images

export const ONBOARDING_CRM_VIDEO       =   `${import.meta.env.VITE_ONBOARDING_ASSET}/setup-hubspot-crm.mp4`
export const ONBOARDING_CREATE_ROOM     =   `${import.meta.env.VITE_ONBOARDING_ASSET}/createRoom.mp4`
export const ONBOARDING_CREATE_TEMPLATE =   `${import.meta.env.VITE_ONBOARDING_ASSET}/createTemplate.mp4`
export const ONBOARDING_INVITE_BUYER    =   `${import.meta.env.VITE_ONBOARDING_ASSET}/inviteBuyer.mp4`
export const ONBOARDING_ACCOUNT_SETUP   =   `${import.meta.env.VITE_ONBOARDING_ASSET}/accountSetup.mp4`

export const ONBOARDING_MP_BRANDING            =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-branding-step.png`
export const ONBOARDING_MP_FAQ                 =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-faq-step.png`
export const ONBOARDING_MP_OVERVIEW            =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-overview-step.png`
export const ONBOARDING_MP_SCREENSHOTS         =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-screenshots-step.png`
export const ONBOARDING_MP_UPDATE_TEMPLATES    =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-template-step.png`
export const ONBOARDING_MP_SHOWCASE_PAGES      =   `${import.meta.env.VITE_ONBOARDING_ASSET}/mp-showcase-step.png`

// Onboarding Videos and images

//fallback Thumbnail Image

export const PDF_FALLBACK_IMAGE             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/pdf.svg`
export const WORD_FALLBACK_IMAGE            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/doc.svg`
export const PPT_FALLBACK_IMAGE             =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/ppt.svg`
export const IMAGE_FALLBACK_IMAGE           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/image.svg`
export const VIDEO_FALLBACK_IMAGE           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/video.svg`
export const LINK_FALLBACK_IMAGE            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/link.svg`
export const EXCEL_FALLBACK_IMAGE           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/xls.svg`
export const OTHERS_FALLBACK_IMAGE          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/others.svg`
export const TEXT_FALLBACK_IMAGE            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/txt.svg`
export const WIDGET_PROFILE_IMAGE_FALLBACK  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/resource-fallbacks/profile_fallback.svg`

//fallback Thumbnail Image

// Empty charts

export const TOP_5_BY_DEAL_CYCLE          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/top_5_by_deal_cycle.svg`;
export const TOP_5_BY_TIME_SPENT          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/top_5_by_time_spent.svg`;
export const EMPTY_LEADER_BOARD           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/leader_board_empty.svg`;
export const NO_RECENT_MESSAGES           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_comments.svg`;
export const NO_DEAL_VS_USER              =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_deal_user.svg`;

// Widgets

export const BUTTON_WIDGET_IMG          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/button-widget.svg`
export const CAROUSEL_WIDGET_IMG        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/carousel-widget.svg`
export const CONTACT_CARD_WIDGET_IMG    =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/contact-card-widget.svg`
export const EMBED_WIDGET_IMG           =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/embed-widget.svg`
export const FEATURE_WIDGET_IMG         =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/feature-widget.svg`
export const RESOURCE_WIDGET_IMG        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/resource-widget.svg`
export const TEAM_CARD_WIDGET_IMG       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/team-card-widget.svg`
export const TEXT_WIDGET_IMG            =   `${import.meta.env.VITE_STATIC_ASSET_URL}/widget-icons/text-widget.svg`

// Widgets

// Widget - carousel

export const CAROUSEL_FALLBACK_IMAGE1       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/carousel_default_1.svg`
export const CAROUSEL_FALLBACK_IMAGE2       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/carousel_default_2.svg`
export const CAROUSEL_EMPTY                 =   `${import.meta.env.VITE_STATIC_ASSET_URL}/carousel_empty.svg`

// Widget - carousel

export const NEXT_STEPS_EMPTY                 =   `${import.meta.env.VITE_STATIC_ASSET_URL}/empty_next-steps.svg`


// Onboarding

export const ONBOARDING_PERSON_IMAGE        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-person-img.svg`;
export const ONBOARDING_OFFICE_IMAGE        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-office-img.svg`;
export const ONBOARDING_BANNER_IMAGE        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-rect-img.svg`;
export const ONBOARDING_DEMO_SKELETON       =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-demo-video-skeleton.svg`;
export const ONBOARDING_LAST_IMAGE          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/onboarding-dsr-last-image.svg`;

export const NOT_TRACKED_YET                =   `${import.meta.env.VITE_STATIC_ASSET_URL}/not-tracked-yet.svg`;
export const VIDEO_NOT_TRACKED_YET          =   `${import.meta.env.VITE_STATIC_ASSET_URL}/video-not-tracked.svg`;

export const NO_BUYERS                      =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no_buyers.svg`;
export const NO_MESSAGES                    =   `${import.meta.env.VITE_STATIC_ASSET_URL}/no_messages.svg`;

export const ORG_DPR                        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/org-dpr.svg`;

export const ORG_DSR                        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/org-dsr.svg`;

export const ORG_GTM                        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/org-gtm.svg`;

export const PREMIUM                        =   `${import.meta.env.VITE_STATIC_ASSET_URL}/premium.svg`;

export const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

export const LINKED_IN_URL_REGEX = /(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

export const URL_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;


export const MODULE_TEMPLATE   =   "MODULE_TEMPLATE";
export const MODULE_ROOM       =   "MODULE_ROOM"

export const DECK_NOTION_DOC_LINK = 'https://intercom.help/buyerstage-resources/en/articles/9787868-link-sharing-tracking'

export const TEMPLATE_FROM_SCRATCH =   `${import.meta.env.VITE_STATIC_ASSET_URL}/room-new/from-scratch.jpg`

export const BUYERSTAGE_FULL_LOGO   = "https://static.buyerstage.io/static-assets/buyerstage-logo.svg";

export const ACCESS_DENIED_IMAGE    = "https://static.buyerstage.io/static-assets/access-denied.svg";

export const OWNER_LOGO             =  "https://static.buyerstage.io/static-assets/owner-logo.svg";

export const BUYERSTAGE_FULL_WHITE_LOGO   = "https://static.buyerstage.io/static-assets/buyerstage-white-logo.svg";

export const ACCOUNT_TYPE_DSR    =   "ACCOUNT_TYPE_DSR";

export const ACCOUNT_TYPE_DPR    =   "ACCOUNT_TYPE_DPR";

export const ACCOUNT_TYPE_GTM    =   "ACCOUNT_TYPE_GTM";

export const BLANK  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/room-new/blank.png`

export const ONE_PAGER  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/room-new/one-pager.png`

export const BASIC  =   `${import.meta.env.VITE_STATIC_ASSET_URL}/room-new/basic.png`

