import { FC, useContext, useState } from 'react';
import { Button, Form, Input, Popconfirm, Space } from 'antd';

import { PermissionCheckers } from '../../../config/role-permission';
import { SETTINGS_FAQ } from '../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { SettingsAgent } from '../api/settings-agent';
import { GlobalContext } from '../../../globals';

const { useForm }   =   Form;
const { TextArea }  =   Input;

interface FaqUpdateProps
{
    faq     :   any;
    formRef :   any;
}

const FaqUpdate: FC<FaqUpdateProps> = (props) => {

    const { faq, formRef }   =   props;

    const [form]        =   useForm();

    const { $user }     =   useContext(GlobalContext);

    const showEdit      =   PermissionCheckers.__checkPermission($user.role, SETTINGS_FAQ, 'update');
    const showDelete    =   PermissionCheckers.__checkPermission($user.role, SETTINGS_FAQ, 'delete');

    const [saved, setIsSaved]       =   useState(false);

    const handleDelete = (faqId: string) => {
        SettingsAgent.deleteFaq({
            variables: {
                uuid    :   faqId
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Faq deleted successfully");
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })   
    }

    const handleUpdate = (faqId: string) => {
        setIsSaved(true)
        SettingsAgent.updateFaq({
            variables: {
                uuid    :   faqId,
                input   :   {
                    question: formRef.getFieldsValue()[faqId].question,
                    answer: form.getFieldsValue()[faqId].answer
                }
            },
            onCompletion: () => {
                setTimeout(function() {			
                    setIsSaved(false)
                }, 2000);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        
    }

    return (
        <Form form={form} className='cm-form'>
            <Form.Item name={[faq.uuid, "answer"]} initialValue={faq.answer} rules = {[{required: true, message: 'Answer cannot be empty'}]}>
                <TextArea showCount rows={4} placeholder='answer'/>
            </Form.Item>
            <Space>
                {
                    showEdit &&
                        <Form.Item>
                            <Button type='primary' onClick={() => handleUpdate(faq.uuid)}>{saved ? "Saved" : "Save"}</Button>
                        </Form.Item>
                }
                {
                    showDelete &&
                        <Popconfirm 
                            placement           =   "bottom"  
                            title               =   {<div className="cm-font-fam500">Delete FAQ</div>}
                            description         =   {<div className="cm-font-size13">Are you sure you want to delete this FAQ?</div>}
                            icon                =   {null}
                            okText              =   "Delete"
                            okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F", fontSize: "12px"}}}
                            cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC", fontSize: "12px"}, ghost: true}}
                            onConfirm           =   {() => handleDelete(faq.uuid)}
                        >
                            <Form.Item>
                                <Button type='primary' ghost style={{border: "none"}}>Delete</Button>
                            </Form.Item>
                        </Popconfirm>
                }
            </Space>
        </Form>
    )
}

export default FaqUpdate