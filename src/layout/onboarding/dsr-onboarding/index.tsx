import { useState } from "react";

import "../../layout.css"
import "../onboarding.css";

import OnboardingHeader from "../header";
import DSROnboardingStep3 from "./step-3";

const DSROnboarding = (props: {step: number, tenantName: string, emailId: string, accountLogo: string}) => {

    const { step=0, accountLogo }  =   props;

    const [currentStep, setCurrentStep]             =   useState<number>(step);
    const [selectedSteps, setSelectedSteps]         =   useState<string[]>(["introduction", "demo", "resources"]); 

    const navigateNext      = () => setCurrentStep((prevStep: number) => (prevStep < 2 ? prevStep + 1 : prevStep));
    const navigatePrevious  = () => setCurrentStep((prevStep: number) => (prevStep > 0 ? prevStep - 1 : prevStep));

    const getStep = () => {
        return <DSROnboardingStep3 accountLogo={accountLogo} currentStep={currentStep} onNext={navigateNext} onPrevious={navigatePrevious} selectedSteps={selectedSteps} setSelectedSteps={setSelectedSteps}/>;
    };

    return (
        <div className="cm-height100 j-onboarding-body">
            <OnboardingHeader headerColor={'blue'}/>
            {
                getStep()
            }
        </div>
    )
}

export default DSROnboarding