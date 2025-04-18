import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Space, Menu, Layout, theme, Dropdown, MenuProps, Popover } from 'antd';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { StrictModeDroppable } from '../../../buyer-view/pages/journey/droppable';
import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { PermissionCheckers } from "../../../config/role-permission";
import { RT_JOURNEY_STAGE_STUBS } from "../api/room-templates-query";
import { TEMPLATE_STEP_ADDED } from "../../../tracker-constants";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { AppTracker } from "../../../app-tracker";
import { GlobalContext } from "../../../globals";

import SectionPopoverContent from "./template-section-popover/section-popover-content";
import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import EditStep from '../../rooms/room-view/edit-step';

import TemplateLayoutContainer from "./template-layout-container";
import Emoji from '../../../components/Emoji';
import Loading from "../../../utils/loading";

const { Sider, Content }    =   Layout;
const { SubMenu }           =   Menu;

let colorBgBlur = "#f7fbff";

const TemplateView = (props: {roomTemplate : any, sectionsData: any}) => {

    const { roomTemplate, sectionsData }      =    props;

    const { token: { colorPrimary } }       =   theme.useToken();
    
    const { $user, $isVendorOrg, $isVendorMode }             =   useContext(GlobalContext);

    const TemplateEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');   
    
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false);

    const [sectionData, setSectionData]         =   useState<any>([]);
    const [stepData, setStepData]               =   useState<any>([]);
    const [isMenuOpen, setMenuOpen]             =   useState(true);
    const [isActive, setIsActive]               =   useState(false);

    const initialLoad                           =   useRef(true);

    const [currentView, setCurrentView]         =   useState({
        id  :   "",
        type:   ""
    });

    const { data, loading, error } = useQuery(RT_JOURNEY_STAGE_STUBS, {
        variables: {
            templateUuid: roomTemplate.uuid
        },
        fetchPolicy: "network-only",
    })

    useEffect(() => {
        if(sectionsData?._rtSections) setSectionData(sectionsData?._rtSections)
        if(data?._rtJourneyStageStubs) setStepData(data?._rtJourneyStageStubs)        
    }, [sectionsData?._rtSections, data?._rtJourneyStageStubs])

    useEffect(() => {
        if(stepData.length > 0){
            setMenuOpen(true)
        }
    }, [stepData])


    useEffect(() => {
        if (initialLoad.current && sectionData?.length > 0) {
            if (sectionData[0].type === "NEXT_STEPS") {
                setCurrentView({
                    id      :   stepData[0]?.uuid,
                    type    :   'step'
                });
            } else {
                setCurrentView({
                    id      :   sectionData[0].uuid,
                    type    :   sectionData[0].type
                });
            }
            initialLoad.current = false;
        }
    }, [sectionData, stepData]);
    
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
    
    const handleJourneyLock = () => {
        RoomTemplateAgent.updateRoomTemplateSection({
            variables: {
                sectionUuid:  sectionData.filter((item: any) => item.type === "NEXT_STEPS")[0].uuid,
                input: {
                    isHidden    :   !sectionData.filter((item: any) => item.type === "NEXT_STEPS")[0].isHidden
                }
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    const handleOnDragEndForSteps = (result: any) => {
        if(result.source.index !== result.destination.index){
            const reOrderStepList = Array.from(stepData);
            const [reOrderedItem] = reOrderStepList.splice(result.source.index, 1);
            reOrderStepList.splice(result.destination.index, 0, reOrderedItem);
            setStepData(reOrderStepList);
            RoomTemplateAgent.updateRoomTemplateStageOrder({
                variables: {
                    templateUuid: roomTemplate.uuid,
                    stageUuid   : result.draggableId,
                    order       : result.destination.index + 1
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleOnDragEndForSection = (result: any) => {
        if (result.source.index !== result.destination.index) {
            const reOrderSectionList = Array.from(sectionData);
            const [reOrderedItem] = reOrderSectionList.splice(result.source.index, 1);
            reOrderSectionList.splice(result.destination.index, 0, reOrderedItem);
            setSectionData(reOrderSectionList);
            RoomTemplateAgent.updateRoomTemplateSectionOrder({
                variables: {
                    sectionUuid: result.draggableId,
                    order: result.destination.index + 1
                },
                onCompletion: () => { },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error);
                }
            });
        };
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          : isDraggingOver ? `1px dashed ${colorPrimary}`: " 1px solid #fff",
        padding         : isDraggingOver ? "5px"   : "0px",
        borderRadius    : isDraggingOver ? "5px" : "",
    });

    const nextStepDropDown: MenuProps['items'] = [
        {
            key     :   'enable',
            icon    :   <MaterialSymbolsRounded font={sectionData?.filter((item: any) => item?.type === "NEXT_STEPS")[0]?.isHidden ? "visibility" : "visibility_off"} size='18' />,
            label   :   <span>{!sectionData?.filter((item: any) => item?.type === "NEXT_STEPS")[0]?.isHidden ? "Hide Section" : "Show Section"}</span>,
            onClick :   (event: any) => {
                event.domEvent.stopPropagation();
                handleJourneyLock()
            }
        },
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16" />,
            danger  :   true,
            label   :   <span>Delete</span>,
            onClick :   (event: any) => {
                event.domEvent.stopPropagation();
                setShowDeleteConfirmation(true)
            }
        }
    ];

    const handleDelete = () => {
        RoomTemplateAgent.deleteSection({
            variables: {
                sectionUuid:  sectionData.filter((item: any) => item.type === "NEXT_STEPS")[0].uuid,
            },
            onCompletion: () => {
                setCurrentView({
                    id  :   sectionData[0].uuid,
                    type:   sectionData[0].type
                });
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const filteredSectionData = ($isVendorOrg || $isVendorMode) ? sectionData?.filter((section: any) => !(section?.type === "NEXT_STEPS")) : sectionData;

    if (loading) return <Loading />
    if (error) return <SomethingWentWrong />

    return (
        <> 
            <Sider width={300} style={{ borderRight: "1px solid #eeeeee", height: "100%", overflow: "auto", overflowX: "hidden" }} className='j-room-template-sider' >
                <Menu 
                    mode            =   "inline"
                    expandIcon      =   {null}
                    className       =   {`j-rt-nav-menu cm-padding10`}
                    defaultOpenKeys =   {isMenuOpen ? ["buying_journey"] : []}
                >
                    <Space className="cm-flex-space-between cm-padding-inline5">
                        <span className="cm-font-size12 cm-font-fam600 cm-secondary-text cm-letter-spacing08">SECTIONS</span>
                        <Popover
                            content         =   {<SectionPopoverContent setCurrentView={setCurrentView}/>}
                            trigger         =   {"click"}
                            placement       =   'rightTop'
                            overlayClassName=   "j-template-add-section-popover"
                        >
                            <Space size={4} className="cm-cursor-pointer">
                                <MaterialSymbolsRounded font="add" size="18" color="#0065E5"/>
                                <div className="cm-font-size13 cm-font-fam500 cm-active-color">Add</div>
                            </Space>
                        </Popover>
                    </Space>
                    <DragDropContext onDragEnd={handleOnDragEndForSection}>
                        <StrictModeDroppable droppableId="section">
                            {(provided, snapshot) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className="j-rt-journey-steps-layout cm-width100 cm-padding-top10">
                                    {filteredSectionData.map((section: any, index: number) => (
                                        <Draggable key={section?.uuid} draggableId={section?.uuid} index={index} isDragDisabled={!TemplateEditPermission}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                                    {section?.type === "NEXT_STEPS" ? (
                                                        <SubMenu 
                                                            key                 =   "buying_journey"
                                                            className           =   "cm-border-light"
                                                            onTitleClick        =   {() => setMenuOpen((prevStatus) => !prevStatus)}
                                                            icon                =   {isActive ? <div style={{marginLeft: "12px"}} {...provided.dragHandleProps}><MaterialSymbolsRounded font="drag_indicator" className="cm-cursor-dragger" size='20' color='#7a7a7a'/></div> : <div style={{marginLeft: "12px"}}><Emoji font="🧭" size="18"/></div>}
                                                            onTitleMouseEnter   =   {() => {setIsActive(true)}}
                                                            onTitleMouseLeave   =   {() => setIsActive(false)}
                                                            title               =   {
                                                                <Space direction="vertical" size={0} className="cm-flex" style={{height: "fit-content"}}>
                                                                    <div className="cm-flex-space-between cm-flex-align-center hover-item">
                                                                        <Space>
                                                                            <MaterialSymbolsRounded font={isMenuOpen ? "chevron_right" : "keyboard_arrow_down"} size='22'/>
                                                                            {section?.title}
                                                                        </Space>
                                                                        <div className='cm-position-relative cm-flex-align-center' style={{right: "8px"}}>
                                                                            {
                                                                                TemplateEditPermission &&
                                                                                    <Dropdown menu={{ items: nextStepDropDown }} trigger={["click"]} placement="bottom" className='show-on-hover-icon'>
                                                                                        <div onClick={(event) => event.stopPropagation()} className='show-on-hover-icon'>
                                                                                            <MaterialSymbolsRounded font="more_vert" size="18" />
                                                                                        </div>
                                                                                    </Dropdown>
                                                                            }
                                                                            {
                                                                                sectionData.filter((item: any) => item?.type === "NEXT_STEPS")[0].isHidden && 
                                                                                    <div className='cm-flex-center cm-position-relative hide-on-hover-icon'>
                                                                                        <MaterialSymbolsRounded font={"visibility_off"} size='18'/>
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Space>
                                                            }
                                                        >
                                                            <DragDropContext onDragEnd={handleOnDragEndForSteps}>
                                                                <StrictModeDroppable droppableId="steps">
                                                                    {(provided, snapshot) => (
                                                                        <div {...provided.droppableProps} ref={provided.innerRef} className="j-rt-journey-steps-layout cm-width100" style={getListStyle(snapshot.isDraggingOver)}>
                                                                            {stepData.length > 0 ? (
                                                                                stepData.map((_step: any, stepIndex: number) => (
                                                                                    <Draggable key={_step?.uuid} draggableId={_step?.uuid} index={stepIndex} isDragDisabled={!TemplateEditPermission}>
                                                                                        {(provided) => (
                                                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                                <EditStep sectionData={sectionData} key={_step?.uuid} step={_step} selected={currentView.id === _step?.uuid} setCurrentView={setCurrentView} type="step" draggable={true}/>
                                                                                            </div>
                                                                                        )}
                                                                                    </Draggable>
                                                                                ))
                                                                            ) : (
                                                                                <div className="cm-padding25">
                                                                                    <div className='cm-font-opacity-black-67 cm-font-size13 cm-height100 cm-flex-center'>No steps found</div>
                                                                                </div>
                                                                            )}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </StrictModeDroppable>
                                                            </DragDropContext>
                                                            {
                                                                TemplateEditPermission &&
                                                                    <div className="cm-background-white cm-padding-block10 cm-border-radius4">
                                                                        <Button className="cm-flex-center cm-icon-button" type="text" icon={<MaterialSymbolsRounded font="add" size="22" color="#0065E5"/>} onClick={handleAddStepClick} style={{marginLeft: "9px"}}>
                                                                            <div className="cm-font-size13 cm-font-fam500 cm-active-color">New Step</div>
                                                                        </Button>
                                                                    </div>
                                                            }
                                                        </SubMenu>
                                                    ) : (
                                                        <EditStep key={section?.uuid} step={section} sectionData={sectionData} selected={currentView.id === section?.uuid} setCurrentView={setCurrentView} type={section?.type} draggable={true} provided={provided} snapshot={snapshot}/>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </StrictModeDroppable>
                    </DragDropContext>
                </Menu>
            </Sider>
            <Content>
                <Layout className='cm-height100 cm-overflow-auto'>
                    {/* {_getLayoutEditor(currentView)} */}
                    <TemplateLayoutContainer
                        currentStage    =   {currentView}
                        roomTemplate    =   {roomTemplate}
                        sectionsData    =   {sectionsData}
                        setCurrentView  =   {setCurrentView}
                        stepData        =   {data}
                    />
                </Layout>
            </Content>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {handleDelete(); setShowDeleteConfirmation(false)}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   'Delete Section'
                body        =   'Are you sure you want to delete this section?'
                okText      =   'Delete'
            />
        </>
    )
}

export default TemplateView