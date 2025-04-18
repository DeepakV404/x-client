import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button, Divider, Layout, Space, Tooltip } from "antd";

import { MODULE_ROOM, NO_WIDGETS_ADDED } from "../../../../constants/module-constants";
import { PermissionCheckers } from "../../../../config/role-permission";
import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { GlobalContext } from "../../../../globals";
import { useRoomContext } from "../../room-layout";
import { R_SECTION } from "../../api/rooms-query";
import { useCustomSectionContext } from "..";

import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import CustomSectionLayoutSider from "./custom-section-layout-slider";
import NoResultFound from "../../../../components/no-result-found";
import Loading from "../../../../utils/loading";
import SectionWidgets from "../section-widgets";
import SectionTitle from "../section-title";
import Sider from "antd/es/layout/Sider";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import RoomNextSteps from "../room-next-steps/room-next-steps";
import AddWidgetModal from "./add-widget/add-widget-modal";
import ContactCardWidget from "./contact-card-widget";
import EmbedWidget from "./embed-widget";
import ResourceWidget from "./resource-widget";
import TextWidget from "./text-widget";
import ButtonWidget from "./button-widget";
import CarouselWidget from "./carousel-widget";
import FeatureWidget from "./feature-widget";
import TeamCardsWidget from "./team-card-widget";
import EditHome from "../room-home";
import RoomDemo from "../room-demo";
import RoomTalkToUs from "../room-talk-to-us";
import FileUploadWidget from "./upload-widget";
import RoomResources from "../room-resources";
import RoomFaq from "../room-faq/room-faq";
import HeaderWidget from "./header-widget";
import { ORG_PROPERTIES } from "../../../settings/api/settings-query";

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

const CustomSectionLayout = (props: { sectionId?: string, setCurrentPage?: any, kind? : any }) => {

    const { setCurrentPage } = props;

    const sectionBodyRef                    =   useRef<HTMLDivElement>(null);
    const { roomId, sectionId }             =   useParams();
    const { room, tourRef }                 =   useRoomContext();
    const { $user }                         =   useContext(GlobalContext);
    const { roomsSectionList }              =   useCustomSectionContext();

    const [newWidgetId, setNewWidgetId]                 =   useState("");
    
    const [widgetSlider, setWidgetSlider]               =   useState(false);
    const [isWidgetModalOpen, setIsWidgetModalOpen]     =   useState(false);
    const [currentOrder, setCurrentOrder]               =   useState<number>(0);
    const [prevWidgetCount, setPrevWidgetCount]         =   useState<number>(0);

     const { data: pData, loading: pLoading, error: pError }  =   useQuery(ORG_PROPERTIES, {
        fetchPolicy: "network-only",
        variables: {
            isPreview   :   false
        }
    });

    const { data, loading, error } = useQuery(R_SECTION, {
        variables: {
            roomUuid: roomId,
            sectionUuid: sectionId
        },
        fetchPolicy: "network-only"
    })

    const SectionEditPermission     =    PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    const CurrentSectionType        =   roomsSectionList?.filter((_section: any) => _section?.uuid === sectionId)[0]?.type;

    useEffect(() => {
        if(data?._rSection?.widgets?.length > prevWidgetCount && data?._rSection?.widgets?.filter((_widget: any) => _widget?.uuid === newWidgetId)?.length){
            const newlyAddedElement = sectionBodyRef.current?.querySelector(`[id='${newWidgetId}']`);
            if(newlyAddedElement) {
                newlyAddedElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
            setPrevWidgetCount(data?._rtSection?.widgets.length || 0)
        }
    }, [data?._rSection?.widgets.length]);

    const handleAddWidgetClick = (order: number) => {
        setCurrentOrder(order);
        setIsWidgetModalOpen(true);
    };

    if (loading || pLoading) return <Loading />
    if (error || pError) return <SomethingWentWrong />    

    return (
        <>
            {
                CurrentSectionType === "CUSTOM_SECTION" &&
                <>
                    <Layout className="j-room-custom-section-layout cm-height100 cm-width100" style={{backgroundColor: "#F5F7F9"}}>
                        <div ref={sectionBodyRef} className="j-room-custom-section-body">
                            <div style={{padding: "15px", width: "100%"}}>
                                <SectionTitle sectionId={sectionId} section={data._rSection} setCurrentView={setCurrentPage} entityData={room}/>
                                {/* {
                                    data?._rSection?.widgets.length > 0 &&
                                        <div className="cm-position-relative">
                                            <Divider dashed style={{borderColor: "#E8E8EC", marginBlock: "40px"}}/>
                                            <div className={`j-section-add-widget cm-margin-bottom15 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"} cm-flex-center`}>
                                                <MaterialSymbolsRounded font="add" className="j-section-add-widget-icon cm-flex-center" size="22" onClick={() => SectionEditPermission ? handleAddWidgetClick(0) : {}}/>
                                            </div>
                                        </div>
                                } */}
                                {
                                    data?._rSection.widgets.map((_widget: any, index: number) => {
                                        const WidgetComponent   =   widgetComponentsMap[_widget.type];
                                        const widgetOrder       =   _widget.order;
                                        return WidgetComponent && 
                                            <div id={_widget?.uuid} key={_widget?.uuid} className="cm-margin-bottom15"> 
                                                <Space direction="vertical" className="cm-width100" size={0}>
                                                    <WidgetComponent widget={_widget} sectionId={sectionId} widgetOrder={widgetOrder} module={MODULE_ROOM} showComments={pData?.orgProperties?.buyerLayout === "2"}/>
                                                    <div className="cm-position-relative">
                                                        <Divider dashed style={index === (data?._rSection?.widgets?.length - 1) ? {marginBottom: "200px", marginTop: "10px", borderColor: "#E8E8EC"} : {borderColor: "#E8E8EC", marginBlock: "10px"}}/>
                                                        <div className={`j-section-add-widget cm-margin-bottom15 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"} cm-flex-center`}>
                                                            <MaterialSymbolsRounded font="add" className={`j-section-add-widget-icon cm-flex-center`} size="22" onClick={() => SectionEditPermission ? handleAddWidgetClick(widgetOrder) : {}}/>
                                                        </div>
                                                    </div>
                                                </Space>
                                            </div>
                                        })
                                }
                                {
                                    data._rSection.widgets.length === 0 &&
                                        <Space className="cm-flex-center cm-width100" direction="vertical" style={{height: "calc(100% - 200px)"}} size={12}>
                                            <img src={NO_WIDGETS_ADDED} width={75} height={75}/>
                                            <NoResultFound message={"Add a Widget to Get Started"} description={"Customize Widgets to Meet Your Exact Needs"}/>
                                            {
                                                SectionEditPermission ?
                                                    <Button className="cm-icon-button" type="primary" ghost onClick={() => setIsWidgetModalOpen(true)}><Space><MaterialSymbolsRounded font="add" size="22"/>Add Widget</Space></Button>
                                                :
                                                    <Tooltip title="You don't have permission">
                                                        <Button className="cm-icon-button" disabled={!SectionEditPermission} type="primary" ghost onClick={() => {}}><Space><MaterialSymbolsRounded font="add" size="22"/>Add Widget</Space></Button>
                                                    </Tooltip>
                                            }
                                        </Space>
                                }
                            </div>
                        </div>
                        <Sider trigger={null} collapsedWidth={0} collapsible={true} collapsed={!widgetSlider} className="cm-background-white cm-overflow-auto" style={{borderRadius: "6px 0px 0px 6px"}}>
                            {widgetSlider ? <SectionWidgets setWidgetSlider={setWidgetSlider} sectionId={sectionId} setNewWidgetId={setNewWidgetId}/> : null}
                        </Sider>
                        <CustomSectionLayoutSider tourRef={tourRef} sectionId={sectionId} widgets={data._rSection.widgets} setWidgetSlider={setWidgetSlider}/>
                    </Layout>
                    <AddWidgetModal 
                        isOpen          =   {isWidgetModalOpen} 
                        onClose         =   {() => setIsWidgetModalOpen(false)} 
                        sectionId       =   {sectionId} 
                        currentOrder    =   {currentOrder} 
                        setNewWidgetId  =   {setNewWidgetId}
                    />
                </>
            }
            {CurrentSectionType === "WELCOME" && <EditHome />}
            {CurrentSectionType === "DEMO" && <RoomDemo />}
            {CurrentSectionType === "TALK_TO_US" && <RoomTalkToUs />}
            {CurrentSectionType === "NEXT_STEPS" && <RoomNextSteps/>}
            {CurrentSectionType === "FAQ" && <RoomFaq/>}
            {CurrentSectionType === "RESOURCES" && <RoomResources/>}
        </>
    )
}

export default CustomSectionLayout;
