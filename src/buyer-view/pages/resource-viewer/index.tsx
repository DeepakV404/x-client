import { FC, useImperativeHandle, useRef } from 'react';

import { OFFICE_FILES, RESOURCE_TYPE_PDF } from '../../../constants/module-constants';
import { DOCS, IMAGE, LINK, VIDEO } from '../../../pages/library/config/resource-type-config';
import { CommonUtil } from '../../../utils/common-util';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import BuyerFileViewer from './buyer-file-viewer';
import BuyerImageViewer from './buyer-image-viewer';
import BuyerOfficeFilesViewer from './buyer-office-files-viewer';
import BuyerVideoPlayer from './buyer-video-player';

interface ResourceViewLayoutProps
{
    fileInfo            :   any;
    track?              :   boolean;
    resourceViewRef?    :   any;
    onClose?            :   () => void;
    shouldAutoPlay?     :   any;
}

const BuyerResourceViewLayout: FC <ResourceViewLayoutProps> = (props) => {

    const { fileInfo, onClose, track=true, resourceViewRef, shouldAutoPlay }   =   props;

    const fileViewerRef: any        =   useRef();
    const videoPlayerRef: any       =   useRef();
    const imageViewerRef: any       =   useRef();
    const officeFileViewRef: any    =   useRef();

    useImperativeHandle(resourceViewRef, () => ({
        closeViewer :   () =>   closeViewer(),
    }))

    const closeViewer = () => {
        if(track){
            if(fileInfo.type === VIDEO || fileInfo.type === LINK){
                videoPlayerRef?.current?.closeVideoPlayer()
            }else{
                if(fileViewerRef.current){
                    fileViewerRef.current.closeFileViewer()
                }else if(imageViewerRef.current){
                    imageViewerRef.current.closeImageViewer()
                }else if(officeFileViewRef.current){
                    officeFileViewRef.current.closeOfficeFilesViewer()
                }
            }
        }
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;
        if (searchParams.has('resourceid')) {
            currentUrl.searchParams.delete('resourceid');
            currentUrl.searchParams.delete('sectionid');
            window.history.replaceState(null, '', currentUrl.toString());
        }
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
        
        if(!resource) {
            return null
        }

        let contentType =   resource?.content.type;
        let contentUrl  =   resource?.content.url;

        switch(resource.type) {
            case DOCS:
                if(contentType === RESOURCE_TYPE_PDF){
                    return (
                        <BuyerFileViewer fileUrl={fileInfo.content.url} fileViewerRef={fileViewerRef} fileId={fileInfo.uuid} track={track}/>
                    )
                }
                else if(OFFICE_FILES.includes(contentType)){
                    return <BuyerOfficeFilesViewer resource={resource} track={track} officeFileViewRef={officeFileViewRef}/>
                }else {
                    return null
                }
            case LINK:
                if(CommonUtil.__checkVideoDomain(contentUrl)){
                    return <BuyerVideoPlayer resource={resource} videoResourceRef={videoPlayerRef} track={track} shouldAutoPlay={shouldAutoPlay}/>
                }else{
                    return <iframe width="100%" height="100%" src={parseLink(contentUrl)} style={{borderRadius: "8px", minHeight: "500px"}} frameBorder={0}></iframe>
                }
            
            case VIDEO:
                return <BuyerVideoPlayer resource={resource} videoResourceRef={videoPlayerRef} track={track} shouldAutoPlay={shouldAutoPlay}/>
            
            case IMAGE:
                return <BuyerImageViewer resource={resource} track={track} imageViewerRef={imageViewerRef}/>

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
            <div className='cm-height100 cm-flex-center cm-width100'>
                {getViewerComponent(fileInfo)}
            </div>
        </>
    )
}

export default BuyerResourceViewLayout