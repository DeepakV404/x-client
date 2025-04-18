import { FC, useRef } from 'react';
import { Modal } from 'antd';

import VideoPlayer from '.';

interface VideoPlayerModalProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    videoUrl        :   string;
    videoPlayerRef? :   any;
    resourceId?     :   string;
    track?          :   boolean;   
}

const VideoPlayerModal: FC<VideoPlayerModalProps> = (props) => {

    const { isOpen, onClose, track }   =   props;

    const videoResourceRef: any =   useRef();
    
    const handleClose = () => {
        if(track){       
            videoResourceRef?.current?.closeVideoPlayer()
        }
        onClose()
    }

    return (
        <Modal 
            centered
            className       =   {"j-video-player-modal"}
            open            =   {isOpen} 
            onCancel        =   {handleClose} 
            footer          =   {null}
            destroyOnClose  =   {true}
            closable        =   {false}
            width           =   {1000}
        >
            {
                isOpen &&
                    <VideoPlayer {...props} videoResourceRef={videoResourceRef}/>
            }
        </Modal>
    )
}

export default VideoPlayerModal