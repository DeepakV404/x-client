import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';
import { useLazyQuery } from '@apollo/client';
import ReactPlayer from 'react-player';

// import { PermissionCheckers } from '../../../../config/role-permission';
// import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { LINK, VIDEO } from '../../../library/config/resource-type-config';
import { CommonUtil } from '../../../../utils/common-util';
// import { GlobalContext } from '../../../../globals';
import { R_USECASE } from '../../api/rooms-query';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import DemoEditSlider from '../demo-edit/demo-edit-slider';
import Loading from '../../../../utils/loading';
import { NO_PITCH_VIDEO, NO_USE_CASE } from '../../../../constants/module-constants';

const { Text } = Typography;

const DemoPreview = (props: {usecase: any}) => {

    const { usecase } =   props;

    const params: any   =   useParams();

    const [showEdit, setShowEdit]   =   useState(false);

    // const { $user }    =   useContext(GlobalContext);

    // const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [_getUsecase, { data, loading, error }]  =   useLazyQuery(R_USECASE, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if(usecase){
            _getUsecase({
                variables: {
                    usecaseUuid :   usecase.uuid
                }
            })
        }
    }, [usecase])

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

    if(loading) return <div className='cm-flex-center' style={{height: "500px"}}><Loading/></div>
    if(error) return <SomethingWentWrong/> 

    const getTourViewer = (tour: any) => {
        if(tour.type === VIDEO || (tour.type === LINK && CommonUtil.__checkVideoDomain(tour.content.url) )){
            return (
                <ReactPlayer 
                    className   =   "j-video-player" 
                    width       =   "100%"
                    height      =   "100%"
                    controls    =   {true}
                    url         =   {tour.content.url}
                    loop        =   {false}
                    config={{
                        youtube: {
                            playerVars: { autoplay: 0 }
                        },
                    }} 
                />
            )
        }else{
            return (
                <div className="j-buyer-demo-player cm-width100">
                    <iframe src={parseLink(tour.content.url)} loading="lazy" style={{width: "100%", height: "100%", colorScheme: "light", border: "0px"}} frameBorder={0} title={tour.title}></iframe>
                </div>
            )
        }
    }

    if(usecase){
        return (
            <>
                <Space direction='vertical' className='cm-width100 cm-height100'>
                    {/* <Space className='j-demo-preview-header cm-padding15 cm-width100 cm-flex-space-between'>
                        <Space direction='vertical' size={4}>
                            <Text style={{maxWidth: "750px"}} ellipsis={{tooltip: usecase.title}} className='cm-font-size16 cm-font-fam500'>{usecase?.title}</Text>
                            <div className='cm-secondary-text cm-font-size12'>{usecase.description ? usecase.description : "No description found"}</div>
                        </Space>
                        <Space>
                            {
                                usecase?.categories  && usecase?.categories.length > 0 &&
                                    <div className='j-demo-preview-category-wrapper'>
                                        <div className='cm-secondary-text cm-font-size12 j-demo-preview-category-label cm-flex-center'>Category</div>
                                        <Text style={{maxWidth: "250px"}} ellipsis={{tooltip: usecase.categories[0].name}} className='cm-font-size13 j-demo-preview-category-title'>{usecase?.categories && usecase.categories.length > 0 && usecase.categories[0].name}</Text>
                                   
                                    </div>
                            }
                            { RoomEditPermission && <Button type='primary' ghost onClick={() => setShowEdit(true)}>Edit</Button>}
                        </Space>
                    </Space> */}
                    <div className='cm-padding15 cm-width100 j-demo-preview-listing-wrapper'>
                        {
                            !(data?._rUsecase?.video) && !(data?._rUsecase?.walkthrough) && 
                                <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-overflow-auto" style={{height: "500px"}}>
                                    <img src={NO_PITCH_VIDEO} alt="No next steps found" className="cm-margin-bottom15" width={160}/>
                                    <div className="cm-font-size18 cm-font-fam500">No Demos Uploaded</div>
                                    <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                        Upload a demo video to show buyers your product in action
                                    </div>
                                    <Button className='cm-margin-top15' type='primary' ghost onClick={() => setShowEdit(true)}>Add content</Button>
                                </Space>
                        }
                        {
                            data?._rUsecase?.video ?
                                <Space direction="vertical" className="cm-width100 j-demo-preview-viewer">
                                    <Space className="cm-flex-align-center" size={15}>
                                        <div className="cm-font-size16">Video</div>
                                        <MaterialSymbolsRounded font="smart_display" size="18"  color="#DF2222"/>
                                    </Space>
                                    <div className="cm-flex-center j-buyer-demo-player cm-width100">
                                        {getTourViewer(data._rUsecase.video)}
                                    </div>
                                </Space>
                            :
                                null
                        }
                        {
                            data?._rUsecase?.walkthrough ?
                                <Space direction="vertical" className="cm-width100 j-demo-preview-viewer">
                                    <Space className="cm-flex-align-center" size={15}>
                                        <div className="cm-font-size16">Tour</div>
                                        <MaterialSymbolsRounded font="tour" size="18"  color="#3176CD" />
                                    </Space>
                                    <div className="cm-flex-center j-buyer-demo-player cm-width100">
                                        {getTourViewer(data._rUsecase.walkthrough)}
                                    </div>
                                </Space>
                            :
                                null
                        }
                    </div>
                </Space>
                {data?._rUsecase && <DemoEditSlider isOpen={showEdit} onClose={() => setShowEdit(false)} entityId={params.roomId} page='ROOM' usecase={data._rUsecase}/>}
            </>
        )
    }else{
        return (
            <div className='cm-flex-center' style={{height: "calc(100vh - 340px)", minHeight: "250px"}}>
                <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                    <img height={130} width={130} src={NO_USE_CASE} alt="" />
                    <Text className='cm-font-size18 cm-font-fam500'>Add a Use Case</Text>
                    <div  className='cm-font-opacity-black-65 cm-text-align-center'>Create a use case to organize and showcase your product demos.</div>
                </Space>
            </div>
        )
    }
}

export default DemoPreview