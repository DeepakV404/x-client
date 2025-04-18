import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client"
import { Button, Divider, Layout, Space, Tooltip } from "antd";

import { GlobalContext } from "../../../globals";
import { PermissionCheckers } from "../../../config/role-permission";
import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { RT_SECTION } from "../../templates/api/room-templates-query";
import { MODULE_TEMPLATE, NO_WIDGETS_ADDED } from "../../../constants/module-constants";

import CustomSectionLayoutSider from "../room-settings/section-layout/custom-section-layout-slider";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import SectionTitle from "../room-settings/section-title";
import Loading from "../../../utils/loading";
import Sider from "antd/es/layout/Sider";
import SectionWidgets from "../room-settings/section-widgets";
import NoResultFound from "../../../components/no-result-found";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import AddWidgetModal from "../room-settings/section-layout/add-widget/add-widget-modal";
import TeamCardsWidget from '../room-settings/section-layout/team-card-widget/index';
import EmbedWidget from "../room-settings/section-layout/embed-widget";
import ResourceWidget from "../room-settings/section-layout/resource-widget";
import FeatureWidget from "../room-settings/section-layout/feature-widget";
import TextWidget from "../room-settings/section-layout/text-widget";
import ButtonWidget from "../room-settings/section-layout/button-widget";
import CarouselWidget from "../room-settings/section-layout/carousel-widget";
import ContactCardWidget from "../room-settings/section-layout/contact-card-widget";
import FileUploadWidget from "../room-settings/section-layout/upload-widget";
import HeaderWidget from "../room-settings/section-layout/header-widget";

const widgetComponentsMap: any = {
    TEXT            : TextWidget,
    RESOURCE        : ResourceWidget,    
    BUTTON          : ButtonWidget,
    CAROUSEL        : CarouselWidget,
    EMBEDDED        : EmbedWidget,
    FEATURE         : FeatureWidget,
    TEAMS_CARD      : TeamCardsWidget,
    CONTACT_CARD    : ContactCardWidget,
    FILE_UPLOAD     : FileUploadWidget,
    HEADER          : HeaderWidget,  
};

const EditSection = (props: {currentSection: any, setCurrentView: any, sectionData: any, roomTemplate: any}) => {

    const { currentSection, setCurrentView, sectionData, roomTemplate } = props

    const sectionBodyRef            =      useRef<HTMLDivElement>(null);
    
    const { $user }                 =   useContext(GlobalContext);

    const SectionEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const [newWidgetId, setNewWidgetId]             =   useState("");

    const [widgetSlider, setWidgetSlider]           =   useState(true);
    const [isWidgetModalOpen, setIsWidgetModalOpen] =   useState(false);
    const [currentOrder, setCurrentOrder]           =   useState<number>(0);

    const [prevWidgetCount, setPrevWidgetCount]     =   useState<number>(0);

    const { data, loading, error }    =   useQuery(RT_SECTION, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   roomTemplate.uuid, 
            sectionUuid     :   currentSection.id
        }
    })

    useEffect(() => {
        if(data?._rtSection?.widgets?.length > prevWidgetCount && data?._rtSection?.widgets?.filter((_widget: any) => _widget.uuid === newWidgetId)?.length){
            const newlyAddedElement = sectionBodyRef.current?.querySelector(`[id='${newWidgetId}']`);            
            if(newlyAddedElement) {
                newlyAddedElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
            setPrevWidgetCount(data?._rtSection?.widgets?.length || 0)
        }
    }, [data?._rtSection?.widgets.length]);

    const handleAddWidgetClick = (order: number) => {
        setCurrentOrder(order);
        setIsWidgetModalOpen(true);
    };
    
    if (loading) return <Loading/>;
    if (error) return <SomethingWentWrong/>;

    return (
        <Layout className="j-room-custom-section-layout cm-height100 cm-width100" style={{backgroundColor: "#F5F7F9"}}>
            <div className="j-room-custom-section-body cm-flex-justify-center">
                <div ref={sectionBodyRef} className="cm-padding15" style={{width: "100%"}}>
                    <SectionTitle sectionId={currentSection.id} section={data._rtSection} kind={"Templates"} setCurrentView={setCurrentView} sectionData={sectionData}/>
                    {/* {
                        data?._rtSection?.widgets.length > 0 &&
                            <div className="cm-position-relative">
                                <Divider dashed style={{borderColor: "#E8E8EC", marginBlock: "40px"}}/>
                                <div className={`j-section-add-widget cm-margin-bottom15 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"} cm-flex-center`}>
                                    <MaterialSymbolsRounded font="add" className="j-section-add-widget-icon cm-flex-center" size="22" onClick={() => SectionEditPermission ? handleAddWidgetClick(0) : {}}/>
                                </div>
                            </div>
                    } */}
                    {
                        data?._rtSection?.widgets.map((widget: any, index: number) => {
                            const WidgetComponent = widgetComponentsMap[widget.type];
                            const widgetOrder = widget.order;
                            return WidgetComponent && 
                                <div key={widget.uuid} id={widget.uuid} className="cm-margin-bottom15"> 
                                    <Space direction="vertical" className="cm-width100" size={0}>
                                        <WidgetComponent widget={widget} sectionId={currentSection.id} module={MODULE_TEMPLATE}/>
                                        <div className="cm-position-relative">
                                            <Divider dashed style={index === (data?._rtSection?.widgets?.length - 1) ? {marginBottom: "200px", marginTop: "10px", borderColor: "#E8E8EC"} : {borderColor: "#E8E8EC", marginBlock: "10px"}}/>
                                            <div className={`j-section-add-widget cm-margin-bottom15 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"} cm-flex-center`}>
                                                <MaterialSymbolsRounded font="add" className={`j-section-add-widget-icon cm-flex-center`} size="22" onClick={() => SectionEditPermission ? handleAddWidgetClick(widgetOrder) : {}}/>
                                            </div>
                                        </div>
                                    </Space>
                                </div>
                        })
                    }
                    {
                        data._rtSection.widgets.length === 0 &&
                            <Space className="cm-flex-center cm-width100" direction="vertical" style={{height: "calc(100% - 200px)"}} size={12}>
                                <img src={NO_WIDGETS_ADDED} width={75} height={75}/>
                                <NoResultFound message={"Add a Widget to Get Started"} description={"Customize Widgets to Meet Your Exact Needs"}/>
                                <div className="cm-cursor-pointer cm-flex-center cm-margin-top10">
                                {
                                    SectionEditPermission ?
                                        <Button className="cm-icon-button" type="primary" ghost onClick={() => setIsWidgetModalOpen(true)}><Space><MaterialSymbolsRounded font="add" size="22"/>Add Widget</Space></Button>
                                    :
                                        <Tooltip title="You don't have permission">
                                            <Button className="cm-icon-button" disabled={!SectionEditPermission} type="primary" ghost onClick={() => {}}><Space><MaterialSymbolsRounded font="add" size="22"/>Add Widget</Space></Button>
                                        </Tooltip>
                                }
                                </div>
                            </Space>
                    }
                </div> 
            </div>
            <Sider trigger={null} collapsedWidth={0} collapsible={true} collapsed={widgetSlider} className="cm-background-white cm-overflow-auto">
                <SectionWidgets setWidgetSlider={setWidgetSlider} sectionId={currentSection.id} setNewWidgetId={setNewWidgetId}/>
            </Sider>
            <CustomSectionLayoutSider sectionId={currentSection.id} kind="template" widgets={data._rtSection.widgets} setWidgetSlider={setWidgetSlider}/>
            <AddWidgetModal 
                isOpen          =   {isWidgetModalOpen} 
                onClose         =   {() => setIsWidgetModalOpen(false)} 
                sectionId       =   {currentSection.id} 
                currentOrder    =   {currentOrder} 
                setNewWidgetId  =   {setNewWidgetId}
            />
        </Layout>
    );
}

export default EditSection;
