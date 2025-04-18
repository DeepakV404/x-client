import { Checkbox, Collapse, Form, Input, Space, Switch, Typography } from 'antd';
import { debounce } from 'lodash';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';

import { RoomTemplateAgent } from '../../../../../templates/api/room-template-agent';
import { Length_Input, MODULE_TEMPLATE } from '../../../../../../constants/module-constants';
import { RoomsAgent } from '../../../../api/rooms-agent';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';

const { Text }      =   Typography;
const { useForm }   =   Form;

const EditButtonComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module } =   props;

    const [form]           =   useForm();

    const __buttonPropertyMap           =   {...component.content.button};

    const handleButtonComponentChange = debounce(() => {
        handleButtonChange();
    }, 500);

    const handleButtonChange = () => {
        __buttonPropertyMap["link"]             =   form.getFieldValue("buttonLink");
        __buttonPropertyMap["name"]             =   form.getFieldValue("buttonName");
        __buttonPropertyMap["openInNewTab"]     =   form.getFieldValue("openInNewTab");

        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "button",
                    propertyContent :   __buttonPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    } 

    return (
        <Form form={form} className="cm-form cm-width100" layout='vertical'>
            <Space direction='vertical' className='cm-width100' size={10}>
                <Collapse
                    defaultActiveKey    =   {["button"]}
                    expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"button"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Button 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__buttonPropertyMap.enabled} 
                                        disabled        =   {__buttonPropertyMap.required} 
                                        onChange        =   {(_: boolean, event: any) => {
                                            event.stopPropagation()
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <>
                            <Form.Item label="Name" name="buttonName"
                                rules       =   {[{
                                    required    :   true,
                                    message     :   "Name is required"
                                }]}
                                initialValue=   {__buttonPropertyMap.name}
                            >
                                <Input allowClear maxLength={Length_Input} placeholder="Name" size="large" onChange={handleButtonComponentChange}/>
                            </Form.Item>
                            <Form.Item label="Link" name="buttonLink"
                                rules           =   {[
                                    {
                                        required    :   true,
                                        message     :   "Link required",
                                    }
                                ]}
                                initialValue    =   {__buttonPropertyMap.link}
                            >
                                <Input allowClear maxLength={Length_Input} placeholder="Link" size="large" onChange={handleButtonComponentChange}/>
                            </Form.Item>
                            <Form.Item noStyle name={"openInNewTab"} valuePropName="checked" initialValue={__buttonPropertyMap.openInNewTab}>
                                <Checkbox
                                    onChange    =   {handleButtonChange}
                                    onClick     =   {(event) => event.stopPropagation()}
                                >
                                    <Text>Open in new tab</Text>
                                </Checkbox>
                            </Form.Item>
                        </>
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditButtonComponent