import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Space, Typography } from 'antd';

import { DOCS, IMAGE, LINK, VIDEO } from '../../library/config/resource-type-config';
import { CommonUtil } from '../../../utils/common-util';
import { ActionPointViewContext } from '.';

import RoomResourceViewerModal from '../room-resource-viewer/room-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import UserQuickView from '../../../buyer-view/components/user-quick-view';
import SellerAvatar from '../../../components/avatars/seller-avatar';
import BuyerAvatar from '../../../components/avatars/buyer-avatar';

const { Text }  =   Typography;

interface FileViewerProps
{
    isOpen          :   boolean;
    onClose         :   () => void;
    resourceInfo    :   any;
}


const ActionUploadType = () => {

    const { roomId }        =   useParams();

    const { actionPoint }   =   useContext(ActionPointViewContext);

    const [viewFile, setViewFile]           =   useState<FileViewerProps>({
        isOpen      :   false,
        onClose     :   () => {},
        resourceInfo:   ""
    });

    const handleResourceClick = (resourceInfo: any) => {
        if(resourceInfo.type === DOCS){
            if(resourceInfo.content.type === "application/pdf" || resourceInfo.content.type === ".pdf"){
                setViewFile({
                    isOpen          :   true,
                    onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
                    resourceInfo    :   resourceInfo
                })
            }else{
                window.open(!resourceInfo.content.url.startsWith('http') ? `https://${resourceInfo.content.url}` : resourceInfo.content.url, '_blank');
            }
        }else if(resourceInfo.type === IMAGE){
            setViewFile({
                isOpen          :   true,
                onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
                resourceInfo    :   resourceInfo
            })
        }else if(resourceInfo.type === LINK){
            CommonUtil.__checkVideoDomain(resourceInfo.content.url) 
            ? 
                setViewFile({
                    isOpen          :   true,
                    onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
                    resourceInfo    :   resourceInfo
                })
            :
                window.open(!resourceInfo.content.url.startsWith('http') ? `https://${resourceInfo.content.url}` : resourceInfo.content.url, '_blank');
        }else if(resourceInfo.type === VIDEO){
            setViewFile({
                isOpen          :   true,
                onClose         :   () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}),
                resourceInfo    :   resourceInfo
            })
        }
    }

    const UploadedFile = (_resource: any) => {
        return (
            <Card key={_resource.uuid} className='j-ap-uploaded-file cm-cursor-pointer' onClick={(event) => {event.stopPropagation(); handleResourceClick(_resource)}}>
                <Space direction='vertical' className='cm-width100' size={20}>
                    <Space className='cm-flex-space-between cm-width100' >
                        <Space className='cm-flex'>
                            <MaterialSymbolsRounded font={'attach_file'} size={"16"}/>
                            <Text style={{maxWidth: "180px"}} ellipsis={{tooltip: _resource.title}} className='cm-font-size13 cm-font-fam400'>{_resource.title}</Text>
                        </Space>
                        {
                            _resource.type === LINK ? 
                                <MaterialSymbolsRounded font={"open_in_new"} size={'18'} className='cm-cursor-pointer' onClick={(event) => {event.stopPropagation(); window.open(_resource.content.url, "_blank")}}/>
                            :
                                <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer' onClick={(event) => {event.stopPropagation(); window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url, "_blank")}}/>
                        }
                    </Space>
                    <Space className='cm-flex-space-between'>
                        <div className='cm-font-size11'><span className='cm-light-text'>Uploaded on : </span><span className='cm-font-fam-500 cm-font-size12'>{`${CommonUtil.__getDateDay(new Date(_resource.createdAt))}, ${new Date(_resource.createdAt).getFullYear()}`}</span></div>
                        <Space className='cm-font-size11'> 
                            <span className='cm-light-text'>Uploaded by : </span>
                            {
                                _resource.createdStakeholder.__typename === "ContactOutput"
                                ?
                                    <UserQuickView user={_resource.createdStakeholder}>
                                        <BuyerAvatar buyer={_resource.createdStakeholder} size={20} fontSize={11}/>
                                    </UserQuickView>
                                :
                                    <UserQuickView user={_resource.createdStakeholder}>
                                        <SellerAvatar seller={_resource.createdStakeholder} size={20} fontSize={11} />
                                    </UserQuickView>
                            }
                        </Space>
                    </Space>
                </Space>
            </Card>
        )
    }

    return (
        <>
            <div className={`j-ap-upload-action-layout ${actionPoint.resources && actionPoint.resources.length > 0 ? "" : "cm-flex-center"}`} style={{backgroundColor: "#fafafa", paddingInline: "10px"}}>
                {
                    actionPoint.resources && actionPoint.resources.length > 0 ? 
                        <Row gutter={[10, 10]} >
                            {
                                actionPoint.resources.map((_resource: any) => (
                                    <Col span={12} className="cm-width100">
                                        <UploadedFile key={_resource.uuid} {..._resource} />
                                    </Col>
                                ))
                            }
                        </Row>
                    :
                    <Space direction='vertical' className='cm-flex-center' size={25}>
                            <div className='cm-font-fam500 cm-font-size16'>No resources uploaded by buyers yet</div>
                    </Space>
                }
            </div>
            <RoomResourceViewerModal
                isOpen          =   {viewFile.isOpen}
                onClose         =   {viewFile.onClose}
                roomId          =   {roomId}
                resourceId      =   {viewFile.resourceInfo.uuid}
            />
        </>
    )
}

export default ActionUploadType