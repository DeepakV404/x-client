import { Suspense, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Avatar, Badge, Button, Layout, Progress, ProgressProps, Space, notification } from 'antd';
import { toLower } from 'lodash';

import { TOUCH_POINT_TYPE_GENERAL, WHEN_ON_DELAY } from '../../config/buyer-discovery-config';
import { BUYER_RESOURCE, BUYER_UNREAD_NOTIFICATIONS, P_TRIGGERED_QUESTIONS } from '../../api/buyers-query';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { BUYER_STAGES_CONFIG, DEMO } from '../../config/buyer-stages-config';
import { TEMPLATE_PREVIEW } from '../../config/buyer-constants';
import { BuyerGlobalContext } from '../../../buyer-globals';
import { CommonUtil } from '../../../utils/common-util';

import UnreadNotificationsDrawer from '../buyer-unread-notifications/unread-notifications-drawer';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../custom-hooks/use-translation-hook';
import DiscoveryQPopup from '../buyer-discovery/discovery-q-popup';
import DiscoveryPopup from '../buyer-discovery/discovery-popup';
import Translate from '../../../components/Translate';
import BuyerNextSteps from '../../pages/next-steps';
import BuyerResources from '../../pages/resources';
import BuyerSection from '../../pages/sections';
import BuyerJourney from '../../pages/journey';
import Loading from '../../../utils/loading';
import BuyerHome from '../../pages/home';
import BuyerDemo from '../../pages/demo';
import BuyerFaq from '../../pages/faq';
import MultipleFileUploadIndicator from '../../components/buyer-multiple-file-uploader';
import BuyerResourceViewerModal from '../../pages/resource-viewer/buyer-resource-viewer-modal';
import { useBuyerResourceViewer } from '../../../custom-hooks/resource-viewer-hook';

const { Content }   =   Layout;

const BuyerBody = (props: {setShowPreviewForm: any, isProfileClicked: boolean, setIsProfileClicked: any, setIsIconAnimatingOut: any, isIconAnimatingOut: any, handleMessageOpen: any}) => {

    const { setShowPreviewForm, isProfileClicked, setIsProfileClicked, setIsIconAnimatingOut, isIconAnimatingOut, handleMessageOpen }   =   props;

    const navigate          =   useNavigate();
    const { translate }     =   useLocalization();

    const {
        $buyerData,
        $isDiscoveryEnabled,
        $sessionId,
        $buyerUsecases,
        $customSections,
        $fileListProps
    }   =   useContext<any>(BuyerGlobalContext);

    const { fileListForMultipleUpload }                 =   $fileListProps;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer()

    const { touchPoints, setShowInitialPopup }          =   useContext<any>(BuyerDiscoveryContext);

    const [api, contextHolder]                          =   notification.useNotification();

    const location                                      =   useLocation();

    const buyerPortalId: any                            =   window.location.pathname.split("/")[2];

    const { data: unData }                              =   useQuery(BUYER_UNREAD_NOTIFICATIONS, {
        fetchPolicy: "network-only"
    })

    const url = new URL(window.location.href);
    const hasResourceShareLink = url.searchParams.has("resourceid");
    const isResourceSectionEnabled = url.searchParams.has("sectionid");        
    
    const { data: resourceData } = useQuery(BUYER_RESOURCE, {
        fetchPolicy: "network-only",
        variables: {
            resourceUuid: url.searchParams.get("resourceid")
        },
        skip: !hasResourceShareLink || isResourceSectionEnabled
    });
    
    useEffect(() => {   
        if(resourceData) {
            handleResourceOnClick(resourceData?.buyerResource)
        }    
    }, [resourceData])

    const [showUnread, setShowUnread]                   =   useState(false);

    useEffect(() => {
        if(unData){
            let storageData: any    =   localStorage.getItem(`${buyerPortalId}__unreadNotifications`);
            let localData: any      =   JSON.parse(storageData);

            if(!localData && (unData._pUnreadComments.length > 0 || unData._pUnreadMessages.length > 0)){
                setTimeout(() => {
                    let  unreadLocalData= {
                        "unreadTriggeredDate"   :   new Date().toDateString()
                    }
                    localStorage.setItem(`${buyerPortalId}__unreadNotifications`,JSON.stringify(unreadLocalData))
                    setShowUnread(true)
                }, 3000)
            }

            if(localData && (unData._pUnreadComments.length > 0 || unData._pUnreadMessages.length > 0)){
                if(localData.unreadTriggeredDate !== new Date().toDateString()){
                    setTimeout(() => {
                        let  unreadLocalData= {
                            "unreadTriggeredDate"   :   new Date().toDateString()
                        }
                        localStorage.setItem(`${buyerPortalId}__unreadNotifications`,JSON.stringify(unreadLocalData))
                        setShowUnread(true)
                    }, 3000)
                }
            }   
        }
        
    }, [unData])

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const allUsecasesLength =   $buyerUsecases.filter((_usecase: any) => (_usecase.hasVideo || _usecase.hasWalkthrough)).length
    const filteredUsecases  =   $buyerUsecases.filter((usecase:any) => (usecase.hasVideo || usecase.hasWalkthrough) && usecase.hasWatched);
    const numerator         =   filteredUsecases.length;

    const openNotification = () => {
        notification.destroy();
        api.info({
            key         :   "demoNotification",
            className   :   "j-buyer-demo-notification-root",
            duration    :   12,
            icon        :   <></>,
            closeIcon   :
                <div
                    className   =   'j-buyer-demo-notification-close'
                    onClick     =   {() => {
                        let localData = {
                            "demoNotification"   :   "closed"
                        }
                        localStorage.setItem(`${buyerPortalId}__notificationInfo`,JSON.stringify(localData))
                    }}
                >
                    <MaterialSymbolsRounded size="20" font='close'/>
                </div>,
            message     :
                <Space className='j-notification-wrapper'>
                    <Progress type="circle" strokeWidth={8} percent={Math.round((numerator / allUsecasesLength) * 100)} size={50} strokeColor={twoColors}/>
                    <Space direction='vertical'>
                        <Space className='cm-flex-space-between'>
                            {allUsecasesLength > 0 ? (
                                <Space>
                                    <div className='cm-font-fam500'>
                                        <Translate i18nKey='demo.you-watched'/> <span>{`${$buyerUsecases.filter((_usecase: any) => (_usecase.hasVideo || _usecase.hasWalkthrough) && _usecase.hasWatched).length}/${allUsecasesLength}`} {toLower(translate("demo.demos"))}</span>
                                    </div>
                                </Space>
                            ) : null}
                        </Space>
                            <div className='cm-font-size12'><Translate i18nKey='demo.notification-subtitle'/>, <span onClick={() => {navigate("/demo"); api.destroy()}} className='cm-link-text cm-cursor-pointer'>{toLower(translate("common-labels.click-here"))}</span></div>
                    </Space>
                </Space>,
        });
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            let storageData: any    =   localStorage.getItem(`${buyerPortalId}__notificationInfo`);
            let localData: any      =   JSON.parse(storageData);
            if((localData?.demoNotification !== "closed") && ($buyerData?.metadata[BUYER_STAGES_CONFIG[DEMO]?.metaKey].isEnabled) && (location.pathname.split("/")[1] !== "demo")){
                if(allUsecasesLength > $buyerUsecases.filter((_usecase: any) => (_usecase.hasVideo || _usecase.hasWalkthrough) && _usecase.hasWatched).length){
                    if($buyerData.sellerAccount.tenantName === "buyerstage" || $buyerData.sellerAccount.tenantName === "buyerstage2"){
                        openNotification()
                    }
                }
            }
        }, 180000)
        return () => {
            clearTimeout(timer)
        }
    }, [location])

    const $isTemplatePreview                         =   $buyerData?.portalType === TEMPLATE_PREVIEW;

    const [_getTriggeredQuestions, { data, error }]  =   useLazyQuery(P_TRIGGERED_QUESTIONS, {
        fetchPolicy: "network-only",
        variables: {
            sessionUuid: $sessionId
        }
    })

    const handleTimeOutTrigger = () => {

        let delayTriggers = touchPoints.filter((_touchPoint: any) => _touchPoint.type === TOUCH_POINT_TYPE_GENERAL && _touchPoint.target.when === WHEN_ON_DELAY)

        delayTriggers.map((_trigger: any) => {
            setTimeout(() => {
                setShowInitialPopup({
                    visibility      :   true,
                    touchpointData  :   _trigger
                })
            }, _trigger.target.delayInSecs * 1000)
        });
    }

    useEffect(() => {
        handleTimeOutTrigger()
        if($isDiscoveryEnabled && $sessionId){
            _getTriggeredQuestions()
        }
    }, [$sessionId])

    const patterStyle = {
        // backgroundColor     :   "rgba(255, 255, 255, 0.1)",
        // backgroundImage     :   `repeating-linear-gradient(45deg, ${colorPrimary}0d  25%, transparent 25%, transparent 75%, ${colorPrimary}0d 75%, ${colorPrimary}0d), repeating-linear-gradient(45deg, ${colorPrimary}0d 25%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 75%, ${colorPrimary}0d 75%, ${colorPrimary}0d)`,
        // backgroundPosition  :   "0 0, 40px 40px",
        // backgroundSize      :   "80px 80px",
        // borderLeft          :   "none"
        backgroundImage         :   "radial-gradient(rgb(139 154 177 / 50%) 5%, rgb(240, 242, 245) 0px)",
        backgroundSize          :   "35px 35px"
    }

    if(error) {
        console.log("[error]: error in triggered questions ",error)
    }

    const toggleOwnerCard = () => {
        if(isProfileClicked){
            setIsIconAnimatingOut(true);
            setTimeout(() => {
                setIsProfileClicked((prev: any) => !prev)
                setIsIconAnimatingOut(false);
            }, 1000);
        }
        else{
            setIsProfileClicked((prev: any) => !prev)
        }
    } 

    const getRoute = () => {
        let sectionType = $customSections?.filter((_section: any) => _section.uuid === location.pathname.split("/")[location.pathname.split("/").length - 1])[0]?.type;
        switch (sectionType) {
            case "WELCOME":
                return <BuyerHome />
            
            case "DEMO":
                return <BuyerDemo/>
            
            case "RESOURCES":
                return <BuyerResources/>
            
            case "TALK_TO_US":
                return <BuyerNextSteps/>

            case "FAQ":
                return <BuyerFaq setShowPreviewForm={setShowPreviewForm}/>
        
            default:
                return <BuyerSection/>
        }
    }

    const getNavigateRoute = () => {
        if(isResourceSectionEnabled) {
            return `/section/${url.searchParams.get("sectionid")}`
        }else if($customSections && $customSections.length > 0){
            return `/section/${$customSections[0].uuid}`
        }else{
            return "/no-match"
        }
    }

    return (
        <>
            {contextHolder}
            <Content className="j-buyer-body cm-height100 cm-width100 cm-overflow-auto" style={patterStyle}>
                <Suspense fallback={<Loading />}>
                    <div className='cm-flex cm-width100 cm-height100'>
                        <div className='cm-overflow-auto' style={{width: "calc(100% - 50px)"}}>
                            <Routes>
                                <Route path="/"                     element={<Navigate to={getNavigateRoute()}/>}/>
                                <Route path="/:stepId"              element={<BuyerJourney/>}/>
                                <Route path="/section/:sectionId"   element={getRoute()}/>
                                <Route 
                                    path    =   '/no-match'             
                                    element =   {
                                        <Space size={20} direction='vertical' className='cm-height100 cm-flex-center cm-secondary-text'>
                                            <Space direction='vertical'>
                                                <div className='cm-text-align-center cm-font-size16 cm-font-fam500'>We couldn't find the exact page you were looking for.</div>
                                                <div className='cm-text-align-center cm-font-size12'>Select any section or click refresh to land on the availabe page</div>
                                            </Space>
                                            <Button type='primary' onClick={() => {navigate(""); window.location.reload()}}> Refresh </Button>
                                        </Space>
                                    }
                                />
                            </Routes>
                        </div>

                        <div className='j-discovery-sider'>
                            {
                                $buyerData.owner && $buyerData?.portalType !== TEMPLATE_PREVIEW && $buyerData?.properties.isPOCEnabled
                                ?
                                    <div className="j-buyer-sales-owner-avatar-sider cm-cursor-pointer" onClick={() => toggleOwnerCard()}>
                                        {
                                            isProfileClicked ?
                                                <div className='j-sales-owner-avatar-close'>
                                                    <MaterialSymbolsRounded font='close' size='22' className={`${isIconAnimatingOut ? "j-rotate-close-icon-end" : "j-rotate-close-icon-start"}`}/>
                                                </div>
                                            :
                                                null
                                        }
                                        <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "30px" }} src={$buyerData.owner.profileUrl ? <img src={$buyerData.owner.profileUrl} alt={CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName)}/> : ""}>
                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName), 1)}
                                        </Avatar>
                                    </div>
                                :
                                    null
                            }
                            {
                                $isTemplatePreview
                                ?
                                    <Badge className='j-template-preview-form-dot' status="processing" dot={true} offset={[-28, 2]} color='red'>
                                        <div className='j-template-preview-form-icon cm-cursor-pointer' onClick={() => setShowPreviewForm(true)}>
                                            <MaterialSymbolsRounded font='info' size='20' filled/>
                                        </div>
                                    </Badge>
                                :
                                    null
                            }
                            <div className='j-discovery-sider-popup'>
                                {
                                    data && data._pTriggeredQuestions.map((_question: any) => (
                                        <div className="j-discovery">
                                            <DiscoveryPopup question={_question} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </Suspense>
            </Content>
            {
                fileListForMultipleUpload?.length > 0 && <MultipleFileUploadIndicator />
            }
            <DiscoveryQPopup/>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
            <UnreadNotificationsDrawer open={showUnread} onClose={() => setShowUnread(false)} notifications={unData} handleMessageOpen={handleMessageOpen}/>
        </>
    )
}

export default BuyerBody