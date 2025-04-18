import { Divider, Space, Typography} from "antd";

import { IMAGE_FALLBACK_IMAGE, LINK_FALLBACK_IMAGE, ONBOARDING_DEMO_SKELETON, PDF_FALLBACK_IMAGE, VIDEO_FALLBACK_IMAGE } from "../../../constants/module-constants";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography;

interface ComponentProps{
    accountLogo         :   string;
    onboardingData      :   any;
    metaData            :   any;
    stepClass           :   "step3" | "step4" | "step5";
    selectedSteps       :   string[];
    currentSelectedStep :   string | null;
} 

const DSRRoomSetupSkleton = (props: ComponentProps) => {

    const { accountLogo, onboardingData, stepClass, selectedSteps, currentSelectedStep, metaData } = props;

    const getSkeleton = () => {
        if(currentSelectedStep === "introduction"){
            return (
                <div className="cm-width100">
                    <div className="cm-position-relative">
                        <div className="j-banner-bg">
                            <div className="j-banner-bg-overlay"></div>
                        </div>
                        <div className="j-logos-container">
                            {
                                metaData?.logoUrl
                                ?
                                    <div className="j-logo1">
                                        <img style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "contain"}} src={metaData?.logoUrl} alt="Company"/>
                                    </div>
                                :
                                    <div className="j-logo1">BUYER LOGO</div>
                            }
                            <div className="j-logo2"><img width={"100%"} height={"100%"} src={accountLogo ?? "https://static.buyerstage.io/static-assets/company-logo.png"}/></div>
                        </div>
                    </div>
                    {onboardingData?.welcomeData ? <div className="j-onboarding-welcome-content">{onboardingData?.welcomeData}</div> : null}
                    <Divider style={{marginTop: onboardingData?.welcomeData ? '25px' : '50px'}}>
                        <div className="j-add-icon-skleton">+</div>
                    </Divider>
                    <div className="j-widget-preview-skleton cm-width100 fade-in" style={{height: "280px"}}></div>
                </div>
            )
        }else if(currentSelectedStep === "demo"){
            return (
                <div className="cm-width100 cm-height100 fade-in">
                    <div className="j-demo-usecase-header-skleton">
                        <div className="j-demo-usecase-header-title-skleton cm-font-opacity-black-67">Usecases</div>
                        <div className="cm-flex-align-center cm-padding-inline10 cm-font-size13">Use case 1</div>
                    </div>
                    <div className="j-demo-skleton-wrapper">
                        <Space className="cm-font-size14 cm-margin-bottom15"><MaterialSymbolsRounded font="smart_display" color="#DF2222" size="18"/> Video</Space>
                        <div className="j-widget-preview-skleton cm-width100 fade-in cm-flex-center" style={{height: "calc(100% - 35px)"}}>
                            {
                                onboardingData?.demoData && onboardingData?.demoData === "use_sample" ? <img src={ONBOARDING_DEMO_SKELETON}/> : null
                            }
                        </div>
                    </div>
                </div>
            )
        }else if(currentSelectedStep === "resources"){
            return (
                <div className="cm-width100 cm-height100 fade-in">
                    <div 
                        className="j-demo-skleton-wrapper" 
                        style={{
                            height: "calc(100% - 35px)", 
                            display: "flex",
                            flexDirection: "row",
                            overflow: "hidden",
                            flexWrap: "wrap",
                            gap: "15px"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            rowGap: "15px",
                            columnGap: "15px"
                        }}>
                            <div className={`j-resource-preview-skleton fade-in ${onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? "filled" : ""}`} style={{width: "200px", height: "200px"}}>
                                {
                                    onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? 
                                        <div>
                                            <img src={LINK_FALLBACK_IMAGE} width={"100%"} style={{borderRadius: "6px"}} className="fade-in"/> 
                                            <div style={{height: "10px", width: "60px", background: "#F3F4F6", borderRadius: "6px", marginTop: "15px"}}></div>
                                            <div style={{height: "10px", width: "160px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                            <div style={{height: "10px", width: "100px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                        </div>
                                    : 
                                        null
                                }
                            </div>
                            <div className={`j-resource-preview-skleton fade-in ${onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? "filled" : ""}`} style={{width: "200px", height: "200px"}}>
                                {
                                    onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? 
                                        <div>
                                            <img src={IMAGE_FALLBACK_IMAGE} width={"100%"} style={{borderRadius: "6px"}} className="fade-in"/> 
                                            <div style={{height: "10px", width: "60px", background: "#F3F4F6", borderRadius: "6px", marginTop: "15px"}}></div>
                                            <div style={{height: "10px", width: "160px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                            <div style={{height: "10px", width: "100px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                        </div>
                                    : 
                                        null
                                }
                            </div>
                            <div className="j-resource-preview-skleton fade-in" style={{width: "200px", height: "200px"}}></div>
                        </div>
                        <div style={{
                            display: "flex",
                            rowGap: "15px",
                            columnGap: "15px"
                        }}>
                            <div className={`j-resource-preview-skleton fade-in ${onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? "filled" : ""}`} style={{width: "200px", height: "200px"}}>
                                {
                                    onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? 
                                        <div>
                                            <img src={VIDEO_FALLBACK_IMAGE} width={"100%"} style={{borderRadius: "6px"}} className="fade-in"/> 
                                            <div style={{height: "10px", width: "60px", background: "#F3F4F6", borderRadius: "6px", marginTop: "15px"}}></div>
                                            <div style={{height: "10px", width: "160px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                        </div>
                                    : 
                                        null
                                }
                            </div>
                            <div className={`j-resource-preview-skleton fade-in ${onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? "filled" : ""}`} style={{width: "200px", height: "200px"}}>
                                {
                                    onboardingData?.resourcesData && onboardingData?.resourcesData === "use_sample" ? 
                                        <div>
                                            <img src={PDF_FALLBACK_IMAGE} width={"100%"} style={{borderRadius: "6px"}} className="fade-in"/> 
                                            <div style={{height: "10px", width: "60px", background: "#F3F4F6", borderRadius: "6px", marginTop: "15px"}}></div>
                                            <div style={{height: "10px", width: "160px", background: "#F3F4F6", borderRadius: "6px", marginTop: "10px"}}></div>
                                        </div>
                                    : 
                                        null
                                }
                            </div>
                            <div className="j-resource-preview-skleton fade-in" style={{width: "200px", height: "200px"}}></div>
                        </div>
                    </div>
                </div>
            )
        }else if(currentSelectedStep === "talk_to_us"){
            return (
                <div className="cm-width100 cm-height100 fade-in">
                    <div 
                        className="j-demo-skleton-wrapper" 
                        style={{
                            height: "calc(100% - 35px)", 
                            display: "flex",
                            flexDirection: "row",
                            overflow: "hidden",
                            flexWrap: "wrap",
                            gap: "15px",
                            alignItems: "flex-start",
                            alignContent: "flex-start",
                        }}
                    >
                        <div className="j-widget-preview-skleton fade-in" style={{width: "100%", height: "150px"}}>
                            <video src="https://us06web.zoom.us/rec/play/Fp6vl81rAYvDhsKH6O7jwHmaY_vp9xkGotklIZm-26EQhipAe0Vs3ow5zIM8vd-HuCEZSodi0xywEANZ.JN9zg2jZ-6Ufi2vG?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fus06web.zoom.us%2Frec%2Fshare%2FdF7Ia4xFWxeSKCO4QMVqI5T7FEBowI05gLhHdQZ4y-093XrCrF-M6A0RIRpKDVB2.ZtN6tCDz1lLy02tC"></video>
                        </div>
                        <div className="j-talk-to-us-app-icon-wrapper">
                            {
                                [...Array(18)].map((_el, index) => (
                                    <div className="j-widget-preview-skleton fade-in" style={{width: "50px", height: "50px"}} key={index}></div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )   
        }else if(currentSelectedStep === "case_studies"){
            return(
                <div className="cm-width100 cm-height100 fade-in">
                    <div 
                        className="j-demo-skleton-wrapper" 
                        style={{
                            height: "calc(100% - 35px)", 
                            display: "flex",
                            flexDirection: "row",
                            overflow: "hidden",
                            flexWrap: "wrap",
                            gap: "15px",
                            alignItems: "flex-start",
                            alignContent: "flex-start",
                        }}
                    >
                        <div className="j-widget-preview-skleton fade-in" style={{width: "100%", height: "150px"}}></div>
                        <Space size={20}>
                            <div className="j-widget-preview-skleton fade-in" style={{width: "150px", height: "150px"}}></div>
                            <Space direction="vertical" size={20}>
                                <div className="j-widget-preview-skleton fade-in" style={{width: "150px", height: "15px"}}></div>
                                <div className="j-widget-preview-skleton fade-in" style={{width: "150px", height: "15px"}}></div>
                                <div className="j-widget-preview-skleton fade-in" style={{width: "95px", height: "15px"}}></div>
                                <div className="j-widget-preview-skleton fade-in" style={{width: "70px", height: "25px", borderRadius: "4px"}}></div>
                            </Space>
                        </Space>
                        <Space direction="vertical" className="cm-flex-center cm-margin-top10">
                            <div className="j-widget-preview-skleton fade-in" style={{width: "350px", height: "15px"}}></div>
                            <div className="j-widget-preview-skleton fade-in" style={{width: "150px", height: "15px"}}></div>
                            <div className="j-widget-preview-skleton fade-in" style={{width: "70px", height: "25px", borderRadius: "4px"}}></div>
                        </Space>
                    </div>
                </div>
            )
        }
    }

    const getStep = (step: string) => {
        switch (step) {
            case "introduction":
                return {
                    emoji: "👋",
                    text: "Introduction",
                }
            case "demo":
                return {
                    emoji: "🖥️",
                    text: "Demo",
                }
            case "resources":
                return {
                    emoji: "📂",
                    text: "Resources",
                }
            case "case_studies":
                return {
                    emoji: "📈",
                    text: "Case Studies",
                }
            case "talk_to_us":
                return {
                    emoji: "💬",
                    text: "Talk to Us",
                }
        }
    }

    const stepsOrder = ["introduction", "demo", "resources", "case_studies", "talk_to_us"].filter(step => selectedSteps.includes(step));
    
    return (
        <div className={`j-onboarding-link-page-card ${stepClass}`}>
            <div className="j-onboarding-link-page-card-header cm-flex-align-center">
                <div className="cm-padding-top10 cm-padding-left10">
                    <img style={{width: "30px", height: "30px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-product-logo.svg`} alt='logo'/>
                </div>
            </div>
            <div className="j-onboarding-link-page-card-body cm-padding15" style={{display: "flex", flexDirection: "row", columnGap: "25px", height: "500px"}}>
                <div className="j-selected-steps-container">
                    <div className="cm-width100 cm-font-size13 cm-font-opacity-black-67 cm-margin-bottom5 cm-margin-top5 cm-margin-left20">Sections</div>
                    {
                        stepsOrder.map((_step) => (
                            <div key={_step} className={`j-selected-step-card fade-in ${currentSelectedStep === _step ? "selected" : ""}`}>
                                <div className="cm-font-size13">{getStep(_step)?.emoji}</div>
                                <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: getStep(_step)?.text}} className='cm-font-size13 cm-line-height22 cm-font-opacity-black-85'>{getStep(_step)?.text}</Text>
                            </div>
                        ))
                    }
                </div>
                <div style={{width: "calc(100% - 315px)", overflow: "hidden"}}>
                    {
                        getSkeleton()
                    }
                </div>
                <div className="j-widgets-skleton-wrapper">
                    <div className="cm-width100 cm-font-size12">Widgets</div>
                    {
                        Array(5).fill(0).map((_, index) => (
                            <div key={index} className="j-widget-card-skleton">
                                <div className="j-widget-card-skleton1"></div>
                                <div className="j-widget-card-skleton2"></div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default DSRRoomSetupSkleton
