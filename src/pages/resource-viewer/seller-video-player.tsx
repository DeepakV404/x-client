import { useImperativeHandle, useRef } from "react";
import ReactPlayer from "react-player";

const SellerVideoPlayer = (props: {resource: any, videoResourceRef: any}) => {

    const { resource, videoResourceRef }  =   props;

    const playerRef = useRef<any>(null);

    let videoUrl = resource.content.url;

    const handleClose = () => {}

    useImperativeHandle(videoResourceRef, () => ({
        closeVideoPlayer: () => handleClose()
    }))

    return (
        <div className="cm-width100">
            <ReactPlayer 
                className   =   "cm-aspect-ratio16-9"
                ref         =   {playerRef}
                width       =   "100%"
                height      =   "100%"
                controls    =   {true}
                url         =   {videoUrl}
                loop        =   {false}
                config={{
                    youtube: {
                        playerVars: { autoplay: 0 }
                    },
                }}
            />
        </div>
    )
}

export default SellerVideoPlayer