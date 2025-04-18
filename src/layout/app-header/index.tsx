import { Layout, Radio, Space, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../globals';
import { CommonUtil } from '../../utils/common-util';
import { checkPermission, PermissionCheckers } from '../../config/role-permission';
import { FEATURE_ACCOUNT_ANALYTICS, FEATURE_ACCOUNTS, FEATURE_CONTENT_ANALYTICS, FEATURE_DECK, FEATURE_EXECUTIVE_ANALYTICS, FEATURE_HOME, FEATURE_LIBRARY, FEATURE_ROOMS, FEATURE_TEMPLATES, SETTINGS_ORG } from '../../config/role-permission-config';
import { ACCOUNTS, ANALYTICS, HEADER_FEATURE_PERMISSION, LIBRARY, LINKS, USER_TYPE_BS_MARKET_PLACE_USER, VENDORS } from './permission';

import { ACCOUNT_TYPE_DSR, ACCOUNT_TYPE_GTM } from '../../constants/module-constants';

import Notifications from '../../components/sellers-notifications/notifications';
import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';
import NewPricingModal from '../../pages/settings/pricing/new-pricing-modal';
import PricingModal from '../../pages/settings/pricing/pricing-modal';
import Profile from './profile';
import UpgradeIcon from '../../components/upgrade-icon';

const { Header }    =   Layout;

const AppHeader = (props: {code?: any, setCurrentView?: any, currentView?: any, setFromPath: (arg0: string) => void, hsRoomId?: string, hsAccountId?: string, sfdcRoomId?: string, sfdcAccountId?: string}) => {

    const { code, currentView, setCurrentView, setFromPath, hsRoomId, hsAccountId, sfdcRoomId, sfdcAccountId }   =   props;

    const location      =    useLocation();
    const navigate      =    useNavigate();

    const { $dictionary, $orgDetail, $user, $isVendorMode, $accountType, $featData }    =   useContext(GlobalContext);

    const [showPricing, setShowPricing]     =   useState(false);
    const [showPurchase, setShowPurchase]   =   useState(false);

    let currentModule = location.pathname.split("/")[1];

    const navItems = [
        {
            key: "home",
            to: "/home",
            label: "Home",
            permission: checkPermission($user.role, FEATURE_HOME, 'read'),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "rooms",
            to: "/rooms",
            label: $dictionary.rooms.title,
            permission: checkPermission($user.role, FEATURE_ROOMS, 'read'),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "links",
            to: HEADER_FEATURE_PERMISSION[LINKS]?.toPath,
            label: $dictionary.links.title,
            permission: checkPermission($user.role, FEATURE_DECK, 'read') && !($accountType === ACCOUNT_TYPE_DSR),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "accounts",
            to: HEADER_FEATURE_PERMISSION[ACCOUNTS]?.toPath,
            label: HEADER_FEATURE_PERMISSION[ACCOUNTS]?.displayName,
            permission: checkPermission($user.role, FEATURE_ACCOUNTS, 'read'),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "templates",
            to: "/templates",
            label: $dictionary.templates.title,
            permission: checkPermission($user.role, FEATURE_TEMPLATES, 'read'),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "library",
            to: HEADER_FEATURE_PERMISSION[LIBRARY]?.toPath,
            label: $dictionary.library.title,
            permission: checkPermission($user.role, FEATURE_LIBRARY, 'read'),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "analytics",
            to: HEADER_FEATURE_PERMISSION[ANALYTICS]?.toPath,
            label: (<Space>
                        {$dictionary.analytics.title} 
                        {($featData?.content_performance?.isRestricted) && <UpgradeIcon/>}
                    </Space>
            ),
            permission: (checkPermission($user.role, FEATURE_ACCOUNT_ANALYTICS, 'read') || 
                        checkPermission($user.role, FEATURE_CONTENT_ANALYTICS, 'read') || 
                        checkPermission($user.role, FEATURE_EXECUTIVE_ANALYTICS, 'read')),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        },
        {
            key: "vendors",
            to: HEADER_FEATURE_PERMISSION[VENDORS]?.toPath,
            label: HEADER_FEATURE_PERMISSION[VENDORS]?.displayName,
            permission: HEADER_FEATURE_PERMISSION[VENDORS]?.permission($orgDetail.type, $user.type),
            vendorClass: "j-bs-mp-tab",
            defaultClass: "j-tab",
        }
    ];

    const orderedNavItems = $orgDetail?.type === "VENDOR" ? [navItems[6], navItems[5], navItems[2], navItems[4], navItems[1], navItems[3]] : navItems;

    useEffect(() => {
        setFromPath(currentModule ? currentModule : "rooms")
    }, [])
    
    return(
        <>
            <Space className='cm-width100 j-sfdc-app-header j-hs-app-header' style={{height: "25px"}}>
                <Radio.Group value={currentModule ? currentModule : currentView} className='cm-flex' size='small' >
                    {
                        code === 20003 || hsRoomId || sfdcRoomId ?
                            <Radio.Button value="rooms" key={"rooms"} className='cm-font-size12 cm-flex'>
                                <NavLink 
                                    key         =   {"rooms"} 
                                    to          =   {CommonUtil.__getSubdomain(window.location.origin) === "hs-app" ? `/rooms/${hsAccountId}/${hsRoomId}/sections` : `/rooms/${sfdcAccountId}/${sfdcRoomId}/sections`} 
                                >
                                    Room
                                </NavLink>
                            </Radio.Button>
                        :
                            <Radio.Button value="rooms" key={"rooms"} className='cm-font-size12 cm-flex' onClick={() => setCurrentView("empty")}>
                                Room
                            </Radio.Button>
                    }
                    <Radio.Button value="library" key={"library"}  className='cm-font-size12 cm-flex' onClick={code !== 20003 ? () => setCurrentView("library") : () => {}}>
                        <NavLink 
                            key         =   {"library"} 
                            to          =   {HEADER_FEATURE_PERMISSION[LIBRARY]?.toPath} 
                        >
                            Library
                        </NavLink>
                    </Radio.Button>
                    <Radio.Button value="links" key={"links"}  className='cm-font-size12 cm-flex' onClick={code !== 20003 ? () => setCurrentView("links") : () => {}}>
                        <NavLink 
                            key         =   {"links"} 
                            to          =   {HEADER_FEATURE_PERMISSION[LINKS]?.toPath} 
                        >
                            Links
                        </NavLink>
                    </Radio.Button>
                </Radio.Group>
            </Space>
            <Header className={`${($orgDetail?.type === "VENDOR") ? "j-bs-mp-app-header" : "j-app-header" } cm-flex-space-between cm-width100`}>
                <Space size={20}>
                    <Space className='cm-flex-center'>
                        <a className='j-app-logo' href="/">
                            <img style={{width: "40px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-product-logo.svg`} alt='logo'/>
                        </a>
                        {
                            $isVendorMode && <Space className='cm-flex-center' size={15}><MaterialSymbolsRounded font='arrow_forward' className="cm-dark-text" size='20'/><img style={{width: "30px"}} src={$orgDetail.logoUrl} className='cm-flex-center'/></Space>
                        }
                    </Space>
                    <Space className={`cm-flex ${($orgDetail?.type === "VENDOR") ? "j-bs-mp-header-left" : "j-header-left"} `} size={0}>
                        {orderedNavItems.map((item) => 
                            item.permission && (
                                <NavLink 
                                    key         =   {item.key} 
                                    to          =   {item.to} 
                                    onClick     =   {() => setFromPath(item.key)} 
                                    className   =   {({isActive}) => `${$orgDetail?.type === "VENDOR" ? item.vendorClass : item.defaultClass} ${isActive ? "active" : ""}`}
                                >
                                    {item.label}
                                </NavLink>
                            )
                        )}
                    </Space>
                </Space>
                <Space className='j-header-right' size={20}>
                    {
                        $orgDetail.planDetail.isTrial
                        ? 
                            $accountType === ACCOUNT_TYPE_GTM 
                            ?
                                // <a href="mailto:support@buyerstage.io" target="_blank"><Space className='j-upgrade-button cm-flex-center' style={{width: "120px"}}><MaterialSymbolsRounded font='auto_fix_high' size='18' filled weight='400'/>Talk to us</Space></a>
                                null
                            :
                                <Space className={`j-upgrade-button cm-flex-center cm-cursor-pointer`} onClick={() => navigate("/settings/plan-details")}>
                                    <MaterialSymbolsRounded font='auto_fix_high' size='18' filled weight='400'/>
                                    <div className='cm-font-fam500'>Upgrade</div>
                                </Space>
                        :
                            null
                    }
                    { $user.type === USER_TYPE_BS_MARKET_PLACE_USER && <Tag color='#ff831d'>{$orgDetail.companyName}</Tag> }
                    <Notifications />
                    <Space size={15} className='cm-flex-center'>
                        <NavLink 
                            to          =   {PermissionCheckers.__checkPermission($user.role, SETTINGS_ORG, 'read') ? "/settings/organization-details" : "/settings/personal-details"}
                            className   =   {() => `j-settings-tab cm-flex-center ${($orgDetail.type === "VENDOR") ? "j-bs-mp-nav-icon" : "j-nav-icon"} ${currentModule === "settings" ? "selected" : ""}`}
                            style       =   {{display: "block"}}
                        >
                            <MaterialSymbolsRounded font={'settings'} size={'22'} filled={currentModule === "settings"} />
                        </NavLink>
                    </Space>
                    <Profile/>
                </Space>
            </Header>
            <PricingModal
                isOpen  =   {showPricing}
                onClose =   {() => setShowPricing(false)}
            />
            <NewPricingModal 
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
        </>
    );
}

export default AppHeader;