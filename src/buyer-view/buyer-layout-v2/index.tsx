import { Dropdown, Layout, Space, Tabs, Typography } from "antd"
import { useContext, useEffect, useState } from "react";
import { BuyerGlobalContext } from "../../buyer-globals";
import BuyerHeaderV2 from "./buyer-header-v2";
import { TEMPLATE_PREVIEW } from "../config/buyer-constants";
import { ACME_FALLBACK_ICON, COMPANY_FALLBACK_ICON } from "../../constants/module-constants";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BuyerBodyV2 from "./buyer-body-v2";
import { useQuery } from "@apollo/client";
import { BUYER_JOURNEY_STAGES } from "../api/buyers-query";
import Loading from "../../utils/loading";
import SomethingWentWrong from "../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import BuyerChatWidgetPopover from "../layout/chat-window";

const { Text }  =   Typography;

const BuyerLayoutV2 = (props: any) => {

    const { isMobile }  =   props
    
    const { $showPreviewForm, $setShowPreviewForm, $buyerData, $customSections, setIsIconAnimatingOut, isIconAnimatingOut, setIsProfileClicked, isProfileClicked } =   useContext<any>(BuyerGlobalContext);

    const navigate                                  =   useNavigate();
    const location                                  =   useLocation();

    const [collapsed, setCollapsed]                 =   useState(isMobile);

    const [selectedTab, setSelectedTab]             =   useState("");

    const [isMessagePopoverOpen, setIsMessagePopoverOpen ]     =   useState(false);

    const [_, setSearchParams]                      =   useSearchParams();

    const { data, loading, error }                  =   useQuery(BUYER_JOURNEY_STAGES, {
        fetchPolicy: "network-only",
        skip: !$buyerData?.isJourneyEnabled
    });

    useEffect(() => {
        const splittedPath = location?.pathname?.split("/");

        if(splittedPath.length === 2){
            const selectedSection = $customSections.find((section: any) => section.type === "NEXT_STEPS");

            setSelectedTab(selectedSection?.uuid) 

        }else{
            setSelectedTab(splittedPath[2]) 
        }
        
    }, [location])

    const isLogoCentered: boolean                   =   $buyerData.properties.headerAlignment === "middle";
    const $isTemplatePreview                        =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const handleSiderOpen = () => {
        setCollapsed(false)
        // setShowMessages(false)
    }

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    const handleTabChange: any = (_sectionId: string) => {
        const selectedSection = $customSections.find((section: any) => section.uuid === _sectionId);
        if (selectedSection.type === "NEXT_STEPS") {
            navigate(`/${data?.buyerJourneyStages[0].uuid}`)
        }else{
            navigate(`/section/${_sectionId}`)
        }
    }

    const getSelectedSection = (sectionId: string) => {
        return $customSections.find((section: any) => section.uuid === sectionId)
    }

    const handleMessagesClose = () => {
        setSearchParams({
            "messages" : 'false'
        })
        setIsMessagePopoverOpen(false)
    }

    const handleMessageOpen = () => {
        setSearchParams({
            "messages" : 'true'
        })
    }


    return (
        <Layout>
            <BuyerHeaderV2 
                handleSiderOpen     =   {handleSiderOpen}
                setShowPreviewForm  =   {$setShowPreviewForm} 
                showPreviewForm     =   {$showPreviewForm} 
                collapsed           =   {collapsed} 
                isMobile            =   {isMobile} 
                showCollapseIcon    =   {true}
            />
            <div style={{height: "calc(100% - 50px)", background: "#fafbfc", overflow: "auto"}}>
                <div className="hover-item cm-position-relative" style={{minHeight: "50px"}}>
                    <div style={{overflow: "hidden"}}>
                        {$buyerData?.properties.coverImageUrl && <img src={$buyerData?.properties.coverImageUrl} className="j-buyer-home-banner" alt="Cover Image" width={"100%"} style={{objectFit: "cover"}}/>}
                    </div>
                    <div className={`cm-position-relative ${isLogoCentered ? "cm-flex-center" : "cm-flex"} j-buyer-company-logos-wrapper ${$buyerData.properties.coverImageUrl ? "has-cover" : ""}`} style={{maxWidth: "900px", margin: "auto", marginTop: $buyerData.properties.coverImageUrl ? "0px" : "60px"}}>
                        <div className={`j-buyer-company-logo ${$isTemplatePreview ? "is-template" : ""}`}>
                            <img src={$isTemplatePreview ? ACME_FALLBACK_ICON : $buyerData?.logoUrl} alt={$buyerData.companyName} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= ACME_FALLBACK_ICON;}}/>
                        </div>
                        <div className="j-buyer-customer-company-logo" style={{position: "relative", left: "-10px"}}>
                            <img src={$buyerData.sellerAccount.logoUrl} alt="update_logo" className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/>
                        </div>
                    </div>
                </div>
                <div className={`${isLogoCentered ? "cm-flex-center" : "cm-flex-align-center"} cm-padding-left10 cm-padding-block10`} style={{maxWidth: "900px", margin: "auto", marginTop: $buyerData?.properties.coverImageUrl ? "-40px" : "0px"}}>
                    <Text autoFocus className="cm-font-fam700 cm-font-size28">{$isTemplatePreview ? "Acme" : $buyerData.companyName} &harr; {$buyerData.sellerAccount.title}</Text>
                </div>
                <div style={{position: "sticky", top: "0", background: "#fafbfc", zIndex: 10}} className="cm-flex-center">
                    <div style={{maxWidth: "900px"}}>
                        <Tabs
                            centered
                            className           =   "bn-header-tabs"
                            defaultActiveKey    =   {selectedTab ? selectedTab : $customSections[0].uuid}
                            activeKey           =   {selectedTab}
                            onChange            =   {handleTabChange}
                            more                =   {{icon: <Space size={0}><MaterialSymbolsRounded font="chevron_left" size="18"/><MaterialSymbolsRounded font="chevron_right" size="18"/></Space>}}
                            items               =   {
                                $customSections.map((_section: any) => {
                                    if(_section){
                                        if(_section?.type === "NEXT_STEPS"){
                                            if(data?.buyerJourneyStages?.length > 0 ){
                                                return {
                                                    label: `${_section?.emoji}  ${_section?.title}`,
                                                    key: _section?.uuid,
                                                };
                                            }else{
                                                return null
                                            }
                                        }
        
                                        return {
                                            label: `${_section?.emoji}  ${_section?.title}`,
                                            key: _section?.uuid,
                                        };
                                    }
                                })
                            }
                        />
                    </div>
                    <Dropdown 
                        overlayClassName    =   "bn-mobile-tabs"
                        trigger             =   {["click"]}
                        menu                =   {{
                            onClick: (event: any) => {
                                handleTabChange(event.key)
                            },
                            items: $customSections.map((_section: any) => {
                                if(_section){
                                    if(_section.type === "NEXT_STEPS"){
                                        if(data?.buyerJourneyStages?.length > 0 ){
                                            return {
                                                label: <span className="cm-margin-left10">{_section?.title}</span>,
                                                key: _section?.uuid,
                                                icon: _section?.emoji,
                                            };
                                        }else{
                                            return null
                                        }
                                    }
    
                                    return {
                                        label: <span className="cm-margin-left10">{_section?.title}</span>,
                                        key: _section?.uuid,
                                        icon: _section?.emoji,
                                    };
                                }
                            })
                        }}
                    >

                        <Space className="cm-flex-space-between cm-cursor-pointer bn-mobile-tabs-dropdown cm-width100" style={{padding: "10px 20px"}}>
                            <Space size={4} className="cm-font-fam500 cm-font-size14">{getSelectedSection(selectedTab)?.emoji} {getSelectedSection(selectedTab)?.title}</Space>
                            <MaterialSymbolsRounded font="keyboard_arrow_down"/>
                        </Space>
                    </Dropdown>
                </div>
                <BuyerBodyV2 
                    setShowPreviewForm      =   {$setShowPreviewForm} 
                    isProfileClicked        =   {isProfileClicked} 
                    setIsProfileClicked     =   {setIsProfileClicked} 
                    isIconAnimatingOut      =   {isIconAnimatingOut} 
                    setIsIconAnimatingOut   =   {setIsIconAnimatingOut} 
                    handleMessageOpen       =   {handleMessageOpen}
                    journeyStages           =   {data?.buyerJourneyStages}
                />
            </div>
            {
                ($buyerData.sellerAccount.tenantName !== "kissflow") && 
                    <BuyerChatWidgetPopover
                        handleMessageOpen       =   {handleMessageOpen}
                        handleMessagesClose     =   {handleMessagesClose}
                        isMessagePopoverOpen    =   {isMessagePopoverOpen}
                        setIsMessagePopoverOpen =   {setIsMessagePopoverOpen}
                        isMobile                =   {isMobile} 
                    />
            }
        </Layout>
    )
}

export default BuyerLayoutV2