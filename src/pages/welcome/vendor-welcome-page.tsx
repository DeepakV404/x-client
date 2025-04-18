import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Steps, Space, Typography } from 'antd';

import { ONBOARDING_ACCOUNT_SETUP, ONBOARDING_BANNER, ONBOARDING_MP_BRANDING, ONBOARDING_MP_FAQ, ONBOARDING_MP_OVERVIEW, ONBOARDING_MP_SCREENSHOTS, ONBOARDING_MP_SHOWCASE_PAGES, ONBOARDING_MP_UPDATE_TEMPLATES } from '../../constants/module-constants';
import { CommonUtil } from '../../utils/common-util';
import { GlobalContext } from '../../globals';

import SomethingWentWrong from '../../components/error-pages/something-went-wrong';
import OnboardedPage from './onboarded-success';
import Loading from '../../utils/loading';
import VendorOnboarding from './vendor-onboarding';
import { ONBOARDING_META } from '../../layout/onboarding/api/onboarding-query';

const { Text } = Typography

const VendorWelcomePage = () => {

    const { $user }     =   useContext(GlobalContext);

    const navigate      =   useNavigate();

    let stepsArr        =   ["hasOrgDataUpdated", "hasPersonalDataUpdated", "isBrandUpdated", "hasFaqUpdated", "hasMPOverviewUpdated", "hasMPScreenshotsUpdated", "hasTemplateUpdated", "hasMPPageAdded"];

    const [showWelcome, setShowWelcome] =   useState(false);
    const [current, setCurrent]         =   useState(0);
    
    const { data, loading, error }  =   useQuery(ONBOARDING_META, {
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(data){
            let notCompleted: any = [];
            stepsArr.some(function(element) {
                (data.onboardingDetails[element] === "false") ? notCompleted.push(element) : null
            });
            setCurrent(notCompleted.length > 0 ? ((stepsArr.indexOf(notCompleted[0]) - 1) > 0 ?  (stepsArr.indexOf(notCompleted[0]) - 1) : 0) : 0)
        }
    }, [data])

    useEffect(() => {
        if(CommonUtil.__getQueryParams(window.location.search)?.hasOwnProperty("signup-success")){
            setShowWelcome(true)
        }
    }, [window.location])


    const closeWelcome = () => {
        setShowWelcome(false)
        window.location.href = window.location.origin + window.location.pathname;
    }

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    let onboarding_steps: any = [
        {
            key         :   "accountSetup",
            title       :   <div className={`cm-font-size14 ${current === 0 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Set up Account</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   (data.onboardingDetails.hasOrgDataUpdated === "true" && data.onboardingDetails.hasPersonalDataUpdated === "true") ? "finish" : (current === 0 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Set up Account' 
                                ctaText     =   "Set up Account"
                                videoLink   =   {ONBOARDING_ACCOUNT_SETUP}
                                imgLink     =   {null}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Personal Details"</span>.</li>,
                                                    <li>Enter your Name, upload your photo, calendar link, and click on the <span className='cm-font-fam600'>"Update"</span> button.</li>,
                                                    <li>Go to <span className='cm-font-fam600'>"Organization Details"</span> section.</li>,
                                                    <li>Enter your Company Name, Industry Type, Website URL, etc to set up your Organization profile, and click on the <span className='cm-font-fam600'>"Update"</span> button.</li>]
                                                }
                                ctaLink     =   {() => navigate("/settings/personal-details")}
                            />
        },
        {
            key         :   "brandingAndTheme",
            title       :   <div className={`cm-font-size14 ${current === 1 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Branding & Theme</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data.onboardingDetails.isBrandUpdated === "true" ? "finish" : (current === 1 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Branding & Theme'
                                ctaText     =   'Customize'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_BRANDING}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Branding"</span> section.</li>,
                                                    <li>Update your Logo, Portal Name, and Theme color. </li>,
                                                    <li>Click on the <span className='cm-font-fam600'>"Update"</span> button</li>
                                                ]}
                                ctaLink     =   {() => navigate("/settings/branding")}
                            />
        },
        {
            key         :   "faq",
            title       :   <div className={`cm-font-size14 ${current === 2 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Set up FAQ</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data?.onboardingDetails.hasFaqUpdated === "true" ? "finish" : (current === 2 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Set up FAQ'
                                ctaText     =   'Set up FAQ'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_FAQ}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"FAQ"</span> section.</li>,
                                                    <li>Update your FAQ.</li>,
                                                    <li>Click on the <span className='cm-font-fam600'>"Add"</span> button</li>
                                                ]}
                                ctaLink     =   {() => navigate("/settings/faqs")}
                            />
        },
        {
            key         :   "overview",
            title       :   <div className={`cm-font-size14 ${current === 3 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Set up Marketplace</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data?.onboardingDetails.hasMPOverviewUpdated === "true" ? "finish" : (current === 3 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Set up Marketplace'
                                ctaText     =   'Set up Marketplace'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_OVERVIEW}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Buyerstage Marketplace"</span> section.</li>,
                                                    <li>Go to the Overview tab.</li>,
                                                    <li>Set up <span className='cm-font-fam600'>Overview</span></li>
                                                ]}
                                ctaLink     =   {() => navigate("/settings/marketplace")}
                            />
        },
        {
            key         :   "screenshots",
            title       :   <div className={`cm-font-size14 ${current === 4 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Add Screenshots</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data?.onboardingDetails.hasMPScreenshotsUpdated === "true" ? "finish" : (current === 4 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Add Screenshots'
                                ctaText     =   'Add Screenshots'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_SCREENSHOTS}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Buyerstage Marketplace"</span> section.</li>,
                                                    <li>Go to the <span className='cm-font-fam600'>Screenshots</span> tab.</li>,
                                                    <li>Add the screenshots.</li>
                                                ]}
                                ctaLink     =   {() => navigate("/settings/marketplace")}
                            />
        },
        {
            key         :   "templates",
            title       :   <div className={`cm-font-size14 ${current === 5 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Customize Templates</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data?.onboardingDetails.hasTemplateUpdated === "true" ? "finish" : (current === 5 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Customize Templates'
                                ctaText     =   'Customize Templates'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_UPDATE_TEMPLATES}
                                desc        =   {[
                                                    <li>Go to the <span className='cm-font-fam600'>"Templates"</span> tab at the top bar</li>,
                                                    <li>Find a template, <span className='cm-font-fam600'>"Marketplace Page"</span></li>,
                                                    <li>Customize the template by adding use case demos and other relevant details that you want to showcase to your audience. It is a completely DIY page.</li>
                                                ]}
                                ctaLink     =   {() => navigate("/templates")}
                            />
        },
        {
            key         :   "showcasePage",
            title       :   <div className={`cm-font-size14 ${current === 6 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Finish</div>,
            description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
            status      :   data?.onboardingDetails.hasMPPageAdded === "true" ? "finish" : (current === 6 ? "process" : "wait"),
            content     :   <VendorOnboarding
                                title       =   'Add Showcase Pages'
                                ctaText     =   'Add Showcase Pages'
                                videoLink   =   {null}
                                imgLink     =   {ONBOARDING_MP_SHOWCASE_PAGES}
                                desc        =   {[
                                                    <li>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Buyerstage Marketplace"</span> section.</li>,
                                                    <li>Go to the <span className='cm-font-fam600'>Showcase pages</span> tab.</li>,
                                                    <li>Under <span className='cm-font-fam600'>Showcase pages</span>, choose template <span className='cm-font-fam600'>"Marketplace Page"</span> and provide the audience you want to present the page to.</li>
                                                ]}
                                ctaLink     =   {() => navigate("/settings/marketplace")}
                            />
        }
    ];

    return (
        <>
            <div className='j-onboarding-wrapper cm-height100 cm-width100 cm-padding20'>
                <div className='j-onboarding-banner cm-flex-align-center' style={{backgroundImage: `url(${ONBOARDING_BANNER})`}}>
                    <Space direction='vertical' className='j-onboarding-banner-text'>
                        <span>
                            <Text className='cm-font-size24 cm-font-fam600 cm-white-text'>Hey, </Text>
                            <Text style={{maxWidth: "800px"}} ellipsis={{tooltip: CommonUtil.__getFullName($user.firstName, $user.lastName)}} className='cm-font-size24 cm-font-fam600 cm-white-text'>{CommonUtil.__getFullName($user.firstName, $user.lastName)}</Text>
                            <Text className='cm-font-size24 cm-font-fam600 cm-white-text'>!</Text>
                        </span>
                        <span className='cm-flex'>&#128075; Welcome to Buyerstage</span>
                    </Space>
                </div>
                <div className='j-onboarding-flex-wrapper'>
                    <div style={{background: "#fff", borderRadius: "6px", padding: "25px 20px", width: "300px", overflow: "auto"}} className='cm-height100'>
                        <Space direction='vertical' style={{marginBottom: "25px"}} size={5}>
                            <div className='cm-font-fam600 cm-font-size18'>Getting started</div>
                            <div style={{color: "#000000AB", lineHeight: "22px"}}>Steps to get listed in the marketplace</div>
                        </Space>
                        <Steps
                            direction   =   "vertical"
                            current     =   {current}
                            className   =   'j-onboarding-steps'
                            items       =   {onboarding_steps}
                            onChange    =   {(step: number) => setCurrent(step)}
                        />
                    </div>
                    <div style={{width: "calc(100% - 300px)", height: "100%", overflow: "auto", paddingBottom: "30px"}} className='cm-margin-top20'>
                        {onboarding_steps[current].content}
                    </div>
                </div>
            </div>
            <OnboardedPage isOpen={showWelcome} onClose={()=> closeWelcome()}/>
        </>
    )
}

export default VendorWelcomePage