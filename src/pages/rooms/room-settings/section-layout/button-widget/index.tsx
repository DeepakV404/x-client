import { useContext, useEffect, useState } from "react";
import { Button, Form, Space, Typography } from "antd";
import { useApolloClient } from "@apollo/client";
import { debounce } from "lodash";

import { R_SECTION } from "../../../api/rooms-query";
import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { GlobalContext } from "../../../../../globals";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { FEATURE_ROOMS, FEATURE_TEMPLATES } from "../../../../../config/role-permission-config";
import { WidgetsAgent } from "../../../../custom-sections/api/widgets-agent";

import ButtonConfigurationModal from "./widget-button-configurations/button-configuration-modal";
import EditSectionSlider from "./edit-button-widget/edit-button-widget-slider";
import WidgetToolbar from "../widget-toolbar";
import WidgetTitle from "../widget-title";

const { Text }      =   Typography;
const { useForm }   =   Form;

const ButtonWidget = (props: {widget: any, sectionId: string, module: any, showComments?: any}) => {

    const { widget, sectionId, module, showComments }   =   props;

    const [ form ]      =    useForm();

    const $client       =   useApolloClient();

    const { $user }                 =   useContext(GlobalContext);
    
    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editButtonProps, setEditButtonProps]                 =   useState({
        visibility  :   false,
        widget      :   null,
        component   :   null
    });

    const [editWidgetProps, setEditWidgetProps]                 =   useState({
        visibility  :   false,
    });

    const [widgetTitle, setWidgetTitle] =   useState(widget.title.value)

    useEffect(() => {
        form.setFieldsValue({
            ["title"]   :   widget.title.value
        })
        setWidgetTitle(widgetTitle)
    }, [widget.title.value])

    const handleTitleChangeDebounce = (debounce(() => {
        handleTitleChange();
    }, 1000));

    const handleTitleChange = () => {

        let titleInput = { ...widget.title };

        titleInput["value"] = form.getFieldValue("title");

        WidgetsAgent.updateWidgetNoRefetch({
            variables: {
                sectionUuid: sectionId,
                widgetUuid: widget.uuid,
                input: {
                    title: titleInput,
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    };

    const handleButtonClick = (component: any) => {
        setEditButtonProps({
            visibility  :   true,
            widget      :   widget,
            component   :   component,
        })
    }

    const handleOnEditClick = () => {
        $client.refetchQueries({include: [R_SECTION, RT_SECTION]})
        setEditWidgetProps({
            visibility  :   true
        })
    }

    return (
        <>
            <div className={`cm-padding15 cm-position-relative cm-margin-bottom15 j-section-card j-section-widget-border ${widget.isHidden ? "j-section-widget-hidden" : ""}`}>
                {/* Right Toolbar */}
                {
                    SectionEditPermission &&
                        <WidgetToolbar
                            sectionId       =   {sectionId} 
                            widget          =   {widget}
                            onEdit          =   {handleOnEditClick}
                            module          =   {module}
                            showComments    =   {showComments}
                        />
                }
                {/* Right Toolbar */}
                <Space direction="vertical" className="cm-width100 cm-margin-bottom10" size={10}>
                    {
                        widget.title.enabled ?
                            <Form form={form} className="cm-width100 cm-flex-center cm-height100 cm-margin-top10">
                                <Form.Item noStyle={true} name={"title"} initialValue={widgetTitle}>
                                    <WidgetTitle value={widgetTitle} onChange={() => handleTitleChangeDebounce()} placeholder="Click here to add title"/>
                                </Form.Item>
                            </Form>
                        :
                            null
                    }
                    {
                        widget.components.map((_component: any) => (
                            <div className="cm-flex-center">
                                <Button type="primary" onClick={() => handleButtonClick(_component)}>{_component.content.button.name || "Button Name"}</Button>
                            </div>
                        ))
                    }
                </Space>
                <div className="cm-width100 cm-flex-space-between">
                    {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08">| Button</Text> */}
                    <div></div>
                    {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                </div>
            </div>

            <ButtonConfigurationModal 
                editButtonProps     =   {editButtonProps}
                onClose             =   {() => setEditButtonProps({visibility: false, component: null, widget: null})}
                module              =   {module} 
            />
            <EditSectionSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId}
                widget              =   {widget}
                module              =   {module}
            />
        </>
    )
}

export default ButtonWidget