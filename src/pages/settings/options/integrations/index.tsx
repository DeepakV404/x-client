import { useContext, useState } from "react";
import { Col, Row, Space } from "antd";
import { useQuery } from "@apollo/client";

import { ORG_INTEGRATIONS } from "../../api/settings-query";
import { HUBSPOT, PIPEDRIVE, SALESFORCE, SLACK } from '../../config/integration-type-config';
import { ACCOUNT_TYPE_DPR } from "../../../../constants/module-constants";
import { GlobalContext } from "../../../../globals";

import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import SlackIntegration from "./slack-integration/slack-integration";
import Loading from "../../../../utils/loading";
import HubspotIntegration from "./hubspot-integration/hubspot-integration";
import SalesforceIntegration from "./sfdc-integration/sfdc-integration";
import PipedriveIntegration from "./pipedrive-integration/pipedrive-integration";
import HubspotSettings from "./hubspot-integration/hubspot-settings";
import UpgradeIcon from "../../../../components/upgrade-icon";
import NewPricingModal from "../../pricing/new-pricing-modal";

const Integrations = () => {

    const { $accountType, $featData }  =   useContext(GlobalContext);

    const [showPurchase, setShowPurchase]   =   useState(false);

    const { data, loading, error }  =   useQuery(ORG_INTEGRATIONS, {
        fetchPolicy: 'network-only'
    })
    
    const crmSettings             =   data?.orgIntegrations["CRM"]?.settings
    const isSalesforceConnected   =   data?.orgIntegrations["CRM"]?.serviceName === SALESFORCE ? true : false 
    const isHubspotConnected      =   data?.orgIntegrations["CRM"]?.serviceName === HUBSPOT ? true : false 
    const isPipedriveConnected    =   data?.orgIntegrations["CRM"]?.serviceName === PIPEDRIVE ? true : false 
    const isSlackConnected        =   data?.orgIntegrations["COMMUNICATIONS"]?.serviceName === SLACK ? true : false;

    const showUpgrade             =   data?.orgIntegrations["CRM"]?.status === "UPGRADE";
    
    const slackChannelName      =   data?.orgIntegrations["COMMUNICATIONS"]?.channelName
    const SlackChannelId        =   data?.orgIntegrations["COMMUNICATIONS"]?.id

    const [showSettings, setShowSettings]     =   useState<{visibility: boolean, serviceName: typeof HUBSPOT | typeof SALESFORCE | typeof PIPEDRIVE | null}>({
        visibility  :   false,
        serviceName :   null
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return(
        <>
            <div className="cm-height100 cm-overflow-auto">
                {
                    showSettings.visibility && showSettings.serviceName === HUBSPOT 
                    ? 
                        <HubspotSettings onBack={() => setShowSettings({visibility: false, serviceName: null})} settings={crmSettings}/> 
                    :
                        <>
                            <div className="cm-width100 j-setting-header"> 
                                <Space>
                                    <MaterialSymbolsRounded font='integration_instructions' size='22' color="#0065E5"/>
                                    <div className="cm-font-size16 cm-font-fam500">Integrations</div>
                                </Space>
                            </div>
                            <div className="cm-padding20 cm-overflow-auto" style={{height: "calc(100% - 50px"}}>
                                <Space className="cm-font-size16 cm-font-fam500 cm-padding-bottom10">CRM {$featData?.crm_integrations?.isRestricted ? <UpgradeIcon size={20} /> : null}</Space>
                                <Row gutter={[20, 20]}>
                                    {
                                        $accountType !== ACCOUNT_TYPE_DPR &&
                                            <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
                                                <SalesforceIntegration
                                                    setShowPurchase         =   {setShowPurchase}
                                                    isSalesforceConnected   =   {isSalesforceConnected}
                                                    isHubspotConnected      =   {isHubspotConnected}
                                                    isPipedriveConnected    =   {isPipedriveConnected}
                                                    settings                =   {crmSettings}
                                                />
                                            </Col>
                                    }
                                    <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
                                        <HubspotIntegration 
                                            setShowPurchase         =   {setShowPurchase}
                                            isSalesforceConnected   =   {isSalesforceConnected}
                                            isHubspotConnected      =   {isHubspotConnected} 
                                            isPipedriveConnected    =   {isPipedriveConnected}
                                            settings                =   {crmSettings} 
                                            setShowSettings         =   {setShowSettings}
                                            showUpgrade             =   {showUpgrade}
                                        />
                                    </Col>
                                     {
                                        $accountType !== ACCOUNT_TYPE_DPR &&
                                        <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
                                            <PipedriveIntegration
                                                setShowPurchase         =   {setShowPurchase}
                                                isSalesforceConnected   =   {isSalesforceConnected}
                                                isHubspotConnected      =   {isHubspotConnected}
                                                isPipedriveConnected    =   {isPipedriveConnected}
                                            />
                                        </Col>
                                     }
                                </Row>
                                <Space className="cm-font-size16 cm-font-fam500 cm-padding-block20">Communication {$featData?.slack_integration?.isRestricted ? <UpgradeIcon size={20} /> : null}</Space>
                                <Row>
                                    <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
                                        <SlackIntegration   
                                            setShowPurchase         =   {setShowPurchase}
                                            isSlackConnected        =   {isSlackConnected}
                                            channelName             =   {slackChannelName}
                                            channelId               =   {SlackChannelId}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </>
                }
            </div>
            <NewPricingModal
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
            {/* <SFDCIntegrationForm
                isOpen  =   {connectionForm}
                onClose =   {() => setConnectionForm(false)}
            /> */}
        </>
    );
}

export default Integrations