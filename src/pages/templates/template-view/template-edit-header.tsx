import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Space } from "antd";

import { RoomTemplateAgent } from "../api/room-template-agent";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";
import { Length_Input } from "../../../constants/module-constants";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import HtmlEditor from "../../../components/HTMLEditor";
import Loading from "../../../utils/loading";

const { useForm }    =    Form;

const TemplateEditHeader = (props: {onClose: () => void, stage : any, currentStage: any}) => {

    const { onClose, stage, currentStage }    =   props;

    const { id }    =   currentStage

    const params    =   useParams();

    const [form]    =   useForm();

    const [submitState]         =   useState({
        loading         :   false,
        text            :   "Update"
    });

    const onFinish = (values: any) => {
        RoomTemplateAgent.updateStage({
            variables: {
                templateUuid: params.roomTemplateId,
                stageUuid:  id,
                input: {
                    title: values.title,
                    description: form.getFieldsValue().description
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Title updated successfully");
                onClose();
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


    return(
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-add-res-form-body'>
                <div className='cm-padding15'>
                    <Form layout="vertical" preserve={false} form={form} onFinish={onFinish} className='cm-form cm-width100'> 
                        <Form.Item label="Title" name={"title"} initialValue={stage._rtJourneyStage.title}>
                            <Input autoFocus maxLength={Length_Input} className="cm-font-fam500 cm-font-size16"  placeholder="Untitled" onKeyDown={handleEnter}/>
                        </Form.Item>
                        <Form.Item label="Description" name={"description"} initialValue={stage._rtJourneyStage.description ? stage._rtJourneyStage.description : ""} className='cm-margin-top20'>
                            <HtmlEditor/>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className='j-add-res-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <Button type="primary" className="cm-flex-center" onClick={() => form.submit()}>
                        <Space size={10}>
                            {submitState.text}
                            {submitState.loading && <Loading color="#fff" size='small' />}
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default TemplateEditHeader