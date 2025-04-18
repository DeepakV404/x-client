import { useEffect, useState } from 'react';
import { Form, Input, Tabs, Tooltip } from 'antd'
import { debounce } from 'lodash';

import { RoomTemplateAgent } from '../../../../templates/api/room-template-agent';
import { RoomsAgent } from '../../../api/rooms-agent';

import { MODULE_TEMPLATE } from '../../../../../constants/module-constants';

const { TextArea }  =   Input;
const { useForm }   =   Form;

const EmbedComponent = (props: {widget: any, component: any, module: any }) => {

    const { widget, component, module } =   props;

    const [form]  =  useForm();

    const [embedLink, setEmbedLink] =   useState(component.content.embedCode);

    const __embedPropertyMap         =   { ...component.content.embedCode };


    useEffect(() => {
        form.setFieldsValue({
            ["link"]   :   component.content.embedCode.value
        })
        setEmbedLink(component.content.embedCode.value)
    }, [component.content.embedCode.value])

    const parseLink = () => {
        
        const embededCode = __embedPropertyMap.value
        if (embededCode?.includes("iframe")) {
            const match = embededCode.match(/src="([^"]+)"/);
            if (match && match[1]) {
                return match[1];
          }
        }
        return embededCode;
    };

    const handleUrlInputChange = (debounce(() => {
        form.submit();
    }, 500));

    const handleEmbedUrlChange = (values: any) => {
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
    };


    return (
        <Tabs
            rootClassName       =   "j-section-widget-tab"
            defaultActiveKey    =   "code"
            type                =   "card"
            items               =   {[
                {
                    label       :   "Embed URL",
                    key         :   "code",
                    children    :   (
                        <Form form={form} onFinish={handleEmbedUrlChange}>
                            <Form.Item noStyle={true} name={"link"} initialValue={__embedPropertyMap.value}>
                                <TextArea style={{height: 80,resize: 'none'}} placeholder={`<iframe src="https://www.sampleurlxyz123.com/" height="600px" width="100%" title="description"></iframe>`} onChange={() => handleUrlInputChange()}/>
                            </Form.Item>
                        </Form>
                    )
                },
                {
                    key         :   "preview",
                    children    :   (
                        <div className="j-buyer-demo-player cm-width100 cm-aspect-ratio16-9">
                            <iframe src={parseLink()} loading="lazy" style={{ width: "100%", height: "100%", colorScheme: "light", border: "0px" }} frameBorder={0} title={"demo"} />
                        </div>
                    ),
                    disabled    :   !embedLink,
                    label       :   !embedLink ? <Tooltip mouseEnterDelay={1} title={"Add any URL to preview"}>Preview</Tooltip> : "Preview"
                },
            ]}
        />
    )
}

export default EmbedComponent