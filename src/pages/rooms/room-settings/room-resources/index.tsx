import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Col, Dropdown, Form, Input, MenuProps, Modal, Popover, Row, Space, Typography } from "antd";

import { RESOURCE_COUNT, Length_Input, EMPTY_CONTENT_ACCOUNT_IMG, ACCOUNT_TYPE_DPR } from "../../../../constants/module-constants";
import { ADD_RESOURCE_CONFIG } from "../../../library/config/add-resource-config";
import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { checkPermission, PermissionCheckers } from "../../../../config/role-permission";
import { ROOM_RESOURCE_ADDED } from "../../../../tracker-constants";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { R_SECTIONS, ROOM_RESOURCES } from "../../api/rooms-query";
import { AppTracker } from "../../../../app-tracker";
import { GlobalContext } from "../../../../globals";
import { RoomsAgent } from "../../api/rooms-agent";

import AnalyticsResourceViewerModal from "../../../../components/analytics-resource-viewer";
import EditResourceModal from "../../../library/resource-list/edit-resource-modal";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import SellerResourceCard from "../../room-resources/seller-resource-card";
import ResourceModal from "../../library/resource-form/resource-modal";
import LibraryModal from "../../library/library-modal/library-modal";
import AddResourceForm from "../../room-resources/add-resource-form";
import Loading from "../../../../utils/loading";
import EmojiPicker from "@emoji-mart/react";

const { Text }  =   Typography;
const { useForm }   =   Form;

const RoomResources = () => {

    const params = useParams();
    
    const { $user, $dictionary, $accountType }        =   useContext(GlobalContext);

    const [filter, setFilter]           =   useState<any>({});
    const [editView, setEditView]       =   useState(false);

    const [form]            =   useForm();

    const [resourceAnalytics, setResourceAnalytics] =   useState({
        isOpen: false,
        resource: null
    })
    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    const [resourceView, setResourceView]           =   useState(false);
    const [emojiVisible, setEmojiVisible]           =   useState(false);
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

    const { data: sectionsData }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId,
            filter  : {
                type : "RESOURCES"
            }
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        let latestFilter = { ...filter };
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
    }, [filter])

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

    const handleTitleSave = () => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: sectionsData._rSections[0].uuid,
                input: {
                    title: form.getFieldsValue().title
                }
            },
            onCompletion: () => {
                setEditView(false);
                CommonUtil.__showSuccess("Title updated successfully")
            },
            errorCallBack: (error:any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        setEditView(false)
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            handleTitleSave()
        }
    }

    const handleInputBlur = () => {
        form.submit()
    }

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const onEmojiSelect = (emojiValue: string) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid     :  sectionsData._rSections[0].uuid,
                input: {
                    emoji           :   emojiValue
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Emoji updated successfully")
                setEmojiVisible(false);
            },
            errorCallBack: (error:any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <div className="cm-height100 cm-overflow-hidden cm-padding15" style={{rowGap: "15px"}}>
            <Space className="cm-flex-space-between cm-width100 cm-margin-bottom15">
                <Space>
                    <Popover
                        overlayClassName    =   'j-emoji-popoup'
                        content             =   {
                            <EmojiPicker theme={"light"} previewPosition={"none"} style={{ height: "20%" }} onEmojiSelect={(e: { native: string }) => {onEmojiSelect ((e.native))}} />
                        }
                        trigger             =   "click"
                        open                =   {emojiVisible}
                        onOpenChange        =   {setEmojiVisible}
                        placement           =   "bottom"
                    > 
                        <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                            {sectionsData?._rSections[0].emoji}
                        </Text> 
                    </Popover>
                    {
                        RoomEditPermission ?
                            (editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center">
                                    <>
                                        <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={sectionsData?._rSections[0]?.title}>
                                            <Input style={{width: "150px"}} maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => handleTitleSave()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <>
                                    <div className='cm-flex-align-center'>
                                        <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: sectionsData?._rSections[0]?.title}} style={{ maxWidth: "200px", marginRight: "8px"}}>{sectionsData?._rSections[0]?.title}</Text>
                                        <div className='show-on-hover-icon'>
                                            <MaterialSymbolsRounded font="edit" size="14" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                        </div>
                                    </div>
                                </>
                            )
                        :
                            <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: data?._rSections[0]?.title}} style={{ maxWidth: "200px", marginRight: "8px"}}>{data?._rSections[0]?.title}</Text>
                    } 
                </Space>
                {
                    checkPermission($user.role, FEATURE_ROOMS, 'create') &&
                        <Dropdown menu={{ items: addResourceOptions }} trigger={["click"]} placement='bottom' overlayClassName='cm-add-resource-dropdown j-sfdc-add-res-dropdown'>
                            <Button type="primary" ghost className="j-add-resource-room-template cm-flex-center" icon={<MaterialSymbolsRounded font="home_storage" size="22" />} style={{background: "transparent"}}>
                                <div className="cm-font-size14">Add Resources</div>
                            </Button>
                        </Dropdown>
                }
            </Space>
            <div className="j-room-resources cm-padding15">
                <div className="cm-flex-center cm-width100 cm-margin-bottom10">
                    <Input style={{minWidth: "300px", maxWidth: "500px"}} autoFocus allowClear maxLength={Length_Input} placeholder="Search"  suffix={<MaterialSymbolsRounded font="search" size="18" />} onChange={(inputValue) => handleSearch(inputValue)} />
                </div>
                {
                    loading
                        ?
                        <Loading />
                        :
                        <div className="j-room-res-list">
                            {
                                data && data._rResources.length > 0 ?
                                    <Row gutter={[15, 15]}>
                                        {
                                            data._rResources.map((_resource: any) => (
                                                <Col xs={24} sm={24} md={24} lg={12} xl={8}>
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
                                                        />
                                                    </Loading>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                :
                                    <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                                        <img height={160} width={160} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                        <Text className='cm-font-size18 cm-font-fam500'>No Resources Yet!</Text>
                                        <div  className='cm-font-opacity-black-65 cm-text-align-center'>Populate this {$accountType === ACCOUNT_TYPE_DPR ? "pod" : "room"} with essential collaterals to drive success.</div>
                                    </Space>
                            }
                        </div>
                }
            </div>
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