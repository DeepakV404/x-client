import { FC, useImperativeHandle, useRef } from 'react';

import { OFFICE_FILES, RESOURCE_TYPE_PDF } from '../../constants/module-constants';
import { CommonUtil } from '../../utils/common-util';
import { DOCS, IMAGE, LINK, VIDEO } from '../library/config/resource-type-config';

import FileViewer from '../../components/file-viewer';
import MaterialSymbolsRounded from '../../components/MaterialSymbolsRounded';
import SellerImageViewer from './buyer-image-viewer';
import SellerOfficeFilesViewer from './buyer-office-files-viewer';
import SellerVideoPlayer from './seller-video-player';

interface ResourceViewLayoutProps
{
    fileInfo            :   any;
    track?              :   boolean;
    resourceViewRef?    :   any;
    onClose?            :   () => void;
}

const SellerResourceViewLayout: FC <ResourceViewLayoutProps> = (props) => {

    const { fileInfo, onClose, resourceViewRef }   =   props;

    const fileViewerRef: any        =   useRef();
    const videoPlayerRef: any       =   useRef();
    const imageViewerRef: any       =   useRef();
    const officeFileViewRef: any    =   useRef();

    useImperativeHandle(resourceViewRef, () => ({
        closeViewer :   () =>   closeViewer(),
    }))

    const closeViewer = () => {
        onClose && onClose()
    }

    const parseLink = (link: string) => {
 
        let contentUrl = link;
 
        if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
            contentUrl = 'https://' + contentUrl;   
        }
 
        const urlObj = new URL(contentUrl);
 
        if (urlObj.origin === "https://docs.google.com") {
            urlObj.pathname = urlObj.pathname.replace(/\/edit$/, "/embed");
        }
 
        return urlObj.toString();

    };

    const getViewerComponent = (resource: any) => {

        let contentType =   resource.content.type;
        let contentUrl  =   resource.content.url;

        switch(resource.type) {
            case DOCS:
                if(contentType === RESOURCE_TYPE_PDF){
                    return (
                        <FileViewer fileUrl={fileInfo.content.url} fileViewerRef={fileViewerRef} fileId={fileInfo.uuid} track={false}/>
                    )
                }
                else if(OFFICE_FILES.includes(contentType)){
                    return <SellerOfficeFilesViewer resource={resource} officeFileViewRef={officeFileViewRef}/>
                }else {
                    return null
                }
        
            case LINK:
                if(CommonUtil.__checkVideoDomain(contentUrl)){
                    return <SellerVideoPlayer resource={resource} videoResourceRef={videoPlayerRef}/>
                }else{
                    return <iframe width="100%" height="100%" src={parseLink(contentUrl)} style={{borderRadius: "8px", minHeight: "500px"}} frameBorder={0}></iframe>
                }
            
            case VIDEO:
                return <SellerVideoPlayer resource={resource} videoResourceRef={videoPlayerRef}/>
            
            case IMAGE:
                return <SellerImageViewer resource={resource} imageViewerRef={imageViewerRef}/>

            default:
                return <iframe width="100%" height="100%" src={contentUrl} style={{borderRadius: "8px", minHeight: "500px"}} frameBorder={0}></iframe>
        }
    }
    
    return (
        <>
            {
                onClose &&
                    <div className='j-viewer-modal-close cm-cursor-pointer' onClick={closeViewer}>
                        <MaterialSymbolsRounded font='close' size='20' />
                    </div>
            }
            <div className='cm-height100 cm-flex-center'>
                {getViewerComponent(fileInfo)}
            </div>
        </>
    )
}

export default SellerResourceViewLayout