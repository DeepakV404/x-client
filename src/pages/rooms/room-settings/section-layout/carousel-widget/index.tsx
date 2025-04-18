import { useContext, useEffect, useRef, useState } from "react";
import { Carousel, Form, Typography } from "antd";
import { useApolloClient } from "@apollo/client";
import { debounce } from 'lodash'

import { CAROUSEL_EMPTY, CAROUSEL_FALLBACK_IMAGE1, CAROUSEL_FALLBACK_IMAGE2, MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { FEATURE_ROOMS, FEATURE_TEMPLATES } from "../../../../../config/role-permission-config";
import { WidgetsAgent } from "../../../../custom-sections/api/widgets-agent";
import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { R_SECTION } from "../../../api/rooms-query";

import EditCarouselWidgetSlider from "./edit-carousel-widget/edit-carousel-widget-slider";
import SectionResourceViewer from "../resource-widget/section-resource-viewer";
import WidgetToolbar from "../widget-toolbar";
import WidgetTitle from "../widget-title";

const { Text }      =   Typography
const { useForm }   =   Form;

const CarouselWidget = (props: {widget: any, sectionId: string, module: any, showComments? :any}) => {

    const { widget, sectionId, module, showComments }   =   props;

    const $client       =   useApolloClient();
    const [form]        =   useForm();
    const carouselRef   =   useRef<any>(null);
    const { $user }     =   useContext(GlobalContext);
    
    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editWidgetProps, setEditWidgetProps]                 =   useState({
        visibility  :   false,
    });

    const [widgetTitle, setWidgetTitle]                     =   useState(widget.title.value);

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

    return (
        <>
            <div className={`j-room-section-resource cm-padding15 cm-width100 cm-margin-bottom15 j-section-card j-section-widget-border ${widget.isHidden ? "j-section-widget-hidden" : ""}`}>
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
                <div className="cm-margin-top20">
                    {
                        widget.components.length > 0 
                        ?
                            <Carousel ref={carouselRef} draggable arrows className="j-section-carousel-root cm-border-radius8 cm-flex-center" infinite={false} style={{marginInline: "50px"}}>
                                {
                                    widget.components.map((_component: any, index: number) => {
                                        if(_component.content.resource.value){
                                            return (
                                                <div style={{backgroundColor: "#F5F7F9", borderRadius: "6px"}} className="cm-aspect-ratio16-9 cm-flex-align-center cm-cursor-pointer">
                                                    <SectionResourceViewer resource={_component.content.resource.value}/>
                                                </div>
                                            )
                                        } else{
                                            const FALLBACK_IMAGE = (index === 0) ? CAROUSEL_FALLBACK_IMAGE1 : CAROUSEL_FALLBACK_IMAGE2 ;
                                            return (
                                                <div>
                                                    <img src={FALLBACK_IMAGE} style={{borderRadius: "12px", width: "100%"}}/>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </Carousel>
                        :
                            <div className="cm-flex-center" style={{height: "250px"}}>
                                <img src={CAROUSEL_EMPTY} style={{borderRadius: "12px", width: "200px", height: "200px"}}/>
                            </div>
                    }
                    <div className="cm-width100 cm-flex-space-between cm-margin-top20">
                        {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08">| Carousel</Text> */}
                        <div></div>
                        {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                    </div>
                </div>
            </div>
            <EditCarouselWidgetSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId}
                widget              =   {widget}
                module              =   {module}
            />
        </>
    )
}

export default CarouselWidget