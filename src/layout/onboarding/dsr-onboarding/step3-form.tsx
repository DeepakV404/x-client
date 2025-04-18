import React from 'react';
import { Form, Input, Space } from 'antd';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

interface ComponentProps{
    form                :   any;
    selectedSteps       :   string[];
    setSelectedSteps    :   React.Dispatch<React.SetStateAction<string[]>>;
}

const Step3Form = (props: ComponentProps) => {

    const { form, selectedSteps, setSelectedSteps } = props;
    
    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const clickedCard = target.closest(".j-step-3-option") as HTMLElement | null;

        if (!clickedCard) return;

        const stepKey = clickedCard.getAttribute("data-key");
        if (stepKey) {
            if (selectedSteps.includes(stepKey)) {
                setSelectedSteps(selectedSteps.filter(step => step !== stepKey));
            } else {
                setSelectedSteps([...selectedSteps, stepKey]);
            }
        }
    }

    return (
        <Space direction="vertical" className="cm-height100 cm-flex-center">
            <Space direction="vertical" style={{width: "420px"}}>
                <div className="cm-font-fam600 j-onboarding-step-title" >It all starts with Deal Room</div>
                <div className='cm-font-size14 cm-font-opacity-black-65' style={{lineHeight: "23px"}}>Your personalized deal room. Share materials, chat directly, and close deals faster. It's all about streamlining and wowing your buyers!</div>
                <Form form={form} layout="vertical" className="j-onboarding-form">   
                    <Form.Item label="Account / Room Name" name="name" className='cm-width100 cm-margin-top20' rules={[{required: true, message: "Account / Room Name", whitespace: true}]} initialValue={"Tesla"}>
                        <Input autoFocus placeholder="e.g., Google, Tesla" size="large"/>
                    </Form.Item>
                </Form>
                <div className='cm-font-opacity-black-65 cm-font-size14 cm-line-height22 cm-margin-bottom5'>What sections would you like to include in your deal room?</div>
                <Space direction='vertical' className='cm-width100' onClick={handleCardClick}>
                    <div data-key="introduction" key={"introduction"} className={`j-step-3-option ${selectedSteps.includes("introduction") ? "selected" : ""}`}>
                        <div style={selectedSteps.includes("introduction") ? {display: "none"} : {fontSize: "20px", height: "26px", width: "26px"}} >👋</div>
                        <div style={selectedSteps.includes("introduction") ? {} : {display: "none"}}><MaterialSymbolsRounded font='done' color={"#0065E5"} size='26'/></div>
                        <Space direction='vertical' size={0}>
                            <div className='cm-font-size14 cm-font-fam500 cm-line-height22'>Introduction</div>
                            <div className='cm-font-size13 cm-font-opacity-black-67 cm-line-height22'>Add welcome message and introductory product video.</div>
                        </Space>
                    </div>
                    <div data-key="demo" key={"demo"} className={`j-step-3-option ${selectedSteps.includes("demo") ? "selected" : ""}`}>
                        <div style={selectedSteps.includes("demo") ? {display: "none"} : {fontSize: "20px", height: "26px", width: "26px"}}>🖥️</div>
                        <div style={selectedSteps.includes("demo") ? {} : {display: "none"}}><MaterialSymbolsRounded font='done' color={"#0065E5"} size='26'/></div>
                        <Space direction='vertical' size={0}>
                            <div className='cm-font-size14 cm-font-fam500 cm-line-height22'>Demo</div>
                            <div className='cm-font-size13 cm-font-opacity-black-67 cm-line-height22'>Include demo videos and product tour.</div>
                        </Space>
                    </div>
                    <div data-key="resources" key={"resources"} className={`j-step-3-option ${selectedSteps.includes("resources") ? "selected" : ""}`}>
                        <div style={selectedSteps.includes("resources") ? {display: "none"} : {fontSize: "20px", height: "26px", width: "26px"}}>📂</div>
                        <div style={selectedSteps.includes("resources") ? {} : {display: "none"}}><MaterialSymbolsRounded font='done' color={"#0065E5"} size='26'/></div>
                        <Space direction='vertical' size={0}>
                            <div className='cm-font-size14 cm-font-fam500 cm-line-height22'>Resources</div>
                            <div className='cm-font-size13 cm-font-opacity-black-67 cm-line-height22'>Upload sales collaterals, brochures, and more.</div>
                        </Space>
                    </div>
                    <div data-key="case_studies" key={"case_studies"} className={`j-step-3-option ${selectedSteps.includes("case_studies") ? "selected" : ""}`}>
                        <div style={selectedSteps.includes("case_studies") ? {display: "none"} : {fontSize: "20px", height: "26px", width: "26px"}}>📖</div>
                        <div style={selectedSteps.includes("case_studies") ? {} : {display: "none"}}><MaterialSymbolsRounded font='done' color={"#0065E5"} size='26'/></div>
                        <Space direction='vertical' size={0}>
                            <div className='cm-font-size14 cm-font-fam500 cm-line-height22'>Case Studies</div>
                            <div className='cm-font-size13 cm-font-opacity-black-67 cm-line-height22'>Share customer stories, and other valuable resources.</div>
                        </Space>
                    </div>
                    <div data-key="talk_to_us" key={"talk_to_us"} className={`j-step-3-option ${selectedSteps.includes("talk_to_us") ? "selected" : ""}`}>
                        <div style={selectedSteps.includes("talk_to_us") ? {display: "none"} : {fontSize: "20px", height: "26px", width: "26px"}}>💬</div>
                        <div style={selectedSteps.includes("talk_to_us") ? {} : {display: "none"}}><MaterialSymbolsRounded font='done' color={"#0065E5"} size='26'/></div>
                        <Space direction='vertical' size={0}>
                            <div className='cm-font-size14 cm-font-fam500 cm-line-height22'>Talk to us</div>
                            <div className='cm-font-size13 cm-font-opacity-black-67 cm-line-height22'>Share your calendar link for scheduling.</div>
                        </Space>
                    </div>
                </Space>
            </Space>
        </Space> 
    )
}

export default Step3Form