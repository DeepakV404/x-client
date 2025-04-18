import { useState } from "react";
import { Collapse, Form, Space, Switch } from "antd";
import { debounce } from 'lodash';

import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";
import { RoomsAgent } from "../../../../api/rooms-agent";
import { MODULE_TEMPLATE } from "../../../../../../constants/module-constants";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import RichTextEditor from "../../../../../../components/HTMLEditor/rt-editor";

const { useForm }   =   Form;

const EditTextComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module } =   props;

    const [form]           =   useForm();

    const __paragraphPropertyMap        =   {...component.content.paragraph};

    const [loading, setLoading]     =   useState(false);
    const [saved, setSaved]         =   useState(false);

    const handleTextDescriptionChange = debounce((description: any) => {
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
                onCompletion: () => {
                    setLoading(false)
                    setSaved(true)
                    setTimeout(() => {
                        setSaved(false)
                    }, 2000)
                },
                errorCallBack: () => {
                    setLoading(false)
                    setSaved(false)
                }
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {
                    setLoading(false)
                    setSaved(true)
                    setTimeout(() => {
                        setSaved(false)
                    }, 2000)
                },
                errorCallBack: () => {
                    setLoading(false)
                    setSaved(false)
                }
            });
        }
    }

    return (
        <Form form={form} className="cm-form cm-width100" layout='vertical'>
            <Space direction='vertical' className='cm-width100' size={10}>
                <Collapse
                    defaultActiveKey    =   {["description"]}
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel  
                        className       =   'j-contact-card-edit-property-wrapper j-edit-text-widget-rte' 
                        key             =   {"description"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Description 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__paragraphPropertyMap?.enabled} 
                                        disabled        =   {__paragraphPropertyMap?.required} 
                                        onChange        =   {(_: boolean, event: any) => {
                                            event.stopPropagation()
                                        }}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item name={"description"} noStyle={true} initialValue={__paragraphPropertyMap.value}>
                            <RichTextEditor loading={loading} saved={saved} showSave={true} placeholder="Description" onChange={handleTextDescriptionChange}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditTextComponent