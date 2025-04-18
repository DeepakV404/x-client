import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import { LinkedinFilled } from '@ant-design/icons';

import { ACME_FALLBACK_ICON, COMPANY_FALLBACK_ICON, PREVIEW_USER_ICON } from "../../../constants/module-constants";
import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_WELCOME_SECTION } from "../../config/buyer-discovery-config";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { TEMPLATE_PREVIEW } from "../../config/buyer-constants";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import BuyerResourceViewLayout from "../resource-viewer";
import Translate from "../../../components/Translate";

const { Text }  =   Typography;

const BuyerHome = () => {

    const navigate                                  =   useNavigate();
    const params                                    =   useParams()
    const { $buyerData, $customSections }           =   useContext<any>(BuyerGlobalContext);
    const { touchPoints, setShowInitialPopup }      =   useContext<any>(BuyerDiscoveryContext);

    const isLogoCentered: boolean                   =   $buyerData.properties.headerAlignment === "middle";
    const $isTalkToSalesEnabled                     =   $customSections?.some((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);
    const $talkToUs                                 =   $customSections?.find((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);
    const $isTemplatePreview                        =   $buyerData?.portalType === TEMPLATE_PREVIEW;
    const $visitWelcomeSection                      =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);
    const queryParams                               =   CommonUtil.__getQueryParams(window.location.search);

    const viewerRef: any    =   useRef();
    let discoveryQuestionsTimeoutId: any
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

    useEffect(() => {
        const welcomeSectionOnLoadToBeTriggered = $visitWelcomeSection.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_WELCOME_SECTION
        );  

        if(welcomeSectionOnLoadToBeTriggered.length){
            if(welcomeSectionOnLoadToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   welcomeSectionOnLoadToBeTriggered[0]
                    })
                }, (welcomeSectionOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }

        return () => {
            viewerRef?.current ? viewerRef?.current?.closeViewer() : null;
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [touchPoints])

    return (
        <>
            <div className="j-buyer-cm-padding">
                <div className="cm-width100  cm-flex cm-flex-direction-column cm-flex-align-center" style={{rowGap: "25px"}}>
                    <div className="j-buyer-cm-card cm-width100">
                        {
                            queryParams?.embed === 'true' ?
                                <Space className="j-buyer-banner-wrap cm-flex-center cm-margin-bottom20 cm-width100 cm-space-inherit" direction="vertical" size={30}>
                                    <div className="hover-item cm-position-relative" style={{minHeight: "50px"}}>
                                        <div style={{overflow: "hidden"}}>
                                            {$buyerData?.properties.coverImageUrl && <img src={$buyerData?.properties.coverImageUrl} className="cm-border-radius6 slide-in-top j-buyer-home-banner" alt="Cover Image" width={"100%"} style={{objectFit: "cover"}}/>}
                                        </div>
                                        <div className={`${isLogoCentered ? "cm-flex-center" : "cm-flex"} cm-position-relative j-buyer-company-logos-wrapper ${$buyerData.properties.coverImageUrl ? "has-cover" : ""}`} style={{bottom: $buyerData.properties.coverImageUrl ? "40px" : "0px", left: (isLogoCentered || !$buyerData.properties.coverImageUrl) ? "0px" : "50px"}}>
                                            <div className="j-buyer-company-logo">
                                                <img src={$buyerData.sellerAccount.logoUrl} alt={$buyerData.companyName} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${isLogoCentered ? "cm-flex-center" : "cm-flex"}`} style={{marginTop: $buyerData.properties.coverImageUrl ? "-70px" : "0px"}} >
                                        <Text className={"cm-position-relative cm-font-size28 cm-font-fam700"} ellipsis={{tooltip: $buyerData?.sellerAccount.title}}>{$buyerData?.sellerAccount.title}</Text>
                                    </div>
                                </Space>
                            :
                                <Space className="j-buyer-banner-wrap cm-flex-center cm-margin-bottom20 cm-width100 cm-space-inherit" direction="vertical" >
                                    {
                                        <div className="hover-item cm-position-relative" style={{minHeight: "50px"}}>
                                            <div style={{overflow: "hidden"}}>
                                                {$buyerData?.properties.coverImageUrl && <img src={$buyerData?.properties.coverImageUrl} className="cm-border-radius6 slide-in-top j-buyer-home-banner" alt="Cover Image" width={"100%"} style={{objectFit: "cover"}}/>}
                                            </div>
                                            <div className={`cm-position-relative ${isLogoCentered ? "cm-flex-center" : "cm-flex"} j-buyer-company-logos-wrapper ${$buyerData.properties.coverImageUrl ? "has-cover" : ""}`} style={{left: (isLogoCentered || !$buyerData.properties.coverImageUrl) ? "0px" : "50px"}}>
                                                <div className={`j-buyer-company-logo ${$isTemplatePreview ? "is-template" : ""}`}>
                                                    <img src={$isTemplatePreview ? ACME_FALLBACK_ICON : $buyerData?.logoUrl} alt={$buyerData.companyName} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= ACME_FALLBACK_ICON;}}/>
                                                </div>
                                                <div className="j-buyer-customer-company-logo" style={{position: "relative", left: "-10px"}}>
                                                    <img src={$buyerData.sellerAccount.logoUrl} alt="update_logo" className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Space>
                        }
                        {
                            queryParams?.embed !== 'true' ?
                                <div className={`${isLogoCentered ? "cm-flex-center" : "cm-flex-align-center"} cm-padding-left10 cm-padding-block10`} style={{marginTop: $buyerData?.properties.coverImageUrl ? "-40px" : "0px"}}>
                                    <Text autoFocus className="cm-font-fam700 cm-font-size28">{$isTemplatePreview ? "Acme" : $buyerData.companyName} &harr; {$buyerData.sellerAccount.title}</Text>
                                </div>
                            :   
                                null
                        }
                        {
                            $buyerData?.welcomeContent && $buyerData?.welcomeContent !== "" && $buyerData?.welcomeContent !== "<p></p>" &&
                                <div className="j-buyer-welcome-content tiptap" dangerouslySetInnerHTML={{__html: $buyerData?.welcomeContent || ""}}></div>
                        }
                    </div>
                    {
                        $buyerData?.pitchVideo && 
                            <div className="j-buyer-cm-card cm-width100">
                                <BuyerResourceViewLayout resourceViewRef={viewerRef} fileInfo={$buyerData?.pitchVideo}/>
                            </div>
                    }
                    {
                        ($buyerData.owner && $buyerData?.portalType !== TEMPLATE_PREVIEW && $buyerData?.properties.isPOCEnabled) ?
                            <Space direction="vertical" size={20} className="cm-margin-top20">
                                <div className="cm-font-size24 cm-font-fam500 cm-text-align-center">
                                    <Translate i18nKey="common-labels.point-of-contact"/>
                                </div>
                                <div className="j-buyer-team-card">
                                    <div className="j-buyer-team-profile">
                                        <img className="j-buyer-team-img" width={"100%"} height={"100%"} src={$buyerData.owner.profileUrl ? $buyerData.owner.profileUrl : PREVIEW_USER_ICON} />
                                    </div>
                                    <Space direction="vertical" className="cm-padding15 cm-flex cm-flex-space-between" style={{width: "calc(100% - 160px)", maxHeight: $buyerData?.calendarUrl && $buyerData.owner.linkedInUrl ? "230px" : "180px"}}>
                                        <Space direction="vertical" className="cm-width100" size={10}>
                                            <Text ellipsis={{tooltip: CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName)}} className="cm-font-fam600 cm-font-size18 j-team-profile-name">{CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName)}</Text>
                                            <Text ellipsis={{tooltip: $buyerData.owner.emailId}} className="cm-secondary-text j-team-profile-name">{$buyerData.owner.emailId}</Text>
                                        </Space>
                                        <Space className="cm-flex cm-flex-space-between">
                                            <div>
                                                {
                                                    $buyerData?.calendarUrl && 
                                                        <Button  type="primary" ghost size="large"  onClick={() => {$isTalkToSalesEnabled && $talkToUs.uuid  ? navigate(`/section/${$talkToUs.uuid}`) : window.open(`${$buyerData?.calendarUrl}`, "_blank");}} className="cm-font-size14">
                                                            <Translate i18nKey="step.book-meeting" />
                                                        </Button>
                                                }
                                            </div>
                                            {$buyerData.owner.linkedInUrl && <LinkedinFilled className='cm-cursor-pointer' style={{color: "#006097", fontSize: "27px", borderRadius: "6px"}} onClick={(event) => {event.stopPropagation(); window.open($buyerData.owner.linkedInUrl, "_blank")}}/>}
                                        </Space>
                                    </Space>
                                </div>
                            </Space>
                        :
                            null
                    }
                </div>
            </div> 
          
        </>
    )
}

export default BuyerHome