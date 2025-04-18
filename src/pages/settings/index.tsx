import { useContext, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Col, Menu, Row, Space, Tooltip } from 'antd';
import './settings.css';

import { GlobalContext } from '../../globals';

import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';
import SubMenu from 'antd/es/menu/SubMenu';
import { checkPermission } from '../../config/role-permission';
import { FEATURE_ROOMS, SETTINGS_BRANDING, SETTINGS_CATEGORIES, SETTINGS_DEVELOPER_SETTINGS, SETTINGS_DISCOVERY_SETTINGS, SETTINGS_FAQ, SETTINGS_INTEGRATIONS, SETTINGS_ORG, SETTINGS_TEAMS_AND_PERMISSIONS } from '../../config/role-permission-config';
import { ACCOUNT_TYPE_DSR } from '../../constants/module-constants';
import NewPricingModal from './pricing/new-pricing-modal';
import UpgradeIcon from '../../components/upgrade-icon';

const SettingsLayout = () => {

    const pathname = useLocation().pathname.split("/")[2];

    const { $orgDetail, $user, $dictionary, $accountType, $featData }    =   useContext(GlobalContext);

    const isNotVendorNormalUser    =   !($orgDetail.type === "VENDOR" && $user.type === "NORMAL_USER");

    const [showPurchase, setShowPurchase]   =   useState(false);

    return(   
        <>
            <Row className="cm-height100 cm-row" gutter={20}>
                <Col flex="230px" className="j-settings-side-nav cm-height100" style={{ padding: "0px"}}>
                    <div className="j-settings-sider-sub-header cm-font-fam500" >User</div>
                    <Menu className="j-setting-nav-menu" mode="inline" selectedKeys={[pathname]}>
                        <Menu.Item key={"personal-details"} icon={<MaterialSymbolsRounded font='person' size="22"/>} className='j-settings-nav-item'>
                            <NavLink to={"personal-details"}>Personal Details</NavLink>
                        </Menu.Item>
                        {
                            checkPermission($user.role, SETTINGS_ORG, 'read') || 
                                checkPermission($user.role, SETTINGS_BRANDING, 'read') || 
                                    checkPermission($user.role, SETTINGS_BRANDING, 'read') || 
                                        checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, 'read') ||
                                            checkPermission($user.role, SETTINGS_CATEGORIES, 'read') ||
                                                checkPermission($user.role, SETTINGS_INTEGRATIONS, 'read') ||
                                                    checkPermission($user.role, SETTINGS_FAQ, 'read') ||
                                                        checkPermission($user.role, SETTINGS_DISCOVERY_SETTINGS, 'read') ||
                                                            checkPermission($user.role, SETTINGS_DEVELOPER_SETTINGS, 'read')
                                        ?
                                <div className="j-settings-sider-sub-header cm-font-fam500 cm-margin-bottom10 cm-margin-top10">Organization</div>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_ORG, 'read') ? 
                                <Menu.Item key={"organization-details"} icon={<MaterialSymbolsRounded font='corporate_fare' size="22"/>} className='j-settings-nav-item'>
                                    <NavLink to={"organization-details"}>Organization Details</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_BRANDING, 'read') ? 
                                <Menu.Item key={"branding"} icon={<MaterialSymbolsRounded font='verified' size="22"/>} className='j-settings-nav-item'>
                                    {
                                        <NavLink to={"branding"}>
                                            <Space className='cm-flex-space-between'>Branding {$featData?.branding?.isRestricted ? <UpgradeIcon/> : ""}</Space>
                                        </NavLink>
                                    }
                                </Menu.Item>
                                :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, 'read') ?
                                <Menu.Item key={"users-permissions"} icon={<MaterialSymbolsRounded font='group' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"users-permissions"}>Team & Permissions</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_CATEGORIES, 'read') ?
                                <Menu.Item key={"options"} icon={<MaterialSymbolsRounded font='category' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"options"}>Options</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, FEATURE_ROOMS, 'update') ?
                                <Menu.Item key={"room-settings"} icon={<MaterialSymbolsRounded font='roofing' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"room-settings"}>{$dictionary.rooms.singularTitle} Settings</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_INTEGRATIONS, 'read') ?
                                <Menu.Item key={"integrations"} icon={<MaterialSymbolsRounded font='integration_instructions' size='22'/>} className='j-settings-nav-item'>
                                    {
                                       ($orgDetail.planDetail.isTrial && $orgDetail.planDetail.expiryInDays < 1)
                                        ? 
                                            <Tooltip title={"🚀 Upgrade to access Integrations"} placement='right'>
                                                <Space className='cm-flex-space-between' onClick={() => setShowPurchase(true)}>Integrations <UpgradeIcon/></Space>
                                            </Tooltip>
                                        :
                                            <NavLink to={"integrations"}>Integrations</NavLink>
                                    }
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_FAQ, 'read') ?
                                <Menu.Item key={"faqs"} icon={<MaterialSymbolsRounded font='quiz' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"faqs"}>FAQ</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_DISCOVERY_SETTINGS, 'read') && $orgDetail.tenantName !== "kissflow" && ($accountType !== ACCOUNT_TYPE_DSR) ?
                                <Menu.Item key={"discovery"} icon={<MaterialSymbolsRounded font='question_answer' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"discovery"}>Discovery Questions</NavLink>
                                </Menu.Item>
                            :
                                null
                        }
                        {
                            $orgDetail.type === "INTERNAL" ?
                                <>
                                    <SubMenu title={"Connect to Website"} icon={<MaterialSymbolsRounded font='language' size='22'/>} className='j-settings-sub-nav'>
                                        <Menu.Item key={"gated"} className='j-settings-sub-nav-item'>
                                            <NavLink to={"gated"}>Gated</NavLink>
                                        </Menu.Item>
                                        <Menu.Item key={"non_gated"} className='j-settings-sub-nav-item'>
                                            <NavLink to={"non_gated"}>Non-Gated</NavLink>
                                        </Menu.Item>
                                    </SubMenu>
                                    <Menu.Item key={"calendar"} icon={<MaterialSymbolsRounded font='calendar_month' size='22'/>} className='j-settings-nav-item'>
                                        <NavLink to={"calendar"}>Scheduling</NavLink>
                                    </Menu.Item>
                                    <Menu.Item key={"form_fields"} icon={<MaterialSymbolsRounded font='summarize' size='22'/>} className='j-settings-nav-item'>
                                        <NavLink to={"form_fields"}>Form Fields</NavLink>
                                    </Menu.Item>
                                </>
                            :
                                null
                        }
                        {
                            checkPermission($user.role, SETTINGS_DEVELOPER_SETTINGS, 'read') && isNotVendorNormalUser ?
                                <Menu.Item key={"developer"} icon={<MaterialSymbolsRounded font='code' size='22'/>} className='j-settings-nav-item'>
                                    {
                                        $featData?.developer_settings?.isRestricted
                                        ?
                                            <Space className='cm-flex-space-between' onClick={() => setShowPurchase(true)}>Developer Settings <UpgradeIcon/></Space>
                                        :
                                            <NavLink to={"developer"}>Developer Settings</NavLink>
                                    }
                                </Menu.Item>
                            :
                            null
                        }
                        {
                            <Menu.Item key={"plan-details"} icon={<MaterialSymbolsRounded font='credit_card' size='22'/>} className='j-settings-nav-item'>
                                <NavLink to={"plan-details"}>Billing</NavLink>
                            </Menu.Item>
                        }
                        {
                            ($orgDetail.type === "VENDOR" || $orgDetail.type === "USER_AND_VENDOR") &&
                                <Menu.Item key={"marketplace"} icon={<MaterialSymbolsRounded font='storefront' size='22'/>} className='j-settings-nav-item'>
                                    <NavLink to={"marketplace"}>Marketplace</NavLink>
                                </Menu.Item>
                        }
                    </Menu>
                </Col>
                <Col flex="auto" style={{maxWidth: "calc(100% - 230px)",padding: 0}}  className="cm-height100" >
                    <Outlet/>
                </Col>
            </Row>
            <NewPricingModal
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
        </>
    )
}

export default SettingsLayout