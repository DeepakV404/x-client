import { Button, Checkbox, Form, Input, Space, Typography } from "antd"

import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";
import { Length_Input, MODULE_TEMPLATE } from "../../../../../../constants/module-constants";
import { RoomsAgent } from "../../../../api/rooms-agent";
import { CommonUtil } from "../../../../../../utils/common-util";
import { ERROR_CONFIG } from "../../../../../../config/error-config";

const { useForm }   =   Form;
const { Text }      =   Typography

const ButtonConfigurationForm = (props: {editButtonProps: any, onClose: () => void, module: any}) => {

    const { editButtonProps, onClose, module }   =   props

    const widget        =   editButtonProps?.widget;
    const component     =   editButtonProps?.component;

    const __buttonPropertyMap           =   {...component.content.button}

    const [form]    =   useForm();

    const onFinish = (values: any) => {
        __buttonPropertyMap["name"]         =   values.name;
        __buttonPropertyMap["link"]         =   values.link;
        __buttonPropertyMap["openInNewTab"] =   values.openInNewTab;

        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {
                    onClose()
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            });
        }else{
            RoomsAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {
                    onClose()
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            });
        }
    }

    return (
        <>                
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Button Configuration</div>
            <Form 
                form            =   {form} 
                onFinish        =   {onFinish}
                layout          =   "vertical"
                className       =   "cm-form cm-modal-content"
            >
                <Form.Item label="Name" name="name"
                    rules       =   {[{
                        required    :   true,
                        message     :   "Name is required"
                    }]}
                    initialValue=   {__buttonPropertyMap.name}
                >
                    <Input allowClear maxLength={Length_Input} placeholder="Name" size="large"/>
                </Form.Item>
                <Form.Item label="Link" name="link"
                    rules           =   {[
                        {
                            required    :   true,
                            message     :   "Link required",
                        },
                        {
                            pattern     :   /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                            message     :   "Not an valid link"
                        }
                    ]}
                    initialValue    =   {__buttonPropertyMap.link}
                >
                    <Input allowClear maxLength={Length_Input} placeholder="Link" size="large"/>
                </Form.Item>
                <Form.Item noStyle name={"openInNewTab"} valuePropName="checked" initialValue={__buttonPropertyMap.openInNewTab}>
                    <Checkbox
                        onClick     =   {(event) => event.stopPropagation()}
                    >
                        <Text>Open in new tab</Text>
                    </Checkbox>
                </Form.Item>
            </Form>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Form.Item noStyle>
                    <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => onClose()}>
                        <Space size={10}>
                            <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                        </Space>
                    </Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button type="primary" className={`cm-flex-center`} onClick={() => form.submit()}>
                        <Space size={10}>
                            <div className="cm-font-size14">Save</div>
                        </Space>
                    </Button>
                </Form.Item>
            </Space>
        </>
    )
}

export default ButtonConfigurationForm