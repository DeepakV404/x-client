import "./buyer-layout.css";

import { useMutation } from "@apollo/client";
import { Worker } from '@react-pdf-viewer/core';
import { LinkedinFilled } from '@ant-design/icons';
import { HashRouter, NavLink } from "react-router-dom";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Avatar, Button, FloatButton, Form, Input, Layout, Popover, Space, Typography } from "antd";

import { THEME_COLOR_CONFIG, THEME_DEFAULT } from "../../pages/settings/theme-color-config";
import { P_TRACK_CONTACT_ENTERED_EVENT } from "../api/buyer-mutation";
import { PREVIEW_USER_ICON } from "../../constants/module-constants";
import { TEMPLATE_PREVIEW } from "../config/buyer-constants";
import { BuyerGlobalContext } from "../../buyer-globals";
import { CommonUtil } from "../../utils/common-util";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import useLocalization from "../../custom-hooks/use-translation-hook";
import LocalCache from "../../config/local-storage";
import Translate from "../../components/Translate";
import EmailGateLayout from "../pages/email-gate";
import NonGatedForm from "./non-gated-form";

import "./buyer-mobile.css"
import packageJson from '../../../package.json';
import Loading from "../../utils/loading";
import SectionProtected from "../pages/sections/section-protected";
import BuyerLayoutV2 from "../buyer-layout-v2";
import BuyerLayout from "./layout";

const { useForm }   =   Form;
const { Text }      =   Typography

const BuyersLayout = () => {

    const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

    const { $buyerData, $customSections, $orgProperties, $showPreviewForm, $setShowPreviewForm, $isMobile } =   useContext<any>(BuyerGlobalContext);

    let $isTalkToSalesEnabled   =   $customSections?.some((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);
    const $talkToUs             =   $customSections?.find((item: any) => item.type === "TALK_TO_US" && item.isEnabled === true);

    const buyerPortalId: any    =   window.location.pathname.split("/")[2];

    const { translate } =   useLocalization();

    let storageData: any             =   localStorage.getItem(`${buyerPortalId}__showBookMarkBar`);
    let bookmarkLocalData: any       =   JSON.parse(storageData);

    const [isProtectedVerified, setIsProtectedVerified]   =   useState($buyerData?.properties.isProtected);

    const checkSessionExpired = (sessionCreatedOn: any) => {
        var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
        return (sessionCreatedOn - new Date().valueOf()) >= OneDay
    }
    
    const [showChat]    =   useState($buyerData?.sellerAccount.type === "INTERNAL");
    const POCCardRef    =   useRef<HTMLDivElement | null>(null);

    const [form]        =   useForm();

    const $isTemplatePreview    =   $buyerData?.portalType === TEMPLATE_PREVIEW;
    const templatePreview       =   CommonUtil.__getQueryParams(window.location.search).hasOwnProperty("preview");

    const [isProfileClicked, setIsProfileClicked]       =   useState<any>(false)
    const [isIconAnimatingOut, setIsIconAnimatingOut]   =   useState(false);
    const [showBookmarkBar, setShowBookmarkBar]         =   useState(bookmarkLocalData);

    function pageInIframe() {
        return (window?.location !== window?.parent?.location);
    }

    const [contactEnteredEvent] = useMutation(P_TRACK_CONTACT_ENTERED_EVENT, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if(!isProtectedVerified){
            contactEnteredEvent()
        }
    }, [isProtectedVerified])

    useEffect(() => {
        const handleOutsideClick = (e: any) => {
            if (isProfileClicked && !POCCardRef?.current?.contains(e.target) && !e.target.className.includes("j-rotate-close-icon-start")) {
                setIsIconAnimatingOut(true);
                setTimeout(() => {
                    setIsProfileClicked((prev: any) => !prev);
                    setIsIconAnimatingOut(false);
                }, 1000);
            }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isProfileClicked]);
    

    useEffect(() => {
        let unparsedPortalData: any =   localStorage.getItem(buyerPortalId);
        let portalData              =   unparsedPortalData ? JSON.parse(unparsedPortalData) : null;
    
        if($buyerData.properties.isProtected){
            if(!portalData || !portalData.sessionCreatedOn || checkSessionExpired(portalData.sessionCreatedOn)){
                setIsProtectedVerified(true)
            }else{
                setIsProtectedVerified(false)
            }
        }else{
            setIsProtectedVerified(false)
        }
    }, [$buyerData.properties.isProtected])

    useEffect(() => {
        if(!pageInIframe()){
            if(bookmarkLocalData === null || bookmarkLocalData === undefined){
                localStorage.setItem(`${buyerPortalId}__showBookMarkBar`, "true")
                setShowBookmarkBar(true)
            }
        }
    }, [])

    // useEffect(() => {
    //     if(!LocalCache.getData("isPreviewFormClosed") && !$isTemplatePreview){
    //         setTimeout(() => {
    //             $setShowPreviewForm(true)
    //         }, 60000)
    //     }
    // }, []);

    const messages: any = [
        {
            "side"  :   "left",
            "message":  `<p>Hey! This is <strong>BEN</strong>, the AI assistant of <strong>Buyerstage</strong>. How can I help you?</p>`
        },
        {
            "side"  :   "right",
            "message":  "Is this CRM GDPR compliant ?"
        },
        {
            "side"  :   "left",
            "message":  `<p>Yes! Salesforce CRM is GDPR compliant. To know more visit <a href="https://compliance.salesforce.com/en/gdpr" rel="noopener noreferrer" target="_blank">https://compliance.salesforce.com/en/gdpr</a></p>`
        },
    ]

    const chatWindow = () => {
        return (
            <div className="j-buyer-chat-layout">
                <div className="j-buyer-messages-layout">
                    {
                        messages.map((_message: any) => (
                            <Space className={`cm-width100 ${_message.side === "right" ? "cm-flex-justify-end" : ""}`}>
                                {
                                    _message.side === "left" &&
                                        <Avatar size={25} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "10px", display: "flex", alignItems: "center" }} >
                                            <MaterialSymbolsRounded font="robot_2" size="16"/>
                                        </Avatar>
                                }
                                <div className={`j-buyer-message-${_message.side}`} dangerouslySetInnerHTML={{__html: _message.message}}></div>
                            </Space>
                        ))
                    }
                </div>
                <Form form={form} className='cm-width100'>
                    <Form.Item noStyle={true} name={"message"} >
                        <Input autoFocus={true} style={{marginTop: "10px"}} bordered={false} placeholder={translate("common-labels.ben-ai")} suffix={<MaterialSymbolsRounded className='cm-cursor-pointer' font='arrow_forward' onClick={() => form.submit()}/>}/>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    const demoWindow = () => {
        return (
            <Space className="j-buyer-chat-layout cm-flex-center" direction="vertical" size={20}>
                <div className="cm-font-fam500 cm-font-size20 cm-text-align-center">You are in a demo account</div>
                <NavLink to={"/next-steps"} className="j-link-text">Contact Us</NavLink>
            </Space>
        )
    }

    const hideBookMarkBar = () => {
        localStorage.setItem(`${buyerPortalId}__showBookMarkBar`, "false")
        setShowBookmarkBar(false)
    }

    const handleBookMarkClick = (event: any) => {
        if (event.keyCode == 68 && (event.metaKey || event.ctrlKey)) {
            hideBookMarkBar()
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleBookMarkClick);
    }, [])

    const onVerify = () => {
        setIsProtectedVerified(false)
    }

    if(!templatePreview && $buyerData?.properties?.isGated){
        return (
            <EmailGateLayout/>
        )
    } else if(isProtectedVerified) {
        return <SectionProtected onVerify={onVerify} type="room-level"/>
    } else{
        return (
            <>
                {    
                    showBookmarkBar && !pageInIframe() && !$isMobile && !$isTemplatePreview ? 
                        <div className="j-buyer-bookmark-banner cm-flex-center" style={{background: `${THEME_COLOR_CONFIG[$orgProperties.brandColor ? $orgProperties.brandColor : THEME_DEFAULT].primaryColor}66`}}>
                            <div className="cm-font-fam400 cm-font-size13" style={{letterSpacing: "0.5px"}}>Press ⌘+D to bookmark this page for future reference!</div>
                            <MaterialSymbolsRounded font="close" className="j-buyer-bookmark-close cm-cursor-pointer" size="19" onClick={() => hideBookMarkBar()}/>
                        </div>
                    :
                        null
                }
                <Layout style={{height: showBookmarkBar && !pageInIframe() && !$isMobile && !$isTemplatePreview ? "calc(100% - 40px)" : "100%"}}>
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                        <HashRouter>
                            <Suspense fallback={<Loading/>}>
                                {
                                    // $orgProperties?.enableNewBuyerFlow === "true" ?
                                    $orgProperties?.buyerLayout === "2" ?
                                        <BuyerLayoutV2
                                            isMobile                =   {$isMobile}
                                            setIsIconAnimatingOut   =   {setIsIconAnimatingOut}
                                            isIconAnimatingOut      =   {isIconAnimatingOut}
                                            setIsProfileClicked     =   {setIsProfileClicked}
                                            isProfileClicked        =   {isProfileClicked}
                                        />
                                    :
                                        <BuyerLayout
                                            isMobile                =   {$isMobile}
                                            setIsIconAnimatingOut   =   {setIsIconAnimatingOut}
                                            isIconAnimatingOut      =   {isIconAnimatingOut}
                                            setIsProfileClicked     =   {setIsProfileClicked}
                                            isProfileClicked        =   {isProfileClicked}
                                        />
                                }
                                {
                                    $buyerData?.sellerAccount.type === "INTERNAL" &&
                                        <Popover rootClassName="j-chat-popover" placement="topRight" content={showChat ? chatWindow : demoWindow } trigger="click">
                                            <FloatButton rootClassName="j-buyer-chat-widget" icon={<MaterialSymbolsRounded font="chat" filled size="28"/>} type="primary" style={{ right: 30, bottom: 30, width: "50px", height: "50px" }} className="cm-flex-center"/>
                                        </Popover>
                                }
                            </Suspense>
                        </HashRouter>
                    </Worker>
                    {
                        $buyerData?.owner && isProfileClicked &&
                            <div className={`j-buyer-team-card-in-discovery-slider cm-position-absolute ${isIconAnimatingOut ? "slide-out-right" : "slide-in-right"}`} style={{top: "75px", right: "60px"}} ref={POCCardRef}>
                                <div style={{height: "75px", width: "75px", padding: "15px 0 0 15px", borderRadius: "12px"}}>
                                    <img style={{objectFit: "scale-down"}} className="cm-border-light cm-border-radius6" width={"100%"} height={"100%"} src={$buyerData.owner.profileUrl ? $buyerData.owner.profileUrl : PREVIEW_USER_ICON} />
                                </div>
                                <Space direction="vertical" className="cm-padding15 cm-flex cm-flex-space-between">
                                    <Space direction="vertical" className="cm-width100" size={10}>
                                        <Text ellipsis={{tooltip: CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName)}} className="cm-font-fam600 cm-font-size18 j-team-profile-name" style={{maxWidth: "200px"}}>{CommonUtil.__getFullName($buyerData.owner.firstName, $buyerData.owner.lastName)}</Text>
                                        <Text ellipsis={{tooltip: $buyerData.owner.emailId}} className="cm-secondary-text j-team-profile-name" style={{maxWidth: "200px"}}>{$buyerData.owner.emailId}</Text>
                                    </Space>
                                    <Space className="cm-flex cm-flex-space-between">
                                        <div>
                                            {$buyerData?.calendarUrl && (
                                                <Button  type="primary" ghost size="large"  onClick={() => {$isTalkToSalesEnabled  && $talkToUs.uuid ? (window.location.hash = `/section/${$talkToUs.uuid}`) : window.open(`${$buyerData?.calendarUrl}`, "_blank");}} className="cm-font-size14">
                                                    <Translate i18nKey="step.book-meeting" />
                                                </Button>
                                            )}
                                        </div>
                                        {$buyerData.owner.linkedInUrl ? <LinkedinFilled className='cm-cursor-pointer' style={{color: "#006097", fontSize: "27px", borderRadius: "6px"}} onClick={(event) => {event.stopPropagation(); window.open($buyerData.owner.linkedInUrl, "_blank")}}/> : null} 
                                    </Space>
                                </Space>
                            </div>
                    }
                    <NonGatedForm
                        isOpen  =   {$showPreviewForm}
                        onClose =   {() => {LocalCache.setData("isPreviewFormClosed", true); $setShowPreviewForm(false)}}
                    />
                </Layout>
            </>
        )
    }
}

export default BuyersLayout