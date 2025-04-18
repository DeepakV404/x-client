import { useContext, useState } from "react";
import { Typography} from "antd";
import { useApolloClient } from "@apollo/client";

import { RT_SECTION } from "../../../../templates/api/room-templates-query";
import { PermissionCheckers } from "../../../../../config/role-permission";
import { FEATURE_TEMPLATES, FEATURE_ROOMS } from "../../../../../config/role-permission-config";
import { MODULE_TEMPLATE } from "../../../../../constants/module-constants";
import { GlobalContext } from "../../../../../globals";
import { R_SECTION } from "../../../api/rooms-query";

import WidgetToolbar from "../widget-toolbar";
import HeaderComponent from "./header-component";
import EditHeaderWidgetSlider from "./edit-header-widget/edit-header-widget-slider";

const { Text }          =   Typography;

const HeaderWidget = (props: {widget: any, sectionId: string, template?: boolean, module: any}) => {

    const { widget, sectionId, module }     =   props;

    const $client       =   useApolloClient();

    const { $user }                 =   useContext(GlobalContext);

    const SectionEditPermission     =   module === MODULE_TEMPLATE ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [editWidgetProps, setEditWidgetProps]     =   useState({
        visibility  :   false,
    });

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
                    />
                }
                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "45px", marginTop: "20px"}}>
                    {widget.components.map((_component: any, index: number) => {
                        return (
                            <div key={index} className="cm-width100 ">
                                <HeaderComponent
                                    widget      =   {widget} 
                                    component   =   {_component} 
                                />
                            </div>
                        )
                    })}
                    <div className="cm-width100 cm-flex-space-between">
                        {/* <Text className="cm-light-text cm-font-size10 cm-letter-spacing08">| Header</Text> */}
                        <div></div>
                        {widget.isHidden && <Text className="cm-float-right cm-secondary-text cm-font-size12" style={{fontStyle: "italic"}}>This section will not be visible to the buyer.</Text>}
                    </div>
                </div>
            </div>
            <EditHeaderWidgetSlider
                editWidgetProps     =   {editWidgetProps}
                onClose             =   {() => {setEditWidgetProps({visibility: false}); $client.refetchQueries({include: [R_SECTION, RT_SECTION]})}}
                sectionId           =   {sectionId}
                widget              =   {widget}
                module              =   {module}
            />
        </>
    )
}

export default HeaderWidget