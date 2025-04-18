import { useContext, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { Form, Typography } from "antd";
import { debounce } from "lodash";

import { WidgetsAgent } from "../../../../custom-sections/api/widgets-agent";
import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { R_SECTION } from "../../../api/rooms-query";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { FEATURE_TEMPLATES, FEATURE_ROOMS } from "../../../../../config/role-permission-config";
import { MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";

import EditTextWidgetSlider from "./edit-text-widget/edit-text-widget-slider";
import WidgetToolbar from "../widget-toolbar";
import WidgetTitle from "../widget-title";
import TextComponent from "./text-component";

const { Text }      =       Typography;
const { useForm }   =       Form;

const TextWidget = (props: {widget: any, sectionId: string, module: any, showComments?: any}) => {

    const { widget, sectionId, module, showComments }   =   props;

    const [form]                  =   useForm();

    const $client                 =   useApolloClient();

    const { $user }                 =   useContext(GlobalContext);
    
    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editWidgetProps, setEditWidgetProps]                 =   useState({
        visibility  :   false
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
    }, 500));

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

    const handleOnEditClick = () => {
        $client.refetchQueries({include: [R_SECTION, RT_SECTION]})
        setEditWidgetProps({
            visibility  :   true
        })
    }

    return(
        <>
            <div className={`cm-padding15 cm-position-relative cm-margin-bottom15 j-section-card j-section-widget-border ${widget.isHidden ? "j-section-widget-hidden" : ""}`}>
                {/* Right Toolbar */}
                { SectionEditPermission &&
                    <WidgetToolbar
                        sectionId       =   {sectionId} 
                        widget          =   {widget}
                        onEdit          =   {handleOnEditClick}
                        module          =   {module}
                        showComments    =   {showComments}
                    />
                }
                {/* Right Toolbar */}

                {/* Title RTE */}
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
                {/* Title RTE */}

                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px", marginTop: "20px"}}>
                    {widget.components.map((_component: any, index: number) => {
                        return (
                            <div key={index} className="cm-position-relative cm-width100 hover-item">
                                <TextComponent
                                    widget                  =   {widget} 
                                    component               =   {_component} 
                                    module                  =   {module}
                                />
                            </div>
                        )
                    })}
                    <div className="cm-width100 cm-flex-space-between">
                        {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08">| Text </Text> */}
                        <div></div>
                        {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                    </div>
                </div>
            </div>
            <EditTextWidgetSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId} 
                widget              =   {widget}
                module              =   {module}
            />
        </>
    )
}

export default TextWidget