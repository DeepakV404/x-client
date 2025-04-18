import { Collapse, Space, Switch } from "antd";
import { debounce } from "lodash";

import { WidgetsAgent } from "../../../../../custom-sections/api/widgets-agent";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded"
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import EditTextComponent from "./edit-text-component";
import WidgetTitle from "../../widget-title";

const EditTextWidget = (props: { widget: any, onClose: any, sectionId: string, module: any }) => {

    const { widget, onClose, sectionId, module }   =   props;

    const __widget          =   { ...widget }
    const __titleProperty   =   { ...__widget.title }

    const handleTitleChangeDebounce = (debounce((title: any) => {
        handleTitleChange(title);
    }, 1000));

    const handleTitleChange = (title: string) => {

        __titleProperty["value"] = title;

        WidgetsAgent.updateWidgetNoRefetch({
            variables: {
                sectionUuid : sectionId,
                widgetUuid  : __widget.uuid,
                input: {
                    title: __titleProperty,
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    };

    const handleTitleEnable = (enabled: boolean, event: any) => {
        event.stopPropagation()
        __titleProperty["enabled"] = enabled;
        WidgetsAgent.updateWidgetNoRefetch({
            variables: {
                sectionUuid: sectionId,
                widgetUuid: __widget.uuid,
                input: {
                    title : __titleProperty
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    return(
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Text Widget
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-edit-widget-text-drawer-body cm-padding15'>
                <Space direction="vertical" className="cm-width100">
                    <Collapse
                        expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                    >
                        <CollapsePanel 
                            key     =   {__widget.uuid}
                            header  =   {
                                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                    Title
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__titleProperty.enabled} 
                                        onChange        =   {handleTitleEnable}
                                    />
                                </div>
                            } 
                        >
                            <WidgetTitle value={__titleProperty.value} onChange={handleTitleChangeDebounce} placeholder="Title" bordered/>
                        </CollapsePanel>
                    </Collapse>

                    {
                        widget.components.map((_component: any) => (
                            <EditTextComponent widget={widget} component={_component} module={module}/>
                        ))
                    }
                </Space>
            </div>
        </div>
    )
}

export default EditTextWidget