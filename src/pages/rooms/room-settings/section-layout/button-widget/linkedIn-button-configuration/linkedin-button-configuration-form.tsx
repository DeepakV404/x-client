import { Button, Form, Input, Space } from "antd";

import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";
import { Length_Input, MODULE_TEMPLATE } from "../../../../../../constants/module-constants";
import { RoomsAgent } from "../../../../api/rooms-agent";
import { CommonUtil } from "../../../../../../utils/common-util";
import { ERROR_CONFIG } from "../../../../../../config/error-config";

const { useForm }   =   Form;

const LinkedinButtonConfigurationForm = (props: {editButtonProps: any, onClose: () => void, module: any}) => {

    const { editButtonProps, onClose, module }   =   props

    const [form]        =   useForm();

    const widget        =   editButtonProps?.widget;
    const component     =   editButtonProps?.component;

    const __linkedInButtonPropertyMap   =   {...component.content.linkedInButton}

    const onFinish = (values: any) => {

        __linkedInButtonPropertyMap["link"]         =   values.link;
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "linkedInButton",
                    propertyContent :   __linkedInButtonPropertyMap
                },
                onCompletion: () => {
                    onClose()
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }else{
            RoomsAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "linkedInButton",
                    propertyContent :   __linkedInButtonPropertyMap
                },
                onCompletion: () => {
                    onClose()
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    return (
        <>                
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">LinkedIn Configuration</div>
            <Form 
                form            =   {form} 
                onFinish        =   {onFinish} 
                layout          =   "vertical"
                className       =   "cm-form cm-modal-content"
            >
                <Form.Item label="Link" name={"link"}
                    rules       =   {[{
                        required    :   true,
                        message     :   "Link required"
                    },{
                        pattern     :   /(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                        message     :   "Not an valid link"
                    }]}
                    initialValue=   {__linkedInButtonPropertyMap.link}
                >
                    <Input allowClear maxLength={Length_Input} placeholder="Link" size="large"/>
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

export default LinkedinButtonConfigurationForm