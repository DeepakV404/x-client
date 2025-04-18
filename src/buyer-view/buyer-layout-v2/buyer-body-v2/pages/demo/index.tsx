import { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Anchor, Dropdown, Space, Typography } from "antd";
import { useParams } from "react-router-dom";
import { BuyerGlobalContext } from "../../../../../buyer-globals";
import Translate from "../../../../../components/Translate";
import { BuyerAgent } from "../../../../api/buyer-agent";
import { BUYER_USECASE } from "../../../../api/buyers-query";
import { BuyerDiscoveryContext } from "../../../../context/buyer-discovery-globals";
import { TOUCH_POINT_TYPE_DEMO, TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_DEMO_SECTION, WHEN_ON_USECASE_PICK } from "../../../../config/buyer-discovery-config";
import DemoViewerV2 from "./demo-viewer";
import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography;

const BuyerDemoV2 = () => {

    const { $buyerUsecases, $isMobile }    =   useContext(BuyerGlobalContext);

    let allUsecases             =   $buyerUsecases;
    let filteredUsecases        =   $buyerUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).map((_usecase: any) => _usecase)

    const params                =   useParams();

    let filteredUsecaseLength   =   allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).map((_usecase: any) => ({ title: <Text className="bn-anchor-text cm-font-size13" ellipsis={{tooltip: _usecase.title}}>{_usecase.title}</Text>, target: _usecase.title, key: _usecase.uuid, href: _usecase.uuid}))
    
    const { touchPoints, setShowInitialPopup }              =   useContext<any>(BuyerDiscoveryContext);
    
    const [currentUsecase, setCurrentUsecase]               =   useState<any>();
    const [activeSection, setActiveSection]                 =   useState(filteredUsecaseLength[0]?.href);

    let $demoTouchPoints                                    =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_DEMO);
    let $demoSectionTouchPoints                             =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);
    
    let discoveryQuestionsTimeoutId: any

    const [_getUsecaseData, { data, loading }]              =   useLazyQuery(BUYER_USECASE, {
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(currentUsecase){
            _getUsecaseData({
                variables: {
                    usecaseUuid :   currentUsecase.uuid
                }
            })
            setActiveSection(currentUsecase)
        }
    }, [currentUsecase]);

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
        const demoSectionOnLoadToBeTriggered = $demoSectionTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_DEMO_SECTION
        );  

        if(demoSectionOnLoadToBeTriggered.length){
            if(demoSectionOnLoadToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   demoSectionOnLoadToBeTriggered[0]
                    })
                }, (demoSectionOnLoadToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [touchPoints])


    useEffect(() => {
        let selectorUsecases = allUsecases.filter((_usecase: any) => (_usecase.hasVideo || _usecase.hasWalkthrough) && !_usecase.hasWatched)
        let otherUsecases = allUsecases.filter((_usecase: any) => (_usecase.hasVideo || _usecase.hasWalkthrough))
        setCurrentUsecase(
            selectorUsecases.length > 0 ? 
                selectorUsecases[0]
            : 
                otherUsecases.length > 0 ?
                    otherUsecases[0]
                :   
                    undefined
        )

        if(selectorUsecases.length){
            const demoPickToBeTriggered = $demoTouchPoints.filter(
                (_demoPickTouchPoint: any) =>
                    _demoPickTouchPoint.target.when === WHEN_ON_USECASE_PICK &&
                    _demoPickTouchPoint.target.entityUuid === selectorUsecases[0].uuid
            );

            if(demoPickToBeTriggered.length){
                if(demoPickToBeTriggered[0].target.durationInSecs !== undefined){
                    discoveryQuestionsTimeoutId = setTimeout(() => {
                        setShowInitialPopup({
                            visibility      :   true,
                            touchpointData  :   demoPickToBeTriggered[0]
                        })
                    }, (demoPickToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
                }
            }
        }

        return () => {
            clearTimeout(discoveryQuestionsTimeoutId);
        }
    }, [])

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLElement>,
        link: { title: React.ReactNode; href: string}
    ) => {
        e.preventDefault();
        setActiveSection(link.href)
        setCurrentUsecase(filteredUsecases.filter((item : any) => item.uuid === link.href)[0])
        const targetElement = document.getElementById(link.href);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div className="bn-section-body-wrapper" style={{minHeight: "calc(100vh - 410px)"}}>
            <Anchor
                affix={true}
                rootClassName="bn-stickey-anchor-wrapper"
                className="bn-stickey-anchor-wrapper"
                onClick={handleAnchorClick}
                getCurrentAnchor={() => `${activeSection}`}
                style={{
                    fontSize: "16px"
                }}
                items={filteredUsecaseLength}
            />
            <div className="bn-section-container cm-width100 cm-flex cm-flex-direction-column cm-flex-align-center" style={{rowGap: "25px"}}>
                {
                    $isMobile &&
                        allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).length > 0 &&
                            <Dropdown
                                placement           =   "bottom"
                                overlayClassName    =   "bn-mobile-tabs"
                                trigger     =   {["click"]}
                                menu        =   {{
                                    items: allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).map((_demo: any) => {
                                        return {
                                            label: _demo.title,
                                            key: _demo.uuid,
                                            onClick: (key: any) => {
                                                if(activeSection.uuid !== key.key) {
                                                    setActiveSection(key.key)
                                                    setCurrentUsecase(filteredUsecases.filter((item : any) => item.uuid === key.key)[0])
                                                }
                                            }
                                        };
                                    }),
                                    selectedKeys: [currentUsecase?.uuid]
                                }}
                            >
                                <Space className="cm-flex-space-between cm-cursor bn-mobile-tabs-dropdown cm-width100" style={{padding: "10px 20px", background: "#fff", borderRadius: "4px", border: "1px solid #efefefe"}}>
                                    <Space size={4} className="cm-font-fam500 cm-font-size14">{activeSection?.title || ""}</Space>
                                    <MaterialSymbolsRounded font="keyboard_arrow_down"/>
                                </Space>
                            </Dropdown>
                }
                {
                    data && (data.buyerUsecase?.video || data.buyerUsecase?.walkthrough)
                    ?
                        <DemoViewerV2 data={data} loading={loading}/>
                    :
                        !loading && <div style={{minHeight: "250px"}} className="cm-flex-center cm-font-opacity-black-65 cm-font-size13 cm-letter-spacing03 cm-text-align-center"><Translate i18nKey={"common-empty.demo-no-video-and-tour.message"}/></div>
                }
            </div>
        </div> 
    )
}

export default BuyerDemoV2