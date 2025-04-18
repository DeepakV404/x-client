import { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Divider, Form, Input, Space, Tag, Typography } from 'antd';

import { R_ACTION_POINTS, R_JOURNEY_STAGE } from '../../api/rooms-query';
import { Length_Input } from '../../../../constants/module-constants';
import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { RoomsAgent } from '../../api/rooms-agent';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import RoomStageResources from '../../../rooms/room-action-plan/stage-resources';
import ActionItemSlider from './action-item-slider';
import Loading from '../../../../utils/loading';
import ActionPoints from './action-items';
import DeleteConfirmation from '../../../../components/confirmation/delete-confirmation';
import { AccountsAgent } from '../../../accounts/api/accounts-agent';


const { Text }        =   Typography
const { useForm }     =   Form

const ActionItemsListing = () => {

    const { roomId, stageId }   =   useParams();

    const [form]    =   useForm();
    const navigate  =   useNavigate()
    const location  =   useLocation()
    
    const [editStage, setEditStage]     =   useState(false);

    const { $user }    =    useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const { data, loading, error }      =   useQuery(R_JOURNEY_STAGE, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid        :   roomId,
            stageUuid       :   stageId
        }
    })

    const { data: apData, loading: apLoading, error: apError }  =   useQuery(R_ACTION_POINTS, {
        variables: {
            roomUuid        :   roomId, 
            stageUuid       :   stageId
        },
        fetchPolicy: "network-only"
    });
    
    const [editView, setEditView]                               =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false)

    const onFinish = (values: any) => {
        RoomsAgent.updateStageName({
            variables: {
                roomUuid: roomId,
                stageUuid: stageId,
                input: {
                    title: values.title,
                }
            },
            onCompletion: () => {
                setEditView(false)
                CommonUtil.__showSuccess("Title updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDeleteStep = () => {
        AccountsAgent.deleteStage({
            variables: {
                roomUuid: roomId,
                stageUuid: stageId
            },
            onCompletion: () => {
                navigate(location.pathname.split("/").slice(0, -1).concat('empty').join("/"));
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }

    const CompletedAPLength = apData?._rActionPoints.filter((_ap: any) => _ap.status === "COMPLETED").length;
    const ifAnyUsersAssigned = apData?._rActionPoints.some((_ap: any) => _ap.assignedBuyers.length > 0 || _ap.assignedSellers.length > 0);

    const StageStatus  = () => {
        if(data?._rJourneyStage?.totalActionPoints > 0 && (data?._rJourneyStage?.totalActionPoints === CompletedAPLength)){
            return (
                <Tag style={{backgroundColor : "#e5f4d6", color: "#2c9203", border: "none", paddingBlock: "2px"}}>
                    <Space className='cm-flex-center' size={2}>
                        <MaterialSymbolsRounded font='check' size='19'/>
                        Completed
                    </Space>
                </Tag>
            )
        }
        else if(CompletedAPLength > 0 || ifAnyUsersAssigned){
            return <Tag style={{backgroundColor : "#deeffd", color: "#005bda", border: "none", paddingBlock: "2px"}}>In Progress</Tag>
        }
        else if(CompletedAPLength === 0){
            return <Tag style={{backgroundColor: "#F0F2F5", paddingBlock: "2px",  border: "none"}}>Not Started</Tag>
        }
    }

    if(loading || apLoading) return <Loading/>
    if(error || apError) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-width100 cm-flex-direction-column">
                <div className="j-room-action-points cm-position-relative cm-margin-bottom15">
                    <Space direction='vertical' className='cm-padding20 cm-width100 j-room-ap-header'>
                        <Space className='cm-flex-space-between'>
                            <Space>
                                {
                                    RoomEditPermission ?
                                        (editView ?
                                            <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish} preserve={false}>
                                                <>
                                                    <Form.Item name={"title"} noStyle initialValue={data._rJourneyStage.title}>
                                                        <Input autoFocus style={{width: "300px"}} maxLength={Length_Input} className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter}/>
                                                    </Form.Item>
                                                    <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                                </>
                                            </Form>
                                        :
                                            <Space className='cm-flex-align-center'>
                                                <Text className="cm-font-size18 cm-font-fam500" style={{ maxWidth: "300px"}} ellipsis={{tooltip:  data._rJourneyStage.title}}>{ data._rJourneyStage.title}</Text>
                                                <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => {setEditView(true)}}/>
                                            </Space>
                                        )
                                    :
                                        <Text className="cm-font-size18 cm-font-fam500" style={{ maxWidth: "300px"}} ellipsis={{tooltip:  data._rJourneyStage.title}}>{ data._rJourneyStage.title}</Text>    
                                }
                                <div>
                                    {
                                        CompletedAPLength !== data?._rJourneyStage?.totalActionPoints
                                        ?
                                            <div className="cm-flex-center cm-font-size14" style={{minWidth: "40px"}}>{CompletedAPLength}/{data?._rJourneyStage?.totalActionPoints}</div>
                                        :
                                            null
                                    }
                                </div>
                            </Space>
                            <Space>
                                {StageStatus()}
                                {
                                    RoomEditPermission && <Button onClick={() => setEditStage(true)}>Edit</Button>
                                }
                                {
                                    RoomEditPermission && <Button onClick={() => setShowDeleteConfirmation(true)} icon={<MaterialSymbolsRounded font='delete' size='20' color='#df2222' />}/>
                                }
                            </Space>
                        </Space>
                        { 
                            data._rJourneyStage.description
                            ?
                                <div className="cm-quill-font ql-editor cm-padding-inline0" dangerouslySetInnerHTML={{__html: data._rJourneyStage.description || ""}}></div>
                            : 
                                null
                        }
                    </Space>
                    <Divider style={{margin: 0, borderColor: "#E8E8EC"}}/>
                    <ActionPoints actionPoints={apData?._rActionPoints} apLoading={apLoading}/>
                </div>
                <RoomStageResources/>
            </div>
            <ActionItemSlider isOpen={editStage} onClose={() => setEditStage(false)} stage={data}/>
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

export default ActionItemsListing