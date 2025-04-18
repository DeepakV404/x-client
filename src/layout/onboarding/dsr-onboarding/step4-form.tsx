import { useRef } from 'react';
import { Button, Form, Input, Space, Upload } from 'antd';
import { ACCEPTED_FILE_TYPES, ACCEPTED_VIDEO_TYPES } from '../../../constants/module-constants';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

interface ComponentProps{
    onboardingData      :   any;
    resourcesList       :   any[];
    demosList           :   any[];
    caseStudyList       :   any[];
    currentSegment      :   string |  null;
    selectedSteps       :   string[];
    setSelectedSteps    :   React.Dispatch<React.SetStateAction<string[]>>;
    setCurrentSegment   :   React.Dispatch<React.SetStateAction<string | null>>;
    setOnboardingData   :   React.Dispatch<React.SetStateAction<any | null>>;
    setResourcesList    :   React.Dispatch<React.SetStateAction<any | null>>;
    setDemosList        :   React.Dispatch<React.SetStateAction<any | null>>;
    setCaseStudyList      :   React.Dispatch<React.SetStateAction<any | null>>;
}

const { TextArea }  =   Input;  
const { Dragger }   =   Upload;
const { useForm }   =   Form;

const Step4Form = (props: ComponentProps) => {

    const { demosList, resourcesList, caseStudyList, onboardingData, currentSegment, selectedSteps, setCurrentSegment, setOnboardingData, setResourcesList, setDemosList, setCaseStudyList } = props;

    const [form]    =   useForm();
    
    const segments = useRef<(HTMLDivElement | null)[]>([]);

    const handleWelcomeChange = (event: any) => {
        let welcomeText = event.target.value;
        setOnboardingData((prevData: any) => ({
            ...prevData,
            welcomeData : welcomeText  
        }))
    }

    const handleCalendarLinkChange = (event: any) => {
        let calendarlink = event.target.value;
        setOnboardingData((prevData: any) => ({
            ...prevData,
            talkToUsData : calendarlink  
        }))
    }

    const handleDemoUploadChange = (uploadObj: any) => {
        setDemosList(uploadObj.fileList)
        setOnboardingData((prevData: any) => ({
            ...prevData,
            demoData : uploadObj.fileList.length
        }))       
    }

    const handleResourcesUploadChange = (uploadObj: any) => {
        setResourcesList(uploadObj.fileList)
        setOnboardingData((prevData: any) => ({
            ...prevData,
            resourcesData : uploadObj.fileList.length
        }))       
    }

    const handleCaseStudyUploadChange = (uploadObj: any) => {
        setCaseStudyList(uploadObj.fileList)
        setOnboardingData((prevData: any) => ({
            ...prevData,
            caseStudyData : uploadObj.fileList.length
        }))       
    }

    const handleUseSampleDemoClick = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            demoData : "use_sample"
        }))  
    }

    const handleUseSampleResourcesClick = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            resourcesData : "use_sample"
        }))  
    }

    const handleUseSampleCaseStudiesClick = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            caseStudyData : "use_sample"
        }))
    }

    const handleRemoveDemo = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            demoData : null
        })) 
        setDemosList([])
    }

    const handleRemoveResources = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            resourcesData : null
        })) 
        setResourcesList([])
    }

    const handleRemoveCaseStudy = () => {
        setOnboardingData((prevData: any) => ({
            ...prevData,
            caseStudyData : null
        })) 
        setCaseStudyList([])
    }

    const handleUseWelcomeSample = () => {
        let staticContent = "Welcome to [Your Company Name]! We specialize in [briefly describe the main product/service, e.g., innovative software solutions, high-quality consumer electronics, etc.]. Our mission is to [state the mission or value proposition, e.g., empower businesses to achieve their goals through cutting-edge technology]. With a commitment to excellence and customer satisfaction, we strive to deliver [mention key benefits or features, e.g., user-friendly products that enhance productivity and streamline operations]. Join us on this journey as we redefine [industry or market focus, e.g., digital transformation, home entertainment, etc.]."
        form.setFieldsValue({
            ["introduction"] : staticContent
        })
        setOnboardingData((prevData: any) => ({
            ...prevData,
            welcomeData : staticContent  
        }))
    }

    const segmentData: any = {
        "introduction"   :   {
            title: "👋 Introduction",
            description: "Build trust and credibility by sharing your company's mission, values, and successes.",
            content: (
                <Space direction='vertical' className='cm-width100'>
                    <Form.Item name={"introduction"}>
                        <TextArea onChange={handleWelcomeChange} rows={8} style={{borderRadius: "8px"}} placeholder='eg., The Ultimate Buyer Enablement Platform to Simplify Journeys'/>
                    </Form.Item>
                    <div className='cm-flex-center'>
                        <Button size='small' type='primary' className='cm-font-size12' onClick={() => handleUseWelcomeSample()}>Use Sample</Button>
                    </div>
                </Space>
            )
        },
        "demo": {
            title: "🖥️ Product Demo",
            description: "Showcase your product in action. Let buyers visualize the possibilities!",
            content: (
                <div style={{marginInline: '50px'}}>
                    <Dragger 
                        style                   =   {{borderRadius: "12px"}}
                        customRequest           =   {() => {}}
                        showUploadList          =   {false}
                        onChange                =   {handleDemoUploadChange}
                        accept                  =   {ACCEPTED_VIDEO_TYPES}
                        className               =   "j-onboarding-upload cm-margin-top15 cm-margin-bottom0"
                        multiple                =   {true}
                        maxCount                =   {5}
                        fileList                =   {demosList} 
                    >
                        <Space size={10}>
                            <Button size='small' className='cm-font-size13'><Space size={4}><MaterialSymbolsRounded font='upload' size='16' weight='400'/> Upload files</Space></Button>
                            OR
                            <Button size='small' type='primary' className='cm-font-size13' onClick={(event) => {event.stopPropagation(); handleUseSampleDemoClick()}}>Use sample</Button>
                        </Space>
                    </Dragger>
                    {
                        onboardingData?.demoData ? 
                            (
                                onboardingData?.demoData === "use_sample" 
                                ? 
                                    <Space className='cm-flex-center cm-margin-top15'>
                                        <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                        <div className='cm-font-fam300 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>Sample resources</div>
                                        <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveDemo()}/>
                                    </Space>
                                :
                                    demosList.length > 0 
                                    && 
                                        <Space className='cm-flex-center cm-margin-top15'>
                                            <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                            <div className='cm-font-fam300 cm-font-opacity-black-67 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>{demosList.length} file(s) uploaded</div>
                                            <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveDemo()}/>
                                        </Space>
                            )
                        :
                            null

                    }
                </div>
            )
        },
        "resources": {
            title: "📂 Resources",
            description: "Upload presentations, brochures - anything that seals the deal.",
            content: (
                <div style={{marginInline: '50px'}}>
                    <Dragger 
                        style                   =   {{borderRadius: "12px"}}
                        customRequest           =   {() => {}}
                        showUploadList          =   {false}
                        onChange                =   {handleResourcesUploadChange}
                        accept                  =   {ACCEPTED_FILE_TYPES}
                        className               =   "j-onboarding-upload cm-margin-top15 cm-margin-bottom0"
                        multiple                =   {true}
                        maxCount                =   {5}
                        fileList                =   {resourcesList} 
                    >
                        <Space size={10}>
                            <Button size='small' className='cm-font-size13'><Space size={4}><MaterialSymbolsRounded font='upload' size='16' weight='400'/> Upload files</Space></Button>
                            OR
                            <Button size='small' type='primary' className='cm-font-size13' onClick={(event) => {event.stopPropagation(); handleUseSampleResourcesClick()}}>Use sample</Button>
                        </Space>
                    </Dragger>
                    {
                        onboardingData?.resourcesData ? 
                            (
                                onboardingData?.resourcesData === "use_sample" 
                                ? 
                                    <Space className='cm-flex-center cm-margin-top15'>
                                        <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                        <div className='cm-font-fam300 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>Sample resources</div>
                                        <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveResources()}/>
                                    </Space>
                                :
                                    resourcesList.length > 0 
                                    && 
                                        <Space className='cm-flex-center cm-margin-top15'>
                                            <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                            <div className='cm-font-fam300 cm-font-opacity-black-67 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>{resourcesList.length} file(s) uploaded</div>
                                            <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveResources()}/>
                                        </Space>
                            )
                        :
                            null

                    }
                </div>
            )
        },
        "case_studies": {
            title: "📈 Case Studies",
            description: "Share customer stories, white papers, and more that demonstrate value to your buyers.",
            content: (
                <div style={{marginInline: '50px'}}>
                    <Dragger 
                        style                   =   {{borderRadius: "12px"}}
                        customRequest           =   {() => {}}
                        showUploadList          =   {false}
                        onChange                =   {handleCaseStudyUploadChange}
                        accept                  =   {ACCEPTED_FILE_TYPES}
                        className               =   "j-onboarding-upload cm-margin-top15 cm-margin-bottom0"
                        multiple                =   {true}
                        maxCount                =   {5}
                        fileList                =   {caseStudyList} 
                    >
                        <Space size={10}>
                            <Button size='small' className='cm-font-size13'><Space size={4}><MaterialSymbolsRounded font='upload' size='16' weight='400'/> Upload files</Space></Button>
                            OR
                            <Button size='small' type='primary' className='cm-font-size13' onClick={(event) => {event.stopPropagation(); handleUseSampleCaseStudiesClick()}}>Use sample</Button>
                        </Space>
                    </Dragger>
                    {
                        onboardingData?.caseStudyData ? 
                            (
                                onboardingData?.caseStudyData === "use_sample" 
                                ? 
                                    <Space className='cm-flex-center cm-margin-top15'>
                                        <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                        <div className='cm-font-fam300 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>Sample case studies</div>
                                        <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveCaseStudy()}/>
                                    </Space>
                                :
                                    caseStudyList.length > 0 
                                    && 
                                        <Space className='cm-flex-center cm-margin-top15'>
                                            <MaterialSymbolsRounded font='attachment' size='20' color='#5F6368'/>
                                            <div className='cm-font-fam300 cm-font-opacity-black-67 cm-font-size13 cm-text-align-center cm-cursor-pointer' style={{lineHeight: "21px"}}>{caseStudyList.length} file(s) uploaded</div>
                                            <MaterialSymbolsRounded font='cancel' size='16' filled color='#B8B8B8' className='cm-cursor-pointer' onClick={() => handleRemoveCaseStudy()}/>
                                        </Space>
                            )
                        :
                            null
                    }
                </div>
            )
        },
        "talk_to_us": {
            title: "💬 Talk to Us",
            description: "Share your calendar link for scheduling.",
            content: (
                <div style={{marginInline: '50px'}}>
                    <Form.Item name={"calendar-link"}>
                        <Input placeholder='https://calendly.com/demo' onChange={handleCalendarLinkChange} size={"large"} style={{fontSize: "14px", borderRadius: "8px"}}/>
                    </Form.Item>
                </div>
            )
        }
    }

    const scrollToSegment = (step: string) => {
        const index = selectedSteps.indexOf(step);
        if (index !== -1 && segments.current[index]) {
            segments.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setCurrentSegment(step);
        }
    };

    const isCardSelected = (cardId: string) => {
        switch (cardId) {
            case "introduction":
                if(onboardingData?.welcomeData) return true
                return false

            case "demo":
                if(onboardingData?.demoData) return true
                return false
            
            case "resources":
                if(onboardingData?.resourcesData) return true
                return false

            case "case_studies":
                if(onboardingData?.caseStudyData) return true
                return false
            
            case "talk_to_us":
                if(onboardingData?.talkToUsData) return true
                return false
    
            default:
                return false;
        }
    }

    const stepsOrder = ["introduction", "demo", "resources", "case_studies", "talk_to_us"].filter(step => selectedSteps.includes(step));
    

    return (
        <div className="j-step4-segment-scroller cm-height100">
            <div className='j-step4-segment-cards-wrapper'>
                {stepsOrder.map((step, index) => (
                    <div 
                        key         =   {step} 
                        ref         =   {el => segments.current[index] = el} 
                        className   =   {`j-step4-segment-card ${currentSegment === step ? "selected" : ""}`}
                        onClick     =   {() => scrollToSegment(step)}
                    
                    >
                        <div className="cm-flex-align-center cm-flex-direction-column cm-margin-top15" style={{paddingInline: "50px"}}>
                            <div className="cm-font-size20 cm-font-fam500">{segmentData[step].title}</div>
                            <p className="cm-font-fam300d cm-font-size14 cm-font-opacity-black-67 cm-text-align-center">{segmentData[step].description}</p>
                        </div>
                        {
                            isCardSelected(step) ? 
                                <div style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "10px",
                                }}>
                                    <MaterialSymbolsRounded font='check_circle' filled color='#3EB200'/>
                                </div>
                            :
                                null
                        }
                        <div className='cm-margin-top15' style={{marginBottom: "30px"}}>
                            <Form 
                                form={form}
                            >
                                {segmentData[step].content}
                            </Form>
                        </div>
                        <div className='cm-font-size11 cm-font-opacity-black-67 cm-flex-justify-end '>(Optional)</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step4Form;
