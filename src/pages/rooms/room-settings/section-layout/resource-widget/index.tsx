import { useContext, useEffect, useState } from "react";
import { Form, Typography} from "antd";
import { debounce } from "lodash";
import { useApolloClient } from "@apollo/client";

import { WidgetsAgent } from "../../../../custom-sections/api/widgets-agent";
import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { FEATURE_TEMPLATES, FEATURE_ROOMS } from "../../../../../config/role-permission-config";
import { MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";
import { R_SECTION } from "../../../api/rooms-query";

import EditResourceWidgetSlider from "./edit-resource-widget/edit-resource-widget-slider";
import ResourceComponent from "./resource-component";
import WidgetToolbar from "../widget-toolbar";
import WidgetTitle from "../widget-title";

const { Text }          =   Typography;
const { useForm }       =   Form;

const ResourceWidget = (props: {widget: any, sectionId: string, template?: boolean, module: any, showComments?: any}) => {

    const { widget, sectionId, module, showComments }     =   props;

    const $client       =   useApolloClient();

    const [widgetTitle, setWidgetTitle]             =   useState(widget.title.value)

    const { $user }                 =   useContext(GlobalContext);
    
    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editWidgetProps, setEditWidgetProps]     =   useState({
        visibility  :   false,
    });

    const [form]                =   useForm();

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

    const handleOnEditClick = () => {
        $client.refetchQueries({include: [R_SECTION, RT_SECTION]})
        setEditWidgetProps({
            visibility  :   true
        })
    }

    return(
        <>
            <div className={`cm-padding15 j-section-card cm-margin-bottom15 j-section-card j-section-widget-border ${widget.isHidden ? "j-section-widget-hidden" : ""}`}>
                { SectionEditPermission &&
                    <WidgetToolbar 
                        sectionId       =   {sectionId} 
                        widget          =   {widget}
                        onEdit          =   {handleOnEditClick}
                        module          =   {module}
                        showComments    =   {showComments}
                    />
                }
                {/* Title RTE */}
                {
                    widget.title.enabled ?
                        <Form form={form} className="cm-width100 cm-flex-center cm-height100 cm-margin-top10">
                            <Form.Item noStyle={true} name={"title"} initialValue={widgetTitle}>
                                <WidgetTitle onChange={() => handleTitleChangeDebounce()} placeholder="Click here to add title"/>
                            </Form.Item>
                        </Form>
                    :
                        null
                }
                {/* Title RTE */}
                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "45px", marginTop: "20px"}}>
                    {widget.components.map((_component: any, index: number) => {
                        return (
                            <div key={index} className="cm-position-relative hover-item" style={{paddingBlock: "10px"}}>
                                <ResourceComponent
                                    widget      =   {widget} 
                                    component   =   {_component} 
                                />
                            </div>
                        )
                    })}
                    <div className="cm-width100 cm-flex-space-between">
                        {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08">| Resource</Text> */}
                        <div></div>
                        {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                    </div>
                </div>
            </div>
            <EditResourceWidgetSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId}
                widget              =   {widget}
            />
        </>
    )
}

export default ResourceWidget