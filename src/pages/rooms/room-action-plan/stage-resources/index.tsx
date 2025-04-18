import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Col, Row, Space, Typography } from 'antd';

import { EMPTY_CONTENT_ACCOUNT_IMG } from '../../../../constants/module-constants';
import { R_JOURNEY_STAGE_RESOURCE } from '../../../accounts/api/accounts-query';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { checkPermission } from '../../../../config/role-permission';
import { GlobalContext } from '../../../../globals';

import AnalyticsResourceViewerModal from '../../../../components/analytics-resource-viewer';
import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import EditResourceModal from '../../../library/resource-list/edit-resource-modal';
import RoomStageResourceCard from './room-stage-resource-card';
import EditResourceSlider from './edit-resource-slider';
import Loading from '../../../../utils/loading';

const { Text }  =   Typography;

const RoomStageResources = () => {

    const { roomId, stageId } = useParams();

    const { $user } = useContext(GlobalContext);

    const [editResource, setEditResource] = useState(false);
    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })
    const [showEdit, setShowEdit] = useState({
        isOpen: false,
        onClose: () => { },
        resource: null
    })

    const { data, loading, error } = useQuery(R_JOURNEY_STAGE_RESOURCE, {
        variables: {
            roomUuid: roomId,
            stageUuid: stageId
        },
        fetchPolicy: "network-only"
    });

    const handleEditClick = (resource: any) => {
        setShowEdit({
            isOpen: true,
            onClose: () => setShowEdit({ isOpen: false, onClose: () => { }, resource: null }),
            resource: resource
        })
    }

    if (error) return <SomethingWentWrong />

    return (
        <>
            <div className="j-room-action-points cm-padding20 cm-position-relative">
                <Space className='cm-flex-space-between cm-margin-bottom20'>
                    <span className='cm-font-size16 cm-font-fam500'>Resources</span>
                    {
                        checkPermission($user.role, FEATURE_ROOMS, 'create') &&
                        <Button type="primary" className="j-ap-add-resource cm-flex-center" icon={<MaterialSymbolsRounded font="home_storage" size="20" />} onClick={() => setEditResource(true)}>
                            <div className="cm-font-size14">Add Resource</div>
                        </Button>
                    }
                </Space>

                {
                    data && data._rStageResources.length > 0
                        ?
                        <Row gutter={[20, 20]}>
                            {
                                loading
                                    ?
                                    <Loading />
                                    :
                                    data._rStageResources.map((_resource: any) => (
                                        <Col key={_resource.uuid} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
                                            <RoomStageResourceCard
                                                key={`${_resource.uuid}card`}
                                                cardId={_resource.uuid}
                                                name={_resource.title}
                                                fileType={_resource.type}
                                                thumbnail={_resource.content.thumbnailUrl}
                                                createdAt={_resource.createdAt}
                                                selected={false}
                                                onCheck={() => { }}
                                                onResourceClick={(_, _resource) => setResourceAnalytics({ isOpen: true, resource: _resource })}
                                                resource={_resource}
                                                onEdit={(_resource) => handleEditClick(_resource)}
                                            />
                                        </Col>
                                    ))
                            }
                        </Row>
                        :
                        <div className='cm-flex-center cm-width100' style={{ minHeight: "350px" }}>
                            <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                                <img height={130} width={130} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                <Text className='cm-font-size18 cm-font-fam500'>No Resources Yet!</Text>
                                <div  className='cm-font-opacity-black-65 cm-text-align-center'>We couldn't find any existing resources.</div>
                            </Space>
                        </div>
                }
            </div>
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
            <EditResourceModal
                isOpen={showEdit.isOpen}
                onClose={showEdit.onClose}
                resource={showEdit.resource}
            />
            <EditResourceSlider isOpen={editResource} onClose={() => setEditResource(false)} />
        </>
    )
}

export default RoomStageResources