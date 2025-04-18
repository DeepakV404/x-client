import { Checkbox, Collapse, Form, Input, Space, Switch, Typography } from 'antd';
import { debounce } from "lodash";

import { Length_Input, MODULE_TEMPLATE } from '../../../../../../constants/module-constants';
import { RoomTemplateAgent } from '../../../../../templates/api/room-template-agent';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import WidgetTitle from '../../widget-title';
import EditResourceComponent from '../../resource-widget/edit-resource-widget/edit-resource-component';
import { RoomsAgent } from '../../../../api/rooms-agent';

const { Text }      =   Typography;
const { useForm }   =   Form;

export const PROFILE_TYPE_USER      =   "PROFILE_TYPE_USER";
export const PROFILE_TYPE_CUSTOM    =   "PROFILE_TYPE_CUSTOM";

const EditFeatureComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module } =   props;

    const [form]           =   useForm();

    const __buttonPropertyMap           =   {...component.content.button};
    const __headingPropertyMap          =   {...component.content.heading};
    const __paragraphPropertyMap        =   {...component.content.paragraph};

    const handlePersonNameChange = debounce((event: any) => {
        handleNameChange(event.target.value);
    }, 500);

    const handleNameChange = (name: string) => {
        __headingPropertyMap["value"]  =   name
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "heading",
                    propertyContent :   __headingPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "heading",
                    propertyContent :   __headingPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handlePersonDescriptionChange = debounce((description: any) => {
        handleDescriptionChange(description);
    }, 500);

    const handleDescriptionChange = (description: string) => {
        __paragraphPropertyMap["value"]  =   description
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handlePersonButtonChange = debounce(() => {
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
    
    const changeHeadingState = (state: boolean) => {
        __headingPropertyMap["enabled"]  =   state
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "heading",
                    propertyContent :   __headingPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "heading",
                    propertyContent :   __headingPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }


    const changeParagraphState = (state: boolean) => {
        __paragraphPropertyMap["enabled"]  =   state
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const changeButtonState = (state: boolean) => {
        __buttonPropertyMap["enabled"]  =   state
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
                    expandIcon      =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel  
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"name"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Heading 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch size='small' defaultValue={__headingPropertyMap.enabled} disabled={__headingPropertyMap.required} onChange={(state: boolean, event: any) => {event.stopPropagation();changeHeadingState(state)}}/>
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item name={"name"} noStyle={true} initialValue={__headingPropertyMap.value}>
                            <Input placeholder="Heading" onChange={handlePersonNameChange}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel  
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"description"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Paragraph 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__paragraphPropertyMap.enabled} 
                                        disabled        =   {__paragraphPropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {
                                            event.stopPropagation()
                                            changeParagraphState(state)
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item name={"description"} noStyle={true} initialValue={__paragraphPropertyMap.value}>
                            <WidgetTitle onChange={handlePersonDescriptionChange} placeholder="Description" className="j-widget-description" bordered/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
                {/* Button Property */}
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
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
                                        onChange        =   {(state: boolean, event: any) => {
                                            event.stopPropagation()
                                            changeButtonState(state)
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
                                <Input allowClear maxLength={Length_Input} placeholder="Name" size="large" onChange={handlePersonButtonChange}/>
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
                                <Input allowClear maxLength={Length_Input} placeholder="Link" size="large" onChange={handlePersonButtonChange}/>
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
                <EditResourceComponent component={component} widget={widget}/>
            </Space>
        </Form>
    )
}

export default EditFeatureComponent