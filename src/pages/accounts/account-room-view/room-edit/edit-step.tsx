import { FC, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dropdown, Form, MenuProps, Space, Typography } from 'antd';

import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { AccountsAgent } from '../../api/accounts-agent';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { GlobalContext } from '../../../../globals';
import DeleteConfirmation from '../../../../components/confirmation/delete-confirmation';

const { useForm }   =   Form;
const { Text }      =   Typography;

interface EditStepProps
{
    provided        :   any;
    step            :   any;
    selected        :   boolean;
}

const EditStep: FC<EditStepProps> = (props) => {

    const { step, selected, provided }  =   props;

    const { $user }     =    useContext(GlobalContext);

    const params = useParams();
    const navigate = useNavigate();

    const [form]    =   useForm();

    const [isStepEnabled, setIsStepEnabled]                     =   useState(step.isEnabled)
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false)

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const handleClick = () => {
        navigate(step.uuid)
    }

    const items: MenuProps['items'] = [
        {
            key: 'hide_section',
            label: (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font={step.isHidden ? 'visibility' : 'visibility_off'} size='18' />
                    {step.isHidden ? "Show Step" : "Hide Step"}
                </Space>
            ),
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                handleStepEnabled();
            }
        },
        {
            key: 'enable',
            icon: <MaterialSymbolsRounded font={!isStepEnabled ? "lock_open" : "lock"} size='18' />,
            label: <span>{isStepEnabled ? "Disable" : "Enable"}</span>,
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                handleSwitchChange()
            }
        },
        {
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            danger: true,
            label: <span>Delete</span>,
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                setShowDeleteConfirmation(true)
            }
        },
    ];

    const handleStepEnabled = () => {
        AccountsAgent.updateStage({
            variables: {
                roomUuid: params.roomId,
                stageUuid:  step.uuid,
                input: {
                    isHidden: !step.isHidden
                }
            },
            onCompletion: () => {
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }
    
    const handleSwitchChange = () => {
        setIsStepEnabled((prev: boolean) => !prev)
        if(RoomEditPermission) {
            AccountsAgent.updateStage({
                variables: {
                    roomUuid: params.roomId,
                    stageUuid:  step.uuid,
                    input: {
                        isEnabled: !isStepEnabled
                    }
                },
                onCompletion: () => {
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleDeleteStep = () => {
        AccountsAgent.deleteStage({
            variables: {
                roomUuid: params.roomId,
                stageUuid: step.uuid
            },
            onCompletion: () => {
                navigate("empty");
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getWidth = () => {
        if((!step.isHidden && isStepEnabled && step.totalActionPoints && RoomEditPermission) ||(step.isHidden && isStepEnabled && step.totalActionPoints && RoomEditPermission)){
            return "115px"
        }
        else if((step.isHidden && !isStepEnabled && !step.totalActionPoints) || (!step.isHidden && !isStepEnabled && !step.totalActionPoints && RoomEditPermission)){
            return "135px"
        }else if((!step.isHidden && isStepEnabled && !step.totalActionPoints && RoomEditPermission) || (step.isHidden && isStepEnabled && !step.totalActionPoints)){
            return "160px"
        }else{
            if(RoomEditPermission){
                return "95px"
            }
        }
    }

    return (
        <>
            <Form key={step.uuid} form={form} onClick={handleClick} className='cm-cursor-pointer'>
                <Space className={`j-room-step cm-flex-space-between hover-item ${selected ? "active" : null}`}
                    ref =   {provided.innerRef} 
                    {...provided.draggableProps}
                    size={6}
                >
                    <Space size={4} className='cm-flex'>
                        <div className='cm-cursor-dragger' {...provided.dragHandleProps} onClick={(e) => e.stopPropagation()}>
                            <MaterialSymbolsRounded font='drag_indicator' size='16' color='#7a7a7a'/>
                        </div>
                        <Text style={{maxWidth: getWidth(), opacity: step.isHidden && "50%"}} ellipsis={{tooltip: step.title}}>
                            {step.title}
                        </Text>
                        {!isStepEnabled && <MaterialSymbolsRounded font={isStepEnabled ? "lock_open" : "lock"} color={isStepEnabled ? "#0065E5" : "#5F6368"} size='18' />}
                    </Space>
                    <div className='cm-flex-center'>
                        {
                            step.totalActionPoints ?
                                <span className='cm-font-size12 cm-flex-center' style={{minWidth: "40px", marginRight: "5px"}}>
                                    {
                                        step.completedActionPoints === step.totalActionPoints
                                        ?
                                            step.totalActionPoints === 0
                                            ?
                                                null
                                            :
                                                <MaterialSymbolsRounded font="check_circle" size="20" color="green"/>
                                        :
                                            <div className="cm-flex-center cm-font-size12 j-buyer-total-ap" style={{minWidth: "40px", background: !isStepEnabled ? "#D2D9E3" : "", border: !isStepEnabled ?  "1px solid #D2D9E3" : "", color: !isStepEnabled ? "#000000D9" : ""}}>{step.completedActionPoints} / {step.totalActionPoints}</div>
                                    }
                                </span>
                            :
                                null
                        }
                        <div className='cm-flex-center' style={{width: "25px"}}>
                            {
                                RoomEditPermission &&
                                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" className='show-on-hover-icon'>
                                        <div onClick={(event) => event.stopPropagation()} className='cm-position-relative'>
                                            <MaterialSymbolsRounded font="more_vert" size="20" />
                                        </div>
                                    </Dropdown>
                            }
                            {
                                step.isHidden && 
                                <div className='cm-flex-center cm-position-relative hide-on-hover-icon'>
                                    <MaterialSymbolsRounded font={"visibility_off"} size='18'/>
                                </div>
                            }
                        </div>
                    </div>
                </Space>
            </Form>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {handleDeleteStep(); setShowDeleteConfirmation(false)}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   'Delete Step'
                body        =   'Are you sure you want to delete this step?'
                okText      =   'Delete'
            />
        </>
    )
}

export default EditStep