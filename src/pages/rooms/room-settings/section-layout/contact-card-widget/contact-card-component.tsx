import { FC, useEffect } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { LinkedinFilled } from '@ant-design/icons';
import { debounce } from 'lodash';

import { MODULE_TEMPLATE, WIDGET_PROFILE_IMAGE_FALLBACK } from '../../../../../constants/module-constants';
import { RoomTemplateAgent } from '../../../../templates/api/room-template-agent';

import WidgetTitle from '../widget-title';
import { RoomsAgent } from '../../../api/rooms-agent';

interface ContactCardProps {
    widget                  :   any;
    component               :   any;
    onButtonEdit            :   any;
    onLinkedInButtonEdit    :   any;
    onClickUploadProfile    :   any;
    module                  :   any;
}

const { useForm }   =   Form;

const ContactCardComponent: FC<ContactCardProps> = (props) => {

    const { widget, component, onButtonEdit, onLinkedInButtonEdit, onClickUploadProfile, module }   =   props;

    const [form]    =   useForm()

    const __isTeamUser      =   component.content?.teamCard?.teamUser;
    const __profileUrl      =   component.content?.profileImage?.url;
    const __cardName        =   component.content?.name?.value;
    const __cardDesc        =   component.content?.paragraph?.value;

    useEffect(() => {
        form.setFieldsValue({
            ["title"]       :   __cardName,
            ["description"] :   __cardDesc
        })
    }, [__cardName, __cardDesc])

    const __buttonPropertyMap       =   {...component.content.button};
    const __namePropertyMap         =   {...component.content.name};
    const __paragraphPropertyMap    =   {...component.content.paragraph};
    const __linkedInPropertyMap     =   {...component.content.linkedInButton};

    const handleCardNameChange = debounce(() => {
        handleCardNameUpdate(component.uuid, form);
    }, 1000);

    const handleCardDesignationChange = debounce(() => {
        handleCardDesignationUpdate(component.uuid, form);
    }, 1000);

    const handleCardNameUpdate = (componentUuid: string, form: any) => {
        __namePropertyMap["value"]    =   form.getFieldValue("title")
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "name",
                    propertyContent :   __namePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "name",
                    propertyContent :   __namePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }

    };

    const handleCardDesignationUpdate = (componentUuid: string, form: any) => {
        __paragraphPropertyMap["value"]    =   form.getFieldValue("description")
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

    const openUploadProfileComponent = () => {        
        onClickUploadProfile({
            visibility  :   true,
            widget      :   widget,
            component   :   component,
        })
    }

    const handleButtonClick = () => {
        onButtonEdit({
            visibility  :   true,
            widget      :   widget,
            component   :   component,
        })
    }

    const handleLinkedInButtonClick = () => {
        onLinkedInButtonEdit({
            visibility  :   true,
            widget      :   widget,
            component   :   component,
        })
    }

    return (
        <div 
            key         =   {component.uuid} 
            className   =   "cm-position-relative"
        >
            <Space size={30} align="start">
                {
                    __profileUrl
                    ? 
                        <div className="cm-flex-center j-hyperlink-text cm-font-fam500 cm-border-radius6 cm-cursor-pointer" onClick={() => openUploadProfileComponent()} style={{ height: "170px", width: "170px" }} >
                            {__profileUrl ? <img height={"100%"} width={"100%"} src={__profileUrl} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= WIDGET_PROFILE_IMAGE_FALLBACK}}/> : WIDGET_PROFILE_IMAGE_FALLBACK}
                        </div>
                    : 
                        <div className="j-section-resource-add-card cm-flex-center j-hyperlink-text cm-font-fam500 cm-border-radius6 cm-cursor-pointer" onClick={() => openUploadProfileComponent()} style={{ height: "170px", width: "170px" }} >
                            Upload / Choose
                        </div>
                }
                <Space direction='vertical' style={{maxWidth: "400px"}}>
                    <Form form={form} >
                        <Space direction='vertical' className='cm-width100' size={10}>
                            <Form.Item name={"title"} noStyle={true} initialValue={__cardName}>
                                <Input className="cm-padding-inline0 cm-font-size18 cm-font-fam600" variant="borderless" placeholder="Name" onChange={handleCardNameChange} disabled={__isTeamUser}/>
                            </Form.Item>
                            {
                                __paragraphPropertyMap.enabled ?
                                    <Form.Item name={"description"} noStyle={true} initialValue={__cardDesc}>
                                        <WidgetTitle onChange={handleCardDesignationChange} placeholder="Enter some text" className="j-widget-description"/>
                                    </Form.Item>
                                :
                                    null
                            }
                        </Space>
                    </Form>

                    <Space>
                        {__buttonPropertyMap.enabled ? <Button type="primary" onClick={() => handleButtonClick()}>{__buttonPropertyMap.name || "Contact Me"}</Button>  : null}
                        {
                            __linkedInPropertyMap.enabled ?
                                <Button className={`cm-border-radius6`} style={{padding: 8}} onClick={() => handleLinkedInButtonClick()} disabled={__isTeamUser}>
                                    <LinkedinFilled className="cm-cursor-pointer" style={{ color: __linkedInPropertyMap.enabled ? "#4C4C50" : "#98989F",  fontSize: "15px" }} />
                                </Button>
                            :
                                null
                        }
                    </Space>
                </Space>
            </Space>
        </div>
    )
}

export default ContactCardComponent