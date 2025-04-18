import { useContext, useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Button, Col, Dropdown, MenuProps, Row, Space, Tag, Tooltip, Typography } from "antd"
import { useLazyQuery } from "@apollo/client";

import { EMPTY_CONTENT_ACCOUNT_IMG, RESOURCE_COUNT } from "../../../constants/module-constants";
import { FOLDER, HOME_RESOURCES_COUNT, RESOURCES } from "../api/library-query";
import { FEATURE_LIBRARY } from "../../../config/role-permission-config";
import { CREATED_AT, SORT_BY_CONFIG } from "../config/sort-by-config";
import { RESOURCE_TYPE_CONFIG } from "../config/resource-type-config"
import { checkPermission } from "../../../config/role-permission";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";
import { GlobalContext } from "../../../globals";

import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import CreateDeckSlider from "../deck/create-deck/create-deck-slider";
import MoveResourceModal from "../resource-form/move-resource-modal";
import EditResourceModal from "../resource-list/edit-resource-modal";
import ResourceCard from "../resource-list/resource-card";
import Loading from "../../../utils/loading";
import DeleteConfirmation from "../../../components/delete-confirmation-modal";

const { Text }  =   Typography

const LibraryFiles = (props : {folderId: string | undefined, totalFoldersCount: number}) => {

    const { $categories, $user }       =   useContext(GlobalContext);

    const { search, setIsResourceOpen, setIsModalOpen }     =   useOutletContext<any>()
    
    const { folderId, totalFoldersCount }                   =   props;

    const location = useLocation();

    let [foldersCount]                                      =   useState(totalFoldersCount);

    const [_getHomeInfo, { data: hfData }]                  =   useLazyQuery(HOME_RESOURCES_COUNT, {fetchPolicy: "network-only"});
    const [_getFolder, { data: fData }]                     =   useLazyQuery(FOLDER, {fetchPolicy: "network-only"});
    const [_getResources, { data, loading }]                =   useLazyQuery(RESOURCES, {fetchPolicy: "network-only"});

    const [sortBy, setSortBy]                               =   useState({key: CREATED_AT, displayname: "Created at"});
    const [selectedResourceType, setSelectedResourceType]   =   useState<string>("ALL")
    const [selectedCategory, setSelectedCategory]           =   useState<string[]>([]);
    const [checkedResourcesId, setCheckedResourcesId]       =   useState<string[]>([])
    const [resetAllSelectedRes, setResetAllSelectedRes]     =   useState(false)
    const [moveFolderModalOpen, setMoveFolderIsModalOpen]   =   useState(false)
    const [showCreateDeck, setShowCreateDeck]               =   useState({
        visibility  :   false,
    })

    const [singleLinkCreateRes, setSingleLinkCreateRes]     =   useState<string[]>([])
    const [deleteConfirmation, setDeleteConfirmation]       =   useState<{isOpen: boolean; data: any}>({
        isOpen: false,
        data: null
    });
    const [resourceAnalytics, setResourceAnalytics] =   useState({
        isOpen  :   false,
        resource:   null
    })
    const [showEdit, setShowEdit]           =   useState({
        isOpen      :   false,
        onClose     :   () => {},
        resource    :   null
    })

    useEffect(() => {
        if(folderId !== "home" && folderId !== "all-resources"){
            _getFolder({
                variables: {
                    folderUuid: folderId
                },
                fetchPolicy: "network-only"
            })
        }else if(folderId === "home"){
            _getHomeInfo()
        }
    }, [folderId])

    useEffect(() => {
        handleResetAllSelectedRes()
    }, [selectedCategory, sortBy, selectedResourceType, location])

    useEffect(() => {

        let filter = {
            categories  : selectedCategory,
            types       : selectedResourceType === "ALL" ? undefined : [selectedResourceType],
            searchKey   : search, 
            folderUuid  : (folderId === "home" || folderId === "all-resources") ? undefined : folderId,
        }

        _getResources({
            variables: {
                "input" : filter,
                "sortBy": sortBy.key,
                "pageConstraint": {
                    "page": 1,
                    "limit": RESOURCE_COUNT
                },
                "includeAllResource"    :   folderId === "all-resources"
            }
        })
    }, [folderId, search, selectedResourceType, selectedCategory, sortBy])

    const handleEditClick = (resource: any) => {
        setShowEdit({
            isOpen      :   true,
            onClose     :   () => setShowEdit({isOpen: false, onClose: () => {}, resource: null}),
            resource    :   resource
        })
    }

    const handleCheckboxClick = (id: string) => {
        setCheckedResourcesId(prevCheckedResources => {
            if (prevCheckedResources.includes(id)) {
                return prevCheckedResources.filter(resourceId => resourceId !== id);
            } else {
                return [...prevCheckedResources, id];
            }
        });
    };

    const handleResetAllSelectedRes = () => {
        setResetAllSelectedRes(true)
        setCheckedResourcesId([])
    }

    const handleOnCreateLinkClick = (resource: any) => {
        setSingleLinkCreateRes([resource.uuid])
        setShowCreateDeck({
            visibility  :   true,
        })
    }

    const items: MenuProps['items'] = [];

    Object.values(SORT_BY_CONFIG).map((_sortType: any) => {
        let sortOptions = {
            key     :   _sortType.key,
            label   :   (
                <div className={sortBy.key === _sortType.key ? "cm-primary-color" : ""}>{_sortType.displayName}</div>),
            onClick :   () => {
               setSortBy({key: _sortType.key, displayname: _sortType.displayName})
            }
        }
        items.push(sortOptions)
    })

    const getCategories: MenuProps['items'] = [];
                    
    $categories.map((_category: any) => {
        let category = {
            "key"       :   _category.uuid,
            "label"     :   
                <div className={selectedCategory.includes(_category.uuid) ? "cm-primary-color" : ""}>{_category.name}</div>,

            "onClick"   :   () => {
                setSelectedCategory((prevCategories: any) => {
                    const categoryIndex = prevCategories.indexOf(_category.uuid);
                    if (categoryIndex !== -1) {
                        return prevCategories.filter((categoryId: string) => categoryId !== _category.uuid);
                    } else {
                        return [...prevCategories, _category.uuid];
                    }
                });
            }
        }  
        getCategories.push(category)
    })

    const handleDeleteClick = (resource: any) => {
        setDeleteConfirmation({
            isOpen      :   true,
            data        :   resource
        })
    }

    const handleOnCreateDeckClick = () => {
        setShowCreateDeck({
            visibility  :   true,
        })
    }

    let headerComponent = () => {
        return (
            <>
                <div className="cm-secondary-text cm-font-fam500 cm-margin-bottom10">Files</div>
                <Space className="cm-flex-space-between">
                    <Space>
                    {
                        Object.values(RESOURCE_TYPE_CONFIG).map((_assetType) => (
                            <div className={`j-library-resource-type cm-flex-center cm-cursor-pointer ${_assetType.key === selectedResourceType ? "cm-selected-resource-type" : ""}`} key={_assetType.key} onClick={() => setSelectedResourceType(_assetType.key)}>
                                <Space className='cm-flex-center'>
                                    {_assetType.displayIconName ? <MaterialSymbolsRounded font={_assetType.displayIconName} size='18'/> : null}
                                    <span className='cm-font-fam500'>{_assetType.displayName}</span>
                                </Space>
                            </div>
                        ))
                    }
                    </Space>
                    <Space size={12}>
                        {
                            (selectedCategory.length > 0 || sortBy.key !== CREATED_AT) && 
                                <Tag color="blue" className="cm-margin0 cm-cursor-pointer" onClick={() => {setSortBy({key: CREATED_AT, displayname: "Created at"}); setSelectedCategory([])}} style={{paddingRight: "0px"}}>
                                    <Space size={4}>Reset <MaterialSymbolsRounded font={"close"} size="16" weight="400"/></Space>
                                </Tag>
                        }
                        <Dropdown overlayClassName="j-library-dropdown" menu={{items: getCategories}} trigger={["click"]}>
                            <Space className="cm-font-size14 cm-cursor-pointer" size={4}>
                                Categories: 
                                {
                                    (selectedCategory.length) == 0 ?
                                    <span className="cm-font-fam500"> All</span>
                                    :
                                    <span className="cm-font-fam500">{selectedCategory.length} <span className="cm-text-size10">(selected)</span></span>
                                }

                                <MaterialSymbolsRounded font="expand_more" className="cm-cursor-pointer" />
                            </Space>
                        </Dropdown>
                        <Dropdown menu={{items}} trigger={["click"]}>
                            <Space className="cm-font-size14 cm-cursor-pointer" size={4}>
                                Sort by: <span className="cm-font-fam500">{sortBy.displayname}</span>
                                <MaterialSymbolsRounded font="expand_more" className="cm-cursor-pointer"/>
                            </Space>
                        </Dropdown>
                    </Space>
                </Space>
            </>
        )
    }

    const emptyLogic = () => {
        if(folderId === "all-resources"){
            return getEmptyComponent("all-resources") 
        }else if(folderId === "home"){
            if(hfData?.getLibraryRootCounts.rootResourcesCount > 0){
                return getEmptyComponent()
            }
        }else{
            if(fData?.folder.resourcesCount > 0 && selectedCategory.length > 0 || fData?.folder.resourcesCount > 0 && selectedResourceType !== "ALL") return getEmptyComponent()
        }
    }

    const getResources = () => {
        if(loading) return <Loading/>
        else{
            return (
                <>
                    {(folderId === "home" && hfData?.getLibraryRootCounts.rootResourcesCount > 0) && headerComponent()}	
                    {folderId === "all-resources" && headerComponent()}	
                    {folderId !== "home" && folderId !== "all-resources" && fData?.folder.resourcesCount ? headerComponent() : null}
                    <div className="cm-margin-top20 cm-padding-bottom10" style={{marginBottom: "100px"}}>
                        {
                            data && data.resources && data.resources.length > 0 
                            ?
                                (
                                    <Row gutter={[15, 15]}>
                                        {data?.resources.map((_resource: any) => (
                                            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }} key={_resource._id}>
                                                <ResourceCard 
                                                    key                     =   {_resource._id + "card"}
                                                    cardId                  =   {_resource._id}
                                                    name                    =   {_resource.title}
                                                    fileType                =   {_resource.type}
                                                    thumbnail               =   {_resource.content.thumbnailUrl}
                                                    createdAt               =   {_resource.createdAt}
                                                    downloadCount           =   {_resource.report.downloadCount}
                                                    viewCount               =   {_resource.report.shareCount}   
                                                    selected                =   {false}     
                                                    resource                =   {_resource}
                                                    onResourceClick         =   {(_: any, resource: any) => setResourceAnalytics({isOpen: true, resource: resource})}
                                                    onEdit                  =   {(_resource: any) => handleEditClick(_resource)}
                                                    onDelete                =   {(_resource: any) => handleDeleteClick(_resource)}
                                                    onCheckboxClick         =   {handleCheckboxClick}
                                                    resetAllSelectedRes     =   {resetAllSelectedRes}
                                                    checkedResourcesId      =   {checkedResourcesId}
                                                    setResetAllSelectedRes  =   {setResetAllSelectedRes}
                                                    onCreateLink            =   {handleOnCreateLinkClick}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                )
                            :
                                emptyLogic()
                        }
                    </div>
                </>
            )
        }
    }

    const getEmptyComponent = (page?: string) => {
        return(
            <Space size={20} direction="vertical" style={{height: page === "all-resources" ? "100%" : "calc(100vh - 340px)"}} className="cm-flex-center cm-secondary-text cm-width100">
                <div className='cm-flex-center cm-width100 cm-margin-bottom20'>
                    <Space direction='vertical' className='cm-flex-align-center' size={20}>
                        <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt="" />
                        <Space direction='vertical' className='cm-flex-align-center' size={0}>
                            <Text className='cm-font-size18 cm-font-fam500'>Library is Empty!</Text>
                            { checkPermission($user.role, FEATURE_LIBRARY, 'create') && <div  className='cm-font-opacity-black-65 cm-text-align-center'>Let’s add valuable collaterals to empower your team.</div>}
                        </Space>
                        {
                            checkPermission($user.role, FEATURE_LIBRARY, 'create') &&
                                <Space>
                                    <Button type='primary' className='cm-flex-center cm-icon-button' onClick={() => setIsResourceOpen(true)} icon={<MaterialSymbolsRounded font="home_storage" size='20' weight='400'/>}>Add Resource</Button>
                                    {page !== "all-resources" && <Button type="primary" className="cm-icon-button cm-flex-center" icon={<MaterialSymbolsRounded font="add" size="20" weight="400"/>} onClick={() => setIsModalOpen({visibility: true, parentFolder: folderId})}><div className="cm-font-size14">New Folder</div></Button>}
                                </Space>
                        }
                        {
                            (selectedCategory.length > 0 || sortBy.key !== CREATED_AT) && 
                                <Button className="cm-margin0 cm-cursor-pointer" onClick={() => {setSortBy({key: CREATED_AT, displayname: "Created at"}); setSelectedCategory([])}}>
                                    Reset filters
                                </Button>
                        }
                    </Space>
                </div>
            </Space>
        )
    }

    const getResourceComponent = () => {

        if(folderId === "home"){
            if(hfData?.getLibraryRootCounts.rootResourcesCount === 0 && foldersCount === 0){
                return getEmptyComponent()
            }else if(hfData?.getLibraryRootCounts.rootResourcesCount > 0 || foldersCount > 0){
                return getResources()
            }else return null
        }else if(folderId === "all-resources"){
            if(data && data.resources){
                if(data.resources.length > 0){
                    return getResources()
                }
                if(data.resources.length === 0 && selectedCategory.length > 0 || data.resources.length === 0 && selectedResourceType !== "ALL"){
                    return getResources()
                }else{
                    return getEmptyComponent("all-resources")
                }
            }else if(loading)return <Loading/>
            else{
                return getEmptyComponent("all-resources")
            }
        }else{
            if(fData?.folder.resourcesCount === 0 && foldersCount === 0){
                return getEmptyComponent()
            }else if(fData?.folder.resourcesCount > 0 || foldersCount > 0){
                return getResources()
            }else return null
        }
    }

    const onDelete = () => {        
        LibraryAgent.deleteResources({
            variables: {
                resourceUuid    :   deleteConfirmation?.data?.uuid
            },
            onCompletion: () => {
                setDeleteConfirmation({isOpen: false, data: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return(
        <>
            {getResourceComponent()}
            <AnalyticsResourceViewerModal module={{"type": "library"}} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({isOpen: false, resource: null})} resource={resourceAnalytics.resource}/>
            <EditResourceModal
                isOpen          =   {showEdit.isOpen}
                onClose         =   {showEdit.onClose}
                resource        =   {showEdit.resource}
            />
            <DeleteConfirmation 
                isOpen={deleteConfirmation.isOpen} 
                content={{
                    module: "Resource",
                }}
                onOk={onDelete}
                onCancel={() => setDeleteConfirmation({isOpen: false, data: null})}
                otherReqInfo={{
                    deleteConfirmation
                }}
            />
            {
                checkedResourcesId.length > 0 && 
                    <div className="cm-flex-justify-center">
                        <Space className="cm-position-absolute j-library-multi-select-card cm-flex-space-between-center j-fade-in-fwd" style={{bottom: "30px"}}>
                            <Text className="cm-white-text">{checkedResourcesId.length} Selected</Text>
                            <Space>
                                <Button onClick={handleResetAllSelectedRes}>Cancel</Button>
                                <Button type="primary" onClick={handleOnCreateDeckClick}><MaterialSymbolsRounded font='link' size="20"/> Create Link</Button>
                                {/* <Button type="primary" danger style={{boxShadow: "none"}}>Delete</Button> */}
                                <Tooltip title={checkPermission($user.role, FEATURE_LIBRARY, 'update') ? "" : "You don't have permission. Contact admin."}>
                                    <Button className={checkPermission($user.role, FEATURE_LIBRARY, 'update') ? `` : `cm-button-disabled`} disabled={!checkPermission($user.role, FEATURE_LIBRARY, 'update')} type="primary" onClick={() => checkPermission($user.role, FEATURE_LIBRARY, 'update') ? setMoveFolderIsModalOpen(true) : {}}><MaterialSymbolsRounded font='drive_file_move' size="20"/> Move to Folder</Button>
                                </Tooltip>
                            </Space>
                        </Space>
                    </div>
            }
            <MoveResourceModal isOpen={moveFolderModalOpen} onClose={() => setMoveFolderIsModalOpen(false)} resourceId={checkedResourcesId} handleResetAllSelectedRes={handleResetAllSelectedRes}/>
            <CreateDeckSlider
                action                  =   {"Create"}
                isOpen                  =   {showCreateDeck.visibility}
                onClose                 =   {() => setShowCreateDeck({visibility: false})}
                resources               =   {data?.resources.filter((_resource: any) => singleLinkCreateRes?.length > 0 ? singleLinkCreateRes.some((_id: any) => _id === _resource.uuid):  checkedResourcesId.some((_id: any) => _id === _resource.uuid))}
            />
        </>
    )
}

export default LibraryFiles