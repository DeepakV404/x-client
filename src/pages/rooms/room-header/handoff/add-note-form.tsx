import { Button, Form, Space } from "antd";

import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { RoomsAgent } from "../../api/rooms-agent";
import { useParams } from "react-router-dom";

import HtmlEditor from "../../../../components/HTMLEditor";
import { useState } from "react";

const { useForm }   =   Form;

const AddNoteForm = (props: {onClose: () => void, blankNote?: boolean}) => {

    const { onClose } =   props;

    const [form]        =   useForm();
    const { roomId }    =   useParams();

    const [submitState, setSubmitState]     =   useState({
        text    :   "Add",
        loading :   false
    })

    const onFinish = (values: any) => {
        setSubmitState({
            text: "Adding",
            loading: true
        })
        RoomsAgent.addRoomNote({
            variables: {
                roomUuid    :   roomId, 
                note        :   values.note,  
                attachments :   [],
            },
            onCompletion: () => {
                setSubmitState({
                    text: "Add",
                    loading: false
                })
                onClose()
                CommonUtil.__showSuccess("Note added successfully")
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text: "Add",
                    loading: false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return(
        <div className="cm-width100">
            <div className="cm-modal-header cm-font-size16 cm-font-fam500 cm-flex-align-center">
                Add Note
            </div>
            <Form form={form} onFinish={onFinish} layout="vertical" className="cm-form">
                <div className="cm-modal-content">
                    <Form.Item name={"note"} label={"Note"} rules={[{required: true, message: "Note cannot be empty"}]}>
                        <HtmlEditor />
                    </Form.Item>
                </div>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button ghost className="cm-modal-footer-cancel-btn cm-secondary-text" onClick={() => onClose()}>Cancel</Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button loading={submitState.loading} disabled={submitState.loading} htmlType="submit" type="primary">{submitState.text}</Button>
                    </Form.Item>
                </Space>
            </Form>
        </div>
    )
}

export default AddNoteForm