import { Card, Image, Space, Typography } from 'antd';

import { useBuyerResourceViewer } from '../../../../custom-hooks/resource-viewer-hook';
import { CommonUtil } from '../../../../utils/common-util';

import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import Translate from '../../../../components/Translate';

const { Text }      =   Typography;

const ViewDoc =  (props: {actionPoint: any}) => {

    const { actionPoint }   =   props;

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    return (
        <>
            {
                actionPoint.resources.length > 0 ?
                    <Space direction='vertical' className='cm-width100' size={15}> 
                        <span style={{opacity: "65%"}} className="cm-font-size13"><Translate i18nKey={"common-labels.resources"}/></span>   
                        {
                            actionPoint.resources.map((_resource: any) => (
                                <Card className="j-action-download-card" hoverable key={_resource.uuid} onClick={() => handleResourceOnClick(_resource)}>
                                    <div className='cm-flex cm-gap8'>
                                        <Image className='j-ap-resource-thumbnail' preview={false} width={50} height={30} src={_resource.content.thumbnailUrl ? _resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(_resource.content.type)} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= CommonUtil.__getResourceFallbackImage(_resource.content.type)}}/> 
                                        <Text className="cm-font-size14 cm-font-fam400 cm-flex-align-center" ellipsis={{tooltip: _resource.title}} style={{maxWidth: "220px"}}>{_resource.title}</Text>
                                    </div>
                                </Card>
                            ))
                        }
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

export default ViewDoc