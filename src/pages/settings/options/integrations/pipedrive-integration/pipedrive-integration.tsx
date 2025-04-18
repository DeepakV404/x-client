import { useContext, useState } from "react";
import { Badge, Button, Card, Space } from "antd";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";

import { PermissionCheckers } from "../../../../../config/role-permission";
import { SETTINGS_INTEGRATIONS } from "../../../../../config/role-permission-config";
import { PIPEDRIVE_LOGO } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";
import { DELETE_CONNECTION } from "../../../api/settings-mutation";
import { GET_CONNECTION_URL, ORG_INTEGRATIONS } from "../../../api/settings-query";
import { PIPEDRIVE } from "../../../config/integration-type-config";
import { GLOBALS } from "../../../../../layout/api/global-query";

import DeleteConfirmation from "../../../../../components/confirmation/delete-confirmation";
import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";


const PipedriveIntegration = (props: { isHubspotConnected: boolean, isSalesforceConnected: boolean, isPipedriveConnected: boolean, setShowPurchase: any }) => {

    const { isHubspotConnected, isSalesforceConnected, isPipedriveConnected, setShowPurchase }    =   props;

    const { $user, $featData } =   useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })

    const $client                   =   useApolloClient();

    const [triggerPipedrive, { data, error }] = useLazyQuery(GET_CONNECTION_URL, {
        fetchPolicy: "network-only",
        variables   :  {
            type    :   PIPEDRIVE
        },
        onCompleted  : () => {
            connectToPipedrive()
        },
    });

    const [disconnectPipedrive] = useMutation(DELETE_CONNECTION, {
        fetchPolicy: "network-only",
        variables   :  {
            type    :   PIPEDRIVE
        },
        onCompleted: () => {
            setShowDeleteConfirmation({visibility: false})
        },
        refetchQueries: [ORG_INTEGRATIONS]
    });

    const connectToPipedrive = () => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 800;
        const windowHeight = 600;
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        var oauthWindow = window.open(data.getConnectionUrl, "_blank", `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
        var closeTimer = setInterval(checkClose, 300);

        function checkClose() {
            if (oauthWindow?.closed) {
                clearInterval(closeTimer);
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS, GLOBALS]
                });
            }
            if (String(oauthWindow?.document?.documentElement?.outerHTML).includes("Callback request processed successfully")) {
                clearInterval(closeTimer);
                oauthWindow?.close();
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS, GLOBALS]
                });
            }
        }
    }

    return (
        <div>
            {
                isPipedriveConnected 
                ? 
                    (
                        <Badge.Ribbon text="Connected" color="green">
                            <Card className="j-integ-card">
                                <Space direction="vertical" size={25}>
                                    <img width={80} height={80} src={PIPEDRIVE_LOGO} className="cm-flex-center"/>
                                    <Space direction="vertical" size={2}>
                                        <div className="cm-font-fam500 cm-font-size18 cm-padding-top10">Pipedrive</div>
                                        <span className="cm-light-text cm-font-size12">Your Pipedrive CRM is connected to Buyerstage.</span>
                                    </Space>
                                    {
                                        PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "delete") &&
                                            <Button type="primary" danger ghost onClick={() => {setShowDeleteConfirmation({visibility: true})}}>
                                                Disconnect
                                            </Button>
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
                                    <Space direction="vertical" size={25}>
                                        <img width={80} height={80} src={PIPEDRIVE_LOGO} />
                                        <Space direction="vertical" size={2}>
                                            <div className="cm-font-fam500 cm-font-size18">Pipedrive</div>
                                            <span className="cm-light-text cm-font-size12">Connect your Pipedrive account with Buyerstage.</span>
                                        </Space>
                                        {
                                            PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "create") && !isSalesforceConnected && !isHubspotConnected &&
                                                <Button type="primary" onClick={() => $featData?.crm_integrations?.isRestricted ? setShowPurchase(true) : triggerPipedrive()}>
                                                    Connect
                                                </Button>
                                        }
                                    </Space>
                            }
                        </Card>
                    )
            }
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => {disconnectPipedrive()}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   "Disconnect"
                body        =   "Are you sure you want to disconnect from Pipedrive ?"
                okText      =   "Disconnect"
            />
        </div>
    );
};

export default PipedriveIntegration;
