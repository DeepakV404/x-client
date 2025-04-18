import { FC, useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputRef, Space } from "antd";

import { ERROR_CONFIG } from "../../../config/error-config";
import { FAQ_ADDED } from "../../../tracker-constants";
import { AppTracker } from "../../../app-tracker";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { Length_Input } from "../../../constants/module-constants";
import Loading from "../../../utils/loading";

const { TextArea }  =   Input;
const { useForm }   =   Form;

interface FaqModalContentProps
{
    onClose :   () => void;
}

const FaqModalContent: FC<FaqModalContentProps> = (props) => {

    const { onClose }   =   props;

    const inputRef = useRef<InputRef>(null);
    const [submitState, setSubmitState]     =   useState({
        text: "Submit",
        loading: false
    });

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [form]    =   useForm();

    const onFinish = (values: any) => {

        setSubmitState({
            loading :   true,
            text    :   "submitting..."
        })
        
        const question = form.getFieldsValue().question;
        const answer   = form.getFieldsValue().answer;

        if(!question.trim()){
            CommonUtil.__showError("Question cannot be empty");
        }

        else if(!answer.trim()){
            CommonUtil.__showError("Answer cannot be empty");
        }

        else{
            SettingsAgent.createFaq({
                variables: {
                    input: {
                        question: values.question,
                        answer: values.answer,
                    }
                },
                onCompletion: () => {
                    onClose()
                    CommonUtil.__showSuccess("Faq created successfully")
                    setSubmitState({
                        loading :   false,
                        text    :   "Submit"
                    })
                    AppTracker.trackEvent(FAQ_ADDED, {});
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    setSubmitState({
                        loading :   false,
                        text    :   "Submit"
                    })
                }
            })
        }
    }

    return(
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Add FAQ</div>
            <Form className="cm-form cm-modal-content" form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Question" name="question" rules={[{required: true, message: "Question is required", whitespace: true}]}>
                    <Input ref={inputRef} size="large" maxLength={Length_Input} placeholder="Enter your question here"/>
                </Form.Item>
                <Form.Item label="Answer" name="answer" rules={[{required: true, message: "Answer is required" , whitespace: true}]}>
                    <TextArea showCount rows={3} placeholder="Enter your answer here"/>
                </Form.Item>
                </Form>
                <div className='j-demo-form-footer'>
                <Space>
                    <Button type='primary' ghost onClick={() => onClose()}>Cancel</Button>
                    <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                        <Space size={10}>
                            {submitState.text}
                            {
                                submitState.loading && <Loading color="#fff" size='small'/>
                            }
                        </Space>
                    </Button>
                </Space>
            </div>
        </>
    )
}

export default FaqModalContent