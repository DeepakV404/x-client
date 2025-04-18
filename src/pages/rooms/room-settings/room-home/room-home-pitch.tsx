import { useRef } from 'react';
import { Button, Space } from 'antd';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import SellerResourceViewLayout from '../../../resource-viewer';

const RoomHomePitch = (props: {pitchVideo: any, setEditWC: any}) => {
    
    const { pitchVideo, setEditWC } =   props;

    const viewerRef: any = useRef();

    const getPitchVideo = (pitchVideo: any) => {
        return (
            <div className='cm-position-relative cm-width100'>
                {
                    pitchVideo?.content ?
                        <Space direction="vertical" className="cm-width100 j-welcome-preview-viewer">
                            <Space className="cm-flex-space-between cm-margin-bottom5" size={10}>
                                <Space>
                                    <MaterialSymbolsRounded font="slideshow" size="22"/>
                                    <div className="cm-font-size16">Pitch</div>
                                </Space>
                                <Button type="primary" ghost onClick={() => setEditWC(true)}>Edit</Button>
                            </Space>
                            <div className="j-room-pitch-view">
                                <SellerResourceViewLayout
                                    resourceViewRef =   {viewerRef} 
                                    fileInfo        =   {pitchVideo}
                                    track           =   {false}
                                />
                            </div>
                        </Space>
                    :
                        null
                }
            </div>
        )
    }

    return (getPitchVideo(pitchVideo))
}

export default RoomHomePitch