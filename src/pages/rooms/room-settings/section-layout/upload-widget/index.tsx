import { Form, Space, Typography } from "antd"
import WidgetTitle from "../widget-title"
import { debounce } from "lodash";
import { useContext, useEffect, useState } from "react";
import { MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { FEATURE_ROOMS, FEATURE_TEMPLATES } from "../../../../../config/role-permission-config";
import { GlobalContext } from "../../../../../globals";
import WidgetToolbar from "../widget-toolbar";
import { R_SECTION } from "../../../api/rooms-query";
import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { useApolloClient } from "@apollo/client";
import { useForm } from "antd/es/form/Form";
import EditFileUploadWidgetSlider from "./edit-section-slider";
import { WidgetsAgent } from "../../../../custom-sections/api/widgets-agent";
import FileUpload from "./file-upload-widget";

const { Text }  =   Typography

const FileUploadWidget = (props: {widget: any, sectionId: string, module: any, showComments?: any}) => {

    const { widget, sectionId, module, showComments }   =   props;

    const { $user }     =   useContext(GlobalContext);

    const $client       =   useApolloClient();

    const [ form ]      =    useForm();
    
    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editWidgetProps, setEditWidgetProps]    =   useState({
        visibility  :   false,
    });
    const [widgetTitle, setWidgetTitle]             =   useState(widget.title.value)

    useEffect(() => {
        form.setFieldsValue({
            ["title"]   :   widget.title.value
        })
        setWidgetTitle(widget.title.value)        
    }, [widget.title])

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

    return (
        <>
            <div className={`cm-padding25 cm-position-relative cm-margin-bottom15 j-section-card j-section-widget-border ${widget.isHidden ? "j-section-widget-hidden" : ""}`}>
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
                <Space direction="vertical" className={`cm-width100 ${!widget.title.enabled && "cm-margin-top20"} cm-margin-bottom10`} size={10}>
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
                </Space>
                <FileUpload module={module} widget={widget}/>
                <div className="cm-width100 cm-flex-space-between cm-margin-top15">
                    {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08 cm-flex-align-center">| Upload</Text> */}
                    <div></div>
                    {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                </div>
            </div>
            <EditFileUploadWidgetSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId}
                widget              =   {widget}
                module              =   {module}
            />
        </>
    )
}

export default FileUploadWidget