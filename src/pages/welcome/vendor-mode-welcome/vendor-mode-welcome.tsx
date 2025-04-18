import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Steps, Space } from 'antd';

import { BUYERSTAGE_MARKETPLACE_LIBRARY } from '../../../constants/module-constants';
import { ONBOARDING_META } from '../../../layout/onboarding/api/onboarding-query';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import ShowcasePage from '../../settings/marketplace/showcase-page';
import Screenshots from '../../settings/marketplace/screenshots';
import Overview from '../../settings/marketplace/overview';
import OnboardedPage from '../onboarded-success';
import Loading from '../../../utils/loading';


const VendorModeWelcome = () => {

    const { $dictionary }   =   useContext(GlobalContext);

    const [showWelcome, setShowWelcome] =   useState(false);
    const [current, setCurrent]         =   useState(0); 

    let stepsArr        =   ["hasMPOverviewUpdated", "hasMPScreenshotsUpdated", "hasMPPageAdded"];
    
    const { data, loading, error }  =   useQuery(ONBOARDING_META, {
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(data){
            let notCompleted: any = [];
            stepsArr.some(function(element) {
                (data.onboardingDetails[element] === "false") ? notCompleted.push(element) : null
            });
            setCurrent((prevCurrent: any) => prevCurrent === 0 ? (notCompleted.length > 0 ? ((stepsArr.indexOf(notCompleted[0]) - 1) > 0 ?  (stepsArr.indexOf(notCompleted[0]) - 1) : 0) : 0) : prevCurrent)
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
            key         :   "overview",
            title       :   <div className={`cm-font-size14 ${current === 0 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Overview</div>,
            description :   <div className='cm-padding10'> </div>,
            status      :   data?.onboardingDetails.hasMPOverviewUpdated === "true" ? "finish" : (current === 0 ? "process" : "wait"),
            content     :   <Overview isHomePage/>
        },
        {
            key         :   "productScreens",
            title       :   <div className={`cm-font-size14 ${current === 1 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Product Screens</div>,
            description :   <div className='cm-padding10'> </div>,
            status      :   data?.onboardingDetails.hasMPScreenshotsUpdated === "true" ? "finish" : (current === 1 ? "process" : "wait"),
            content     :   <Screenshots isHomePage/>
        },
        {
            key         :   "chooseTemplate",
            title       :   <div className={`cm-font-size14 ${current === 2 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Choose {$dictionary.templates.singularTitle}</div>,
            description :   <div className='cm-padding10'> </div>,
            status      :   data?.onboardingDetails.hasMPPageAdded === "true" ? "finish" : (current === 2 ? "process" : "wait"),
            content     :   <ShowcasePage isHomePage/>
        },

    ];

    return (
        <>
            <div className='j-vendor-onboarding-wrapper cm-width100 cm-padding20'>
                <div className='j-mp-onboarding-flex-wrapper' style={{columnGap: "20px"}}>
                    <div style={{background: "#fff", borderRadius: "6px", padding: "25px 20px", width: "300px", overflow: "auto"}} className='cm-height100'>
                        <Space direction='vertical' style={{marginBottom: "25px"}} size={5}>
                            <div className='cm-font-fam600 hover-item'>Getting Started in <a href={BUYERSTAGE_MARKETPLACE_LIBRARY} target='_blank'><Space size={2}>Marketplace<MaterialSymbolsRounded font="open_in_new" size="16" className='cm-cursor-pointer show-on-hover-icon' color='#504f4fab'/></Space></a></div>
                            <div style={{color: "#000000AB", lineHeight: "22px"}}>we recommend completing the following steps and submit for marketplace</div>
                        </Space>
                        <Steps
                            direction   =   "vertical"
                            current     =   {current}
                            className   =   'j-onboarding-steps'
                            items       =   {onboarding_steps}
                            onChange    =   {(step: number) => setCurrent(step)}
                        />
                    </div>
                    <div style={{width: "calc(100% - 300px)", height: "100%", overflow: "auto"}}>
                        {onboarding_steps[current].content}
                    </div>
                </div>
            </div>
            <OnboardedPage isOpen={showWelcome} onClose={()=> closeWelcome()}/>
        </>
    )
}

export default VendorModeWelcome