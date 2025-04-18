import { useEffect, FC } from 'react';
import { debounce } from "lodash";
import { Button, Form, Input, Space, Tooltip } from "antd";
import { LinkedinFilled } from '@ant-design/icons';

import { MODULE_TEMPLATE, WIDGET_PROFILE_IMAGE_FALLBACK } from "../../../../../constants/module-constants";
import { RoomTemplateAgent } from "../../../../templates/api/room-template-agent";

import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import { WidgetsAgent } from '../../../../custom-sections/api/widgets-agent';
import { RoomsAgent } from '../../../api/rooms-agent';

interface TeamCardProps {
    index                   :   number;
    widget                  :   any;
    component               :   any;
    onButtonEdit            :   any;
    onLinkedInButtonEdit    :   any;
    onDeleteCard            :   any;
    onClickUploadProfile    :   any;
    module                  :   any;
}

const TeamCardComponent: FC<TeamCardProps> = (props) => {

    const { index, widget, component, onLinkedInButtonEdit, onButtonEdit, onDeleteCard, onClickUploadProfile, module }    =   props;

    const __isTeamUser      =   component.content?.teamCard?.teamUser;
    const __profileUrl      =   component.content?.profileImage?.url;
    const __cardName        =   component.content?.name?.value
    const __cardDesignation =   component.content?.designation?.value;

    const __buttonPropertyMap       =   {...component.content.button};
    const __namePropertyMap         =   {...component.content.name};
    const __designationPropertyMap  =   {...component.content.designation};
    const __linkedInPropertyMap     =   {...component.content.linkedInButton};

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ["title"]           :   __cardName,
            ["designation"]     :   __cardDesignation
        })
    }, [__cardName, __cardDesignation])

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
        __designationPropertyMap["value"]    =   form.getFieldValue("designation")
        if(module === MODULE_TEMPLATE){
            RoomTemplateAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomsAgent.updateComponentByPropertyNoRefetch({
                variables: {
                    componentUuid   :   componentUuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "designation",
                    propertyContent :   __designationPropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    };

    const handleAddTeamCardClick = (index: any) => {

        WidgetsAgent.addComponent({
            variables: {
                widgetUuid: widget.uuid,
                order: index + 2
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

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

    const handleDeleteClick = () => {
        onDeleteCard({
            visibility  :   true,
            component   :   component,
        })
    }

    return (
        <>
            <div 
                key         =   {component.uuid} 
                style       =   {{ width: "230px" }} 
                className   =   "cm-position-relative"
            >
                <Space direction="vertical">
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
                    <Form form={form} >
                        <Form.Item name={"title"} noStyle={true} initialValue={__cardName}>
                            <Input className="cm-padding-inline0 cm-font-size18 cm-font-fam600" variant="borderless" placeholder="Name" onChange={handleCardNameChange} disabled={__isTeamUser}/>
                        </Form.Item>
                        {
                            __designationPropertyMap.enabled ?
                                <Form.Item name={"designation"} noStyle={true} initialValue={__cardDesignation}>
                                    <Input className="cm-padding-inline0 cm-font-size16" variant="borderless" placeholder="Enter some text" onChange={handleCardDesignationChange} disabled={__isTeamUser}/>
                                </Form.Item>
                            :
                                null
                        }
                    </Form>

                    <Space className="cm-margin-top10">
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
                {
                    widget.components.length > 1 &&
                        <div className="cm-position-absolute show-on-hover-icon cm-border-radius4 cm-border-light" style={{top: "0px", right: "12px"}}>
                            <Tooltip title="Delete user" mouseEnterDelay={1}>
                                <div className="cm-cursor-pointer cm-flex-center cm-padding5" style={{width: "35px"}} onClick={() => handleDeleteClick()}>
                                    <MaterialSymbolsRounded font="delete" size="18" color="#DF2222" className="cm-cursor-pointer"/>
                                </div>
                            </Tooltip>
                        </div>
                }
                <div className="cm-position-absolute show-on-hover-icon" style={{right: "12px", top: "135px"}}>
                    <Tooltip title="Add" mouseEnterDelay={1}>
                        <div className="cm-cursor-pointer cm-flex-center j-section-add-widget-icon">
                            <MaterialSymbolsRounded font="add" className="cm-flex-center" size="22" onClick={() => handleAddTeamCardClick(index)}/>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default TeamCardComponent