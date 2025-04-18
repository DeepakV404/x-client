import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button, Col, Row, Space, Typography } from "antd";

import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_NEXT_STEPS_SECTION } from "../../config/buyer-discovery-config";
import { useBuyerResourceViewer } from "../../../custom-hooks/resource-viewer-hook";
import { BUYER_JOURNEY_STAGE, STAGE_RESOURCES } from "../../api/buyers-query";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { BuyerAgent } from "../../api/buyer-agent";

import BuyerResourceViewerModal from "../resource-viewer/buyer-resource-viewer-modal";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import BuyerResourceCard from "../resources/buyer-resource-card";
import BuyerActionRequest from "./buyer-action-request";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";
import ActionPoints from "./action-points";

const { Text } = Typography;

const BuyerJourney = () => {

    const { touchPoints, setShowInitialPopup }      =   useContext<any>(BuyerDiscoveryContext);

    let $visitNextStepSection   =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

    const params: any           =   useParams();
    const navigate              =   useNavigate();
    
    let discoveryQuestionsTimeoutId: any

    const { $customSections, $buyerData }   =   useContext<any>(BuyerGlobalContext);

    const [requestForm, setRequestForm]     =   useState({
        isOpen      :   false,
        requestType :   ""
    });

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer()

    const { data: sData, loading: sLoading, error: sError }    =   useQuery(BUYER_JOURNEY_STAGE, {
        fetchPolicy: "network-only",
        variables: {
            stageUuid :  params.stepId
        }
    })

    const { data, loading, error }  =   useQuery(STAGE_RESOURCES, {
        fetchPolicy: "network-only",
        variables: {
            stageUuid :  params.stepId
        },
        onError() {
            let firstCustomsection = $customSections[0]?.uuid;
            if($customSections[0]?.type === "NEXT_STEPS"){
                // Must handle navigate to first step
                navigate("/no-match")
            }else{                
                navigate(`/section/${firstCustomsection}`)
            }
        },
    });

    useEffect(() => {
        const nextStepSectionOnLoadToBeTriggered = $visitNextStepSection.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_NEXT_STEPS_SECTION
        );

        if(nextStepSectionOnLoadToBeTriggered.length){
            if(nextStepSectionOnLoadToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   nextStepSectionOnLoadToBeTriggered[0]
                    })
                }, (nextStepSectionOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }

    }, [])

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
                            sectionUuid         :   params.stepId,
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
                            sectionUuid         :   params.stepId,
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

    if(sLoading) return <Loading/>
    if(error || sError) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-width100 cm-flex-direction-column j-buyer-cm-padding">
                <div className="j-buyer-cm-card">
                    <Space direction="vertical" className="j-buyer-ap-header cm-width100" size={15}>
                        <div className="cm-flex-space-between j-buyer-ap-header-wrapper" style={{columnGap: "10px"}}>
                            <div className="j-action-points-title-wrapper cm-flex-align-center cm-gap8">
                                <Text
                                    className   =   "cm-font-fam500 cm-font-size20 cm-margin0"
                                    ellipsis    =   {{tooltip: sData?.buyerJourneyStage?.title}}
                                    style       =   {{maxWidth: "calc(100% - 70px)"}}
                                >
                                    {sData?.buyerJourneyStage?.title}
                                </Text>
                                {
                                    sData?.buyerJourneyStage?.completedActionPoints === sData?.buyerJourneyStage?.totalActionPoints
                                    ?
                                        sData?.buyerJourneyStage?.totalActionPoints === 0
                                        ?
                                            null
                                        :
                                            <MaterialSymbolsRounded font="check_circle" className="cm-margin-right5" size="20" color="green"/>
                                    :
                                        <Text className="cm-margin-left10 cm-font-fam500 cm-font-size20" style={{minWidth: "40px"}}>({sData?.buyerJourneyStage?.completedActionPoints}/{sData?.buyerJourneyStage?.totalActionPoints})</Text>
                                }
                            </div>
                            {
                                ($buyerData.sellerAccount.tenantName !== "kissflow") &&
                                    <Space className="j-request-actions-wrapper" >
                                        <Button className="cm-flex-center cm-line-height-unset" icon={<MaterialSymbolsRounded font="file_open" size="16"/>} onClick={() => setRequestForm({isOpen: true, requestType: "resource"})}>
                                            <div className="cm-font-size12">
                                                <Translate i18nKey="step.request-resource"/>
                                            </div>
                                        </Button>
                                        <Button className="cm-flex-center cm-line-height-unset" icon={<MaterialSymbolsRounded font="video_call" size="16"/>} onClick={() => setRequestForm({isOpen: true, requestType: "meeting"})}>
                                            <div className="cm-font-size12">
                                                <Translate i18nKey="step.request-meeting"/>
                                            </div>
                                        </Button>
                                    </Space>
                            }
                        </div>
                        <div>
                            {
                                sData?.buyerJourneyStage?.description
                                ?
                                    <div className="j-buyer-stage-description ql-editor cm-quill-font" style={{paddingInline: "0px"}} dangerouslySetInnerHTML={{__html: sData.buyerJourneyStage.description || ""}}></div>
                                :
                                    null
                            }  
                        </div> 
                        {/* {
                            sData?.buyerJourneyStage.totalActionPoints > 0 &&
                                <Space className="j-buyer-map-header cm-width100 cm-flex-space-between">
                                    <div className="cm-font-fam500 cm-font-size16"><Translate i18nKey="step.action-points"/></div>
                                </Space>
                        } */}
                    </Space>
                    {
                        sData?.buyerJourneyStage.totalActionPoints > 0 &&
                            <ActionPoints/>
                    }
                </div>
                {
                    data && data.buyerStageResources.length > 0 
                    ?
                        <div className="j-buyer-journey-res-listing j-buyer-cm-card">
                            <Row gutter={[20, 20]}>
                                {
                                    loading
                                    ?
                                        <Loading/>
                                    :

                                        data.buyerStageResources.map((_resource: any) => (
                                            <Col key={_resource.uuid} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
                                                <BuyerResourceCard 
                                                    key                 =   {`${_resource.uuid}card`}
                                                    cardId              =   {_resource.uuid}
                                                    name                =   {_resource.title}
                                                    fileType            =   {_resource.type}
                                                    thumbnail           =   {_resource.content.thumbnailUrl}
                                                    createdAt           =   {_resource.createdAt}
                                                    selected            =   {false}     
                                                    onCheck             =   {() => {}}
                                                    onResourceClick     =   {(_, cardInfo) => handleResourceOnClick(cardInfo)}
                                                    resource            =   {_resource}
                                                />
                                            </Col>
                                        ))  
                                }
                            </Row>
                        </div>
                    :
                        null
                }
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
            <BuyerActionRequest
                stageId         =   {params.stepId}
                isOpen          =   {requestForm.isOpen}
                onClose         =   {() => setRequestForm({isOpen: false, requestType: ""})}     
                requestType     =   {requestForm.requestType}
            />
        </>
    )
}

export default BuyerJourney