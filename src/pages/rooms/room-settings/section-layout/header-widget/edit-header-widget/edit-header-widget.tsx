
import { useLazyQuery } from '@apollo/client';
import { Space } from 'antd';

import { REQUEST_BLOB_URLS } from '../../../../../library/api/library-query';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';
import EditHeaderComponent from "./edit-header-component";

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice";

const EditHeaderWidget = (props: { editWidgetProps: any, onClose: any, sectionId: string, widget: any, module: any }) => {

    const { onClose, widget, module }   =   props;

    const [_getBlobUrls]    =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    return(
        <div className='cm-height100'>
            <div className='j-add-res-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Header Widget
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-edit-widget-text-drawer-body cm-padding15'>
                <Space direction="vertical" className="cm-width100 cm-padding-bottom20">
                    {
                        widget.components.map((_component: any) => (
                            <EditHeaderComponent widget={widget} component={_component} module={module}/>
                        ))
                    }
                </Space>
            </div>
        </div>
    )
}

export default EditHeaderWidget