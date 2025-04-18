import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Popover, Space, Typography } from 'antd';

import { Length_Input } from '../../../../constants/module-constants';
import { RoomTemplateAgent } from '../../api/room-template-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import { useQuery } from '@apollo/client';
import { RT_SECTION } from '../../api/room-templates-query';
import EmojiPicker from '@emoji-mart/react';
import { RoomsAgent } from '../../../rooms/api/rooms-agent';
import { GlobalContext } from '../../../../globals';
import { PermissionCheckers } from '../../../../config/role-permission';
import { FEATURE_TEMPLATES } from '../../../../config/role-permission-config';

const { Text }      =   Typography;
const { useForm }   =   Form;

const TalkToUsHeader = (props: { id: string}) => {

    const { id }  =   props;

    const params    =   useParams();

    const [form]    =   useForm();

    const [editView, setEditView]               =   useState(false);
    const [emojiVisible, setEmojiVisible]       =   useState(false);

    const { $user }    =    useContext(GlobalContext);

    const TemplateEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const { data: eData }    =   useQuery(RT_SECTION, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   params.roomTemplateId, 
            sectionUuid     :   id
        }
    })

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            form.submit()
        }
    }

    const handleInputBlur = () => {
        form.submit()
    }

    const onEmojiSelect = (emojiValue: string) => {
        RoomTemplateAgent.updateRoomTemplateSection({
            variables: {
                sectionUuid     :   id,
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
    }

    const onFinish: any = (values: any) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: id,
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
                TemplateEditPermission ?
                    <Space>
                        <Popover
                            overlayClassName    =   'j-emoji-popoup'
                            content             =   {
                                <EmojiPicker theme={"light"} previewPosition={"none"} style={{ height: "20%" }} onEmojiSelect={(e: { native: string }) => {onEmojiSelect ((e.native))}} />
                            }
                            trigger             =   "click"
                            open                =   {emojiVisible}
                            onOpenChange        =   {setEmojiVisible}
                        > 
                            <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                {eData?._rtSection.emoji}
                            </Text> 
                        </Popover>
                        {
                            editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                    <>
                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={eData?._rtSection.title}>
                                            <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <>
                                    <div className='cm-flex-align-center'>
                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: eData?._rtSection.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{eData?._rtSection.title}</Text>
                                        <MaterialSymbolsRounded font="edit" size="14" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                    </div>
                                </>
                        }
                    </Space>
                :
                    <Space>
                        <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                            {eData?._rtSection.emoji}
                        </Text>
                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: eData?._rtSection.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{eData?._rtSection.title}</Text>
                    </Space>

            }
        </div> 
    )
}

export default TalkToUsHeader