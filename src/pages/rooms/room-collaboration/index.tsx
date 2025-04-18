import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useLocation, useOutletContext } from 'react-router-dom';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useQuery } from '@apollo/client';
import { Button, Dropdown, Layout, MenuProps, Space, Tooltip, theme } from 'antd';

import { StrictModeDroppable } from '../../../buyer-view/pages/journey/droppable';
import { PermissionCheckers } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { R_JOURNEY_STAGE_STUBS, R_SECTIONS } from '../api/rooms-query';
import { NEXT_STEPS_EMPTY } from '../../../constants/module-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { ROOM_STEP_ADDED } from '../../../tracker-constants';
import { CommonUtil } from '../../../utils/common-util';
import { AppTracker } from '../../../app-tracker';
import { GlobalContext } from '../../../globals';
import { useRoomContext } from '../room-layout';
import { RoomsAgent } from '../api/rooms-agent';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import EditStep from '../../accounts/account-room-view/room-edit/edit-step';
import Loading from '../../../utils/loading';

const { Sider } =   Layout;

export function useRoom() {
    return useOutletContext<any>();
}

const RoomCollaborationViewLayout = () => {

    const { token: { colorPrimary } }       =   theme.useToken();

    const { $user, hidebackinAP }     =    useContext(GlobalContext);

    let colorBgBlur = "#f7fbff";

    const params    =   useParams();
    const navigate  =   useNavigate();
    const location  =   useLocation();
    const { room }  =   useRoomContext()

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    
    const { data, loading, error }  =   useQuery(R_JOURNEY_STAGE_STUBS, {
        variables: {
            roomUuid:   params.roomId
        },
        fetchPolicy: "network-only"
    })
    
    const [stepData, setStepData]   =   useState<any>([])
    
    useEffect(() => {
        setStepData(data?._rJourneyStageStubs)
    }, [data])
    
    useEffect(() => {
        if(!location.pathname.split("/")[5] || location.pathname.split("/")[5] === "empty"){
            if(stepData?.length > 0){
                navigate(stepData[0].uuid)
            }else{
                navigate("empty")
            }
        }
    }, [stepData])
    
    const handleAddStepClick = () => {
        RoomsAgent.addStage({
            variables: {
                roomUuid: params.roomId,
                input: {
                    title: "Untitled",
                    isEnabled: !(room.buyers.length > 0),
                    isHidden: room.buyers.length > 0
                }
            },
            onCompletion: (data: any) => {
                navigate(data._rAddStage.uuid)
                AppTracker.trackEvent(ROOM_STEP_ADDED, {});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    const { data: nextStepData }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId,
            filter  : {
                type : "NEXT_STEPS"
            }
        },
        fetchPolicy: "network-only"
    })
    
    const items: MenuProps['items'] = [
        {
            key: 'hide_section',
            label: (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font={nextStepData?._rSections[0]?.isHidden ? "visibility" : 'visibility_off'} size='18' />
                    {nextStepData?._rSections[0]?.isHidden ? "Show Section" : "Hide Section"}
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                handleJourneyLock();
            }
        },
    ];
    
    const handleJourneyLock = () => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: nextStepData._rSections[0].uuid,
                input: {
                    isHidden    :   !nextStepData._rSections[0]?.isHidden
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Section updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor :   isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          :   isDraggingOver ? `1px dashed ${colorPrimary}` : " 1px solid #fff",
        borderRadius    :   "4px",
        padding         :   "2px"
    });

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index) {
            const reOrderStepList = Array.from(stepData);
            const [reOrderedItem] = reOrderStepList.splice(result.source.index, 1);
            reOrderStepList.splice(result.destination.index, 0, reOrderedItem);
            setStepData(reOrderStepList);
            RoomsAgent.updateStageOrder({
                variables: {
                    roomUuid: params.roomId,
                    stageUuid: result.draggableId,
                    order: (result.destination.index + 1)
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleAddNextSteps = () => {
        RoomsAgent.addDefaultSectionByType({
            variables: {
                roomUuid: params.roomId,
                type: "NEXT_STEPS",
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong />

    if(nextStepData?._rSections[0]){
        return (
            <Layout className="j-room-layout cm-height100">
                <Sider width={260} className='j-room-journey-sider'>
                    <Space className='j-room-next-steps-header cm-width100 cm-flex-space-between' onClick={() => navigate("../sections")}>
                        <Space>
                            {!hidebackinAP ? <MaterialSymbolsRounded font='arrow_back' className='cm-cursor-pointer' size='23'/> : null}
                            <div className='cm-font-fam500 cm-font-size15' style={{opacity : nextStepData?._rSections[0]?.isHidden && "50%"}}>Next Steps</div>
                        </Space>
                        <Space>
                            {
                                nextStepData?._rSections[0]?.isHidden &&
                                    <div className='cm-flex-center'>
                                        <MaterialSymbolsRounded font={"visibility_off"} size='19'/>
                                    </div>
                            }
                            {
                                RoomEditPermission && 
                                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottom">
                                        <div onClick={(event) => event.stopPropagation()} className='cm-cursor-pointer'>
                                            <MaterialSymbolsRounded font="more_vert" size="19" />
                                        </div>
                                    </Dropdown>
                            }
                        </Space>
                    </Space>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <StrictModeDroppable droppableId =   'steps'>
                            {(provided, snapshot) => (
                                <div 
                                    {...provided.droppableProps} 
                                    ref             =   {provided.innerRef} 
                                    className       =   'cm-width100 cm-margin-top20 cm-margin-bottom20 cm-scrollbar-none'
                                    style           =   {{...getListStyle(snapshot.isDraggingOver), height: "calc(100% - 100px)", overflow: "auto"}}
                                >
                                    {
                                        stepData.length > 0 ?
                                            stepData.map((_step: any, index: number) => {
                                                return (
                                                    <Draggable key={_step.uuid} draggableId={_step.uuid} index={index} isDragDisabled={!RoomEditPermission}>
                                                        {(provided) => (
                                                            <EditStep provided={provided} key={_step.uuid} step={_step} selected={params.stageId === _step.uuid}/>
                                                        )}
                                                    </Draggable>
                                                )
                                            })
                                        :
                                            <div className='cm-font-opacity-black-67 cm-font-size13 cm-height100 cm-flex-center'>No steps found</div>
                                    }
                                    {provided.placeholder}
                                </div>   
                            )} 
                        </StrictModeDroppable>
                    </DragDropContext>
                    <div className='cm-width100 j-room-journey-steps-add-action' style={{bottom: 0}}>
                        {
                            RoomEditPermission ?
                                <Button size='large' block className='cm-flex-center cm-icon-button' type='primary' ghost icon={<MaterialSymbolsRounded font='add' size='22'/>} onClick={handleAddStepClick}>
                                    <div className="cm-font-size14 cm-font-fam600">Add Step</div>
                                </Button>
                            :
                                <Tooltip title="You don't have permission">
                                    <Button size='large' block className='cm-flex-center cm-icon-button' disabled={!RoomEditPermission} type='primary' ghost icon={<MaterialSymbolsRounded font='add' size='22'/>} onClick={() => {}}>
                                        <div className="cm-font-size14 cm-font-fam600">Add Step</div>
                                    </Button>
                                </Tooltip>
                        }
                    </div>
                </Sider>
                <Layout className='j-room-layout cm-overflow-auto cm-padding15'>
                    <Outlet context={{"room": room}}/>
                </Layout>
            </Layout>
        )
    }
    else{
        return (
            <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-background-gray cm-height100 cm-overflow-auto">
                <img src={NEXT_STEPS_EMPTY} alt="No next steps found"/>
                <div className="cm-font-size18 cm-font-fam500">Mutual Action Plan</div>
                <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                    Add stages and action points to align sales with the buyer's journey.
                </div>
                {
                    RoomEditPermission &&
                        <Button className="cm-flex-center cm-margin-top15" type="primary" onClick={() => handleAddNextSteps()}>
                            Add Next Steps
                        </Button>
                }
            </Space>
        )    
    }
}

export default RoomCollaborationViewLayout