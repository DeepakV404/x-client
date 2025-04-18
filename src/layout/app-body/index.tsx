import { Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout, Space } from "antd";

import { STEPPED_INTO_APP } from "../../tracker-constants";
import { ROLE_MANAGER } from '../../config/role-config';
import { AppTracker } from "../../app-tracker";
import { GlobalContext } from "../../globals";
import { AppContext } from "..";

import { checkPermission } from "../../config/role-permission";
import { ADMIN, CONTENT_EDITOR, OWNER, USER, VIEWER } from "../../pages/settings/config/settings-config";
import { FEATURE_ACCOUNT_ANALYTICS, FEATURE_ACCOUNTS, FEATURE_CONTENT_ANALYTICS, FEATURE_DECK, FEATURE_EXECUTIVE_ANALYTICS, FEATURE_HOME, FEATURE_LIBRARY, FEATURE_ROOMS, FEATURE_TEMPLATES, SETTINGS_BRANDING, SETTINGS_CATEGORIES, SETTINGS_DEVELOPER_SETTINGS, SETTINGS_DISCOVERY_SETTINGS, SETTINGS_FAQ, SETTINGS_INTEGRATIONS, SETTINGS_ORG, SETTINGS_TEAMS_AND_PERMISSIONS } from '../../config/role-permission-config';

// import AccountRoomPreview from "../../pages/accounts/account-room-view/room-preview";
import AccountInfoForm from "../../pages/accounts/account-room-view/room-account-info/account-info-form";
import OrgDetails from "../../pages/settings/options/organization-details";
import TemplatesListing from "../../pages/templates/templates-listing";
import PersonalInfo from "../../pages/settings/options/personal-info";
import UserPermissions from "../../pages/settings/user-permissions";
import Integrations from "../../pages/settings/options/integrations";
import AccountsListing from "../../pages/accounts/accounts-list";
import AccountRooms from "../../pages/accounts/account-rooms";
import RoomsListing from "../../pages/rooms/rooms-listing";
import SettingsLayout from "../../pages/settings";
import Faq from "../../pages/settings/faq";

import RoomCollaborationViewLayout from "../../pages/rooms/room-collaboration";
import Handoff from "../../pages/rooms/room-header/handoff/handoff";
import RoomResources from "../../pages/rooms/room-resources";
import RoomInsights from "../../pages/rooms/room-insights";
import AccountsLayout from "../../pages/accounts";

import ActionItemsListing from "../../pages/rooms/room-action-plan/action-items-listing";
import RoomBuyingCommittee from "../../pages/rooms/room-buying-committee";
import NonGatedSetup from "../../pages/settings/connect-inbound/non-gated";
import GatedSetup from "../../pages/settings/connect-inbound/gated";

import CustomSectionLayout from "../../pages/rooms/room-settings/section-layout";
import LibraryWrapper from "../../pages/library/library-layout/library-wrapper";
import DeckLayout from "../../pages/library/deck/deck-view/deck-layout";
import MarketplaceLayout from "../../pages/settings/marketplace";
import DiscoveryQuestions from "../../pages/settings/discovery";
import LibraryLayout from "../../pages/library/library-layout";
import CalendarSettings from "../../pages/settings/calendar";
import WebHooks from "../../pages/settings/options/webhooks";
import PlanDetails from "../../pages/settings/plan-details";
import RoomComments from "../../pages/rooms/room-comments";
import FormFields from "../../pages/settings/form-fields";
import VendorListLayout from "../../pages/vendor-list";
import RoomLayout from "../../pages/rooms/room-layout";
import Branding from "../../pages/settings/branding";
import WelcomePage from "../../pages/welcome";
import Decks from "../../pages/library/deck";
import Loading from "../../utils/loading";
import ProtectedRoute from "../../config/protected-route";
import NoAccess from "../../components/error-pages/no-access";
import AnalyticsLayout from "../../pages/analytics";
import AccountOverview from "../../pages/analytics/account-overview";
import ExecutiveDashboard from "../../pages/analytics/executive-dashboard";
import ContentPerformanceLayout from "../../pages/analytics/content-performance";
import Marketplace_Onboarding from "../../pages/marketplace";
import RoomSettingsTransformer from "../../pages/settings/room-settings/room-settings-transformer";
import TemplateViewLayout from "../../pages/templates/template-view/template-view-layout";
// Options Import
import OptionsLayout from "../../pages/settings/options";
import UsecaseCategoriesList from "../../pages/settings/category/usecase-categories/usecase-categories-list";
import ResourceCategoriesList from "../../pages/settings/category/resource-categories/resource-categories-list";
import Regions from "../../pages/settings/category/regions/regions";
import RoomStages from "../../pages/settings/category/room-stages";
import RoomExecutiveDashboard from "../../pages/rooms/room-executive-dashboard";
import RoomSettingsLayout from "../../pages/rooms/room-settings/room-settings-layout";
import { ACCOUNT_TYPE_DSR, NEXT_STEPS_EMPTY } from "../../constants/module-constants";
// Options Import

const { Content }   =   Layout;

const AppBody = () => {

    const { currentView, sfdcRoomId, sfdcAccountId, hsRoomId, hsAccountId }   =   useContext(AppContext);
    
    const { $orgDetail, $user, $isVendorMode, $isVendorOrg, $accountType, $featData }    =   useContext(GlobalContext);

    useEffect(() => {
        AppTracker.trackEvent(STEPPED_INTO_APP, {});
    }, [])

    return (
        <Content>
            <div className="j-app-body">
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="*"                  element={<NoAccess />} />
                        {
                            currentView === "links" ? 
                                <>
                                    <Route path="/" element =   {<Navigate to={`/links`}/>}/>
                                    <Route path="https://app.hubspot.com" element =   {<Navigate to={`/links`}/>}/>
                                </>
                            :
                            currentView === "library" ?
                                <>
                                    <Route path="/" element =   {<Navigate to={`/library/all-resources`}/>}/>
                                    <Route path="https://app.hubspot.com" element =   {<Navigate to={`/library/all-resources`}/>}/>
                                </>
                            :
                                sfdcRoomId ?
                                    <Route path="/" element =   {<Navigate to={`/rooms/${sfdcAccountId}/${sfdcRoomId}/sections`}/>}/>
                                :
                                    hsRoomId
                                    ?
                                        <Route path="https://app.hubspot.com" element =   {<Navigate to={`/rooms/${hsAccountId}/${hsRoomId}/sections`}/>}/>
                                    :
                                        $user.role === ADMIN || $user.role === OWNER || $user.role === USER || $user.role === ROLE_MANAGER ?
                                            <>
                                                <Route path="/"            element  =   {
                                                        <ProtectedRoute
                                                            permissionCheck   =   {checkPermission($user.role, ($isVendorMode || $isVendorOrg) ? FEATURE_DECK : FEATURE_HOME, 'read')}
                                                            element           =   {<Navigate to={($isVendorMode || $isVendorOrg) ? "/links" : "/home"}/>}
                                                        />
                                                    }
                                                />
                                                <Route 
                                                    path    =   "/welcome"      
                                                    element =   {
                                                        <ProtectedRoute
                                                            permissionCheck     =   {checkPermission($user.role, ($isVendorMode || $isVendorOrg) ? FEATURE_DECK : FEATURE_HOME, 'read')}
                                                            element             =   {<Navigate to={($isVendorMode || $isVendorOrg) ? "/links" : "/home"}/>}
                                                        />
                                                    }
                                                />
                                                {
                                                    ($isVendorMode || $isVendorOrg) ?
                                                        <Route 
                                                            path    =   "/home"      
                                                            element =   {
                                                                <ProtectedRoute
                                                                    permissionCheck     =   {checkPermission($user.role, ($isVendorMode || $isVendorOrg) ? FEATURE_DECK : FEATURE_HOME, 'read')}
                                                                    element             =   {<Navigate to={"/links"}/>}
                                                                />
                                                            }
                                                        />
                                                    :
                                                        null
                                                }
                                            </>
                                        :
                                            null
                        }
                        {
                            $user.role === VIEWER ?
                                <Route
                                    path     =   "/"
                                    element  =   {
                                        <ProtectedRoute
                                            permissionCheck    =    {checkPermission($user.role, FEATURE_ROOMS, 'read')}
                                            element            =    {<Navigate to={"/rooms"}/>}
                                        />
                                    }
                                />
                            :
                                null
                        }
                        {
                            $user.role === CONTENT_EDITOR ?
                                <Route
                                    path     =   "/"
                                    element  =   {
                                        <ProtectedRoute
                                            permissionCheck     =   {checkPermission($user.role, FEATURE_LIBRARY, 'read')}
                                            element             =   {<Navigate to="/library/all-resources"/>}
                                        />
                                    }
                                />
                            :
                                null
                        }

                        {
                            $user.role === ADMIN || $user.role === OWNER || $user.role === USER || $user.role === ROLE_MANAGER ?
                            <>
                                <Route path="home"      element  =   {
                                    <ProtectedRoute
                                        permissionCheck     =   {($isVendorMode || $isVendorOrg) ? false : checkPermission($user.role, FEATURE_HOME, 'read')}
                                        element             =   {<WelcomePage/>}
                                    />
                                    }
                                />
                            </>
                            :
                                null
                        }

                        {/* Links */}
                        <Route path="links"                     element =   {<Decks />} />
                        <Route path="/links/:linkId"     element =   {<DeckLayout/>}/>
                        {/* Links */}

                        <Route path="vendors"                   element =   {<VendorListLayout/>}/>

                        {/* Library */}
                        <Route
                            path    =   "library"
                            element =   {
                                <ProtectedRoute
                                    permissionCheck =   {checkPermission($user.role, FEATURE_LIBRARY, 'read')}
                                    element         =   {<LibraryLayout/>}
                                />}>
                            <Route path="/library"          element =   {<Navigate to="/library/all-resources" />} />
                            <Route path=':folderId'         element =   {<LibraryWrapper/>}/>
                        </Route>
                        {/* Library */}

                        {/* Rooms */}
                        <Route
                            path     =   "rooms"
                            element  =   {
                                <ProtectedRoute
                                    permissionCheck={checkPermission($user.role, FEATURE_ROOMS, 'read')}
                                    element={<RoomsListing />}
                                />
                            }
                        />


                        <Route path="rooms/:accountId/:roomId"          element =   {<RoomLayout />}>
                        <Route path="*" index                   element={<Navigate to="insights" />} />
                            <Route path="insights"              element={<RoomInsights/>}/>
                            <Route path="sections"              element={<RoomSettingsLayout/>}>
                                <Route path=":sectionId"        element={<CustomSectionLayout/>}/> 
                            </Route>
                            <Route path="resources"                 element={<RoomResources/>}/>
                            <Route path="executive-dashboard"       element={<RoomExecutiveDashboard/>}/>
                            <Route path="buying_committee"          element={<RoomBuyingCommittee/>}/>
                            <Route path="messages"                  element={<RoomComments/>}/>
                            <Route path="notes"                     element={<Handoff />} />
                            {
                                !($isVendorMode || $isVendorOrg) &&
                                    <Route path="collaboration" element={<RoomCollaborationViewLayout/>}>
                                        <Route path=":stageId"  element={<ActionItemsListing/>}/>
                                        <Route path="empty"     
                                            element={
                                                <Space direction="vertical" size={20} className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-background-gray cm-height100 cm-overflow-auto">
                                                    <img src={NEXT_STEPS_EMPTY} alt="No steps found"/>
                                                    <Space direction="vertical" className="cm-flex-center">
                                                        <div className="cm-font-size18 cm-font-fam500">No steps found</div>
                                                        <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                                            Add a step to view the action points
                                                        </div>
                                                    </Space>
                                                </Space>
                                            }
                                        />
                                    </Route>
                            }
                        </Route>
                        {/* Rooms */}

                        {/* Accounts */}
                        <Route
                            path    =   "accounts"
                            element =   {
                                <ProtectedRoute
                                    permissionCheck   =   {checkPermission($user.role, FEATURE_ACCOUNTS, 'read')}
                                    element           =   {<AccountsListing />}
                                />
                            }
                        />

                        <Route path="accounts/:accountId"   element =   {<AccountsLayout />}>
                            <Route index                    element =   {<AccountRooms/>}/>
                            <Route path="edit"              element =   {<AccountInfoForm/>}/>
                        </Route>
                        {/* Accounts */}

                        {/* Templates */}

                        <Route
                            path    =   'templates'
                            element =   {
                                <ProtectedRoute
                                    permissionCheck =   {checkPermission($user.role, FEATURE_TEMPLATES, 'read')}
                                    element         =   {<TemplatesListing />}
                                />
                            }
                        />
                        <Route path='templates/:roomTemplateId'         element =   {<TemplateViewLayout />} />
                        
                        {/* Templates */}

                        {
                            ($orgDetail.type === "VENDOR") ?
                                <Route path="marketplace"               element={<Marketplace_Onboarding/>}/>
                            :
                                null
                        }

                        {/* Analytics */}
                        {/* <Route path="analytics"                         element =   {<Analytics/>}/> */}

                        <Route path="analytics"                         element =   {<AnalyticsLayout/>}>
                            {
                                checkPermission($user.role, FEATURE_ACCOUNT_ANALYTICS, 'read') && !($isVendorMode || $isVendorOrg) && (!$featData?.executive_dashboard?.isRestricted)?
                                    <Route
                                        path="/analytics"
                                        element={<Navigate to={"/analytics/executive-dashboard"} />}
                                    />
                                :
                                    checkPermission($user.role, FEATURE_EXECUTIVE_ANALYTICS, 'read') && !($isVendorMode || $isVendorOrg) ?
                                        <Route
                                            path="/analytics"
                                            element={<Navigate to={"/analytics/account-overview"} />}
                                        />
                                    :
                                        checkPermission($user.role, FEATURE_CONTENT_ANALYTICS, 'read') ?

                                            <Route
                                                path        =   "/analytics"
                                                element     =   {<Navigate to={"/analytics/content-overview"}/>}
                                            />
                                        :
                                            null
                            }
                            <Route
                                path    =   "account-overview"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, FEATURE_EXECUTIVE_ANALYTICS, 'read')}
                                        element           =   {<AccountOverview />}
                                    />
                                }
                            />
                            <Route
                                path    =   "executive-dashboard"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, FEATURE_EXECUTIVE_ANALYTICS, 'read')}
                                        element           =   {<ExecutiveDashboard />}
                                    />
                                }
                            />
                            <Route
                                path    =   "content-overview"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, FEATURE_CONTENT_ANALYTICS, 'read')}
                                        element           =   {<ContentPerformanceLayout />}
                                    />
                                }
                            />
                        </Route>

                        {/* Settings */}
                        <Route path='settings'                  element =   {<SettingsLayout/>}>
                            <Route path="personal-details"      element =   {<PersonalInfo/>}/>

                            <Route
                                path    =   "users-permissions"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_TEAMS_AND_PERMISSIONS, 'read')}
                                        element           =   {<UserPermissions/>}
                                    />
                                }
                            />

                            <Route path="options" 
                                element =   {
                                    <ProtectedRoute 
                                        permissionCheck =   {checkPermission($user.role, SETTINGS_CATEGORIES, 'read')} 
                                        element         =   {<OptionsLayout/>}
                                    />
                                }
                            >
                                <Route path="/settings/options"     element =   {<Navigate to={"/settings/options/usecase-categories"}/>}/>
                                <Route path="usecase-categories"    element =   {<UsecaseCategoriesList />}/>
                                <Route path="resource-categories"   element =   {<ResourceCategoriesList />}/>
                                <Route path="regions"               element =   {<Regions />}/>
                                <Route path="room-stages"           element =   {<RoomStages />}/>
                            </Route>

                            {/* <Route
                                path    =   "options"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_CATEGORIES, 'read')}
                                        element           =   {<Options/>}
                                    />
                                }
                            /> */}

                            <Route
                                path    =   "room-settings"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, FEATURE_ROOMS, 'update')}
                                        element           =   {<RoomSettingsTransformer/>}
                                    />
                                }
                            />

                            <Route
                                path    =   "organization-details"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_ORG, 'read')}
                                        element           =   {<OrgDetails/>}
                                    />
                                }
                            />

                            <Route
                                path    =   "faqs"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_FAQ, 'read')}
                                        element           =   {<Faq/>}
                                    />
                                }
                            />

                            <Route
                                path    =   "integrations"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_INTEGRATIONS, 'read') && !($orgDetail.planDetail.isTrial && $orgDetail.planDetail.expiryInDays < 1)}
                                        element           =   {<Integrations/>}
                                    />
                                }
                            />

                            <Route
                                path    =   "branding"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_BRANDING, 'read')}
                                        element           =   {<Branding/>}
                                    />
                                }
                            />


                            {/* Top funnel */}
                            <Route path="calendar"                  element={<CalendarSettings/>}/>
                            <Route path="form_fields"               element={<FormFields/>}/>
                            <Route path="gated"                     element={<GatedSetup/>}/>
                            <Route path="non_gated"                 element={<NonGatedSetup/>}/>

                            <Route
                                path    =   "developer"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_DEVELOPER_SETTINGS, 'read')}
                                        element           =   {<WebHooks/>}
                                    />
                                }
                            />

                            <Route
                                path    =   "discovery"
                                element =   {
                                    <ProtectedRoute
                                        permissionCheck   =   {checkPermission($user.role, SETTINGS_DISCOVERY_SETTINGS, 'read') && $orgDetail.tenantName !== "kissflow"  && ($accountType !== ACCOUNT_TYPE_DSR)}
                                        element           =   {<DiscoveryQuestions/>}
                                    />
                                }
                            />

                            {
                                ($orgDetail.type === "VENDOR" || $orgDetail.type === "USER_AND_VENDOR") ?
                                    <Route path="marketplace"               element={<MarketplaceLayout/>}/>
                                :
                                    null
                            }
                            <Route path="plan-details"              element={<PlanDetails/>}/>
                        </Route>
                        {/* Settings */}

                    </Routes>
                </Suspense>
            </div>            
        </Content>
    )
}

export default AppBody