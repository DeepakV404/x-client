import { useContext, useState } from "react";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { Alert, Badge, Button, Card, Space, Tag, Typography } from "antd";

import { SLACK_CREATE_CONNECTION_URL, ORG_INTEGRATIONS } from "../../../api/settings-query";
import { SETTINGS_INTEGRATIONS } from "../../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { SLACK_DELETE_CONNECTION } from "../../../api/settings-mutation";
import { SLACK_LOGO } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";

import DeleteConfirmation from "../../../../../components/confirmation/delete-confirmation";
import SomethingWentWrong from "../../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import SlackModal from "./slack-modal";

const { Text } = Typography;

const SlackIntegration = (props: {isSlackConnected: boolean, channelName: string, channelId: string, setShowPurchase: any}) => {

    const { isSlackConnected, channelName, channelId, setShowPurchase } = props

    const $client   =   useApolloClient();

    const { $user, $featData } =   useContext(GlobalContext);

    const [showDeleteConfirmation, setShowDeleteConfirmation]    =   useState({
        visibility  :   false,
    })
    const [connectionForm, setConnectionForm]                    =  useState(false)

    const [triggerSlack, { data, error }] = useLazyQuery(SLACK_CREATE_CONNECTION_URL, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            connectToSlack()
        },
    });

    const [disconnectSlack] = useMutation(SLACK_DELETE_CONNECTION, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            setShowDeleteConfirmation({visibility: false})
        },
        refetchQueries: [ORG_INTEGRATIONS]
    });

    const connectToSlack = () => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 800;
        const windowHeight = 600;
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        var oauthWindow = window.open(data._slackCreateConnectionUrl, "_blank", `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
        var closeTimer  = setInterval(checkClose, 300);

        function checkClose() {
            if (oauthWindow?.closed) {
                clearInterval(closeTimer);
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS]
                });
                setConnectionForm(true)
            }
            if (String(oauthWindow?.document?.documentElement?.outerHTML).includes("Callback request processed successfully")) {
                clearInterval(closeTimer);
                oauthWindow?.close();
                $client.refetchQueries({
                    include: [ORG_INTEGRATIONS]
                });
                setConnectionForm(true)
            }
        }
    }

    return (
        <>
            {
                isSlackConnected 
                ? 
                    (
                        <Badge.Ribbon text="Connected" color="green">
                            <Card className="j-integ-card">
                                <Space direction="vertical" size={15} className="cm-width100">
                                    <img width={100} height={100} src={SLACK_LOGO}/>
                                    <Space direction="vertical">
                                        <div className="cm-font-fam500 cm-font-size18">Slack</div>
                                        {
                                            channelName ?
                                                <Space direction="vertical" size={0}>
                                                    <Text className="cm-light-text cm-font-size12">Channel</Text>
                                                    <Tag><Text style={{maxWidth: "200px"}} ellipsis={{tooltip: channelName}}>{channelName}</Text></Tag>
                                                </Space>
                                            :
                                                <Alert style={{borderRadius: "5px"}} message="Select your channel" banner type="info"/>
                                        }
                                    </Space>
                                    {
                                        PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "update") &&
                                            <Space className="cm-flex-space-between">
                                                <Button danger ghost onClick={() => {setShowDeleteConfirmation({visibility: true})}}>
                                                    Disconnect
                                                </Button>
                                                <div className="cm-cursor-pointer" onClick={() => {setConnectionForm(true)}}>
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
                                        <img width={100} height={100} src={SLACK_LOGO} />
                                        <Space direction="vertical" size={2}>
                                            <div className="cm-font-fam500 cm-font-size18">Slack</div>
                                            <span className="cm-light-text cm-font-size12">Connect your Slack account with Buyerstage.</span>
                                        </Space>
                                        {
                                            PermissionCheckers.__checkPermission($user.role, SETTINGS_INTEGRATIONS, "create") &&
                                                <Button type="primary" onClick={() => $featData?.slack_integration?.isRestricted ? setShowPurchase(true) : triggerSlack()}>
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
                onOk        =   {() => disconnectSlack()}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   "Disconnect"
                body        =   "Are you sure you want to disconnect Slack ?"
                okText      =   "Disconnect"
            />
            {
                connectionForm 
                ?
                    <SlackModal
                        isOpen          =   {connectionForm}
                        onClose         =   {() => setConnectionForm(false)}
                        channelId       =   {channelId}
                    /> 
                : 
                    null
            }
        </>
    )
}

export default SlackIntegration