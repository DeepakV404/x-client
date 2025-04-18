import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Anchor, Button, Space, Typography } from "antd";
import { LinkedinFilled } from '@ant-design/icons';
import { BuyerGlobalContext } from "../../../../../buyer-globals";
import { BuyerDiscoveryContext } from "../../../../context/buyer-discovery-globals";
import { TEMPLATE_PREVIEW } from "../../../../config/buyer-constants";
import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_WELCOME_SECTION } from "../../../../config/buyer-discovery-config";
import { CommonUtil } from "../../../../../utils/common-util";
import { BuyerAgent } from "../../../../api/buyer-agent";
import { PREVIEW_USER_ICON } from "../../../../../constants/module-constants";
import BuyerResourceViewLayout from "../../../../pages/resource-viewer";
import Translate from "../../../../../components/Translate";

const { Text }  =   Typography;

const BuyerHomeV2 = () => {

    const navigate                                  =   useNavigate();
    const params                                    =   useParams()
    const { $buyerData, $customSections }           =   useContext<any>(BuyerGlobalContext);
    const { touchPoints, setShowInitialPopup }      =   useContext<any>(BuyerDiscoveryContext);

    const [activeSection, setActiveSection]         =   useState("overview");

    const $isTalkToSalesEnabled                     =   $customSections?.some((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);
    const $talkToUs                                 =   $customSections?.find((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);
    const $visitWelcomeSection                      =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

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

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLElement>,
        link: { title: React.ReactNode; href: string }
    ) => {
        e.preventDefault();
      
        setActiveSection(link.href)
        const targetElement = document.getElementById(link.href);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        const sections = ["overview", "introduction", "team"];
        const observerOptions = { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    break;
                }
            }
        }, observerOptions);

        sections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);
      

    return (
        <>
            <div className="bn-section-body-wrapper">
                <Anchor
                    affix={true}
                    rootClassName="bn-stickey-anchor-wrapper"
                    className="bn-stickey-anchor-wrapper"
                    onClick={handleAnchorClick}
                    getCurrentAnchor={() => `${activeSection}`}
                    style={{
                        fontSize: "16px"
                    }}
                    items={[
                        $buyerData?.welcomeContent &&
                        {
                            key: 'overview',
                            href: 'overview',
                            title: <Text className="cm-font-size13" style={{margin: "0px"}} ellipsis={{tooltip: "Overview"}}>Overview</Text>,
                            target: "overview"
                        },
                        $buyerData?.pitchVideo && {
                            key: 'introduction',
                            href: 'introduction',
                            title: <Text className="cm-font-size13" style={{margin: "0px"}} ellipsis={{tooltip: "Overview"}} >Introduction</Text>,
                            target: "introduction"
                        },
                        {
                            key: 'team',
                            href: 'team',
                            title: <Text className="cm-font-size13" style={{margin: "0px"}} ellipsis={{tooltip: "Overview"}} >Team</Text>,
                            target: "team"
                        },
                    ].filter(Boolean)}
                />
                <div className="bn-section-container cm-width100 cm-flex cm-flex-direction-column cm-flex-align-center" style={{rowGap: "25px"}}>
                    {
                        $buyerData?.welcomeContent && $buyerData?.welcomeContent !== "" && $buyerData?.welcomeContent !== "<p></p>" &&
                            <div className="j-buyer-cm-card cm-width100" id="overview">
                                <div className="j-buyer-welcome-content tiptap" dangerouslySetInnerHTML={{__html: $buyerData?.welcomeContent || ""}}></div>
                            </div>
                    }
                    {
                        $buyerData?.pitchVideo && 
                            <div className="j-buyer-cm-card cm-width100" id="introduction">
                                <BuyerResourceViewLayout resourceViewRef={viewerRef} fileInfo={$buyerData?.pitchVideo}/>
                            </div>
                    }
                    {
                        ($buyerData.owner && $buyerData?.portalType !== TEMPLATE_PREVIEW && $buyerData?.properties.isPOCEnabled) ?
                            <Space direction="vertical" size={20} className="cm-margin-top20" id="team">
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

export default BuyerHomeV2