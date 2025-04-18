import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Form, Input, Popover, Space, Typography } from 'antd';

import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { Length_Input } from '../../../../constants/module-constants';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';
import { R_SECTIONS } from '../../api/rooms-query';
import { RoomsAgent } from '../../api/rooms-agent';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import EmojiPicker from '@emoji-mart/react';

const { Text }      =   Typography;
const { useForm }   =   Form;

const TalkToUsHeader = () => {

    const params    =   useParams();

    const [form]    =   useForm();

    const [editView, setEditView]           =   useState(false);
    const [emojiVisible, setEmojiVisible]   =   useState(false);

    const { $user }    =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');


    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            form.submit()
        }
    }

    const handleInputBlur = () => {
        form.submit()
    }

    const { data }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId,
            filter  : {
                type : "TALK_TO_US"
            }
        },
        fetchPolicy: "network-only"
    })

    const onEmojiSelect = (emojiValue: string) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid     :   data._rSections[0].uuid,
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

    const onFinish: any = (values: any) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: data._rSections[0].uuid,
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

    return (
        <div className='cm-margin-bottom15'>
            {
                RoomEditPermission ?
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
                                {data?._rSections[0].emoji}
                            </Text> 
                        </Popover>
                        {
                            editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                    <>
                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={data?._rSections[0].title}>
                                            <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <>
                                    <div className='cm-flex-align-center'>
                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: data?._rSections[0].title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{data?._rSections[0].title}</Text>
                                        <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                    </div>
                                </>
                        }
                    </Space>
                :
                    <Space>
                        <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                            {data?._rSections[0].emoji}
                        </Text>
                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: data?._rSections[0].title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{data?._rSections[0].title}</Text>
                    </Space>
            }
        </div> 
    )
}

export default TalkToUsHeader