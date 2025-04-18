import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button, Form, Space } from 'antd';

import DSRRoomSetupSkleton from './dsr-room-setup-skleton';
import LinkLoading from '../link-loading';
import Step3Form from './step3-form';
import Step4Form from './step4-form';
import Step5Form from './step-5';

import { CHUNK_SIZE, ONBOARDING_LAST_IMAGE } from '../../../constants/module-constants';
import { LOOK_UP_ACCOUNT } from '../../../pages/accounts/api/accounts-query';
import { REQUEST_BLOB_URLS } from '../../../pages/library/api/library-query';
import { OnboardingAgent } from '../api/onboarding-agent';
import { CommonUtil } from '../../../utils/common-util';

interface ComponentProps{
    accountLogo         :   string;
    currentStep         :   number;
    onNext              :   () => void;
    onPrevious          :   () => void;
    selectedSteps       :   string[];
    setSelectedSteps    :   React.Dispatch<React.SetStateAction<string[]>>;
}

const { useForm } = Form;

const DSROnboardingStep3 = (props: ComponentProps) => {

    const { accountLogo, currentStep, onNext, onPrevious, setSelectedSteps, selectedSteps }    =   props;
    
    const [form]            =   useForm();
    const [lastFormRef]     =   useForm();

    const [loading, setLoading]                 =   useState(false);
    const [currentSegment, setCurrentSegment]   =   useState<(string | null)>("introduction");
    const [onboardingData, setOnboardingData]   =   useState<any>(null);
    const [resourcesList, setResourcesList]     =   useState([]);
    const [demosList, setDemosList]             =   useState([]);
    const [caseStudyList, setCaseStudyList]     =   useState([]);
    const [buyerName, setBuyerName]             =   useState("");
    const [metaData, setMetaData]               =   useState(null);

    const [_lookUpAccount]                      =   useLazyQuery(LOOK_UP_ACCOUNT, {
        fetchPolicy: "network-only"
    });

    const [_getBlobUrls]                        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});
    
    const requestBlobURLs: any = async (parts: number, file: string) => {

        const urls = await _getBlobUrls({
            variables: {
                numberOfParts: parts,
                contentType: file
            }
        })

        return urls.data.requestBlobUrls
    }
    
    const getPresignedUrls = async (file: any) => {
        const numberOfParts     =   Math.ceil(file.size / CHUNK_SIZE);
        const response          =   await requestBlobURLs(numberOfParts, file.type)
        return {urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId}
    }

    const uploadResources = async (uploadBlobList: any) => {
        let requestedBlobs: any[] = [];
    
        if (uploadBlobList.length > 0) {    
            for (const _file of uploadBlobList) {
                const currentFile = _file.originFileObj;
                if (currentFile) {
                    const { urls, contentId, uploadId } = await getPresignedUrls(currentFile);
    
                    try {
                        await new Promise((resolve) => {
                            CommonUtil.__uploadToS3(
                                currentFile,
                                urls,
                                contentId,
                                uploadId,
                                () => {
                                    requestedBlobs.push({
                                        contentUuid: contentId,
                                        contentType: _file.type,
                                        fileName: _file.name
                                    });
                                    resolve(true);
                                },
                            );
                        });
                    } catch (error) {
                        CommonUtil.__showError("Failed to upload file");
                    }
                }
            }
        }
    
        return requestedBlobs; // Ensure it contains all uploaded files
    };
    

    const handleNext = async () => {
        if(currentStep === 0){
            form.validateFields()
                .then((formData) => {
                    setBuyerName(formData.name);
                    _lookUpAccount({
                        variables: {
                            title:  formData.name
                        },
                        onCompleted: (data) => {
                            if(data?.lookupAccount?.status === "FOUND"){
                                setMetaData(data?.lookupAccount.data)
                            }
                        }
                    })
                    form.submit();
                    setSelectedSteps(selectedSteps);
                    onNext();
                })
                .catch((error) => {
                    console.error("Validation failed:", error);
                });
        }else if(currentStep === 2){

            setLoading(true);

            OnboardingAgent.createOrUpdateProperty({
                variables: {
                    key     :   "referral",
                    value   :   lastFormRef.getFieldValue("referral")
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })

            OnboardingAgent.createOrUpdateProperty({
                variables: {
                    key: "usecase",
                    value: lastFormRef.getFieldValue("usecase")
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })

            let onboardingInput: any  = {
                accountName: buyerName,
                sectionConfigs: selectedSteps.map(str => str.toUpperCase()),
                introContent: onboardingData?.welcomeData,
                calendarLink: onboardingData?.talkToUsData,
            };

            let demoUploadPromise: any = Promise.resolve(null);
            let resourcesUploadPromise: any = Promise.resolve(null);
            let caseStudiesUplodePromise: any = Promise.resolve(null);

            if (onboardingData?.demoData) {
                if (onboardingData?.demoData === "use_sample") {
                    onboardingInput["includeSampleUsecase"] = true;
                } else {
                    demoUploadPromise = uploadResources(demosList);
                }
            }

            if (onboardingData?.resourcesData) {
                if (onboardingData?.resourcesData === "use_sample") {
                    onboardingInput["includeSampleResource"] = true;
                } else {
                    resourcesUploadPromise = uploadResources(resourcesList);
                }
            }

            if (onboardingData?.caseStudyData) {
                if (onboardingData?.caseStudyData === "use_sample") {
                    onboardingInput["includeSampleCaseStudies"] = true;
                } else {
                    caseStudiesUplodePromise = uploadResources(caseStudyList);
                }
            }
            
            const [uploadedDemos, uploadedResources, uploadedCaseStudies] = await Promise.all([demoUploadPromise, resourcesUploadPromise, caseStudiesUplodePromise]);

            if (uploadedDemos) {
                onboardingInput["usecaseBlobs"] = uploadedDemos;
            }

            if (uploadedResources) {
                onboardingInput["resourceBlobs"] = uploadedResources;
            }

            if(uploadedCaseStudies) {
                onboardingInput["caseStudyResourceBlobs"] = uploadedCaseStudies;
            }

            OnboardingAgent.createRoomFromOnboarding({
                variables: {
                    input: onboardingInput
                },
                onCompletion: (data: any) => {
                    window.location.hash = `#rooms/${data?.createRoomInOnboarding?.accountStub.uuid}/${data?.createRoomInOnboarding?.uuid}/sections?onboarded=true`;
                },
                errorCallBack: () => {}
            })


        }else if(currentStep === 1){
            onNext();
        }
    }

    const handlePrevious = () => {
        onPrevious()
    }

    return (
        <div className="cm-flex cm-width100" style={{height: "calc(100% - 61px)"}}>
            <div className="j-onboarding-step-1-left-bg">
                {
                    loading ?
                        <div className="cm-height100 cm-flex-center">
                            <div className="cm-height100 cm-flex-center cm-flex-direction-column" style={{width: "320px", rowGap: "15px"}}>
                                <div className='cm-font-size18 cm-font-fam500'>Building Your Deal Room...</div>
                                <LinkLoading/>
                                <div className='cm-font-size13 cm-font-opacity-black-67'>The final touches are being applied.</div>
                            </div>
                        </div>
                    :
                        (currentStep === 0 ?
                            <Step3Form 
                                form                =   {form}  
                                selectedSteps       =   {selectedSteps} 
                                setSelectedSteps    =   {setSelectedSteps}
                            />
                        :
                            currentStep === 1 ?
                                <Step4Form 
                                    demosList           =   {demosList}
                                    setDemosList        =   {setDemosList}
                                    resourcesList       =   {resourcesList}
                                    setResourcesList    =   {setResourcesList}
                                    caseStudyList       =   {caseStudyList}
                                    setCaseStudyList    =   {setCaseStudyList}
                                    onboardingData      =   {onboardingData}
                                    selectedSteps       =   {selectedSteps} 
                                    setSelectedSteps    =   {setSelectedSteps}
                                    currentSegment      =   {currentSegment}
                                    setCurrentSegment   =   {setCurrentSegment}
                                    setOnboardingData   =   {setOnboardingData}
                                />
                            :
                                <Step5Form form={lastFormRef}/>
                        )
                }
                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                    <div className="cm-secondary-text" style={{paddingLeft: "60px"}}>{currentStep + 1} of 3</div>
                    {
                    currentStep === 2 ?
                            <Space style={{paddingRight: "60px"}}>
                                <Button size="large" onClick={handlePrevious} disabled={loading}>Previous</Button>
                                <Button size="large" type="primary" style={{background: loading ? "#4ccb73f0" : "#2FC25B", border: "none", color: loading ? "#f2f2f2" : "#fff"}} onClick={handleNext} disabled={loading}>Start using Buyerstage</Button>
                            </Space>
                        :
                            <Space style={{paddingRight: "60px"}} size={10}>
                                {
                                    currentStep !== 0 && 
                                        <Button size="large" onClick={handlePrevious}>Previous</Button>
                                }
                                <Button disabled={!selectedSteps.length} size="large" type="primary" onClick={handleNext}>Next</Button>
                            </Space>
                    }
                </div>
            </div>
            <div className="j-onboarding-step-1-right-bg">
                <div className="j-onboarding-step-3-element-1 anim"></div>
                <div className="j-onboarding-step-3-element-2 anim"></div>
                {
                    currentStep === 4 ?
                        <div className="cm-flex-center cm-height100 cm-width100">
                            <img src={ONBOARDING_LAST_IMAGE} style={{zIndex: 1}} className="fade-in"/>
                        </div>
                    :
                        <div style={{display: "flex", alignItems: "center", height: "100%"}}>
                            <DSRRoomSetupSkleton 
                                accountLogo         =   {accountLogo}
                                onboardingData      =   {onboardingData}
                                metaData            =   {metaData}
                                stepClass           =   {selectedSteps.length ? "step4" : "step3"}
                                selectedSteps       =   {selectedSteps}
                                currentSelectedStep =   {currentSegment}
                            />
                        </div>
                }
            </div>
        </div>
    )
}

export default DSROnboardingStep3