import { Collapse, Form, Input, Space, Switch } from 'antd'
import { debounce } from 'lodash';
import CollapsePanel from 'antd/es/collapse/CollapsePanel'

import { RoomTemplateAgent } from '../../../../../templates/api/room-template-agent';
import { MODULE_TEMPLATE } from '../../../../../../constants/module-constants';
import { RoomsAgent } from '../../../../api/rooms-agent';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';

const { TextArea }  =   Input;
const { useForm }   =   Form;

const EditEmbedComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module } =   props;

    const __embedPropertyMap         =   { ...component.content.embedCode };

    const [form]    =   useForm();

    const handleEmbedUrlInputChange = (debounce(() => {
        form.submit();
    }, 500));

    const onFinish = (values: any) => {
        __embedPropertyMap["value"] = values.link;
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "embedCode",
                    propertyContent :   __embedPropertyMap
    
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            });
        }else{
            RoomsAgent.updateComponentByProperty({
                variables: {
                    widgetUuid      :   widget.uuid,
                    componentUuid   :   component.uuid,
                    propertyKey     :   "embedCode",
                    propertyContent :   __embedPropertyMap
    
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            });
        }
    }

    return (
        <Form form={form} className="cm-form cm-width100" layout='vertical' onFinish={onFinish}>
            <Space direction='vertical' className='cm-width100' size={10}>
                <Collapse
                    defaultActiveKey =   {["embedCode"]}
                    expandIcon       =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"embedCode"}
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Embed Code
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__embedPropertyMap?.enabled} 
                                        disabled        =   {__embedPropertyMap?.required} 
                                        onChange        =   {(_: boolean, event: any) => event.stopPropagation()}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <Form.Item noStyle={true} name={"link"} initialValue={__embedPropertyMap.value}>
                            <TextArea style={{height: 80,resize: 'none'}} placeholder={`<iframe src="https://www.sampleurlxyz123.com/" height="600px" width="100%" title="description"></iframe>`} onChange={() => handleEmbedUrlInputChange()}/>
                        </Form.Item>
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditEmbedComponent