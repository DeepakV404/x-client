import { useContext, useEffect, useRef, useState } from "react";
import { useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import { List, Select, Space, Tag, Tooltip, Typography } from "antd";
import { toLower } from "lodash";

import { TOUCH_POINT_TYPE_DEMO, TOUCH_POINT_TYPE_GENERAL, WHEN_ON_USECASE_PICK, WHEN_ON_VISIT_DEMO_SECTION } from "../../config/buyer-discovery-config";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { BUYER_USECASE, P_USECASE_CATEGORIES } from "../../api/buyers-query";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { BuyerAgent } from "../../api/buyer-agent";
import { useParams } from "react-router-dom";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";
import DemoViewer from "./demo-viewer";

const { Text } = Typography;

const BuyerDemo = () => {

    const { $buyerUsecases }    =   useContext(BuyerGlobalContext);
    let allUsecases             =   $buyerUsecases;

    const $client               =   useApolloClient();
    const { translate }         =   useLocalization();
    const params                =   useParams();

    const { touchPoints, setShowInitialPopup }              =   useContext<any>(BuyerDiscoveryContext);

    const [currentUsecase, setCurrentUsecase]               =   useState<any>();
    const [selectedUsecaseGroup, setSelectedUsecaseGroup]   =   useState<any>("all");
    const [open, setOpen]                                   =   useState<boolean>(false);

    let $demoTouchPoints            =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_DEMO);
    let $demoSectionTouchPoints     =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);

    const selectRef                                         =   useRef<any>(null);
    let discoveryQuestionsTimeoutId: any

    const { data: ucData, loading: ucLoading, error: ucError }  =   useQuery(P_USECASE_CATEGORIES, {
        fetchPolicy: "network-only"
    })
   
    const handleOpenChange = (newOpen: boolean) => {
        refetchBuyerUsecases()
        setOpen(newOpen);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                setOpen((prevOpen) => !prevOpen);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [_getUsecaseData, { data, loading }]   =   useLazyQuery(BUYER_USECASE, {
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(currentUsecase){
            _getUsecaseData({
                variables: {
                    usecaseUuid :   currentUsecase.uuid
                }
            })
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

    const handleUsecaseGroupClick = (group: any) => {
        setSelectedUsecaseGroup(group.uuid)
    }

    const handleListSelect = (usecase: any) => {

        if (selectRef.current) {
            selectRef.current.blur();
        }
        const demoPickToBeTriggered = $demoTouchPoints.filter(
            (_demoPickTouchPoint: any) =>
                _demoPickTouchPoint.target.when === WHEN_ON_USECASE_PICK &&
                _demoPickTouchPoint.target.entityUuid === usecase.uuid
        );

        if(demoPickToBeTriggered.length){
            if(demoPickToBeTriggered[0].target.durationInSecs !== undefined) {
                discoveryQuestionsTimeoutId = setTimeout(() => {
                    setShowInitialPopup({
                        visibility      :   true,
                        touchpointData  :   demoPickToBeTriggered[0]
                    })
                }, (demoPickToBeTriggered[0].target.durationInSecs ?? 0) * 1000)
            }
        }

        setCurrentUsecase(usecase)
        refetchBuyerUsecases()
        setOpen(false)

    }

    if(ucLoading) return <Loading/>
    if(ucError) return <SomethingWentWrong/>

    const UsecaseContent = () => {
        return (
            <Space direction='vertical' className='cm-width100'>
                <div className="cm-width100 cm-padding10 j-buyer-usecase-selector-header">
                    <div className='cm-font-fam500'><Translate i18nKey={"common-labels.category"}/></div>
                    <div className="j-usecases-category-listing">
                        <div key={"all"} onClick={() => setSelectedUsecaseGroup("all")} className={`j-buyer-usecase-group cm-cursor-pointer ${selectedUsecaseGroup === "all" ? "selected" : "cm-secondary-text"}`}><Translate i18nKey={"common-labels.all"}/></div>
                        {
                            ucData._pUsecaseCategories.filter((_category: any )=> _category.usecasesCount > 0).map((_category: any) => (
                              <div
                                key={_category.uuid}
                                onClick={() => handleUsecaseGroupClick(_category)}
                                className={`j-buyer-usecase-group cm-cursor-pointer ${
                                    selectedUsecaseGroup === _category.uuid ? "selected" : "cm-secondary-text"
                                }`}
                              >
                                {_category.name}
                              </div>
                            ))
                        }
                    </div>
                </div>

                <List
                    itemLayout  =   "horizontal"
                    className   =   'j-buyer-list-usecase-list'
                    dataSource  =   {selectedUsecaseGroup === "all" ? allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo) : $buyerUsecases.filter((_usecase: any) => _usecase.categories.some((category: any) => category.uuid === selectedUsecaseGroup)).filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo)}
                    renderItem  =   {(_usecase: any) => (
                        <List.Item key={_usecase.uuid} className={`j-buyer-usecase-list-item ${currentUsecase?.uuid === _usecase.uuid ? "selected" : ""}`} onClick={() => handleListSelect(_usecase)}>
                            <div className={'cm-flex-space-between cm-width100 cm-cursor-pointer'} style={{columnGap: "10px"}}>
                                <Space direction='vertical' size={4} style={{width: "calc(100% - 100px)"}}>
                                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: _usecase.title}}>{_usecase.title}</Text>
                                    {_usecase.description &&
                                        <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: _usecase.description}} className='cm-font-size11 cm-light-text'>{_usecase.description}</Text>
                                    }
                                </Space>
                                <Space>
                                    {
                                        _usecase.hasWatched ?    
                                            <Tag icon={<MaterialSymbolsRounded font="check_circle" size="15" className="cm-margin-right5"/>} color="success" className="cm-flex-center">
                                                <Translate i18nKey="common-labels.watched"/>
                                            </Tag>
                                        :
                                            <Tag color="orange">
                                                Watch now
                                            </Tag>
                                    }
                                    {/* <MaterialSymbolsRounded font="smart_display" size="19" color={_usecase.hasVideo ? "#DF2222" : "#DF222252"}/>
                                    <MaterialSymbolsRounded font="tour" size="19" color={_usecase.hasWalkthrough ? "#3176CD" : "#3176CD52"}/> */}
                                </Space>
                            </div>
                        </List.Item>
                    )}
                    locale      =   {{emptyText: <Translate i18nKey={"common-empty.no-usecase-found"}/>}}
                />
            </Space>
        )
    }

    let filteredUsecaseLength = allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).length;

    const refetchBuyerUsecases = () => {
        $client.refetchQueries({include: ["BuyerGlobals"]})
    }

    return (
        <div className="cm-height100">
            <div className="j-buyer-demo-header cm-width100 cm-flex-center cm-flex-direction-column" style={{rowGap: "10px"}}>
                <Space size={10}>
                    <Space size={4}>
                        {
                            allUsecases.map((_usecase: any) => (_usecase.hasWalkthrough || _usecase.hasVideo) ? 
                                <Tooltip placement="bottom" title={_usecase.title}>
                                    <div className="cm-cursor-pointer j-buyer-usecase-progress-bar" style={{backgroundColor: _usecase.uuid === currentUsecase?.uuid ? "#F48125" : (_usecase.hasWatched ? "#00B23D" : "#F0F2F5")}} onClick={() => {refetchBuyerUsecases(); setCurrentUsecase(_usecase)}}></div>
                                </Tooltip> 
                                : null
                            )
                        }
                    </Space>
                    {filteredUsecaseLength > 0 ? <div className="cm-secondary-text cm-font-size12">{allUsecases.filter((_usecase: any) => _usecase.hasWatched).length}/{filteredUsecaseLength} {toLower(translate("common-labels.watched"))}</div> : null}
                </Space>
                <div className="cm-width100 cm-flex-justify-center">
                    <div className="j-buyer-demo-title cm-flex-center cm-font-fam500 cm-secondary-text" style={{background: "#F0F2F5"}}><Translate i18nKey={"common-labels.usecase"}/></div>
                    <Select ref={selectRef} style={{maxWidth: "calc(100% - 300px)"}} value={currentUsecase?.uuid} open={open} className="j-buyer-usecase-select cm-width100" suffixIcon={<MaterialSymbolsRounded font="expand_more" color="#5C5A7C"/>} popupClassName="j-buyer-usecase-popup" placeholder={translate("common-placeholder.usecase-selection")} dropdownRender={() => <UsecaseContent />} onClick={(event: any) => event.stopPropagation()} optionLabelProp="label" onDropdownVisibleChange={handleOpenChange}
                        options={allUsecases.filter((_usecase: any) => _usecase.hasWalkthrough || _usecase.hasVideo).map((_usecase: any) => ({ label: _usecase.title, value: _usecase.uuid }))}
                      ></Select>
                </div>
            </div>
            <div className="j-buyer-demo-wrapper">
                {
                    loading 
                    ? 
                        <Loading/>
                    :
                        (
                            data && (data.buyerUsecase?.video || data.buyerUsecase?.walkthrough) 
                            ?
                                <DemoViewer data={data} />
                            :
                                <div className="cm-height100 cm-flex-center cm-light-text cm-font-size16 cm-letter-spacing03 cm-text-align-center"><Translate i18nKey={"common-empty.demo-no-video-and-tour.message"}/></div>
                        )
                }
            </div>
        </div>
    )
}

export default BuyerDemo