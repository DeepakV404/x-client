import { debounce } from "lodash";
import { Collapse, Space, Switch } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";

import { WidgetsAgent } from "../../../../../custom-sections/api/widgets-agent";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded";
import EditButtonComponent from "./edit-button-component";
import WidgetTitle from "../../widget-title";

const EditButtonWidget = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

    const { widget, sectionId, onClose, module }   =   props;

    const __widget          =   { ...widget }
    const __titleProperty   =   { ...__widget.title }

    const handleTitleEnable = (state: any, event: any) => {
        event.stopPropagation();

        __titleProperty["enabled"] = state;

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
    }

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

    return(
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Button Widget
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={onClose}/>
                </Space>
            </div>


            <div className='j-edit-widget-text-drawer-body cm-padding15'>
                <Space direction="vertical" className="cm-width100 cm-padding-bottom20">
                    <Collapse
                        expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                    >
                        <CollapsePanel header={<div className="cm-width100 cm-flex-space-between cm-flex-align-center">Title<Switch size='small' defaultValue={__titleProperty.enabled} onChange={handleTitleEnable}/></div>} key={__widget.uuid}>
                            <WidgetTitle value={__titleProperty.value} onChange={handleTitleChangeDebounce} placeholder="Title" bordered/>
                        </CollapsePanel>
                    </Collapse>
                    {
                        widget.components.map((_component: any) => (
                            <EditButtonComponent component={_component} widget={__widget} module={module}/>
                        ))
                    }
                </Space>
            </div>

        </div>
    )
}

export default EditButtonWidget