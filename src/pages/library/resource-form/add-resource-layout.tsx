import { FC, useState } from 'react';

import { ADD_RESOURCE_CONFIG, UPLOAD_BLOB, UPLOAD_LINK } from '../config/add-resource-config';

import AddResourceOptions from './add-resource-options';
import BlobResourceForm from './blob-resource-form';
import LinkResourceForm from './link-resource-form';

interface AddResourceLayoutProps
{
    onClose     :   () => void;
    type?       :   string;
    uploadKey?  :   string;
    displayName :   string;
    domain      :   any, 
    imageIcon   :   any,
    goBack?     :   any,
    resKey?     :   string,
}

const AddResourceLayout: FC <AddResourceLayoutProps> = (props) => {

    const { type, displayName, domain, imageIcon, resKey }  =   props;

    const [view, setView]   =   useState(type);

    if(view === "upload_options"){
        return (
            <AddResourceOptions
                setView =   {setView}
            />
        )
    }else if(view === UPLOAD_BLOB){
        return (
            <BlobResourceForm
                {...props}
                setView =   {setView}
            />
        )
    }else if(view === UPLOAD_LINK){
        return (
            <LinkResourceForm
                {...props}
                urlType         =   'link'
                setView         =   {setView}
                displayName     =   {displayName}
                domain          =   {domain}
                imageIcon       =   {imageIcon}
                resKey          =   {resKey}
            />
        )
    }else{
        return (
            <LinkResourceForm
                {...props}
                urlType =   {view && ADD_RESOURCE_CONFIG[view].type}
                setView =   {setView}
            />
        )
    }
}

export default AddResourceLayout