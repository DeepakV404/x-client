import { useContext, useState } from "react";
import { Badge, Button, Card, Space } from "antd";
import { useApolloClient, useMutation } from "@apollo/client";

import { PermissionCheckers } from "../../../../../config/role-permission";
import { SETTINGS_INTEGRATIONS } from "../../../../../config/role-permission-config";
import { SALESFORCE_LOGO } from "../../../../../constants/module-constants";
import { SALESFORCE } from "../../../config/integration-type-config";
import { GlobalContext } from "../../../../../globals";
import { ERROR_CONFIG } from "../../../../../config/error-config";
import { CommonUtil } from "../../../../../utils/common-util";
import { SettingsAgent } from "../../../api/settings-agent";
import { ORG_INTEGRATIONS } from "../../../api/settings-query";
import { GLOBALS } from "../../../../../layout/api/global-query";
import { SFDC_DELETE_CONNECTION } from "../../../api/settings-mutation";

import DeleteConfirmation from "../../../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import CRMSyncModal from "../crm-settings/crm-sync-modal";

const SalesforceIntegration = (props: { isHubspotConnected: boolean, isSalesforceConnected: boolean, settings: any, isPipedriveConnected: any, setShowPurchase: any}) => {

    const { isHubspotConnected, isSalesforceConnected, settings, isPipedriveConnected, setShowPurchase }    =   props;

    const { $user, $featData } =   useContext(GlobalContext);

    const [isOpenSync, setIsOpenSync]                           =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState({
        visibility  :   false,
    })

    const $client                   =   useApolloClient();

    const [disconnectSalesforce] = useMutation(SFDC_DELETE_CONNECTION, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            setShowDeleteConfirmation({visibility: false})
        },
        refetchQueries: [ORG_INTEGRATIONS]
    });

    const triggerSalesforce = () => {
        SettingsAgent.sfdcCreateConnection({
            onCompletion: (data: any) => {

                var oauthWindow:any 	= 	window.open(data._sfdcCreateConnection, "_blank", "width=800,height=600");
                var closeTimer          =   setInterval(checkClose, 300); 

                function checkClose() {
                    if(oauthWindow.closed) {  
                        clearInterval(closeTimer);  
                        $client.refetchQueries({
                            include: [ORG_INTEGRATIONS, GLOBALS]
                        })
                    }  
                    if(String(oauthWindow.document?.documentElement?.outerHTML).includes("Callback request processed successfully"))
                    {
                        clearInterval(closeTimer);
                        oauthWindow.close();
                        $client.refetchQueries({
                            include: [ORG_INTEGRATIONS, GLOBALS]
                        })
                    }
                }
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>
            { 
                (isSalesforceConnected ?
                    <Badge.Ribbon text="Connected" color="green">
                        <Card className="j-integ-card">
                            <Space direction="vertical" size={15}>
                                <img width={100} height={100} src={SALESFORCE_LOGO}/>
                                <Space direction="vertical" size={2}>
                                    <div className="cm-font-fam500 cm-font-size18">Salesforce</div>
                                    <span className="cm-light-text cm-font-size12">Your salesforce CRM is connected to Buyerstage.</span>
                                </Space>
                                {
                                    PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "delete") &&
                                    <Space className="cm-flex-space-between">
                                        <Button type="primary" danger ghost onClick={() => setShowDeleteConfirmation({visibility: true})}>
                                            Disconnect
                                        </Button>
                                        <div className="cm-cursor-pointer" onClick={() => {setIsOpenSync(true)}}>
                                            <MaterialSymbolsRounded font="settings"/>
                                        </div>
                                    </Space>
                                }
                            </Space>
                        </Card>
                    </Badge.Ribbon>
                :
                    <Card className="j-integ-card">
                        <Space direction="vertical" size={15}>
                            <img width={100} height={100} src={SALESFORCE_LOGO}/>
                            <Space direction="vertical" size={2}>
                                <div className="cm-font-fam500 cm-font-size18">Salesforce</div>
                                <span className="cm-light-text cm-font-size12">Connect your Salesforce account with Buyerstage.</span>
                            </Space>
                            {
                                PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "create") && !isHubspotConnected && !isPipedriveConnected &&
                                    <Button type="primary" onClick={() => $featData?.crm_integrations?.isRestricted ? setShowPurchase(true) : triggerSalesforce()}>
                                        Connect
                                    </Button>
                            }
                        </Space>
                    </Card>)
            }
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => {disconnectSalesforce()}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   "Disconnect"
                body        =   "Are you sure you want to disconnect from Salesforce ?"
                okText      =   "Disconnect"
            />
            <CRMSyncModal
                isOpen      =   {isOpenSync}
                onClose     =   {() => setIsOpenSync(false)}
                crmType     =   {SALESFORCE}
                settings    =   {settings}
            />
        </>
    );
};

export default SalesforceIntegration;
