import { useImperativeHandle } from 'react';


const SellerImageViewer = (props: {imageViewerRef: any, resource: any}) => {

    const { imageViewerRef, resource }   =   props;

    useImperativeHandle(imageViewerRef, () => ({
        closeImageViewer: () => {}
    }))

    return (
        <div className="cm-height100 cm-width100 cm-flex-center">
            <img src={resource.content.url} alt={resource.title} className={"j-deck-resource-viewer-image"}/>
        </div>
    )
}

export default SellerImageViewer