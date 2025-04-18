import { useContext, useEffect, useState } from "react";
import { Button, Col, Input, Row, Space, Typography } from "antd";

import { GlobalContext } from "../../../globals";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { checkPermission } from "../../../config/role-permission";
import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { EMPTY_CONTENT_ACCOUNT_IMG } from "../../../constants/module-constants";

import TemplateCard from "./template-card";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import DeleteConfirmation from "../../../components/delete-confirmation-modal";
import LockedButton from "../../settings/pricing/locked-button";
import CreateTemplate from "../create-template/new-flow";

const { Text } = Typography

const TemplateLists = (props: { data: any }) => {

    const { data } = props;

    const { $user, $dictionary, $limits, $entityCount }    =   useContext(GlobalContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomCards, setRoomCards]             = useState(data.roomTemplates);
    const [search, setSearch]                   = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean; data: any}>({
        isOpen: false,
        data: null
    });

    useEffect(() => {
        setRoomCards(data.roomTemplates)
    }, [data])

    const handleDeleteClick = (_template: any) => {
        setDeleteConfirmation({isOpen: true, data: _template})
    }

    const onDelete = () => {
        RoomTemplateAgent.deleteTemplate({
            variables: {
                templateUuid: deleteConfirmation.data.uuid
            },
            onCompletion: () => {
                setDeleteConfirmation({isOpen: false, data: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const filteredRoomCards = roomCards.filter((_roomName: any) => _roomName.title.toLowerCase().includes(search?.toLowerCase()));

    const createTemplatePermission = checkPermission($user.role, FEATURE_TEMPLATES, 'create');

    const checkTemplatesLimit = () => {
        if($limits && $limits.templateLimit && parseInt($limits.templateLimit) !== -1){
            if($entityCount.templatesCount >= parseInt($limits.templateLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    return (
        <>
            <div className='cm-flex-space-between j-module-listing-header cm-flex-align-center'>

                <div className='cm-font-fam500 cm-font-size16'>{$dictionary.templates.title} {roomCards.length > 0 && <span className="cm-dark-grey-text cm-font-size14">({roomCards.length})</span> }</div>

                <Space>
                    <div className='cm-flex-justify-end'>
                        <Input placeholder="Search" prefix={<MaterialSymbolsRounded font="search" size="18" color="#c1c1c1" />} allowClear onChange={(e) => setSearch(e.target.value)} style={{ width: "230px" }} />
                    </div>
                    {
                        createTemplatePermission && checkTemplatesLimit() ?
                            <Button onClick={() => setShowCreateModal(true)} type='primary' className="cm-icon-button cm-flex-center" icon={<MaterialSymbolsRounded font="add" size="20" weight="400"/>}>
                                Create {$dictionary.templates.singularTitle}
                            </Button>
                        :
                            <LockedButton btnText={`Create ${$dictionary.templates.singularTitle}`}/>

                    }                </Space>
            </div>
            <div className='j-module-listing-body cm-padding15'>
                {
                    <Row gutter={[15, 15]}>
                        {
                            filteredRoomCards.length > 0 ?
                                (filteredRoomCards.map((_roomTemplate: any) => (
                                    <Col key={_roomTemplate.id} xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                                        <TemplateCard roomTemplate={_roomTemplate} onDelete={(_roomTemplate: any) => handleDeleteClick(_roomTemplate)} />
                                    </Col>
                                )))
                                :
                                <div className='cm-flex-center cm-width100' style={{ height: "calc(100vh - 200px)" }}>
                                    <Space direction='vertical' className='cm-flex-align-center' size={20}>
                                        <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                        <Space direction='vertical' className='cm-flex-align-center' size={0}>
                                            <Text className='cm-font-size18'>No {$dictionary.templates.title} Found</Text>
                                            <Text className='cm-light-text '>{$dictionary.templates.singularTitle} drought! Let's fix that. Create one now and get started!</Text>
                                        </Space>
                                        { checkTemplatesLimit() ?
                                                (createTemplatePermission && <Button type='primary' className='cm-flex-center cm-icon-button' onClick={() => setShowCreateModal(true)} icon={<MaterialSymbolsRounded font="add" size='20' weight="400"/>}>Create {$dictionary.templates.singularTitle}</Button>)
                                            :
                                                <LockedButton btnText={`Create ${$dictionary.templates.singularTitle}`}/>
                                        }
                                    </Space>
                                </div>
                        }
                    </Row>
                }
            </div>
            <CreateTemplate
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
            <DeleteConfirmation 
                isOpen  =   {deleteConfirmation.isOpen} 
                content =   {{
                    module  :   $dictionary.templates.singularTitle,
                    cautionMessage: `This ${$dictionary.templates.singularTitle} "${deleteConfirmation?.data?.title}" was used to create ${deleteConfirmation?.data?.roomCount ?? 0} ${$dictionary.rooms.title}`
                }}
                onOk={onDelete}
                onCancel        =   {() => setDeleteConfirmation({isOpen: false, data: null})}
                otherReqInfo    =   {{
                    deleteConfirmation
                }}
            />
        </>
    )
}

export default TemplateLists