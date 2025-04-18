import { Collapse, Form, Space, Switch } from "antd";

import { CAROUSEL_FALLBACK_IMAGE1, COMPANY_FALLBACK_ICON } from "../../../../../../constants/module-constants";
import { RoomsAgent } from "../../../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";

const { useForm }   =   Form;

const EditHeaderComponent = (props: { component: any, widget: any, module: any }) => {

    const { component, widget, module }     =   props;

    const __coverImagePropertyMap       =   {...component?.content?.coverImage};
    const __primaryImagePropertyMap     =   {...component?.content?.primaryImage};
    const __secondaryImagePropertyMap   =   {...component?.content?.secondaryImage};
    const __titlePropertyMap            =   {...component?.content?.title};

    const [form ]   =   useForm();

    const handleCoverEnableDisable = (state: boolean) => {

        __coverImagePropertyMap["enabled"] = state;

        if(module === "MODULE_ROOM"){
            RoomsAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "coverImage",
                    propertyContent :   __coverImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "coverImage",
                    propertyContent :   __coverImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handlePrimaryEnableDisable = (state: boolean) => {

        __primaryImagePropertyMap["enabled"] = state;

        if(module === "MODULE_ROOM"){
            RoomsAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "primaryImage",
                    propertyContent :   __primaryImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "primaryImage",
                    propertyContent :   __primaryImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handleSecondaryEnableDisable = (state: boolean) => {

        __secondaryImagePropertyMap["enabled"] = state;

        if(module === "MODULE_ROOM"){
            RoomsAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "secondaryImage",
                    propertyContent :   __secondaryImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "secondaryImage",
                    propertyContent :   __secondaryImagePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }

    const handleTitleEnableDisable = (state: boolean) => {

        __titlePropertyMap["enabled"] = state;

        if(module === "MODULE_ROOM"){
            RoomsAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "title",
                    propertyContent :   __titlePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }else{
            RoomTemplateAgent.updateComponentByProperty({
                variables: {
                    componentUuid   :   component.uuid,
                    widgetUuid      :   widget.uuid,
                    propertyKey     :   "title",
                    propertyContent :   __titlePropertyMap
                },
                onCompletion: () => {},
                errorCallBack: () => {},
            });
        }
    }
    
    return(
        <Form form={form} className="cm-form cm-width100" layout='vertical'>
            <Space direction='vertical' className='cm-width100' size={10}>
                <Collapse
                    defaultActiveKey    =   {["coverImage"]}
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"coverImage"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Cover Image 
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__coverImagePropertyMap.enabled} 
                                        disabled        =   {__coverImagePropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {event.stopPropagation(); handleCoverEnableDisable(state)}}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <img src={__coverImagePropertyMap?.url ? __coverImagePropertyMap.url : CAROUSEL_FALLBACK_IMAGE1} className="cm-border-radius6" alt="Cover Image" height={"175px"} width={"100%"} style={{objectFit: "cover"}}/>
                    </CollapsePanel>
                </Collapse>
                {/* Primary Image */}
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"primaryImage"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Left Logo
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__primaryImagePropertyMap.enabled} 
                                        disabled        =   {__primaryImagePropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {event.stopPropagation(); handlePrimaryEnableDisable(state)}}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <div className="cm-flex-center cm-border-radius6" style={{ height: "150px", width: "150px" }} >
                            {__primaryImagePropertyMap?.url ? <img height={"100%"} width={"100%"} src={__primaryImagePropertyMap.url} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/> : COMPANY_FALLBACK_ICON}
                        </div>
                    </CollapsePanel>
                </Collapse>
                {/* Secondary Logo */}
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"secondaryImage"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Right Logo
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__secondaryImagePropertyMap.enabled} 
                                        disabled        =   {__secondaryImagePropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {event.stopPropagation(); handleSecondaryEnableDisable(state)}}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <div className="cm-flex-center cm-border-radius6" style={{ height: "150px", width: "150px" }} >
                            {__secondaryImagePropertyMap?.url ? <img height={"100%"} width={"100%"} src={__secondaryImagePropertyMap.url} className="cm-object-fit-cover cm-border-radius12" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/> : COMPANY_FALLBACK_ICON}
                        </div>
                    </CollapsePanel>
                </Collapse>
                <Collapse
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"title"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Title
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__titlePropertyMap.enabled} 
                                        disabled        =   {__titlePropertyMap.required} 
                                        onChange        =   {(state: boolean, event: any) => {event.stopPropagation(); handleTitleEnableDisable(state)}}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <div 
                            className   =   "cm-font-fam700 cm-font-size28 cm-border-white cm-padding3 cm-border-radius6 cm-outline-none"
                        >
                            {__titlePropertyMap.value}
                        </div>
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditHeaderComponent