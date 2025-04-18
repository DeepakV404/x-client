import { FC, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dropdown, Form, MenuProps, Space, Typography } from 'antd';

import { RoomTemplateAgent } from '../../templates/api/room-template-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import Emoji from '../../../components/Emoji';
import { PermissionCheckers } from '../../../config/role-permission';
import { FEATURE_TEMPLATES } from '../../../config/role-permission-config';
import { GlobalContext } from '../../../globals';

const { useForm }   =   Form;
const { Text }      =   Typography;

let colorBgBlur = "#f7fbff";

interface EditStepProps
{
    step            :   any;
    provided?       :   any;
    selected        :   boolean;
    setCurrentView  :   (arg0: any) => void;
    type            :   string;
    draggable       :   boolean | string;
    sectionData?    :   any
    snapshot?        :   any
}

const EditStep: FC<EditStepProps> = (props) => {

    const { step, setCurrentView, selected, provided, type, draggable, sectionData, snapshot }  =   props;

    const params    =   useParams();
    const [form]    =   useForm();

    const { $user }                                             =   useContext(GlobalContext);
    
    const [isActive, setIsActive]                               =   useState(false);
    const [isStepEnabled, setIsStepEnabled]                     =   useState(step?.isEnabled)
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false)

    const TemplateEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const handleClick = () => {
        setCurrentView({
            id  :   step?.uuid,
            type:   type
        });
    }

    const handleSwitchChange = () => {
        setIsStepEnabled((prev: boolean) => !prev)
        RoomTemplateAgent.updateStage({
            variables: {
                templateUuid    :  params.roomTemplateId, 
                stageUuid       :  step?.uuid,
                input           :   {
                    isEnabled   : !isStepEnabled
                }
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const items: MenuProps['items'] = [
        {
            key: 'hide_section',
            label: (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font={step?.isHidden ? 'visibility' : 'visibility_off'} size='18' />
                    {step?.isHidden ? `Show ${type === "step" ? "Step" : "Section"}` : `Hide ${type === "step" ? "Step" : "Section"}`}
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                handleStepEnabled();
            }
        },
        ...(type === 'step' ? [
            {
                key: 'enable',
                icon: <MaterialSymbolsRounded font={isStepEnabled ? "lock" : "lock_open"} size='18' />,
                label: <span>{isStepEnabled ? "Disable" : "Enable"}</span>,
                onClick: (event: any) => {
                    event.domEvent.stopPropagation();
                    handleSwitchChange()
                }
            }
        ] : []), 
        {
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            danger: true,
            label: <span>Delete</span>,
            onClick: (event: any) => {
                event.domEvent.stopPropagation();
                setShowDeleteConfirmation(true)
            }
        } 
    ];

    const handleStepEnabled = () => {
        if(type==="step"){
            RoomTemplateAgent.updateStage({
                variables: {
                    templateUuid    :  params.roomTemplateId,
                    stageUuid       :  step?.uuid,
                    input           :   {
                        isHidden    :   !step?.isHidden
                    }
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } else {
            RoomTemplateAgent.updateRoomTemplateSection({
                variables: {
                    sectionUuid:  step?.uuid,
                    input: {
                        isHidden    :   !step?.isHidden
                    }
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }
    
    const handleDelete = () => {
        if(type === "step") {
            RoomTemplateAgent.deleteStage({
                variables: {
                    templateUuid:  params.roomTemplateId, 
                    stageUuid   :  step?.uuid,
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
        } else {
            RoomTemplateAgent.deleteSection({
                variables: {
                    sectionUuid:  step?.uuid,
                },
                onCompletion: () => {
                    if(sectionData[0].type !== "NEXT_STEPS"){
                        setCurrentView({
                            id  :   sectionData[0].uuid,
                            type:   sectionData[0].type
                        });
                    }else{
                        setCurrentView({
                            id  :   null,
                            type:   "OTHER"
                        });
                    }
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ? `${colorBgBlur}`     : "#fff",
        border          : isDraggingOver ? `1px solid #efefef`  : " 1px solid #fff",
        borderRadius    : isDraggingOver ? "5px" : "",
    });

    return (
        <>
            <Form key={step?.uuid} form={form} onClick={handleClick} className='cm-cursor-pointer' onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
                <Space
                    className={`j-rt-nav-step cm-flex-space-between hover-item ${selected ? "active" : null}`}
                    style={{paddingInlineStart: type === "step" ? "10px" : "15px",  ...snapshot && getListStyle(snapshot.isDraggingOver)}}
                    {...(provided && {
                        ref: provided.innerRef,
                    })}
                >
                    <Space className='cm-flex' size={type === "step" ? 0 : 8}>
                        {
                            <div className='cm-flex' style={{width: "30px"}}>
                                {
                                    isActive && draggable ?
                                        <div className='cm-cursor-dragger' {...(provided && provided.dragHandleProps)} onClick={(e) => {e.stopPropagation();}} style={{zIndex: "1000"}}>
                                            <MaterialSymbolsRounded font='drag_indicator' size='20' color='#7a7a7a'/>
                                        </div>
                                    :
                                        <Emoji font={step?.emoji} size="20"/>
                                }
                            </div>
                        }
                        <Space size={4}>
                            <Text style={{maxWidth: isStepEnabled ? "195px" : "190px",  opacity: step?.isHidden ? "50%" : ""}} ellipsis={{tooltip: step?.title}}>{step?.title}</Text>
                            {type === "step" && !isStepEnabled && <MaterialSymbolsRounded font={"lock"} color={isStepEnabled ? "#0065E5" : "#5f6368"} size='18' /> }
                        </Space>
                    </Space>
                    {
                        TemplateEditPermission &&
                            <div className='cm-flex-center' style={{columnGap: "8px"}}>
                                <div className='cm-position-relative cm-flex-align-center' style={{right: "20px"}}>
                                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" className='show-on-hover-icon'>
                                        <div onClick={(event) => event.stopPropagation()} className='cm-position-absolute'>
                                            <MaterialSymbolsRounded font="more_vert" size="20" />
                                        </div>
                                    </Dropdown>                        
                                    {
                                        step?.isHidden && !isActive &&
                                        <div className='cm-flex-center cm-position-absolute'>
                                            <MaterialSymbolsRounded font={"visibility_off"} size='18'/>
                                        </div>
                                    }
                                </div>
                            </div>
                    }
                </Space>
            </Form>
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

export default EditStep