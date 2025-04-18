import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Space } from "antd";

import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_TALK_TO_US_SECTION } from "../../config/buyer-discovery-config";
import { GO_TO_DISCOVERY_ICON } from "../../../constants/module-constants";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { BuyerAgent } from "../../api/buyer-agent";

import DiscoveryQuestionDrawer from "../../layout/buyer-discovery/discovery-question-drawer";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import NoResultFound from "../../../components/no-result-found";
import Translate from "../../../components/Translate";

const BuyerNextSteps = () => {

    const params        =       useParams()

    const { $buyerData, $isDiscoveryEnabled, $orgProperties }      =   useContext<any>(BuyerGlobalContext);
    const { touchPoints, setShowInitialPopup }                              =   useContext<any>(BuyerDiscoveryContext);

    let $visitTalkToUsSection = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

    const [showDiscovery, setShowDiscovery] =   useState(false);

    let discoveryQuestionsTimeoutId: any

    useEffect(() => {

        const talkTousSectionOnLoadToBeTriggered = $visitTalkToUsSection.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_TALK_TO_US_SECTION
        );

        if(talkTousSectionOnLoadToBeTriggered.length){
            if(talkTousSectionOnLoadToBeTriggered[0].target.durationInSecs !== undefined){
                discoveryQuestionsTimeoutId =  setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   talkTousSectionOnLoadToBeTriggered[0]
                    })
                }, (talkTousSectionOnLoadToBeTriggered[0].target.durationInSecs ?? 0 ) * 1000)
            }
        }

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, []);

    let pageVisitTime = 0;

    useEffect(() => {

        let pageInterval = setInterval(() => {
            pageVisitTime += 1
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                BuyerAgent.trackSectionEvent({
                    variables: {
                        input: {
                            sectionUuid         :   params.sectionId,
                            durationSpentInSecs :   pageVisitTime
                        }
                    },
                    onCompletion: () => {
                        pageVisitTime = 0;
                        clearInterval(pageInterval);
                    },
                    errorCallBack: () => {}
                });
            }
        };

            document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            if (pageVisitTime > 0) {
                BuyerAgent.trackSectionEvent({
                    variables: {
                        input: {
                            sectionUuid         :   params.sectionId,
                            durationSpentInSecs :   pageVisitTime
                        }
                    },
                    onCompletion: () => {
                        pageVisitTime = 0;
                        clearInterval(pageInterval);
                    },
                    errorCallBack: () => {}
                });
            }

            clearInterval(pageInterval);
        };
    }, []);

    return (
        <>
            <div className="j-buyer-cm-padding-float cm-width100 cm-height100">
                <div className="j-buyer-cm-card cm-height100" style={{padding: "10px"}}>
                    { 
                        $isDiscoveryEnabled && 
                            <Space size={10} className="j-go-to-dicovery-strip cm-flex-center cm-width100 cm-margin-bottom10 cm-font-fam500">
                                <img width={25} height={25} src={GO_TO_DISCOVERY_ICON}/>
                                <Space size={4} className="cm-cursor-pointer" onClick={() => setShowDiscovery(true)}>
                                    <Translate i18nKey="common-labels.let-us-know-you"/>
                                    <MaterialSymbolsRounded font="arrow_forward" size="16" weight="500"/>
                                </Space>
                            </Space>
                    }
                    {
                        $buyerData?.calendarUrl?
                            <iframe
                                src         =   {$buyerData?.calendarUrl}
                                width       =   "100%"
                                style       =   {{height: $isDiscoveryEnabled ? "calc(100% - 50px)" : "100%"}}
                                frameBorder =   "0"
                            ></iframe>  
                        :
                            <div className="cm-width100 cm-flex-center cm-light-text cm-letter-spacing03" style={{height: $isDiscoveryEnabled ? "calc(100% - 40px)" : "100%"}}>
                                <Space direction="vertical" align="center">
                                    <NoResultFound message={<Translate i18nKey="common-empty.no-calendar-link-found"/>}/>
                                    {
                                        $orgProperties.supportEmail 
                                        ?
                                            <a href={`mailto:${$orgProperties.supportEmail}`}>Contact us</a>
                                        :
                                            null
                                    }
                                </Space>
                            </div>
                    }
                </div>
            </div>
            <DiscoveryQuestionDrawer isOpen={showDiscovery} onClose={() => setShowDiscovery(false)}/>
        </>
    )
}

export default BuyerNextSteps