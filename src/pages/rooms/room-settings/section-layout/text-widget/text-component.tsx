import { useState } from 'react';
import { debounce } from 'lodash';

import { RoomTemplateAgent } from '../../../../templates/api/room-template-agent';

import RichTextEditor from '../../../../../components/HTMLEditor/rt-editor';
import { MODULE_TEMPLATE } from '../../../../../constants/module-constants';
import { RoomsAgent } from '../../../api/rooms-agent';

const TextComponent = (props: {widget: any, component: any, module: string }) => {

    const { widget, component, module } =   props;

    const [loading, setLoading]     =   useState(false);
    const [saved, setSaved]         =   useState(false);

    const __textPropertyMap         =   { ...component.content.paragraph };

    const handleParagraphUpdateDebounce = (debounce((text: string) => {
        console.log("Debounced input text length:", text.length);
        handleParagraphUpdate(text);
    }, 500));

    const handleParagraphUpdate = (text: string) => {
        
        const updatedMap = { ...__textPropertyMap, value: text };

        // __textPropertyMap["value"]    =   text;

        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   updatedMap
                },
                onCompletion: () => {
                    setLoading(false)
                    setSaved(true)
                    setTimeout(() => {
                        setSaved(false)
                    }, 2000)
                },
                errorCallBack: (error: any) => {
                    console.error("Update failed", error);
                    setLoading(false)
                    setSaved(false)
                },
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   updatedMap
                },
                onCompletion: () => {
                    setLoading(false)
                    setSaved(true)
                    setTimeout(() => {
                        setSaved(false)
                    }, 2000)
                },
                errorCallBack: (error: any) => {
                    console.error("Update failed", error);
                    setLoading(false)
                    setSaved(false)
                },
            });
        }
    };

    return (
        <div className="j-widget-rte cm-position-relative">
            <RichTextEditor loading={loading} saved={saved} showSave={true} placeholder="Description" onChange={handleParagraphUpdateDebounce} value={__textPropertyMap.value || `<p></p>`}/>
        </div>
    )
}

export default TextComponent