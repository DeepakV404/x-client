import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Avatar, Button, Col, Form, Input, Popconfirm, Row, Space, Tooltip, Typography, message } from 'antd';

import { RT_JOURNEY_STAGE, RT_JOURNEY_STAGE_RESOURCES } from '../../templates/api/room-templates-query';
import { EMPTY_CONTENT_ACCOUNT_IMG, Length_Input } from '../../../constants/module-constants';
import { useBuyerResourceViewer } from '../../../custom-hooks/resource-viewer-hook';
import { FEATURE_TEMPLATES } from '../../../config/role-permission-config';
import { PermissionCheckers } from '../../../config/role-permission';
import { RoomTemplateAgent } from '../api/room-template-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import SellerResourceViewerModal from '../../resource-viewer/seller-resource-viewer-modal';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import ActionPointsListing from './template-action-points/action-points-listing';
import EditResourceModal from '../../library/resource-list/edit-resource-modal';
import TemplateResourceCard from '../template-resource/template-resource';
import TemplateEditResourceSlider from './template-resource-slider';
import TemplateStageSlider from './template-header-slider';
import Loading from '../../../utils/loading';

const { Text }  =   Typography;
const { useForm }   =   Form;

const TemplateStepView = (props: {currentStage: any, setCurrent: any, stepData: any, sectionData: any}) => {

    const { currentStage, setCurrent, stepData, sectionData }  =   props;

    const [ form ]  =   useForm();

    const { $user } =   useContext(GlobalContext);

    const TemplateEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const params    =   useParams();
    
    const [editResource, setEditResource]   =   useState(false);
    const [editStage, setEditStage]         =   useState(false);
    const [editView, setEditView]           =   useState(false);
    const [showEdit, setShowEdit]           =   useState({
        isOpen      :   false,
        onClose     :   () => {},
        resource    :   null
    })

    const { data: sData, loading: sLoading }    =   useQuery(RT_JOURNEY_STAGE, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   params.roomTemplateId, 
            stageUuid       :   currentStage.id
        }
    })

    const { data, loading, error }  =   useQuery(RT_JOURNEY_STAGE_RESOURCES, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   params.roomTemplateId, 
            stageUuid       :   currentStage.id
        }
    });

    const onFinish = (values: any) => {
        RoomTemplateAgent.updateStage({
            variables: {
                templateUuid: params.roomTemplateId,
                stageUuid:  currentStage.id,
                input: {
                    title: values.title,
                    description: form.getFieldsValue().description
                }
            },
            onCompletion: () => {
                setEditView(false);
                CommonUtil.__showSuccess("Title updated successfully");
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

    const handleEditClick = (resource: any) => {
        setShowEdit({
            isOpen      :   true,
            onClose     :   () => setShowEdit({isOpen: false, onClose: () => {}, resource: null}),
            resource    :   resource
        })
    }
    
    if(sLoading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className="cm-width100 cm-flex-direction-column cm-padding15 cm-background-gray cm-height100 cm-overflow-auto">
            {
                TemplateEditPermission ?
                    <Space className='cm-flex-space-between cm-margin-bottom15'>
                        {
                            sData && sData._rtJourneyStage && editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                    <>
                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={sData._rtJourneyStage.title} preserve={false}>
                                            <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <>
                                    <div className='cm-flex-align-center'>
                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: sData?._rtJourneyStage.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{sData?._rtJourneyStage.title}</Text>
                                        <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                    </div>
                                </>
                        }
                        <Space>    
                            <Button style={{background: "transparent"}} type='primary' ghost onClick={() => setEditStage(true)}>Edit</Button>
                            <Popconfirm 
                                placement           =   "leftTop"
                                title               =   {<div className="cm-font-fam500">Delete step</div>}
                                description         =   {<div className="cm-font-size13">Are you sure you want to delete this step? This cannot be undone.</div>}
                                icon                =   {null}
                                okText              =   "Delete"
                                okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F", fontSize: "12px"}}}
                                cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                                onCancel            =   {(event: any) => {
                                    event.stopPropagation()
                                }}
                                onConfirm           =   {(event: any) => {
                                    event.stopPropagation()
                                    const messageLoading = message.loading("Deleting step...", 0);

                                    RoomTemplateAgent.deleteStage({
                                        variables: {
                                            templateUuid:  params.roomTemplateId, 
                                            stageUuid   :  currentStage.id,
                                        },
                                        onCompletion: () => {
                                            messageLoading()
                                                if(stepData._rtJourneyStageStubs > 1) {
                                                    setCurrent({
                                                        id  :   stepData._rtJourneyStageStubs[0].uuid,
                                                        type:   stepData._rtJourneyStageStubs[0].type
                                                    });
                                                } else {
                                                    setCurrent({
                                                        id  :   sectionData._rtSections[0].uuid,
                                                        type:   sectionData._rtSections[0].type
                                                    });
                                                }
                                            CommonUtil.__showSuccess("Step deleted successfully")
                                        },
                                        errorCallBack: (error: any) => {
                                            messageLoading()
                
                                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                        }
                                    })
                                }}
                            >
                                <MaterialSymbolsRounded font='delete' size='20' onClick={(event: any) => event.stopPropagation()} className="j-section-delete-icon cm-padding5 cm-cursor-pointer" color="#DF2222"/>
                            </Popconfirm>                              
                        </Space> 
                    </Space>
                :
                    <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: sData?._rtJourneyStage.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{sData?._rtJourneyStage.title}</Text>
            }
                <div className="cm-background-white cm-border-radius6 cm-padding15 cm-margin-bottom15">
                    <Space direction="vertical" className="cm-width100" size={25}>
                        <Space direction='vertical' className='cm-width100'>                            
                            {
                                sData?._rtJourneyStage.description ?
                                    <div className="cm-quill-font ql-editor cm-padding-inline0" dangerouslySetInnerHTML={{__html: sData._rtJourneyStage.description || ""}}></div>
                                :
                                    null
                            }
                        </Space>
                        <Avatar.Group style={{display: "flex"}}>
                            {
                                sData?.assignedBuyers?.map((_stakeHolder: any) => (
                                    <Tooltip title={<Space size={0} direction='vertical' align='start'>{CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)} <span className='cm-font-size12'>{_stakeHolder.emailId}</span> </Space>} placement="bottom">
                                        <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px" }} src={_stakeHolder.profileUrl ? <img src={_stakeHolder.profileUrl} alt={CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName)}/> : ""}>
                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_stakeHolder.firstName, _stakeHolder.lastName), 1)}
                                        </Avatar>
                                    </Tooltip>
                                ))
                            }
                        </Avatar.Group>
                    </Space>
                    <ActionPointsListing currentStage={currentStage.id} checkBox={true}/>
                </div>
                <div className="cm-background-white cm-padding15 cm-border-radius6 cm-position-relative">
                    <Space className='cm-flex-space-between cm-margin-bottom20'>
                        <span className='cm-font-size16 cm-font-fam500'>Resources</span>
                        {
                            TemplateEditPermission &&
                                <Button type="primary" className="j-ap-add-resource cm-flex-center" icon={<MaterialSymbolsRounded font="home_storage" size="22"/>} onClick={() => setEditResource(true)}>   
                                    Add Resource
                                </Button>
                        }
                    </Space>
                    {
                        data && data._rtStageResources.length > 0 
                        ?
                            <Row gutter={[20, 20]}>
                                {
                                    loading
                                    ?
                                        <Loading/>
                                    :
                                        data._rtStageResources.map((_resource: any) => (
                                            <Col key={_resource.uuid} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
                                                <TemplateResourceCard 
                                                    key                 =   {`${_resource.uuid}card`}
                                                    currentStage        =   {currentStage.id}
                                                    cardId              =   {_resource.uuid}
                                                    name                =   {_resource.title}
                                                    fileType            =   {_resource.type}
                                                    thumbnail           =   {_resource.content.thumbnailUrl}
                                                    createdAt           =   {_resource.createdAt}
                                                    selected            =   {false}     
                                                    onCheck             =   {() => {}}
                                                    onResourceClick     =   {(_, cardInfo) => handleResourceOnClick(cardInfo)}
                                                    resource            =   {_resource}
                                                    onEdit              =   {(_resource) => handleEditClick(_resource)}
                                                />
                                            </Col>
                                        ))  
                                }
                            </Row>
                        :
                            <div style={{height: "400px"}}>
                                <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                                    <img height={160} width={160} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                    <Text className='cm-font-size18 cm-font-fam500'>No Resources Yet!</Text>
                                    <div  className='cm-font-opacity-black-65 cm-text-align-center'>We couldn't find any existing resources.</div>
                                </Space>
                            </div>
                    }
                </div>
            </div>
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
                track           =   {false}
            />
            <EditResourceModal
                isOpen          =   {showEdit.isOpen}
                onClose         =   {showEdit.onClose}
                resource        =   {showEdit.resource}
            />
            <TemplateStageSlider isOpen={editStage} onClose={() => setEditStage(false)} stage={sData} currentStage={currentStage}/>
            <TemplateEditResourceSlider isOpen={editResource} onClose={() => setEditResource(false)} currentStage={currentStage}/>
        </>
    )
}

export default TemplateStepView