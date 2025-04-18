
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, Popover, Space, Typography, message } from 'antd';

import { RoomsAgent } from '../api/rooms-agent';
import { CommonUtil } from '../../../utils/common-util';
import { ERROR_CONFIG } from '../../../config/error-config';
import { Length_Input } from '../../../constants/module-constants';
import { RoomTemplateAgent } from '../../templates/api/room-template-agent';

import EmojiPicker from '@emoji-mart/react';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import SectionAccessManagerModal from './section-layout/access-manager/section-access-manager-modal';
import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import { PermissionCheckers } from '../../../config/role-permission';
import { GlobalContext } from '../../../globals';
import { FEATURE_ROOMS, FEATURE_TEMPLATES } from '../../../config/role-permission-config';
import { useCustomSectionContext } from '.';

const { useForm }  =    Form;
const { Text }     =    Typography;
 
const SectionTitle = (props: { sectionId: any, section: any, kind? : any, setCurrentView?: any, entityData?: any, sectionData?: any }) => {
 
    const { sectionId, section, kind, setCurrentView, entityData, sectionData }    =   props;    

    const [ form ]                  =   useForm();
    const navigate                  =   useNavigate()
    const params                    =   useParams()

    const { $user }                 =   useContext(GlobalContext);
    const { roomsSectionList }      =   useCustomSectionContext();
    
    const SectionEditPermission     =   kind ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editView, setEditView]                               =   useState(false);
    const [emojiVisible, setEmojiVisible]                       =   useState(false);
    const [accessManager, setAccessManager]                     =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false)
 
    const onFinish = (values: any) => {
        
        if(values.title !== section.title) {
            if(kind && kind !== "room"){
                RoomTemplateAgent.updateRoomTemplateSection({
                    variables: {
                        sectionUuid: sectionId,
                        input: {
                            title: values.title
                        }
                    },
                    onCompletion: () => {
                        setEditView(false);
                        CommonUtil.__showSuccess("Title updated successfully")
        
                    },
                    errorCallBack: (error:any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
        
                    }
                })
            }else{
                RoomsAgent.updateSection({
                    variables: {
                        sectionUuid: sectionId,
                        input: {
                            title: values.title
                        }
                    },
                    onCompletion: () => {
                        setEditView(false);
                        CommonUtil.__showSuccess("Title updated successfully")
                    },
                    errorCallBack: (error:any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            }
        }
        setEditView(false)
    };

    const onEmojiSelect = (emojiValue: string) => {
        if(kind === "template"){
            RoomTemplateAgent.updateRoomTemplateSection({
                variables: {
                    sectionUuid     :   sectionId,
                    input: {
                        emoji           :   emojiValue
                    }
                },
                onCompletion: () => {
                    setEditView(false);
                    CommonUtil.__showSuccess("Emoji updated successfully")
                    setEmojiVisible(false)
                },
                errorCallBack: (error:any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    
                }
            })
        }else{
            RoomsAgent.updateSection({
                variables: {
                    sectionUuid     :  sectionId,
                    input: {
                        emoji           :   emojiValue
                    }
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Emoji updated successfully")
                    setEmojiVisible(false);
                },
                errorCallBack: (error:any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    // const handleSwitchChange = (value: any) => {
    //     RoomsAgent.updateSection({
    //         variables: {
    //             sectionUuid: sectionId,
    //             input: {
    //                 isEnabled    :   value
    //             }
    //         },
    //         onCompletion: () => {
    //         },
    //         errorCallBack: (error: any) => {
    //             CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
    //         }
    //     })
    // }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            form.submit()
        }
    }

    const handleInputBlur = () => {
        form.submit()
    }

    const handleDeleteSection = () => {
        const messageLoading = message.loading("Deleting section point...", 0);
        if(kind && kind !== "room"){
            RoomTemplateAgent.deleteSection({
                variables: {
                    sectionUuid:  sectionId,
                },
                onCompletion: () => {
                    messageLoading()
                    if(sectionData._rtSections.find((item: any, index: number) => index === 0 && item.uuid === sectionId)) {
                        setCurrentView({
                            id  :   sectionData._rtSections[1].uuid,
                            type:   sectionData._rtSections[1].type
                        });
                    }
                    else {
                        setCurrentView({
                            id  :   sectionData._rtSections[0].uuid,
                            type:   sectionData._rtSections[0].type
                        });
                    }
                    CommonUtil.__showSuccess("Section deleted successfully")
                },
                errorCallBack: (error: any) => {
                    messageLoading()

                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            RoomsAgent.deleteSection({
                variables: {
                    sectionUuid:  sectionId,
                },
                onCompletion: () => {
                    messageLoading()
                    navigate(`/rooms/${params.accountId}/${params.roomId}/sections/${roomsSectionList?.filter((item: any) => item.type === "WELCOME")[0].uuid}`)
                    CommonUtil.__showSuccess("Section deleted successfully")
                },
                errorCallBack: (error: any) => {
                    messageLoading()

                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }
 
    return (
        <>
            <Space style={{background: "transparent"}} className='cm-width100 j-room-action-points cm-margin-bottom15 cm-flex-space-between' size={15}>
                <div className='cm-flex-justify-center cm-gap8'>
                    {
                        SectionEditPermission ?
                            <>
                                <Popover
                                    overlayClassName    =   'j-emoji-popoup'
                                    content             =   {
                                        <EmojiPicker theme={"light"} previewPosition={"none"} style={{ height: "20%" }} onEmojiSelect={(e: { native: string }) => {onEmojiSelect ((e.native))}} />
                                    }
                                    trigger             =   "click"
                                    open                =   {emojiVisible}
                                    onOpenChange        =   {setEmojiVisible}
                                    placement           =   'bottomLeft'
                                > 
                                    <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                        {section?.emoji}
                                    </Text> 
                                </Popover>
                                {
                                    editView ?
                                        <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                            <>
                                                <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={section?.title}>
                                                    <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                                </Form.Item>
                                                <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                            </>
                                        </Form>
                                    :
                                            <div className='cm-flex-align-center'>
                                                <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: section?.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{section?.title}</Text>
                                                {section?.title && <MaterialSymbolsRounded font="edit" size="14" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>}
                                            </div>
                                }
                            </>
                        :
                            <>
                                <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                    {section?.emoji}
                                </Text> 
                                <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: section?.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{section?.title}</Text>
                            </>
                    }
                </div>
                {
                    SectionEditPermission &&
                        <Space>
                            {
                                !kind ?
                                    <Button
                                        ghost
                                        type        =   'primary'
                                        style       =   {!section?.isProtected ? {background: "transparent"} : {background: "linear-gradient(180deg, #FFFFFF 0%, #E5F1FF 100%)", border: "1px solid #0769E71F"}}
                                        icon        =   {!section?.isProtected ? <MaterialSymbolsRounded font='lock_open' size='18'/> : <MaterialSymbolsRounded font='lock_person' size='18'/>} 
                                        className   =   'cm-flex-center cm-icon-button'
                                        onClick     =   {() => {
                                            setAccessManager(true)
                                        }}
                                    >
                                        Access
                                    </Button>
                                :
                                    null
                            }
                            {/* {
                                kind !== "room" && kind !== "template" && <MaterialSymbolsRounded font='delete' size='20' onClick={() => setShowDeleteConfirmation(true)} className="j-section-delete-icon cm-padding5 cm-cursor-pointer" color="#DF2222"/>
                            } */}
                            {/* <div
                                className   =   'cm-flex-center cm-icon-button cm-border-light cm-border-radius4'
                                style       =   {{padding: "4px 15px"}}
                            >
                                <Space>
                                    <Text>Show to Buyer</Text>
                                    <Switch size='small' onChange={handleSwitchChange} defaultChecked={section.isEnabled}/>
                                </Space>
                            </div> */}
                        </Space>
                }
            </Space>
            <SectionAccessManagerModal 
                isOpen      =   {accessManager}
                onClose     =   {() => setAccessManager(false)}
                entityData  =   {entityData}
                sectionData =   {section}
            />
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {handleDeleteSection(); setShowDeleteConfirmation(false)}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   'Delete Section'
                body        =   'Are you sure you want to delete this section?'
                okText      =   'Delete'
            />
        </>
    );
};
 
export default SectionTitle;
 