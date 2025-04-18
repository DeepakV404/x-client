import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, createSearchParams } from 'react-router-dom';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Button, Form, Input, Space, theme } from 'antd';

import { StrictModeDroppable } from '../../../../buyer-view/pages/journey/droppable';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { PermissionCheckers } from '../../../../config/role-permission';
import { ROOM_ACTION_POINT_ADDED } from '../../../../tracker-constants';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { AppTracker } from '../../../../app-tracker';
import { RoomsAgent } from '../../api/rooms-agent';

import ActionItemCard from '../../../rooms/room-action-plan/action-items-listing/action-item-card';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import ActionPlanSlider from '../../../rooms/room-action-plan/action-plan-slider';
import Loading from '../../../../utils/loading';

const { useForm }   =   Form;

interface ActionInfoProps
{
    isOpen          :   boolean;
    actionId        :   string;
}

const ActionPoints = (props: { actionPoints: any, apLoading: boolean}) => {

    const { actionPoints, apLoading }       =     props;

    const { token: { colorPrimary } }       =   theme.useToken();

    let colorBgBlur = "#f7fbff";

    const { $user }    =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [form]    =   useForm();
    const [searchParams, setSearchParams]   =   useSearchParams();
    const [actionItems, updateActionItems]  =   useState([]);
    const [inputValue, setInputValue]       =   useState('');
    const [isButtonDisabled, setIsButtonDisabled]   =   useState(true);

    const { roomId, stageId }   =   useParams();
    const navigate              =   useNavigate();

    const [showDrawer, setShowDrawer]       =   useState<ActionInfoProps>({
        isOpen      :   false,
        actionId    :   ""
    });

    useEffect(() => {
        if (actionPoints) {
            updateActionItems(actionPoints);
        }
    }, [actionPoints]);

    useEffect(() => {
        const openActionPoint = searchParams.get('actionPointId');
        if(openActionPoint){
            setShowDrawer({isOpen: true, actionId: openActionPoint})
        }
    }, [searchParams])

    useEffect(() => {
        setIsButtonDisabled(!inputValue.trim())
    },[inputValue])

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index){
            RoomsAgent.updateActionPointOrder({
                variables: {
                    roomUuid: roomId, 
                    stageUuid: stageId, 
                    actionPointUuid: result.draggableId, 
                    order: result.destination.index
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Order updated successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const onFinish = (values: any) => {
        RoomsAgent.addActionPoint({
            variables: {
                roomUuid: roomId, 
                stageUuid: stageId, 
                input: {
                    title: values.newActionPoint,
                    order: actionPoints ? actionPoints.length + 1 : 1
                }
            },
            onCompletion: (data: any) => {
                setSearchParams({"actionPointId": data._rCreateActionPoint.uuid})
                CommonUtil.__showSuccess("Action point added successfully")
                AppTracker.trackEvent(ROOM_ACTION_POINT_ADDED, {"Action point name": values.newActionPoint});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        form.resetFields()
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          : isDraggingOver ?  `1px dashed ${colorPrimary}` : " 1px solid #fff",
        padding         : isDraggingOver ? "5px"   : "0px"
    });

    const closeModal = () => {
        const param = searchParams.get("actionPointId");
      
        if (param) {
            searchParams.delete('actionPointId');
            setSearchParams(searchParams);
            setShowDrawer({
                isOpen      :   false,
                actionId    :   ""
            })
        }
    };

    if(apLoading && actionItems.length === 0) return <Loading/>

    return (
        <>
            <div className='cm-width100 cm-padding20'>
                {actionItems?.length > 0 ? <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom20">Action Points {actionItems.length > 0 && <span className="cm-dark-grey-text">({actionItems.length})</span> }</div> : null}
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <StrictModeDroppable droppableId='action-plans'>
                        {(provided, snapshot) => (
                            <Space 
                                {...provided.droppableProps} 
                                ref         =   {provided.innerRef} 
                                direction   =   'vertical' 
                                size        =   {8} 
                                className   =   'cm-width100 cm-border-radius8'
                                style       =   {getListStyle(snapshot.isDraggingOver)}
                            >
                                {
                                    actionItems?.length > 0 ?
                                        actionItems.map((_actionItem: any) => {
                                            return (
                                                <Draggable key={_actionItem.uuid} draggableId={_actionItem.uuid} index={_actionItem.order} isDragDisabled={!RoomEditPermission}>
                                                    {(provided) => (
                                                        <ActionItemCard
                                                            provided        =   {provided}
                                                            key             =   {_actionItem.uuid}
                                                            actionItem      =   {_actionItem}
                                                            onCardClick     =   {(actionId: string) => {                                                              
                                                                navigate({
                                                                    search: `?${createSearchParams({
                                                                        actionPointId: actionId
                                                                    })}`
                                                                });
                                                            }}
                                                        />
                                                    )}
                                                </Draggable>
                                            );
                                        })
                                    :
                                        null
                                }
                                {provided.placeholder}
                            </Space>
                        )}
                    </StrictModeDroppable>
                    {
                        RoomEditPermission &&
                            <div className='j-buyer-new-action-wrap cm-width100'>
                                <Form form={form} onFinish={onFinish} className='cm-width100'>
                                    <Form.Item noStyle={true} name={"newActionPoint"} rules={[{required: true, whitespace: true}]}>
                                        <Input autoFocus maxLength={250} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Add a new action point' suffix={<Button className='cm-icon-button' type='primary' disabled={isButtonDisabled} onClick={() => form.submit()}><Space><MaterialSymbolsRounded font='add'/>Add</Space></Button>} style={{borderRadius: "8px", height: "50px"}}/>
                                    </Form.Item>
                                </Form>
                            </div>
                    }
                </DragDropContext>
            </div>
            <ActionPlanSlider
                isOpen      =   {showDrawer.isOpen} 
                onClose     =   {() => closeModal()}
                actionId    =   {showDrawer.actionId}
            />
        </>
    )
}

export default ActionPoints