import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Button, Col, Dropdown, Input, MenuProps, Modal, Row, Space, Tabs } from "antd";

import { ACCOUNT_TYPE_DPR, EMPTY_CONTENT_ACCOUNT_IMG, Length_Input, RESOURCE_COUNT } from "../../../constants/module-constants";
import { LIBRARY, ROOM_RESOURCE_SEGREGATION } from "../config/room-resource-config";
import { ADD_RESOURCE_CONFIG } from "../../library/config/add-resource-config";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { checkPermission } from "../../../config/role-permission";
import { ROOM_RESOURCE_ADDED } from "../../../tracker-constants";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { ROOM_RESOURCES } from "../api/rooms-query";
import { AppTracker } from "../../../app-tracker";
import { RoomsAgent } from "../api/rooms-agent";
import { GlobalContext } from "../../../globals";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import EditResourceModal from "../../library/resource-list/edit-resource-modal";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import ResourceModal from "../library/resource-form/resource-modal";
import LibraryModal from "../library/library-modal/library-modal";
import SellerResourceCard from "./seller-resource-card";
import ResourceFilter from "./resource-filter-select";
import AddResourceForm from "./add-resource-form";
import Loading from "../../../utils/loading";
import TabPane from "antd/es/tabs/TabPane";

const RoomResources = () => {

    const params = useParams();
    
    const { $isVendorMode, $isVendorOrg, $user, $dictionary, $accountType }        =   useContext(GlobalContext);

    const [filter, setFilter]                       =   useState<any>({});
    const [currentTab, setCurrentTab]               =   useState(LIBRARY);

    const [resourceAnalytics, setResourceAnalytics] =   useState({
        isOpen: false,
        resource: null
    })
    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    const [resourceView, setResourceView]           =   useState(false);
    const [showEdit, setShowEdit]                   =   useState({
        isOpen: false,
        onClose: () => { },
        resource: null
    })

    const [isModalOpen, setIsModalOpen]             =   useState({
        isOpen: false,
        type: "",
        key: "",
        displayname: "",
        domain: "",
        imageIcon: ""
    });

    const [_getResources, { data, loading }] = useLazyQuery(ROOM_RESOURCES, { fetchPolicy: "network-only" });

    useEffect(() => {
        let latestFilter = { ...filter };
        latestFilter["resourceOrigins"] = [currentTab]
        _getResources({
            variables: {
                "roomUuid"  :   params.roomId,
                "input"     :   latestFilter,
                "pageConstraint": {
                    "page": 1,
                    "limit": RESOURCE_COUNT
                }
            }
        })
    }, [filter, currentTab])

    const handleSearch = (searchEvent: any) => {
        setFilter((prevFilter: any) => (
            {
                ...prevFilter,
                searchKey: searchEvent.target.value
            }
        ))
    }

    const handleEditClick = (resource: any) => {
        setShowEdit({
            isOpen: true,
            onClose: () => setShowEdit({ isOpen: false, onClose: () => { }, resource: null }),
            resource: resource
        })
    }

    const addResourceOptions: MenuProps['items'] = [
        {
            "key": "add_from_resource",
            "title": `Select from ${$dictionary.library.title}`,
            "label":
                <Space style={{ minWidth: "280px" }}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        <MaterialSymbolsRounded font={"home_storage"} size='25' />
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>Select from {$dictionary.library.title}</div>
                        <div className='cm-light-text cm-font-size12'>Add a resource from the {$dictionary.library.title}</div>
                    </Space>
                </Space>,
            "onClick": (_resource: any) => {
                setShowLibraryModal(true)
            }
        }
    ];

    Object.values(ADD_RESOURCE_CONFIG).map((_addResourceType) => {
        let option = {
            "key": _addResourceType.key,
            "title": _addResourceType.view,
            "label":
                <Space style={{ minWidth: "280px" }}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        {
                            _addResourceType.imageIcon ?
                                <MaterialSymbolsRounded font={_addResourceType.imageIcon} size='25' />
                                :
                                <img src={_addResourceType.imageFile} style={{ width: "25px", height: "25px" }} />
                        }
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>{_addResourceType.displayName}</div>
                        <div className='cm-light-text cm-font-size12'>{_addResourceType.description}</div>
                    </Space>
                </Space>,
            "onClick": (_resource: any) => {
                setIsModalOpen({
                    isOpen: true,
                    type: _resource.item.props.title,
                    key: _addResourceType.key,
                    displayname: _addResourceType.displayName,
                    domain: _addResourceType.domain ?? "",
                    imageIcon: _addResourceType.imageIcon ?? ""
                })
            }
        }
        addResourceOptions.push(option)
    })

    const handleSelectResource = (resources: any) => {
        RoomsAgent.updateResources({
            variables: {
                roomUuid: params.roomId,
                resourcesUuid: resources.map((_resource: any) => _resource.uuid),
                action: "ADD"
            },
            onCompletion: () => {
                setShowLibraryModal(false)
                CommonUtil.__showSuccess("Resource added successfully");
                AppTracker.trackEvent(ROOM_RESOURCE_ADDED, {});
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleTabChange = (key: string) => {
        setCurrentTab(key)
    }

    return (
        <div className="cm-padding15 cm-height100 cm-overflow-hidden cm-border-radius8">
            <Row className="cm-height100 cm-row" gutter={20} >
                <Col flex="270px" className="cm-height100 cm-overflow-auto cm-padding0 cm-background-white cm-border-radius8">
                    <ResourceFilter setFilter={setFilter} hideAdd={true} />
                </Col>
                <Col flex="auto" style={{ maxWidth: "calc(100% - 270px)" }} className="cm-height100 j-res-list-col">
                    <Space className="cm-width100 cm-flex-center cm-margin-bottom10 j-room-res-search-block" size={15}>
                        <Input autoFocus allowClear maxLength={Length_Input} placeholder="Search" className="j-doc-list-search" size="large" suffix={<MaterialSymbolsRounded font="search" size="18" />} onChange={(inputValue) => handleSearch(inputValue)} />
                        {
                            checkPermission($user.role, FEATURE_ROOMS, 'create') &&
                            <Dropdown menu={{ items: addResourceOptions }} trigger={["click"]} placement='bottom' overlayClassName='cm-add-resource-dropdown j-sfdc-add-res-dropdown'>
                                <Button type='primary' className="j-add-resource-room-template cm-flex-center" size="large" icon={<MaterialSymbolsRounded font="home_storage" size="22" />} >
                                    <div className="cm-font-size14">Add Resources</div>
                                </Button>
                            </Dropdown>
                        }
                    </Space>
                    <Tabs className="j-room-res-tab" onChange={handleTabChange}>
                        {Object.values(ROOM_RESOURCE_SEGREGATION).map((_origin) => (
                            <TabPane tab={`${_origin.key === "ROOM" && ($isVendorMode || $isVendorOrg) ? "For this Lead" : (($isVendorMode || $isVendorOrg) ? "From Assets" : _origin.displayName)}`} key={_origin.key}>
                                {
                                    loading
                                        ?
                                        <Loading />
                                        :
                                        <div className="j-room-res-list-wrap">
                                            {
                                                data && data._rResources.length > 0 ?
                                                    <Row gutter={[15, 15]}>
                                                        {
                                                            data._rResources.map((_resource: any) => (
                                                                <Col xs={24} sm={24} md={24} lg={12} xl={6} >
                                                                    <Loading className="j-resource-loading" loading={_resource.content.uploadStatus !== "COMPLETED"}>
                                                                        <SellerResourceCard
                                                                            key                 =   {`${_resource.uuid}card`}
                                                                            roomId              =   {params.roomId}
                                                                            cardId              =   {_resource.uuid}
                                                                            name                =   {_resource.title}
                                                                            fileType            =   {_resource.type}
                                                                            thumbnail           =   {_resource.content.thumbnailUrl}
                                                                            createdAt           =   {_resource.createdAt}
                                                                            selected            =   {false}
                                                                            onCheck             =   {() => { }}
                                                                            resource            =   {_resource}
                                                                            onResourceClick     =   {() => setResourceAnalytics({ isOpen: true, resource: _resource })}
                                                                            onEdit              =   {(_resource: any) => handleEditClick(_resource)}
                                                                            origin              =   {_origin.key}
                                                                        />
                                                                    </Loading>
                                                                </Col>
                                                            ))
                                                        }
                                                    </Row>
                                                :
                                                    <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                                                        <img height={160} width={160} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                                        <div className="cm-font-size18 cm-font-fam500">No Resources Yet!</div>
                                                        <div  className='cm-font-opacity-black-65 cm-text-align-center'>Populate this {$accountType === ACCOUNT_TYPE_DPR ? "pod" : "room"} with essential collaterals to drive success.</div>
                                                    </Space>
                                            }
                                        </div>
                                }
                            </TabPane>
                        ))}
                    </Tabs>
                </Col>
            </Row>
            <Modal
                centered
                width       =   {1000}
                open        =   {resourceView}
                footer      =   {null}
                onCancel    =   {() => setResourceView(false)}
            >
                <>
                    <Space direction="vertical" size={5} className="cm-margin-bottom20">
                        <div className="cm-font-size16 cm-font-fam500">Add resource</div>
                        <div className="j-settings-subtitle-border"></div>
                    </Space>
                    <AddResourceForm onClose={() => setResourceView(false)} />
                </>
            </Modal>
            <EditResourceModal
                isOpen      =   {showEdit.isOpen}
                onClose     =   {showEdit.onClose}
                resource    =   {showEdit.resource}
            />
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": params?.roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resources: any) => handleSelectResource(resources)}
                initialFilter           =   {[]}
                multipleResource        =   {true}
            />
            <ResourceModal
                isOpen      =   {isModalOpen.isOpen}
                onClose     =   {() => setIsModalOpen({ isOpen: false, type: "", key: "", displayname: "", domain: "", imageIcon: "" })}
                type        =   {isModalOpen.type}
                uploadKey   =   {isModalOpen.key}
                displayName =   {isModalOpen.displayname}
                domain      =   {isModalOpen.domain}
                imageIcon   =   {isModalOpen.imageIcon}
            />
        </div>
    )
}

export default RoomResources