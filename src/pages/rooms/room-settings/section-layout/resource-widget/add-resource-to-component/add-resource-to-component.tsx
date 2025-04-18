import { useRef } from "react";
import { Space } from "antd"
import { useLazyQuery } from "@apollo/client";

import { REQUEST_BLOB_URLS } from "../../../../../library/api/library-query";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded"
import SectionResourceUpload from "../section-resource-upload";

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice";

const AddResourceToComponent = (props: {isDrawerOpen: boolean, widget: any, setIsDrawerOpen: any, carousel?: boolean, template?: boolean, component: any}) => {

    const { widget, setIsDrawerOpen, carousel, component }       =   props;

    const resourceRef: any                  =   useRef();

    const [_getBlobUrls]        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});

    return(
        <div className='cm-height100'>
            <div className='j-demo-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Add/Edit Resource
                    <MaterialSymbolsRounded font='close' size='22' className='cm-cursor-pointer' onClick={() => {setIsDrawerOpen(false)}}/>
                </Space>
            </div>
            <div className='j-demo-form-body'>
                <div className="cm-padding15">
                    <SectionResourceUpload component={component} demoRef={resourceRef} resource={component.content.resource} widget={widget} carousel={carousel} setIsDrawerOpen={setIsDrawerOpen}/>
                </div>
            </div>
        </div>
    )
}

export default AddResourceToComponent