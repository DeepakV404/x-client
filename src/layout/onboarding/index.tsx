import { useState } from "react";

import "../layout.css";
import "./onboarding.css";

import OnboardingHeader from "./header";
import OnboardingStep1 from "./step-1";
import OnboardingStep2 from "./step-2";
import OnboardingStep3 from "./step-3";
import OnboardingStep4 from "./step-4";

const Onboarding = (props: {step: number, tenantName: string, emailId: string}) => {

    const { step=0, tenantName, emailId }  =   props;

    const [fileList, setFileList]                   =   useState<any>([]);
    
    const [sampleFileUpload, setSampleFileUpload]   =   useState([]);

    const [currentStep, setCurrentStep]             =   useState<number>(step);

    const [linkData, setLinkData]                   =   useState<{copyLink: string, uuid: string, title: string} | undefined>(undefined);

    const navigateNext      = () => setCurrentStep((prevStep: number) => prevStep + 1);
    const navigatePrevious  = () => setCurrentStep((prevStep: number) => prevStep - 1);

    const getStep = (step: number) => {
        switch (step) {
            case 0:
                return <OnboardingStep1 onNext={navigateNext} onSkip={navigateNext}/>

            case 1:
                return <OnboardingStep2 onNext={navigateNext} onPrevious={navigatePrevious} onSkip={navigateNext}/>
        
            case 2:
                return <OnboardingStep3 fileList={fileList} setFileList={setFileList} sampleFileUpload={sampleFileUpload} setSampleFileUpload={setSampleFileUpload} onNext={navigateNext} onPrevious={navigatePrevious} setLinkData={setLinkData}/>
            
            case 3:
                return <OnboardingStep4 tenantName={tenantName} fileList={fileList} sampleFileUpload={sampleFileUpload} linkData={linkData} emailId={emailId} onPrevious={navigatePrevious} />
        }
    }

    return (
        <div className="cm-height100 j-onboarding-body">
            <OnboardingHeader/>
            {
                getStep(currentStep)
            }
        </div>
    )
}

export default Onboarding