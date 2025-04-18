import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Avatar, Divider, Layout, Menu, Space, Tag, Timeline, Tooltip, Typography, theme } from "antd"

import { PREVIEW_USER_ICON } from "../../../constants/module-constants";
import { TEMPLATE_PREVIEW } from "../../config/buyer-constants";
import { BUYER_JOURNEY_STAGES } from "../../api/buyers-query";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UpdateProfileModal from "../../pages/settings/update-profile-modal";
import LocalCache from "../../../config/local-storage";
import Translate from "../../../components/Translate";
import Emoji from "../../../components/Emoji";

const { Sider }     =   Layout;
const { SubMenu }   =   Menu;
const { Text }      =   Typography;

const BuyerSider = (props: {setShowPreviewForm: any; showPreviewForm: boolean, isMobile: boolean, collapsed: boolean, setCollapsed: any}) => {

    const { isMobile, setShowPreviewForm, collapsed, setCollapsed } =   props;

    const { $buyerData, $isDemo, $customSections }  =   useContext<any>(BuyerGlobalContext);

    const navigate                                                  =   useNavigate();
    const location                                                  =   useLocation();
    const { token: { colorBgContainer } }                           =   theme.useToken();

    // const buyerPortalId: any                                        =   window.location.pathname.split("/")[2];

    const $isTemplatePreview                                        =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const $isPreview                                                =   CommonUtil.__getQueryParams(window.location.search).preview === "true";

    const sectionId: string                                         =   location.pathname.split("/")[location.pathname.split("/").length - 1]

    const [showProfileModal, setShowProfileModal]                   =   useState(false);
    const [isMenuOpen, setMenuOpen]                                 =   useState(false);
    const [selectedSiderItem, setSelectedSiderItem]                 =   useState(sectionId);

    const key                       =   "_jungle";
    const buyerSessionDataString    =   localStorage.getItem(key);
    const buyerSessionData          =   buyerSessionDataString ? JSON.parse(buyerSessionDataString) : null;
    const buyerSessionId            =   buyerSessionData && buyerSessionData[window.location.pathname.split("/")[2]] && buyerSessionData[window.location.pathname.split("/")[2]]["buyerSessionId"];

    const [_getStages, { data }]   =   useLazyQuery(BUYER_JOURNEY_STAGES, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if(sectionId){
            setSelectedSiderItem(sectionId)
        }
    }, [location])

    useEffect(() => {
        ($customSections?.filter((_item: any) => _item.type !== "FAQ").length === 1) ? setCollapsed(true) : null
    }, [$customSections])

    useEffect(() => {
        if(isMobile){
            setCollapsed(true)
        }
    }, [isMobile])

    useEffect(() => {
        if(!sectionId){
            if($customSections?.length > 0){
                if($customSections[0]?.type === "CUSTOM_SECTION"){
                    navigate(`/section/${$customSections[0].uuid}`)
                }else if($buyerData?.isJourneyEnabled && $customSections[0].type === "NEXT_STEPS"){
                    if(data){
                        if(data.buyerJourneyStages.length > 0){
                            let firstEnabledStep = data.buyerJourneyStages.filter((_step: any) => _step.isEnabled)[0]?.uuid
                            navigate(firstEnabledStep)
                        }
                    }
                }else if($customSections[1]?.type === "FAQ"){
                    navigate(`/section/${$customSections[1].uuid}`)
                }else{
                    navigate(`/section/${$customSections[0].uuid}`)
                }
            }else{
                navigate("no-match")
            }
        }
    }, [data])

    useEffect(() => {
        if($buyerData?.isJourneyEnabled){
            _getStages()
        }
    }, [$buyerData?.isJourneyEnabled])

    // useEffect(() => {
    //     let storageData: any    =   localStorage.getItem(`${buyerPortalId}__gotProfile`);
    //     let localData: any      =   JSON.parse(storageData);

    //     if(!localData && !$isTemplatePreview){
    //         setShowProfileModal(true)
    //         localStorage.setItem(`${buyerPortalId}__gotProfile`, "true")
    //     }
    // }, [])

    useEffect(() => {

        const handleTabClose = () => {
            if($isPreview) {
                if(buyerSessionData && buyerSessionData[window.location.pathname.split("/")[2]]) {
                    delete buyerSessionData[window.location.pathname.split("/")[2]];
                    localStorage.setItem(key, JSON.stringify(buyerSessionData));
                }

                BuyerAgent.clearSession({
                    variables: {
                        sessionUuid: buyerSessionId
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {}
                })
            }
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, [])

    let previewBuyer = {
        firstName   :   "Preview",
        lastName    :   "User",
        profileUrl  :   null,
        emailId     :   "preview@mail.com"
    }

    let acmeBuyer = {
        firstName   :   "Acme",
        lastName    :   "User",
        profileUrl  :   `${import.meta.env.VITE_STATIC_ASSET_URL}/template-user.svg`,
        emailId     :   "user@acme.com"
    }

    let currentBuyer = $isTemplatePreview ? acmeBuyer : ($buyerData?.buyers.filter((_buyer: any) => _buyer.isCurrentBuyer)[0] ? $buyerData?.buyers.filter((_buyer: any) => _buyer.isCurrentBuyer)[0] :  previewBuyer);

    const isCurrentStepBuyingJourney = data && data.buyerJourneyStages.filter((_journey: any) => _journey.uuid === sectionId).length > 0;

    useEffect(() => {
        if(data){
            setMenuOpen(true)
        }
    }, [data])

    const getNextStepName = () => {
        if($buyerData.language === "fr"){
            return "Prochaines étapes"
        }else if($buyerData.language === "de"){
            return "Nächste Schritte"
        }else if($buyerData.language === "es"){
            return "Próximos pasos"
        }else{
            return "Next Steps"
        }
    }

    const _getNextSteps = () => {
        if(data && data.buyerJourneyStages.length > 0){
            return(
                <Timeline className='j-buyer-journey-tl' mode={"left"}>
                    {
                        data && data.buyerJourneyStages.map((_step: any) => (
                            <Timeline.Item key={_step.uuid} className="" color="#1d1d1d">
                                {
                                    _step.isEnabled
                                    ?
                                        <NavLink to={_step.uuid} onClick={() => isMobile && setCollapsed(true)}>
                                            <Space className={`j-buyer-nav-step ${sectionId === _step.uuid ? "active" : ""} cm-font-fam500 cm-flex-space-between`}>
                                                <Text style={{maxWidth: _step.totalActionPoints > 0 ? "150px" : "200px"}} ellipsis={{tooltip: _step.title}}>{_step.title}</Text>
                                                <Space size={0} className="cm-flex-center">
                                                    {
                                                        _step.completedActionPoints === _step.totalActionPoints
                                                        ?
                                                            _step.totalActionPoints === 0
                                                            ?
                                                                null
                                                            :
                                                                <MaterialSymbolsRounded font="check_circle" className="cm-margin-right5" size="18" color="green"/>
                                                        :
                                                            <div className="cm-flex-center cm-font-size12 j-buyer-total-ap" style={{minWidth: "40px"}}>{_step.completedActionPoints}/{_step.totalActionPoints}</div>
                                                    }
                                                </Space>
                                            </Space>
                                        </NavLink>
                                    :
                                        <Tooltip
                                            title={
                                                <div className="cm-dark-text">
                                                    <div className="cm-flex-align-center" style={{padding: "0px 15px 0 0"}}>
                                                        <div className="cm-font-fam600 cm-font-size16" style={{padding: "5px 0"}}>{_step.title}</div>
                                                    </div>
                                                    <Divider className="cm-unset-divider"/>
                                                    <div style={{padding: "6px 15px 6px 0"}}>
                                                        <span>{$buyerData?.sellerAccount.title} <Translate i18nKey="common-placeholder.will-enable-later"/></span>
                                                    </div>
                                                </div>
                                            }
                                            color       =   "white"
                                            placement   =   "right"
                                            style       =   {{boxShadow: "0px 2px 8px 0px #00000026", maxWidth: "300px"}}
                                            zIndex      =   {999}
                                        >
                                            <Space className={`j-buyer-nav-step ${sectionId === _step.uuid ? "active" : ""} disabled cm-font-fam500 cm-flex-space-between`}>
                                                <Text style={{ maxWidth: "170px", color: "#969494" }} ellipsis={{ tooltip: "" }}>{_step.title}</Text>
                                                <div className="cm-flex-justify-end" style={{ minWidth: "20px" }}><MaterialSymbolsRounded font="lock" size="15" /></div>
                                            </Space>
                                        </Tooltip>
                                }
                            </Timeline.Item>
                        ))
                    }
                </Timeline>
            )
        } else {
            return (
                <div className="j-buyer-not-enabled cm-flex-center cm-light-text">
                    <Translate i18nKey="common-empty.no-steps-found"/>
                </div>
            )
        }
    }

    const _getSections = () => {
        return(
            $customSections?.map((_section: any) =>
            (
                _section.isEnabled && 
                    _section.type !== "NEXT_STEPS" && 
                        _section.type !== "FAQ"
                ?
                    <Menu.Item className={`j-buyer-nav-step ${selectedSiderItem === _section.uuid ? "active" : ""} cm-font-fam500 cm-flex-space-between ${location.pathname.split("/")[1] === _section.uuid ? "active" : ""}`} icon={<Emoji font={_section.emoji ?? "🔖"} size="20"/>}>
                        <Tooltip title={_section.title.length > 30 ? _section.title : ""} placement="right">
                            {
                                _section.type === "CUSTOM_SECTION"
                                ?
                                    (
                                        <NavLink className={"cm-flex-space-between"} to={`/section/${_section.uuid}`}>
                                            <Text style={{display: "block"}} ellipsis={{tooltip: _section.title}}>{_section.title}</Text>
                                            {_section.isNew && <Tag className="cm-margin0" style={{border: "none", background: "#FFEFE2", color: "#F48125", lineHeight: "22px"}}>New</Tag> }
                                        </NavLink>
                                    )
                                :
                                    (
                                        <NavLink to={`/section/${_section.uuid}`}>
                                            <Text style={{display: "block"}} ellipsis={{tooltip: _section.title}}>{_section.title}</Text>
                                        </NavLink>
                                    )
                            }
                        </Tooltip>
                    </Menu.Item>
                :
                    _section.type === "FAQ" ? 
                        <>
                            <Menu.Item className={`j-buyer-nav-step j-buyer-nav-item-faq ${selectedSiderItem === _section.uuid ? "active" : ""} cm-font-fam500 cm-flex-space-between ${location.pathname.split("/")[1] === _section.uuid ? "active" : ""}`} icon={<Emoji font={_section.emoji ?? "🔖"} size="20"/>}>
                                <Tooltip title={_section.title.length > 30 ? _section.title : ""} placement="right">
                                    <NavLink to={`/section/${_section.uuid}`}>
                                        <Text style={{display: "block"}} ellipsis={{tooltip: _section.title}}>{_section.title}</Text>
                                    </NavLink>
                                </Tooltip>
                            </Menu.Item>
                        </>
                    :
                        $buyerData?.isJourneyEnabled ?
                            <SubMenu onTitleClick={() => setMenuOpen((prevStatus) => !prevStatus)} popupClassName="j-buyer-submenu" className={"j-buyer-sub-nav-item"} key={"buying_journey"} title={<div>{getNextStepName()}</div>} icon={<Emoji font="🧭" size="20"/>}>
                                {
                                    _getNextSteps()
                                }
                            </SubMenu>
                        :
                            null
            ))
        )
    }

    const isFaqEnabled = $customSections?.filter((_item: any) => _item.type === "FAQ").length > 0;

    return (
        <>
            <Sider trigger={null} className="j-buyer-view-sider" collapsedWidth={0} collapsible={true} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} width={300} style={{ background: colorBgContainer, borderRight: "1px solid #eeeeee"}}>
                {
                    !collapsed ?
                        <div className="j-buyer-sider-collpase-icon" onClick={() => setCollapsed(!collapsed)}>
                            <MaterialSymbolsRounded font="keyboard_double_arrow_left" color="#000000D9" size="20" filled/>
                        </div>
                    :
                        null
                }
                {
                    <>
                        {
                            !collapsed && (
                                <>
                                    {
                                        $isTemplatePreview && (!LocalCache.getData("isPreviewFormClosed")) ?
                                            <Space className={$isDemo ? "j-buyer-header-left" : "cm-width100 j-buyer-header-left cm-cursor-pointer"} onClick={() => !$isDemo ? ($isTemplatePreview ? setShowPreviewForm(true) :  setShowProfileModal(true)) : null}>
                                                <Avatar size={50} shape='square' style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", borderRadius: "12px" }} src={$isPreview ? <img src={PREVIEW_USER_ICON} alt={CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= PREVIEW_USER_ICON}}/> : (currentBuyer.profileUrl ? <img src={currentBuyer.profileUrl} alt={CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= PREVIEW_USER_ICON}}/> : "")}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(currentBuyer.firstName, ""),1)}
                                                </Avatar>
                                                <Space direction="vertical" size={0}>
                                                    <Text className="cm-font-size16 cm-font-fam500" style={{fontWeight: 500, maxWidth: "250px"}} ellipsis={{tooltip: currentBuyer.firstName}}>{currentBuyer.firstName} {currentBuyer.lastName}</Text>
                                                </Space>
                                            </Space>
                                        :
                                            <Space className={$isDemo ? "j-buyer-header-left" : "cm-width100 j-buyer-header-left cm-cursor-pointer"} onClick={() => !$isDemo ? ($isTemplatePreview ? setShowPreviewForm(true) :  setShowProfileModal(true)) : null}>
                                                <Avatar size={50} shape='square' style = {{backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", borderRadius: "12px" }} src={$isPreview ? <img src={PREVIEW_USER_ICON} alt={CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= PREVIEW_USER_ICON}}/> : (currentBuyer.profileUrl ? <img src={currentBuyer.profileUrl} alt={CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= PREVIEW_USER_ICON}}/> : "")}>
                                                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName),1)}
                                                </Avatar>
                                                <Space direction="vertical" size={0}>
                                                    <Text className="cm-font-fam600 cm-font-size16" style={{width: "180px"}} ellipsis={{tooltip: CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)}}>{CommonUtil.__getFullName(currentBuyer.firstName, currentBuyer.lastName)}</Text>
                                                    <Text className="cm-font-fam400 cm-font-size13" style={{width: "180px"}} ellipsis={{tooltip: currentBuyer.emailId}}>{currentBuyer.emailId}</Text>
                                                </Space>
                                            </Space>
                                    }
                                    <Menu className="j-buyer-nav-menu" mode="inline" openKeys={isMenuOpen && !collapsed ? ["buying_journey"] : []} selectedKeys={[isCurrentStepBuyingJourney ? "buying_journey" : sectionId]}  onClick={() => isMobile && setCollapsed(true)} style={{height: isFaqEnabled ? "calc(100% - 140px)" : "calc(100% - 85px)"}}>
                                        {
                                            _getSections()
                                        }
                                    </Menu>
                                </>
                            )
                        }
                    </>
                }
            </Sider>
            <UpdateProfileModal
                isOpen  =   {showProfileModal}
                onClose =   {() => setShowProfileModal(false)}
            />
        </>
    )
}

export default BuyerSider 
