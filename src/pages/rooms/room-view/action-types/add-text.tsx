import { FC } from "react";
import { Button, Form, Input, Space } from "antd";

import { RoomTemplateAgent } from "../../../templates/api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";

const { TextArea }  =   Input;
const { useForm }   =   Form;

interface AddTextProps
{
    actionId            :   string;
    defaultActionData   :   any;
}

const AddText: FC<AddTextProps> = (props) => {

    const { actionId, defaultActionData }  =   props;

    const [form]        =   useForm();

    const onFinish = (value: any) => {
        RoomTemplateAgent.updateActionPoint({
            variables: {
                actionPointUuid     :   actionId,
                input               :   {
                    actionPointData :   {
                        payload    :   value.textPayload
                    }
                }
            },
            onCompletion: () => {

            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <Space direction='vertical' className='cm-width100' size={15}>
            <Form form={form} onFinish={onFinish} >
                <Form.Item name={"textPayload"} noStyle rules={[{required: true, message: ""}]} initialValue={defaultActionData?.payload}>
                    <TextArea showCount rows={3} placeholder="Write something..."/>
                </Form.Item>
            </Form>
            <Button size='small' type='primary' onClick={() => form.submit()}>Save</Button>
        </Space>
    )
}

export default AddText