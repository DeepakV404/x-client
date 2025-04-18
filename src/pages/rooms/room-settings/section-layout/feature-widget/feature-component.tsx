import { FC, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { debounce } from 'lodash';

import { RoomTemplateAgent } from '../../../../templates/api/room-template-agent';
import { MODULE_TEMPLATE } from '../../../../../constants/module-constants';
import { CommonUtil } from '../../../../../utils/common-util';
import { RoomsAgent } from '../../../api/rooms-agent';

import AddResourceToComponentSlider from '../resource-widget/add-resource-to-component/add-resource-to-component-slider';
import WidgetTitle from '../widget-title';
import { GlobalContext } from '../../../../../globals';
import { PermissionCheckers } from '../../../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../../../config/role-permission-config';

interface FeatureProps {
    widget                  :   any;
    component               :   any;
    onButtonEdit            :   any;
    module                  :   any;
}

const { useForm }   =   Form;
const { Text }      =   Typography;

const FeatureComponent: FC<FeatureProps> = (props) => {

    const { widget, component, onButtonEdit, module }   =   props;

    const [form]    =   useForm();

    const __resourcePropertyMap     =   component.content.resource;
    const __heading                 =   component.content?.heading?.value;

    const { $user }                 =   useContext(GlobalContext);

    const [cardDesc, setCardDesc]                   =   useState(component.content?.paragraph?.value)
    const [uploadResource, setUploadResource]       =   useState(false);


    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    useEffect(() => {
        setCardDesc(component.content?.paragraph?.value)
        form.setFieldsValue({
            ["paragraph"] :   component.content?.paragraph?.value
        })
    }, [component.content?.paragraph?.value])

    const __buttonPropertyMap       =   {...component.content.button};
    const __headingPropertyMap      =   {...component.content.heading};
    const __paragraphPropertyMap    =   {...component.content.paragraph};

    const handleCardNameChange = debounce(() => {
        handleCardNameUpdate(component.uuid, form);
    }, 1000);

    const handleCardDesignationChange = debounce(() => {
        handleCardDesignationUpdate(component.uuid, form);
    }, 1000);

    const handleCardNameUpdate = (componentUuid: string, form: any) => {
        __headingPropertyMap["value"]    =   form.getFieldValue("heading")
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
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
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "heading",
                    propertyContent :   __headingPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    };

    const handleCardDesignationUpdate = (componentUuid: string, form: any) => {
        __paragraphPropertyMap["value"]    =   form.getFieldValue("paragraph")
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
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
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "paragraph",
                    propertyContent :   __paragraphPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    };

    const handleButtonClick = () => {
        onButtonEdit({
            visibility  :   true,
            widget      :   widget,
            component   :   component,
        })
    }

    return (
        <>
            <div 
                key         =   {component.uuid} 
                className   =   "cm-position-relative"
            >
                <Space size={50} align="start">
                    <div style={{maxWidth: "300px"}}>
                        {
                            __resourcePropertyMap.value 
                            ?
                                <div className="cm-flex-center j-hyperlink-text cm-font-fam500 cm-border-radius6 cm-cursor-pointer cm-margin-top5">
                                    {
                                        __resourcePropertyMap?.value?.content?.thumbnailUrl 
                                        ? 
                                            <img height={"100%"} width={"100%"} style={{objectFit: "scale-down"}} src={__resourcePropertyMap.value.content.thumbnailUrl} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(__resourcePropertyMap.value.content.type)}}/>
                                        : 
                                            <img height={"100%"} width={"100%"} style={{objectFit: "scale-down"}} src={CommonUtil.__getResourceFallbackImage(__resourcePropertyMap.value.content.type)} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(__resourcePropertyMap.value.content.type)}}/>
                                    }
                                </div>
                            :
                                <div className="cm-margin-top10 cm-flex-center" style={{height: "250px"}}>
                                    <div className={`j-section-add-text j-section-resource-add-card cm-flex-center ${RoomEditPermission ? "cm-cursor-pointer" : ""} cm-padding5`} onClick={() => RoomEditPermission ? setUploadResource(true) : null} style={{height: "300px", width: "300px"}}>
                                        <Space direction="vertical" className="cm-text-align-center" size={2}>
                                            <Text className="j-hyperlink-text">Add Resource</Text>
                                            <Text className="cm-light-text cm-font-size12">You can add img, docs, mp4 & etc.</Text>
                                        </Space>
                                    </div>
                                </div>
                        }
                    </div>
                    <Space direction='vertical' style={{maxWidth: "400px"}}>
                        <Form form={form}>
                            <Space direction='vertical' align='start' className='cm-width100 cm-space-inherit' size={10}>
                                {
                                    __headingPropertyMap.enabled ?
                                        <Form.Item name={"heading"} noStyle={true} initialValue={__heading} >
                                            <Input 
                                                className   =   "cm-padding-inline0 cm-font-size18 cm-font-fam600" 
                                                variant     =   "borderless" 
                                                placeholder =   "Heading" 
                                                onChange    =   {handleCardNameChange}
                                                style       =   {{width: "400px"}}
                                            />
                                        </Form.Item>
                                    :
                                        null
                                }
                                {
                                    __paragraphPropertyMap.enabled ?
                                        <Form.Item name={"paragraph"} noStyle={true} initialValue={cardDesc}>
                                            <WidgetTitle onChange={handleCardDesignationChange} placeholder="Paragraph" className="j-widget-description"/>
                                        </Form.Item>
                                    :
                                        null
                                }
                                {__buttonPropertyMap.enabled ? <Button type="primary" onClick={() => handleButtonClick()}>{__buttonPropertyMap.name || "Button Name"}</Button>  : null}
                            </Space>
                        </Form>
                    </Space>
                </Space>
            </div>
            <AddResourceToComponentSlider
                widget          =   {widget} 
                component       =   {component}
                isDrawerOpen    =   {uploadResource} 
                setIsDrawerOpen =   {setUploadResource} 
                template        =   {true} 
                addResource     =   {true}
            />  
            
        </>
    )
}

export default FeatureComponent