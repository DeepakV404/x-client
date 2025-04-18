import { debounce } from "lodash";
import { useLazyQuery } from '@apollo/client';
import { Collapse, Space, Switch } from 'antd';

import { REQUEST_BLOB_URLS } from '../../../../../library/api/library-query';
import { WidgetsAgent } from "../../../../../custom-sections/api/widgets-agent";

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';
import EditResourceComponent from "./edit-resource-component";
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import WidgetTitle from "../../widget-title";

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice";

const EditResourceWidget = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any }) => {

    const { onClose, sectionId, widget }   =   props;

    const __widget          =   { ...widget }
    const __titleProperty   =   { ...__widget.title }

    const [_getBlobUrls]        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});


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
                    Edit Resource Widget
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
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
                            <EditResourceComponent component={_component} widget={__widget}/>
                        ))
                    }
                </Space>
            </div>
        </div>
    )
}

export default EditResourceWidget