import { Card, Col, Image, Row, Space, Typography } from 'antd';

import { useBuyerResourceViewer } from '../../../../custom-hooks/resource-viewer-hook';
import { LINK } from '../../../../pages/library/config/resource-type-config';
import { CommonUtil } from '../../../../utils/common-util';
import { BuyerAgent } from '../../../api/buyer-agent';

import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import Translate from '../../../../components/Translate';

const { Text }  =   Typography;

const DownloadAction = (props: {resources: any}) => {

    const { resources }     =   props;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const trackDownload = (resourceId: string) => {
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid: resourceId,
                    isDownloaded: true
                }
            },
            errorCallBack: () => {},
            onCompletion: () => {}
        })
    }

    const UploadedFile = (_resource: any) => {
        return (
            <Card key={_resource.uuid} className='j-ap-uploaded-file cm-cursor-pointer' hoverable onClick={(event) => {event.stopPropagation(); handleResourceOnClick(_resource)}}>
                <Space className="cm-flex-space-between">
                    <Space className='cm-flex'>
                        <Image className='j-ap-resource-thumbnail' preview={false} width={50} height={30} src={_resource.content.thumbnailUrl ? _resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(_resource.content.type)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(_resource.content.type)}}/> 
                        <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: _resource.title}} className='cm-font-size13 cm-font-fam400'>{_resource.title}</Text>
                    </Space>
                    {(_resource.type !== LINK) && ( <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer' onClick={(event: any) => {event.stopPropagation(); trackDownload(_resource.uuid); window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url)}}/> )}
                </Space>
            </Card>
        )
    }

    return (
        <>
            {
                resources.length > 0 ?
                    <Space direction='vertical' className='cm-width100'> 
                        <span style={{opacity: "65%"}} className="cm-font-size13"><Translate i18nKey={"common-labels.resources"}/></span>   
                        <Row gutter={[10, 10]} className='cm-padding-block10 cm-margin-bottom20'>
                            {
                                resources.map((_resource: any) => (
                                    <Col span={24} className="cm-width100">
                                        <UploadedFile key={_resource.uuid} {..._resource} />
                                    </Col>
                                ))
                            }
                        </Row>
                    </Space>
                :
                    null
            }
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
        </>
    )
}

export default DownloadAction