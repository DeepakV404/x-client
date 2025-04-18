import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useQuery } from '@apollo/client';
import { Button, Form, Input, Space, theme } from 'antd';

import { StrictModeDroppable } from '../../../../buyer-view/pages/journey/droppable';
import { RT_JOURNEY_STAGE_ACTION_POINTS } from '../../api/room-templates-query';
import { RoomTemplateAgent } from '../../api/room-template-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import TemplateActionPointSlider from './template-action-point-slider';
import ActionItemCard from '../../../rooms/room-view/action-item-card';
import Loading from '../../../../utils/loading';
import { AppTracker } from '../../../../app-tracker';
import { TEMPLATE_ACTION_POINT_ADDED } from '../../../../tracker-constants';
import { GlobalContext } from '../../../../globals';
import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_TEMPLATES } from '../../../../config/role-permission-config';

const { useForm }   =   Form;

interface ActionInfoProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    actionId        :   string;
    actionItem      :   any;
}

const ActionPointsListing = (props: {currentStage: string, checkBox: boolean}) => {

    const { token: { colorPrimary } }       =   theme.useToken();

    let colorBgBlur = "#f7fbff";

    const { currentStage }  =   props;

    const [form]    =   useForm();
    const params    =   useParams();

    const { $user } =   useContext(GlobalContext);

    const TemplateEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const [showDrawer, setShowDrawer]       =   useState<ActionInfoProps>({
        isOpen      :   false,
        onClose     :   () => {},
        actionId    :   "",
        actionItem  :   {}
    });
    const [inputValue, setInputValue]       =   useState('');
    const [isButtonDisabled, setIsButtonDisabled]   =   useState(true);

    const { data, loading, error }  =   useQuery(RT_JOURNEY_STAGE_ACTION_POINTS, {
        variables: {
            templateUuid    :   params.roomTemplateId, 
            stageUuid   :   currentStage
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        setIsButtonDisabled(!inputValue.trim())
    },[inputValue])

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index){
            RoomTemplateAgent.updateRoomTemplateActionPointOrder({
                variables: {
                    templateUuid: params.roomTemplateId, 
                    stageUuid: currentStage, 
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
        RoomTemplateAgent.addRoomTemplateActionPoint({
            variables: {
                templateUuid: params.roomTemplateId, 
                stageUuid: currentStage, 
                input: {
                    title: values.newActionPoint,
                    order: data ? data._rtActionPoints.length + 1 : 1
                }
            },
            onCompletion: (data: any) => {
                setShowDrawer({isOpen: true, onClose: () => setShowDrawer({isOpen: false, onClose: () => {}, actionId: "", actionItem: {}}), actionId: data._rtCreateActionPoint.uuid, actionItem: data._rtCreateActionPoint})
                CommonUtil.__showSuccess("Action point added successfully")
                AppTracker.trackEvent(TEMPLATE_ACTION_POINT_ADDED, {"Action point name": values.newActionPoint})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        form.resetFields()
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          : isDraggingOver ? `1px dashed ${colorPrimary}`: " 1px solid #fff",
        padding         : isDraggingOver ? "5px"   : "0px"
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            {data._rtActionPoints.length > 0 ? <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom20">Action Points</div> : null}
            <div className='cm-width100'>
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
                                    data._rtActionPoints.length > 0 ?
                                        data._rtActionPoints.map((_actionItem: any) => {
                                            return (
                                                <Draggable key={_actionItem.uuid} draggableId={_actionItem.uuid} index={_actionItem.order}>
                                                    {(provided) => (
                                                        <ActionItemCard
                                                            provided        =   {provided}
                                                            key             =   {_actionItem.uuid}
                                                            actionName      =   {_actionItem.title}
                                                            actionId        =   {_actionItem.uuid}
                                                            status          =   {_actionItem.status}
                                                            dueDate         =   {_actionItem.dueAt}
                                                            actionItem      =   {_actionItem}
                                                            stakeHolders    =   {_actionItem.assignedSellers}
                                                            onClick         =   {(actionId: string) => {setShowDrawer({isOpen: true, onClose: () => setShowDrawer({isOpen: false, onClose: () => {}, actionId: "", actionItem: {}}), actionId: actionId, actionItem: _actionItem})}}
                                                            {...props}
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
                        TemplateEditPermission &&
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
            <TemplateActionPointSlider 
                isOpen      =   {showDrawer.isOpen} 
                onClose     =   {() => setShowDrawer({isOpen: false, onClose: () => {}, actionId: "", actionItem: {}})}
                actionId    =   {showDrawer.actionId}
            />
        </>
    )
}

export default ActionPointsListing