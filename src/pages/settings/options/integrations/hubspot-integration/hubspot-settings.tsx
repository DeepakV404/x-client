import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Space, Tabs } from "antd";

import { BUYERSTAGE_PRODUCT_LOGO, HUBSPOT_LOGO_NEW } from "../../../../../constants/module-constants";
import { SETTINGS_INTEGRATIONS } from "../../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { HS_DELETE_CONNECTION } from "../../../api/settings-mutation";
import { ORG_INTEGRATIONS } from "../../../api/settings-query";
import { GlobalContext } from "../../../../../globals";

import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import HubspotMapping from "./hubspot-mapping";
import HsSyncOptions from "./hubspot-options";
import CRMDisconnectModal from "../crm-settings/crm-disconnect-modal";

const { TabPane }   =   Tabs;

interface HubspotSettingsProps{
    onBack              :   () => void;
    settings            :   any;
}

const HubspotSettings = (props: HubspotSettingsProps) => {
    
    const { settings, onBack }    =   props; 

    const { $user, $isVendorMode, $isVendorOrg }     =   useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState<boolean>(false)

    const [currentView, setCurrentView] =   useState<string>("sync_config");

    const [disconnectHubspot] = useMutation(HS_DELETE_CONNECTION, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            setShowDeleteConfirmation(false)
            onBack()
        },
        refetchQueries: [ORG_INTEGRATIONS]
    });

    const settingsTabs = [
        {
            label   :   "Sync Config",
            value   :   'sync_config',
        },
        !($isVendorMode || $isVendorOrg) ?{
            label   :   "Mapping",
            value   :   'mapping',
        } : null,
    ].filter(Boolean);

    const handleSegmentChange = (key: string) => {
        setCurrentView(key)
    }

    return (
        <>
            <div>
                <div className="cm-width100 j-setting-header cm-flex-space-between"> 
                    <Space>
                        <MaterialSymbolsRounded font='arrow_back' size='22' className="cm-cursor-pointer" onClick={onBack}/>
                        <Space>
                            <Space className='cm-flex-center'>
                                <div style={{background: "#f2f1f3"}} className='j-integration-icon-wrap'><img style={{width: "25px"}} src={BUYERSTAGE_PRODUCT_LOGO}/></div>
                                <div style={{background: "#f2f1f3", marginLeft: "-15px"}} className='j-integration-icon-wrap'><img style={{width: "20px"}} src={HUBSPOT_LOGO_NEW}/></div>
                            </Space>
                            <div className="cm-font-size16 cm-font-fam500">Hubspot</div>
                        </Space>
                    </Space>
                    <Space size={20} className="cm-flex-center">
                        <Space style={{color: "#3EB200"}} size={4} className="cm-flex-center">
                            <MaterialSymbolsRounded font="task_alt" size="18"/>
                            Connected
                        </Space>
                        {
                            PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "delete") &&
                                <Button type="primary" danger onClick={() => {setShowDeleteConfirmation(true)}} style={{background: "#DF2222"}}>
                                    Disconnect
                                </Button>
                        }
                    </Space>
                </div>
                <Tabs className="j-integration-settings-tabs" onChange={handleSegmentChange} activeKey={currentView}>
                    {settingsTabs.map((tab: any) => (
                        <TabPane tab={tab.label} key={tab.value}/>
                    ))}
                </Tabs>
                {
                    currentView === "mapping" ?
                        <HubspotMapping/>
                    :
                        <HsSyncOptions settings={settings}/>
                }
            </div>
            <CRMDisconnectModal
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {disconnectHubspot()}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   "Disconnect"
                body        =   "Are you sure you want to disconnect HubSpot ?"
                okText      =   "Disconnect"
            />
        </>
    )
}

export default HubspotSettings