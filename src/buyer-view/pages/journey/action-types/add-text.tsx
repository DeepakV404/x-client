import { FC } from "react";
import { Button, Form, Input, Space } from "antd";

import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { BuyerAgent } from "../../../api/buyer-agent";
import Translate from "../../../../components/Translate";
import useLocalization from "../../../../custom-hooks/use-translation-hook";

const { TextArea }  =   Input;
const { useForm }   =   Form;

interface AddTextProps
{
    actionId            :   string;
    defaultActionData   :   any;
}

const AddText: FC<AddTextProps> = (props) => {

    const { actionId, defaultActionData }  =   props;

    const { translate } = useLocalization();

    const [form]        =   useForm();

    const onFinish = (value: any) => {
        BuyerAgent.updateActionPoint({
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
                    <TextArea showCount rows={3} placeholder={translate("common-placeholder.write-something")} />
                </Form.Item>
            </Form>
            <Button size='small' type='primary' onClick={() => form.submit()}>
                <Translate i18nKey="common-labels.save"/>
            </Button>
        </Space>
    )
}

export default AddText