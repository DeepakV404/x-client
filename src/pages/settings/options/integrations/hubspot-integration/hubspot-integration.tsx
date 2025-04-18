import { useContext, useState } from "react";
import { Badge, Button, Card, Space } from "antd";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";

import { HS_CREATE_CONNECTION_URL, ORG_INTEGRATIONS } from "../../../api/settings-query";
import { SETTINGS_INTEGRATIONS } from "../../../../../config/role-permission-config";
import { HUBSPOT_LOGO_NEW } from "../../../../../constants/module-constants";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { HS_DELETE_CONNECTION } from "../../../api/settings-mutation";
import { HUBSPOT } from "../../../config/integration-type-config";
import { GLOBALS } from "../../../../../layout/api/global-query";
import { GlobalContext } from "../../../../../globals";

import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import CRMDisconnectModal from "../crm-settings/crm-disconnect-modal";

const HubspotIntegration = (props: { isHubspotConnected: boolean, isSalesforceConnected: boolean, isPipedriveConnected: boolean, settings: any, setShowSettings: any, showUpgrade: boolean, setShowPurchase: any }) => {

    const { isHubspotConnected, isSalesforceConnected, isPipedriveConnected,  setShowSettings, showUpgrade, setShowPurchase }    =   props;

    const { $user, $featData } =   useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation]       =   useState<boolean>(false)

    const $client   =   useApolloClient();

    const [triggerHubspot, { data, error }] = useLazyQuery(HS_CREATE_CONNECTION_URL, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            connectToHubspot()
        },
    });

    const [disconnectHubspot] = useMutation(HS_DELETE_CONNECTION, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            setShowDeleteConfirmation(false)
        },
        refetchQueries: [ORG_INTEGRATIONS]
    });

    const connectToHubspot = () => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 800;
        const windowHeight = 600;
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        var oauthWindow = window.open(data._hsCreateConnectionUrl, "_blank", `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
        var closeTimer = setInterval(checkClose, 300);

        function checkClose() {
            if (oauthWindow?.closed) {
                clearInterval(closeTimer);
                setShowSettings({visibility: true, serviceName: HUBSPOT})
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS, GLOBALS]
                });
            }
            if (String(oauthWindow?.document?.documentElement?.outerHTML).includes("Callback request processed successfully")) {
                clearInterval(closeTimer);
                oauthWindow?.close();
                setShowSettings({visibility: true, serviceName: HUBSPOT})
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS, GLOBALS]
                });
            }
        }
    }

    return (
        <>
            {
                isHubspotConnected 
                ? 
                    (
                        <Badge.Ribbon text="Connected" color="green">
                            <Card className="j-integ-card">
                                <Space direction="vertical" size={15}>
                                    <div style={{height: "80px"}}>
                                        <img width={80} height={80} src={HUBSPOT_LOGO_NEW} />
                                    </div>
                                    <Space direction="vertical" size={2} style={{marginTop: "25px"}}>
                                        <div className="cm-font-fam500 cm-font-size18">HubSpot</div>
                                        <span className="cm-light-text cm-font-size12">Your HubSpot CRM is connected to Buyerstage.</span>
                                    </Space>
                                    {
                                        PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "delete") &&
                                        <Space className="cm-flex-space-between">
                                            {
                                                showUpgrade ?
                                                    <Button style={{border: "1px solid #ff7959", color: "#ff7959"}} type="primary" ghost onClick={() => triggerHubspot()}>
                                                        Reconnect
                                                    </Button>
                                                :
                                                    <Button type="primary" danger onClick={() => {setShowDeleteConfirmation(true)}} style={{background: "#DF2222"}}>
                                                        Disconnect
                                                    </Button>
                                            }
                                            <div className="cm-cursor-pointer" onClick={() => {setShowSettings({visibility: true, serviceName: HUBSPOT})}}>
                                                <MaterialSymbolsRounded font="settings"/>
                                            </div>
                                        </Space>
                                    }
                                </Space>
                            </Card>
                        </Badge.Ribbon>
                    ) 
                : 
                    (
                        <Card className="j-integ-card">
                            {
                                error  
                                ? 
                                    <SomethingWentWrong/> 
                                :
                                    <Space direction="vertical" size={15}>
                                        <div style={{height: "80px"}}>
                                            <img width={80} height={80} src={HUBSPOT_LOGO_NEW} />
                                        </div>
                                        <Space direction="vertical" size={2} style={{marginTop: "25px"}}>
                                            <div className="cm-font-fam500 cm-font-size18">HubSpot</div>
                                            <span className="cm-light-text cm-font-size12">Connect your HubSpot account with Buyerstage.</span>
                                        </Space>
                                        {
                                            PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "create") && !isSalesforceConnected && !isPipedriveConnected &&
                                                <Button type="primary" onClick={() => $featData?.crm_integrations?.isRestricted ? setShowPurchase(true) : triggerHubspot()}>
                                                    Connect
                                                </Button>
                                        }
                                    </Space>
                            }
                        </Card>
                    )
            }
            <CRMDisconnectModal
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {disconnectHubspot()}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   "Disconnect"
                body        =   "Are you sure you want to disconnect HubSpot ?"
                okText      =   "Disconnect"
            />
        </>
    );
};

export default HubspotIntegration;
