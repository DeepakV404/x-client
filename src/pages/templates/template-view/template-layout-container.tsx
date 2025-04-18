import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Button, Space } from "antd"

import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { NEXT_STEPS_EMPTY } from "../../../constants/module-constants";
import { PermissionCheckers } from "../../../config/role-permission";
import { TEMPLATE_STEP_ADDED } from "../../../tracker-constants";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { RT_SECTION } from "../api/room-templates-query";
import { CommonUtil } from "../../../utils/common-util";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";

import SellerResources from "../../rooms/room-view/edit-resources";
import EditSection from "../../rooms/room-view/edit-section";
import TemplateTalkToUs from "./template-talk-to-us";
import TemplateStepView from "./template-step-view";
import Loading from "../../../utils/loading";
import TemplateDemo from "./template-demo";
import TemplateFaq from "./template-faq";
import EditHome from "./template-home";

const TemplateLayoutContainer = (props: { currentStage: any, roomTemplate: any, sectionsData: any, setCurrentView: any, stepData: any }) => {

    const { currentStage, roomTemplate, sectionsData, setCurrentView, stepData }  =   props;

    const { $user }                 =   useContext(GlobalContext);

    const TemplateEditPermission    =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');   

    const { data: eData, loading }    =   useQuery(RT_SECTION, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   roomTemplate.uuid, 
            sectionUuid     :   currentStage.id
        }
    })

    const handleAddStepClick = () => {
        RoomTemplateAgent.addRoomTemplateStage({
            variables: {
                templateUuid: roomTemplate.uuid,
                input: {
                    title: "Untitled",
                    isEnabled: true,
                    isHidden: false
                }
            },
            onCompletion: (data: any) => {
                setCurrentView({
                    id  :   data._rtAddStage.uuid,
                    type:   "step"
                });
                AppTracker.trackEvent(TEMPLATE_STEP_ADDED, {});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const _getLayoutEditor = (currentStage: any) => {
        switch (currentStage.type) {
            case "WELCOME":
                return <EditHome roomTemplate={roomTemplate} id={currentStage.id} sectionData={sectionsData} section={eData._rtSection} setCurrentView={setCurrentView}/>

            case "DEMO": 
                return <TemplateDemo roomTemplate={roomTemplate} sectionData={eData._rtSection} id={currentStage.id}/>

            case "RESOURCES": 
                return <SellerResources roomTemplate={roomTemplate} sectionData={eData._rtSection} id={currentStage.id}/>

            case "TALK_TO_US":
                return <TemplateTalkToUs roomTemplate={roomTemplate} sectionData={eData._rtSection} id={currentStage.id}/>

            case "FAQ":
                return <TemplateFaq />

            default:
                if(currentStage.type === "CUSTOM_SECTION"){
                    return (
                        <EditSection 
                            roomTemplate        =   {roomTemplate} 
                            sectionData         =   {sectionsData} 
                            currentSection      =   {currentStage} 
                            setCurrentView      =   {setCurrentView}
                        />
                    )
                }else{
                    if(currentStage?.id){
                        return (
                            <TemplateStepView 
                                stepData        =   {stepData} 
                                sectionData     =   {sectionsData} 
                                currentStage    =   {currentStage} 
                                setCurrent      =   {setCurrentView}
                            />
                        )
                    }else{
                        return (
                            <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-background-gray cm-height100 cm-overflow-auto">
                                <img src={NEXT_STEPS_EMPTY} alt="No next steps found"/>
                                <div className="cm-font-size18 cm-font-fam500">Mutual Action Plan</div>
                                <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                    Organize and add action items across stages to keep everyone aligned and drive success
                                </div>
                                {
                                    TemplateEditPermission &&
                                        <Button className="cm-flex-center cm-margin-top15" type="primary" onClick={handleAddStepClick}>
                                            Add New Step
                                        </Button>
                                }
                            </Space>
                        )
                    }
                }
        }
    }

    if(loading) return <Loading/>

    return _getLayoutEditor(currentStage)
}

export default TemplateLayoutContainer