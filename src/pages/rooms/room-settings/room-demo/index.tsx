import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Form, Input, Popover, Select, Space, Typography } from 'antd';

import { Length_Input } from '../../../../constants/module-constants';
import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../../config/error-config'
import { CommonUtil } from '../../../../utils/common-util'
import { R_SECTIONS, R_USECASES } from '../../api/rooms-query';
import { RoomsAgent } from '../../api/rooms-agent';
import { GlobalContext } from '../../../../globals';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded'
import DemoEditSlider from '../demo-edit/demo-edit-slider';
import UsecaseSelector from './usecase-selector';
import Loading from '../../../../utils/loading';
import EmojiPicker from '@emoji-mart/react';
import DemoPreview from './demo-preview';
import DemoSlider from '../demo-slider';

const { Text }  =   Typography;
const { useForm }   =   Form;

const RoomDemo = () => {

    const params: any           =   useParams();

    const [currentUsecase, setCurrentUsecase]       =   useState<any>();
    const [newUsecaseAdded, setNewUsecaseAdded]     =   useState<null | boolean>(null)
    const [open, setOpen]                           =   useState<boolean>(false);
    const [showCreateUsecase, setShowCreateUsecase] =   useState<boolean>(false)
    const [editView, setEditView]                   =   useState(false);
    const [emojiVisible, setEmojiVisible]           =   useState(false);
    const selectRef                                 =   useRef<any>(null);


    const [showEdit, setShowEdit]                   =   useState({
        visibility  :   false,
        usecase     :   null
    });

    const { $user }    =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [form]        =   useForm();

    const { data, loading, error }          =   useQuery(R_USECASES, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid    :   params.roomId
        },
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                setOpen((prevOpen) => !prevOpen);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if(newUsecaseAdded){
            setCurrentUsecase(data._rUsecases[data._rUsecases.length - 1])
        }else if(data){
            setCurrentUsecase(
                data._rUsecases.length > 0 ?
                    data._rUsecases[0]
                : 
                    undefined
            )
        }
    }, [data, newUsecaseAdded])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const onCreatedUsecase = (createdUsecase: any) => {
        if(createdUsecase) setNewUsecaseAdded(true)
    }

    const { data : roomSectionId }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId,
            filter  : {
                type : "DEMO"
            }
        },
        fetchPolicy: "network-only"
    })

    const onFinish: any = (values: any) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: roomSectionId._rSections[0].uuid,
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
        setEditView(false)
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }

    const onEmojiSelect = (emojiValue: string) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid         :   roomSectionId._rSections[0].uuid,
                input: {
                    emoji           :   emojiValue
                }
            },
            onCompletion: () => {
                setEditView(false);
                setEmojiVisible(false)
            },
            errorCallBack: (error:any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

            }
        })
    }

    const handleInputBlur = () => {
        form.submit()
    }

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    return (
        <>
            <div className='cm-height100 cm-overflow-auto cm-padding15'>
                <Space direction='vertical' className='cm-width100 j-room-setup-body-wrapper' size={20} style={{background: "transparent"}}>
                    <div className='cm-flex-space-between'>
                        {
                            RoomEditPermission ?
                                <>
                                    <Space>
                                        <Popover
                                            overlayClassName    =   'j-emoji-popoup'
                                            content             =   {
                                                <EmojiPicker theme={"light"} previewPosition={"none"} style={{ height: "20%" }} onEmojiSelect={(e: { native: string }) => {onEmojiSelect ((e.native))}} />
                                            }
                                            trigger             =   "click"
                                            open                =   {emojiVisible}
                                            onOpenChange        =   {setEmojiVisible}
                                            placement           =   'bottom'
                                        > 
                                            <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                                {roomSectionId?._rSections[0].emoji}
                                            </Text> 
                                        </Popover>
                                        {
                                            editView ?
                                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                                    <>
                                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={roomSectionId?._rSections[0].title}>
                                                            <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                                        </Form.Item>
                                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                                    </>
                                                </Form>
                                            :
                                                <>
                                                    <div className='cm-flex-align-center'>
                                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: roomSectionId?._rSections[0].title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{roomSectionId?._rSections[0].title}</Text>
                                                        <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                                    </div>
                                                </>
                                        }
                                    </Space>
                                    <Button type='primary' ghost className="cm-icon-button cm-flex-center" icon={<MaterialSymbolsRounded font="add" size="20" weight='400'/>} onClick={() => setShowCreateUsecase(true)} style={{background: "transparent"}}>
                                        Add Use Case
                                    </Button>
                                </>
                            :
                                <Space>
                                    <Text className="cm-font-size18 cm-font-fam500" style={{ maxWidth: "200px" }}>
                                        {roomSectionId?._rSections[0].emoji}
                                    </Text> 
                                    <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: roomSectionId?._rSections[0].title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{roomSectionId?._rSections[0].title}</Text>
                                </Space>
                        }
                    </div>
                </Space>
                <div className='cm-border-radius6 cm-background-white cm-margin-top15'>
                    <div className="j-demo-room-dropdown cm-padding15">
                        <div className="j-buyer-demo-title cm-flex-center cm-font-fam500 cm-secondary-text" style={{background: "#F0F2F5"}}>Usecase</div>
                        <Select ref={selectRef} style={{maxWidth: "calc(100% - 80px)"}} value={currentUsecase && currentUsecase?.uuid} open={open} className="j-buyer-usecase-select cm-width100" suffixIcon={<Space><div className="j-buyer-demo-suffix-badge cm-font-fam500 cm-secondary-text">⌘ + K</div><MaterialSymbolsRounded font="expand_more" color="#5C5A7C"/></Space>} 
                            popupClassName              =   "j-buyer-usecase-popup" 
                            placeholder                 =   "Select a usecase" 
                            dropdownRender              =   {() => <UsecaseSelector currentUsecase={currentUsecase} setCurrentUsecase={setCurrentUsecase} setOpen={setOpen} selectedRef={selectRef} setShowEdit={setShowEdit}/>} 
                            onClick                     =   {(event: any) => {event.stopPropagation()}} 
                            optionLabelProp             =   "label" 
                            onDropdownVisibleChange     =   {handleOpenChange}
                            options                     =   {data._rUsecases.map((_usecase: any) => ({ label: <Text style={{maxWidth: "calc(100vw - 500px)", display: "block"}} ellipsis={{tooltip: _usecase.title}}>{_usecase.title}</Text>, value: _usecase.uuid }))}
                        ></Select>
                    </div>
                    <DemoPreview usecase={currentUsecase}/>
                </div>
                <DemoSlider isOpen={showCreateUsecase} onClose={() => setShowCreateUsecase(false)} entityId={params.roomId} page={"ROOM"} onCreate={(createdUsecase: any) => onCreatedUsecase(createdUsecase)}/>
            </div>
            <DemoEditSlider 
                isOpen      =   {showEdit.visibility} 
                onClose     =   {() => setShowEdit({visibility: false, usecase: null})} 
                entityId    =   {params.roomId} 
                page        =   'ROOM' 
                usecase     =   {showEdit.usecase}
            />
        </>
    )
}

export default RoomDemo