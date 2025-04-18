import { useState } from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';

import { Length_Input } from '../../../constants/module-constants';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { BuyerAgent } from '../../api/buyer-agent';

import Translate from '../../../components/Translate';
import Loading from '../../../utils/loading';
import useLocalization from '../../../custom-hooks/use-translation-hook';

const { TextArea }      =   Input;
const { useForm }   =   Form;

const BuyerActionRequest = (props: {isOpen: boolean, onClose: () => void, requestType: string, stageId: string}) => {
    
    const { isOpen , onClose, requestType, stageId }  =   props;

    const [form]        =   useForm();

    const { translate } = useLocalization();

    const [submitState, setSubmitState] =   useState(false);

    const onFinish = (values: any) => {
        setSubmitState(true)
        if(requestType === "meeting"){
            BuyerAgent.requestMeeting({
                variables: {
                    stageUuid: stageId,
                    input: {
                        title       :   values.title,
                        description :   values.description,
                    }
                },
                onCompletion: () => {
                    setSubmitState(false)
                    onClose();
                    form.resetFields()
                    CommonUtil.__showSuccess(<Translate i18nKey="success-message.actionpoint-created-message" />);                
                },
                errorCallBack: (error: any) => {
                    setSubmitState(false)
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            BuyerAgent.requestResource({
                variables: {
                    stageUuid: stageId,
                    input: {
                        title       :   values.title,
                        description :   values.description,
                    }
                },
                onCompletion: () => {
                    setSubmitState(false)
                    onClose();
                    form.resetFields()
                    CommonUtil.__showSuccess(<Translate i18nKey="success-message.actionpoint-created-message" />);                
                },
                errorCallBack: (error: any) => {
                    setSubmitState(false)
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    return (
        <Modal
            centered
            width           =   {550}
            open            =   {isOpen}
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   'cm-bs-custom-modal'
        >
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">
                {requestType === "meeting" ? <Translate i18nKey="step.request-meeting"/> : <Translate i18nKey="step.request-resource"/>}
            </div>
            <Form form={form} layout='vertical' onFinish={onFinish}  className='cm-form cm-modal-content'>
                <Form.Item name={"title"} label={<Translate i18nKey={"common-labels.title"}/>} rules={[{required: true, message: "Title is required"}]}>
                    <Input maxLength={Length_Input} placeholder={translate("common-placeholder.title-for-your-request")}/>
                </Form.Item>
                <Form.Item name={"description"} label={<Translate i18nKey={"common-labels.description"}/>} extra={<Space className='cm-margin-top10 cm-font-size12'><div><Translate i18nKey="common-labels.note"/>: </div><div className='cm-font-fam500'><Translate i18nKey="step.request-note"/></div></Space>}>
                    <TextArea showCount rows={4} placeholder={translate("common-placeholder.description")}/>
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text"><Translate i18nKey="common-labels.cancel"/></div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center cm-cancel-btn ${submitState ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState}>
                        <Space size={10}>
                            <div className="cm-font-size14">
                                <div className="cm-font-size14"><Translate i18nKey={submitState ? "common-labels.submitting" : "common-labels.submit"}/></div>
                            </div>
                            {
                                submitState && <Loading color="#fff"/>
                            }
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </Modal>
    )
}

export default BuyerActionRequest