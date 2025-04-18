import { useState } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { useApolloClient } from '@apollo/client';

import { ONBOARDING_META } from './api/onboarding-query';

import LinkPageCard from './link-page-card';
import CopiedLink from "./copied-link.json"
import Lottie from 'react-lottie';

const { useForm }   =   Form;

interface ComponentProps{
    tenantName  :   string;
    onPrevious  :   () => void;
    linkData?   :   {
        copyLink    :   string,
        title       :   string,
        uuid        :   string
    }; 
    fileList    :   any;
    sampleFileUpload : any;
    emailId     :   string;
}

const OnboardingStep4 = (props: ComponentProps) => {

    const { onPrevious, linkData, fileList, tenantName, sampleFileUpload, emailId }  =   props;

    const $client                   =   useApolloClient();
    const [ form ]                  =   useForm();

    const [copy, setCopy]                   =   useState<boolean>(false);
    const [showAnimation, setShowAnimation] =   useState<boolean>(false);
    const link                              =   `${linkData?.copyLink}?bs_email=${emailId ?? "jamesdoe@acmeinc.com"}`;

    const handleNext = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.stopPropagation()
        window.navigator.clipboard.writeText(link!)
        const deckUrl = `${tenantName}#/links/${linkData?.uuid}`;
        window.open(link, "_blank");
        window.location.href = deckUrl;
        $client.refetchQueries({include: [ONBOARDING_META]})
    }

    const onCopy = () => {
        window.navigator.clipboard.writeText(link!);
        setShowAnimation(true); 
        setCopy(true)
        setTimeout(() => setCopy(false), 1500);
        setTimeout(() => setShowAnimation(false), 1500);
    };

    const animationOptions = {
        loop: false,
        autoplay: true,
        animationData: CopiedLink,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handlePrevious = () => {
        onPrevious()
    }

    return (
        <div className="cm-flex cm-width100" style={{height: "calc(100% - 61px)"}}>
            <div className="j-onboarding-step-1-left-bg">
                <Space direction="vertical" className="cm-height100 cm-flex-center">
                    <Space direction="vertical" style={{width: "400px"}}>
                        <div className="cm-font-fam600 j-onboarding-step-title">See the magic 🪄</div>
                        <div className='cm-font-size14 cm-font-opacity-black-65 cm-font-fam500' style={{lineHeight: "23px"}}>Copy the link to view, or click 'See it in action' to experience the magic</div>
                        <Form form={form} layout="vertical" className="j-onboarding-form">   
                            <Form.Item label="Link" name="name" className='cm-width100 cm-margin-top20' initialValue={link}>
                                <Input placeholder="https://portal.buyerstage.io/portal/linkname?bs_email=jamesdoe@acme.io" size="large" readOnly allowClear={false}/>
                            </Form.Item>
                        </Form>
                        <div style={{position: "relative"}}>
                            {showAnimation && (
                                <Lottie options={animationOptions} height={150} width={150} style={{position: "absolute", top: "-150px", left: "140px"}}/>
                            )}
                            <Button style={{borderRadius: "12px"}} type='primary' className='cm-width100 cm-font-size14' size='large' onClick={() => link ? onCopy() : {}}>{copy ? "Copied" : "Copy Link"}</Button>
                        </div>
                    </Space>
                </Space>
                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                    <div className="cm-secondary-text" style={{paddingLeft: "60px"}}>4 of 4</div>
                    <Space style={{paddingRight: "60px"}} size={10}>
                        {
                            !linkData?.copyLink &&
                                <Button size="large" onClick={!linkData?.copyLink ? handlePrevious : () => {}}>Previous</Button>
                        }
                        <a href={link} target='_blank' onClick={handleNext}>
                            <Button size="large" className='cm-border-none' style={{backgroundColor: "#29C996", color: "#fff"}} >
                                See it in action
                            </Button>
                        </a>
                    </Space>
                </div>
            </div>
            <div className="j-onboarding-step-1-right-bg">
                <div className="j-onboarding-step-3-element-1"></div>
                <div className="j-onboarding-step-3-element-2"></div>
                <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                    <LinkPageCard stepClass='step4' uploadedFiles={fileList} linkTitle={linkData?.title} sampleFile={sampleFileUpload}/>
                </div>
            </div>
        </div>
    )
}

export default OnboardingStep4