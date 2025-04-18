import { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Button, Col, Dropdown, Form, Input, MenuProps, Popover, Row, Space, Typography, message } from "antd";

import { RT_RESOURCES } from "../../../templates/api/room-templates-query";
import { EMPTY_CONTENT_ACCOUNT_IMG, Length_Input, RESOURCE_COUNT } from "../../../../constants/module-constants";
import { ADD_RESOURCE_CONFIG } from "../../../library/config/add-resource-config";
import { RoomTemplateAgent } from "../../../templates/api/room-template-agent";
import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";
import { TEMPLATE_RESOURCE_ADDED } from "../../../../tracker-constants";
import { PermissionCheckers } from "../../../../config/role-permission";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { AppTracker } from "../../../../app-tracker";
import { GlobalContext } from "../../../../globals";
import { RoomsAgent } from "../../api/rooms-agent";

import AnalyticsResourceViewerModal from "../../../../components/analytics-resource-viewer";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import EditResourceModal from "../../../library/resource-list/edit-resource-modal";
import ResourceModal from "../../../templates/resource-form/resource-modal";
import LibraryModal from "../../library/library-modal/library-modal";
import SellerResourceCard from "./seller-resource-card";
import Loading from "../../../../utils/loading";
import EmojiPicker from "@emoji-mart/react";

const { useForm }   =   Form;
const { Text }      =   Typography;

const SellerResources = (props: { id: string, roomTemplate: any, sectionData: any }) => {

    const { id, roomTemplate, sectionData }  =   props;

    const { $user, $dictionary }    =    useContext(GlobalContext);

    const TemplateEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const [form]    =   useForm();

    const [showLibraryModal, setShowLibraryModal]   =   useState(false);
    const [editView, setEditView]                   =   useState(false);
    const [emojiVisible, setEmojiVisible]           =   useState(false);
    const [resourceViewer, setResourceViewer] =   useState({
        isOpen: false,
        resource: null
    })

    const [filter, setFilter]               =   useState<any>({});
    const [showEdit, setShowEdit]           =   useState({
        isOpen      :   false,
        onClose     :   () => {},
        resource    :   null
    })

    const [isModalOpen, setIsModalOpen]             =   useState({
        isOpen          :   false,
        type            :   "",
        key             :   "",
        displayname     :   "",
        domain          :   "",
        imageIcon       :   ""
    });

    const [_getResources, { data, loading }]   =   useLazyQuery(RT_RESOURCES, {fetchPolicy: "network-only"});

    useEffect(() => {
        _getResources({
            variables: {
                "templateUuid" : roomTemplate.uuid,
                "input" : filter,
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
            isOpen      :   true,
            onClose     :   () => setShowEdit({isOpen: false, onClose: () => {}, resource: null}),
            resource    :   resource
        })
    }

    const items: MenuProps['items'] = [
        {
            "key"       :   "add_from_resource",
            "title"     :   `Select from ${$dictionary.library.title}`,
            "label"     :   
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        <MaterialSymbolsRounded font={"home_storage"} size='25'/>
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>Select from {$dictionary.library.title}</div>
                        <div className='cm-light-text cm-font-size12'>Add a resource from the {$dictionary.library.title}</div>                        
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setShowLibraryModal(true)
            }
        } 
    ];  

    Object.values(ADD_RESOURCE_CONFIG).map((_addResourceType) => {
        let option = {
            "key"       :   _addResourceType.key,
            "title"     :   _addResourceType.view,
            "label"     :   
                <Space style={{minWidth: "280px"}}>
                    <div className='j-add-res-icon-wrap cm-flex-center'>
                        {
                            _addResourceType.imageIcon ?
                                <MaterialSymbolsRounded font={_addResourceType.imageIcon} size='25'/>
                            :
                                <img src={_addResourceType.imageFile} style={{width: "25px", height: "25px"}}/>
                        }
                    </div>
                    <Space direction='vertical' size={0}>
                        <div className='cm-font-fam500'>{_addResourceType.displayName}</div>
                        <div className='cm-light-text cm-font-size12'>{_addResourceType.description}</div>                        
                    </Space>
                </Space>,
            "onClick"   :   (_resource: any) => {
                setIsModalOpen({
                    isOpen          :   true,
                    type            :   _resource.item.props.title,
                    key             :   _addResourceType.key,
                    displayname     :   _addResourceType.displayName,
                    domain          :   _addResourceType.domain ?? "",
                    imageIcon       :   _addResourceType.imageIcon ?? ""
                })
            }
        }  
        items.push(option)
    })

    const handleSelectResource = (resource: any, isAddToRoomChecked: boolean) => {

        const messageLoading = message.loading("Uploading resource...", 0)
        RoomTemplateAgent.updateRoomTemplateResources({
            variables: {
                templateUuid        :   roomTemplate.uuid, 
                resourcesUuid       :   resource.map((res: any) => res.uuid), 
                action              :   "ADD",
                updateInAllRooms    :   isAddToRoomChecked ?? false
            },
            onCompletion: () => {
                messageLoading()
                setShowLibraryModal(false)
                CommonUtil.__showSuccess("Resource updated successfully");
                AppTracker.trackEvent(TEMPLATE_RESOURCE_ADDED, {"Resource name": resource.title});
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onEmojiSelect = (emojiValue: string) => {
        RoomTemplateAgent.updateRoomTemplateSection({
            variables: {
                sectionUuid     :   id,
                input: {
                    emoji           :   emojiValue
                }
            },
            onCompletion: () => {
                setEditView(false);
                CommonUtil.__showSuccess("Emoji updated successfully")
                setEmojiVisible(false)
            },
            errorCallBack: (error:any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

            }
        })
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            form.submit()
        }
    }

    const handleInputBlur = () => {
        form.submit()
    }

    const onFinish: any = (values: any) => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: id,
                input: {
                    title: values.title
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

    return (
        <>
            <div className="cm-width100 cm-height100 cm-row cm-padding15 cm-background-gray">
                <Space className="cm-flex-space-between cm-margin-bottom15">
                    {
                        TemplateEditPermission ?
                            <div className="cm-flex cm-gap8">
                                <Popover
                                    overlayClassName    =   'j-emoji-popoup'
                                    content             =   {
                                        <EmojiPicker theme={"light"} previewPosition={"none"} style={{ height: "20%" }} onEmojiSelect={(e: { native: string }) => {onEmojiSelect ((e.native))}} />
                                    }
                                    trigger             =   "click"
                                    open                =   {emojiVisible}
                                    onOpenChange        =   {setEmojiVisible}
                                > 
                                    <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                        {sectionData.emoji}
                                    </Text> 
                                </Popover>
                                {
                                    editView ?
                                        <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                            <>
                                                <Form.Item rules={[{required:true, whitespace: true}]} name={"title"} noStyle initialValue={sectionData.title}>
                                                    <Input maxLength={Length_Input} autoFocus className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter} onBlur={handleInputBlur}/>
                                                </Form.Item>
                                                <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                            </>
                                        </Form>
                                    :
                                        <>
                                            <div className='cm-flex-align-center'>
                                                <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: sectionData.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{sectionData.title}</Text>
                                                <MaterialSymbolsRounded font="edit" size="14" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                            </div>
                                        </>
                                }
                            </div>
                        :
                            <Space>
                                    <Text className="cm-font-size18 cm-font-fam500 cm-cursor-pointer" style={{ maxWidth: "200px" }}>
                                    {sectionData.emoji}
                                </Text> 
                                <Text className="cm-font-size18 cm-font-fam500" ellipsis={{tooltip: sectionData.title}} style={{ maxWidth: "600px", marginRight: "8px"}}>{sectionData.title}</Text>
                            </Space>

                    }
                    {
                        TemplateEditPermission &&
                            <Dropdown overlayClassName='cm-add-resource-dropdown' menu={{items}} trigger={["click"]} placement="bottom">
                                <Button type="primary" ghost style={{background: "transparent"}} className="j-add-resource-room-template cm-flex-center cm-icon-button" icon={<MaterialSymbolsRounded font="home_storage" size="22" />}>
                                    Add Resource
                                </Button>
                            </Dropdown>
                    }
                </Space>
                <div className="j-res-list-col cm-padding10 cm-background-white cm-border-radius6" style={{height: "calc(100% - 45px)"}}>
                    <div className="cm-flex-center cm-margin-block15">
                        <Input autoFocus maxLength={Length_Input} allowClear placeholder="Search" style={{minWidth: "300px", maxWidth: "500px"}} suffix={<MaterialSymbolsRounded font="search" size="18"/>} onChange={(inputValue) => handleSearch(inputValue)}/>
                    </div>
                    {
                        loading 
                        ?
                            <Loading/>
                        :
                            <div className="j-res-list-wrap">
                                {
                                    data && data._rtResources.length > 0 
                                    ?
                                        <Row gutter={[20, 20]}>
                                            {
                                                data._rtResources.map((_resource: any) => (
                                                    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                                                        <SellerResourceCard 
                                                            key                 =   {`${_resource.uuid}card`}
                                                            roomTemplateId      =   {roomTemplate.uuid}
                                                            cardId              =   {_resource.uuid}
                                                            name                =   {_resource.title}
                                                            fileType            =   {_resource.type}
                                                            thumbnail           =   {_resource.content.thumbnailUrl}
                                                            createdAt           =   {_resource.createdAt}
                                                            selected            =   {false}     
                                                            onCheck             =   {() => {}}
                                                            resource            =   {_resource}
                                                            onResourceClick     =   {() => setResourceViewer({ isOpen: true, resource: _resource })}
                                                            onEdit              =   {(_resource) => handleEditClick(_resource)}
                                                        />
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    :
                                        <Space direction="vertical" className="cm-flex-center cm-height100 cm-width100">
                                            <img height={160} width={160} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                                            <Text className='cm-font-size18 cm-font-fam500'>No Resources Yet!</Text>
                                            <div  className='cm-font-opacity-black-65 cm-text-align-center'>Populate this template with essential collaterals to drive success.</div>
                                        </Space>
                                }
                            </div>
                    }
                </div>
            </div>
            <EditResourceModal
                isOpen          =   {showEdit.isOpen}
                onClose         =   {showEdit.onClose}
                resource        =   {showEdit.resource}
            />
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resource: any, isAddToRoomChecked?: any) => handleSelectResource(resource, isAddToRoomChecked)}   
                initialFilter           =   {[]}
                multipleResource        =   {true}
                module                  =   {"templates"}
            />
            <AnalyticsResourceViewerModal module={{ "type": "template" }} isOpen={resourceViewer.isOpen} onClose={() => setResourceViewer({ isOpen: false, resource: null })} resource={resourceViewer.resource} />
            <ResourceModal
                isOpen      =   {isModalOpen.isOpen}
                onClose     =   {() => setIsModalOpen({isOpen: false, type: "", key: "", displayname: "", domain: "", imageIcon: ""})}
                type        =   {isModalOpen.type}
                uploadKey   =   {isModalOpen.key}
                displayName =   {isModalOpen.displayname}
                domain      =   {isModalOpen.domain}
                imageIcon   =   {isModalOpen.imageIcon}
            />
        </>
    )
}

export default SellerResources