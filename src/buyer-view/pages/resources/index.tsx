import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Col, Divider, Input, Row, Typography } from "antd";

import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_VISIT_RESOURCES_SECTION } from "../../config/buyer-discovery-config";
import { useBuyerResourceViewer } from "../../../custom-hooks/resource-viewer-hook";
import { Length_Input, RESOURCE_COUNT } from "../../../constants/module-constants";
import { BuyerDiscoveryContext } from "../../context/buyer-discovery-globals";
import { BUYER_RESOURCE, BUYER_RESOURCES } from "../../api/buyers-query";
import { BuyerAgent } from "../../api/buyer-agent";

import BuyerResourceViewerModal from "../resource-viewer/buyer-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import BuyerResourceCard from "./buyer-resource-card";
import Translate from "../../../components/Translate";
import Loading from "../../../utils/loading";

const { Text } = Typography

const BuyerResources = () => {

    const url = new URL(window.location.href);

    const { data: resourceData } = useQuery(BUYER_RESOURCE, {
        fetchPolicy: "network-only",
        variables: {
            resourceUuid: url.searchParams.get("resourceid")
        },
        skip: !url.searchParams.get("resourceid")
    });    

    useEffect(() => {  
        if(resourceData) {
            handleResourceOnClick(resourceData?.buyerResource)
        }    
    }, [resourceData])
    
    const { translate }                                 =   useLocalization();

    const params                                        =   useParams();
    
    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();
    
    const [_getResources, { data, loading }]            =   useLazyQuery(BUYER_RESOURCES, {fetchPolicy: "network-only"});
    
    const { touchPoints, setShowInitialPopup }          =   useContext<any>(BuyerDiscoveryContext);
    
    let $resourceTouchPoints                            =   touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL);
    
    const [filter, setFilter]                           =   useState<any>({});
    const [viewMode, setViewMode]                       =   useState("grid");

    useEffect(() => {
        if (data?.buyerResources.length >= 10) {
            setViewMode("list");
        } else {
            setViewMode("grid");
        }
    }, [data?.buyerResources.length]);

    const handleIconClick = (view: string) => {
        setViewMode(view);
    };

    useEffect(() => {
        _getResources({
            variables: {
                "input" : filter,
                "pageConstraint": {
                    "page": 1,
                    "limit": RESOURCE_COUNT
                }
            }
        })
    }, [filter])

    useEffect(() => {

        const resourceVisitToBeTriggered = $resourceTouchPoints.filter(
            (_resourceTouchPoint: any) =>
                _resourceTouchPoint.target.when === WHEN_ON_VISIT_RESOURCES_SECTION
        );        

        if(resourceVisitToBeTriggered.length){
            setShowInitialPopup({
                visibility      :   true,
                touchpointData  :   resourceVisitToBeTriggered[0]
            })
        }
    }, [touchPoints])

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
    
    const handleSearch = (searchEvent: any) => {
        setFilter((prevFilter: any) => (
            {
                ...prevFilter, 
                searchKey: searchEvent.target.value
            }
        ))
    }
    
    let groupedResources: any       =   {};
    let uncategorizedResources: any =   [];
    let tempGroupedResources: any   =   {};

    data?.buyerResources.forEach((resource: any) => {
        const categoryNames = resource.categories.map((category: any) => category.name);
        if (categoryNames.length === 0) {
            uncategorizedResources.push(resource);
        } else {
            categoryNames.forEach((categoryName: any) => {
                if (!tempGroupedResources[categoryName]) {
                    tempGroupedResources[categoryName] = [];
                }
                tempGroupedResources[categoryName].push(resource);
            });
        }
    });

    const sortedCategories = Object.keys(tempGroupedResources).sort();

    const uncategorizedIndex = sortedCategories.indexOf("Uncategorized");
    if (uncategorizedIndex !== -1) {
        sortedCategories.splice(uncategorizedIndex, 1);
        if (uncategorizedResources.length > 0) {
            sortedCategories.push("Uncategorized");
        }
    }

    sortedCategories.forEach(categoryName => {
        groupedResources[categoryName] = tempGroupedResources[categoryName];
    });

    if (uncategorizedResources.length > 0) {
        groupedResources["Uncategorized"] = uncategorizedResources;
    }

    return (
        <>
            <div className="cm-width100 cm-height100 cm-row j-buyer-cm-padding-float cm-overflow-hidden">
                <div className="cm-height100 j-res-list-col j-buyer-cm-card cm-padding0 cm-overflow-hidden" style={{ borderRadius: "8px" }}>
                    <div className="j-doc-list-header cm-width100 cm-margin-bottom0" style={{ display: "block" }}>
                        <div className="cm-flex-center cm-width100 ">
                                <Input
                                    allowClear
                                    maxLength       =   {Length_Input}
                                    placeholder     =   {translate("common-labels.search")}
                                    className       =   "j-doc-list-search cm-buyer-resource-card cm-flex-center"
                                    size            =   "large"
                                    suffix          =   {<MaterialSymbolsRounded font="search" size="18" />}
                                    onChange        =   {(inputValue) => handleSearch(inputValue)}
                                    style           =   {{ marginTop: "25px", fontSize: "13px", width: "100%", maxWidth: "400px" }}
                                />
                            {data?.buyerResources.length >= 10 && (
                               <div className="cm-flex-center" style={{ marginTop: "25px", marginLeft: "25px" }}>
                               <div className={`j-buyer-resource-icon-grid-list cm-padding5 ${viewMode === 'list' ? 'active' : ''}`}>
                                   <MaterialSymbolsRounded
                                       className    =   "cm-cursor-pointer"
                                       font         =   "view_agenda"
                                       size         =   "20"
                                       onClick      =   {() => handleIconClick("list")}
                                   />
                               </div>
                               <div className={`j-buyer-resource-icon-grid-list cm-padding5 ${viewMode === 'grid' ? 'active' : ''}`}>
                                   <MaterialSymbolsRounded
                                       className    =   "cm-cursor-pointer"
                                       font         =   "grid_view"
                                       size         =   "20"
                                       onClick      =   {() => handleIconClick("grid")}
                                   />
                               </div>
                           </div>
                            )}
                        </div>
                        <Divider className="cm-margin-bottom0" />
                    </div>
                    {
                        loading 
                        ? 
                            <div style={{height: "calc(100% - 120px)"}}>
                                <Loading /> 
                            </div>
                        : 
                            data?.buyerResources.length > 0 
                            ? 
                                (
                                    <div className="j-portal-resource-list-wrapper cm-padding0 cm-padding-bottom15">
                                        {
                                            viewMode === "list" ? (
                                                <>
                                                    {Object.keys(groupedResources).map((categoryName, index) => (
                                                        <>
                                                            <div style={{ paddingInline: "25px" }}>
                                                                <div className="cm-margin-bottom10" style={{ marginTop: "18px" }}>
                                                                    <Text className="cm-font-size14 cm-font-fam500">{categoryName}</Text>
                                                                </div>
                                                                <Row gutter={[15, 15]}>
                                                                    {groupedResources[categoryName].map((resource: any) => (
                                                                        <Col key={resource.uuid} xs={24} sm={24} md={24} lg={12} xl={6}>
                                                                            <BuyerResourceCard
                                                                                key             =   {resource.uuid}
                                                                                cardId          =   {resource.uuid}
                                                                                name            =   {resource.title}
                                                                                fileType        =   {resource.type}
                                                                                thumbnail       =   {resource.content.thumbnailUrl}
                                                                                createdAt       =   {resource.createdAt}
                                                                                selected        =   {false}
                                                                                onCheck         =   {() => { }}
                                                                                resource        =   {resource}
                                                                                onResourceClick =   {(_, cardInfo) => handleResourceOnClick(cardInfo)}
                                                                            />
                                                                        </Col>
                                                                    ))}
                                                                </Row>
                                                            </div>
                                                            {index !== Object.keys(groupedResources).length - 1 && (
                                                                <Divider className="cm-unset-divider" style={{ marginTop: "20px" }} />
                                                            )}
                                                        </>
                                                    ))}
                                                </>
                                            ) 
                                            :
                                            (
                                                <div style={{ paddingInline: "25px" }}>
                                                    <Row gutter={[15, 15]} className="cm-padding20">
                                                        {data.buyerResources.map((resource: any) => (
                                                            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                                                                <BuyerResourceCard
                                                                    key             =   {resource.uuid}
                                                                    cardId          =   {resource.uuid}
                                                                    name            =   {resource.title}
                                                                    fileType        =   {resource.type}
                                                                    thumbnail       =   {resource.content.thumbnailUrl}
                                                                    createdAt       =   {resource.createdAt}
                                                                    selected        =   {false}
                                                                    onCheck         =   {() => { }}
                                                                    resource        =   {resource}
                                                                    onResourceClick =   {(_, cardInfo) => handleResourceOnClick(cardInfo)}
                                                                    showCopyLink    =   {true}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) 
                    : 
                        (
                            <div className="cm-flex-center cm-width100 cm-empty-text" style={{height: "calc(100% - 120px)"}}>
                                <Translate i18nKey={"common-empty.no-resources-found"} />
                            </div>
                        )
                    }
                </div>
            </div>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default BuyerResources