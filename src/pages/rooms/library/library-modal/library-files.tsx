import { capitalize } from 'lodash';
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Col, Dropdown, Image, MenuProps, Row, Space, Table, Tag, Typography } from "antd"

import { GlobalContext } from "../../../../globals";
import { CREATED_AT, SORT_BY_CONFIG } from "../../../library/config/sort-by-config";
import { RESOURCE_COUNT, RESOURCE_TYPE_PDF } from "../../../../constants/module-constants";
import { RESOURCE_TYPE_CONFIG } from "../../../library/config/resource-type-config";
import { LibraryModalContext, LibraryModalView } from "./library-modal";
import { RESOURCES } from "../../../library/api/library-query";
import { CommonUtil } from "../../../../utils/common-util";

import SellerResourceViewerModal from '../../../resource-viewer/seller-resource-viewer-modal';
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import ResourceCard from "./resource-card-select";
import Loading from "../../../../utils/loading";

const { Text }  =   Typography;

const LibraryFiles = (props: {search: string, folderId: string, setIsResourceOpen:any }) => {

    const { $categories }       =   useContext(GlobalContext);

    const { addMultipleResource, module, onAddResource, setLibraryView, pdfCustomPageSelection, selectedResources, setSelectedResources, resourceView, selectedRowKeys, setSelectedRowKeys }  =   useContext<any>(LibraryModalContext);

    const { search, folderId, setIsResourceOpen } =   props;

    const [_getResources, { data, loading }]   =   useLazyQuery(RESOURCES, {fetchPolicy: "network-only"});

    const [sortBy, setSortBy]                               =   useState({key: CREATED_AT, displayname: "Created at"});
    const [selectedResourceType, setSelectedResourceType]   =   useState<string>("ALL")
    const [selectedCategory, setSelectedCategory]           =   useState<string[]>([]);
    const [isAddToRoomChecked, setIsAddToRoomChecked]       =   useState(false);

    const [viewFile, setViewFile]           =   useState<any>({
        isOpen      :   false,
        onClose     :   () => {},
        resourceInfo:   ""
    });

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

    const resourceClicked = (e: any, resource: any) => {        
        e.stopPropagation();        
        if (addMultipleResource) {
            setSelectedRowKeys((prevKeys: any) => {
                if (prevKeys.includes(resource.uuid)) {
                    return prevKeys.filter((key: any) => key !== resource.uuid);
                } else {
                    return [...prevKeys, resource.uuid];
                }
            }); 
            setSelectedResources((prevSelectedResource: any) => {
                if (prevSelectedResource.some((selectedResource: any) => selectedResource.uuid === resource.uuid)) {
                    return prevSelectedResource.filter((selectedResource: any) => selectedResource.uuid !== resource.uuid);
                } else {
                    return [...selectedResources, resource];
                }
            });            
        } else if(pdfCustomPageSelection?.isPDFSelection) {
            setSelectedResources([resource])
            setSelectedRowKeys([resource.uuid]) 
        } else {
            onAddResource(resource, isAddToRoomChecked);
        }     
    };

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

    const _getOptions: any = (options: any) => {

        const categories: MenuProps['items'] = [];

        options.map((_option: any) => {
            let option = {
                "key"      :   _option.uuid,
                "label"    :   _option.name,
                "onClick"   :   (event: any) => {
                    event.domEvent.stopPropagation()
                }
            }
            categories.push(option)
        })
        categories.shift();
        return categories
    }

    const renderers = {
        "_title"  :   (_: any, _resource: any) => {
            return (
                <div className="cm-flex-align-center cm-width100 cm-gap15">
                    <Image style={{borderRadius: "10px"}} height={40} width={60} src={CommonUtil.__getResourceFallbackImage(_resource.content.type)} preview={false}/>
                    <Text className='cm-font-fam500' ellipsis={{tooltip: _resource.title}} style={{width: "100%"}}>{_resource.title}</Text>
                </div>
            )
        },
        "_analytics"  :   (_: any, _resource: any) => {
            return (
                <Space size={10}>
                    <MaterialSymbolsRounded font='share' size='18'/>
                    <span className='cm-font-fam500 cm-whitespace-no-wrap'>{_resource.report.shareCount}</span>
                    <MaterialSymbolsRounded font='visibility' size='18'/>
                    <span className='cm-font-fam500'>{_resource.report.uniqueViews}</span>
                </Space>
            )
        },
        "_type"  :   (_: any, _resource: any) => {
            return (
                <Text>{capitalize(_resource.type)}</Text>
            )
        },
        "_category"  :   (_: any, _resource: any) => {            
            return (
                _resource?.categories && _resource?.categories?.length > 0
                ?
                    <div className="cm-flex-align-center cm-margin-bottom5">
                        <Tag style={{maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis"}} color="blue" onClick={(event) => event?.stopPropagation()}>{_resource?.categories[0].name}</Tag>
                        {
                            _resource?.categories?.length > 1
                            ?
                                (
                                    <Dropdown menu={{items : _getOptions(_resource.categories)}} placement="bottom">
                                        <Tag color='blue' onClick={(event) => event?.stopPropagation()}>{"+ " + (_resource?.categories?.length - 1)}</Tag>
                                    </Dropdown>
                                )
                            :
                                null
                        }
                    </div>
                :
                    <span>-</span>
            )
        },
        "_action"  :   (_: any, _resource: any) => {                        
            const getName = () => {
                const pageSelectedresource  = selectedResources.filter((_item: any) => _item.uuid === _resource.uuid && _item.pages);
                if(pageSelectedresource && pageSelectedresource.length > 0){
                    return `${pageSelectedresource[0].pages.length} Pages`
                }
                return "Select Pages"
            }
            return (
                <Space size={20} className='cm-flex-space-between cm-width100'>
                    <Text className='j-hyperlink-text cm-cursor-pointer' onClick={() => setViewFile({isOpen : true, onClose : () => setViewFile({isOpen: false, onClose: () => {}, resourceInfo: ""}), resourceInfo : _resource})}>Preview</Text>
                    {_resource.content.type === RESOURCE_TYPE_PDF && (pdfCustomPageSelection?.isPDFSelection || false) && 
                        <Text className='j-hyperlink-text cm-cursor-pointer cm-margin-right10' onClick={() => handleSelectPageClick(_resource)}>
                            {getName()}
                        </Text>
                    }
                </Space>
            )
        },
    }

    const columns: any = [
        {
            title       :   <div className='cm-font-fam500'>Name</div>,
            dataIndex   :   'title',
            key         :   'title',
            render      :   renderers._title,
            ellipsis    :   true,
        },
        {
            title       :   <div className='cm-font-fam500'></div>,
            key         :   'analytics',
            width       :   "150px",
            render      :   renderers._analytics,
        },
        {
            title       :   <div className='cm-font-fam500'>Type</div>,
            key         :   'type',
            width       :   "120px",
            render      :   renderers._type,
        },
        {
            title       :   <div className='cm-font-fam500'>Category</div>,
            key         :   'category',
            width       :   "200px",
            render      :   renderers._category,
        },
        {
            title       :   <div className='cm-font-fam500'>Action</div>,
            key         :   'action',
            width       :   "200px",
            render      :   renderers._action,
        },
    ]

    const handleSelectPageClick = (selectedResource: any) => {
        setSelectedRowKeys((prevKeys: any) => {
            if (!prevKeys.includes(selectedResource.uuid)) {                
                return [...prevKeys, selectedResource.uuid];
            }
            return prevKeys;
        });
        setSelectedResources((prev: any) => {
            if (!prev.some((resource: any) => resource.uuid === selectedResource.uuid)) {                
                return [...prev, selectedResource];
            }
            return prev; 
        });
        setLibraryView({
            view                :   LibraryModalView.SELECT_PAGE,
            selectedResource    :   selectedResource
        })
    }

    return(
        <>
            <Space className="cm-flex-space-between cm-margin-top20">
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
                            Categories: {
                                selectedCategory.length ?
                                    <span className="cm-font-fam500">{selectedCategory.length} <span className="cm-text-size10">(selected)</span></span>
                                :   
                                    <span className="cm-font-fam500">All</span>
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
            <div className="cm-margin-top20" style={{height: "calc(100% - 210px)", marginBottom: "100px"}}>
                {
                    loading ? 
                        (
                            <div style={{height: "calc(100vh - 600px)"}} className="cm-flex-center cm-width100">
                                <Loading/>
                            </div>
                        )
                    : 
                        (
                            data && data.resources.length > 0 ?
                                resourceView === "grid_view" 
                                    ?
                                        <Row gutter={[20, 20]} style={{marginBottom: selectedResources.length > 0 ? "75px" : "0"}}>
                                            {
                                                data.resources.map((_resource: any) => (
                                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }}>
                                                        <ResourceCard 
                                                            key                 =   {`${_resource._id}card`}
                                                            cardId              =   {_resource._id}
                                                            name                =   {_resource.title}
                                                            fileType            =   {_resource.type}
                                                            thumbnail           =   {_resource.content.thumbnailUrl}
                                                            createdAt           =   {_resource.createdAt}
                                                            downloadCount       =   {_resource.report.downloadCount}
                                                            viewCount           =   {_resource.report.shareCount}   
                                                            selected            =   {false}     
                                                            resource            =   {_resource}
                                                            onResourceClick     =   {(_, resource) => resourceClicked(event, resource)}
                                                            multipleResource    =   {addMultipleResource}
                                                            isSelected          =   {selectedResources.some((selectedResource: any) => selectedResource.uuid === _resource.uuid)}
                                                        />
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    :   
                                    <Table
                                        size            =   "small"
                                        rowClassName    =   "cm-cursor-pointer"
                                        columns         =   {columns}
                                        pagination      =   {false}
                                        dataSource      =   {data.resources}
                                        rowKey          =   {(record) => record.uuid}
                                        rowSelection    =   {{
                                            selectedRowKeys,
                                            onChange: (keys: React.Key[]) => {
                                                setSelectedRowKeys(() => {
                                                    return addMultipleResource ? keys : keys.slice(-1);
                                                });
                                    
                                                setSelectedResources((prevSelectedResources: any) => {
                                                    if (addMultipleResource) {
                                                        const selectedUUIDs = new Set(keys);
                                                        const updatedResources = data.resources.filter((resource: any) => selectedUUIDs.has(resource.uuid)).map((resource: any) => {
                                                            const existingResource = prevSelectedResources.find((prevResource: any) => prevResource.uuid === resource.uuid);
                                                            if (existingResource) {
                                                                return {...existingResource, pages: resource.pages || existingResource.pages};
                                                            }
                                                            return resource;
                                                        });
                                                        return [...updatedResources];
                                                    } else {
                                                        const newSelectedKey = keys[keys.length - 1];
                                                        const updatedResource = data.resources.find((resource: any) => resource.uuid === newSelectedKey);
                                                        if (!updatedResource) return prevSelectedResources;
                                                        const existingResource = prevSelectedResources.find((prevResource: any) => prevResource.uuid === updatedResource.uuid);
                                                        return existingResource ? [...prevSelectedResources.filter((res: any) => res.uuid !== updatedResource.uuid), { ...existingResource, pages: updatedResource.pages || existingResource.pages }]: [...prevSelectedResources, updatedResource];
                                                    }
                                                });
                                            },
                                        }}
                                        onRow   =   {(record) => ({
                                            onClick: () => {
                                                const isSelected = selectedRowKeys.includes(record.uuid);
                                                const newSelectedKeys = addMultipleResource ? isSelected ? selectedRowKeys.filter((key: string) => key !== record.uuid) : [...selectedRowKeys, record.uuid] : [record.uuid];
                                                setSelectedRowKeys(newSelectedKeys);
                                                setSelectedResources((prevSelectedResources: any) => {
                                                    if (addMultipleResource) {
                                                        const selectedUUIDs = new Set(newSelectedKeys);
                                                        const updatedResources = data.resources.filter((resource: any) => selectedUUIDs.has(resource.uuid)).map((resource: any) => {
                                                            const existingResource = prevSelectedResources.find((prevResource: any) => prevResource.uuid === resource.uuid);
                                                            if (existingResource) {
                                                                return {...existingResource, pages: resource.pages || existingResource.pages};
                                                            }
                                                            return resource;
                                                        });
                                                        return [...updatedResources];
                                                    } else {
                                                        const updatedResource = data.resources.find((resource: any) => resource.uuid === record.uuid);
                                                        if (!updatedResource) return prevSelectedResources;
                                                        const existingResource = prevSelectedResources.find((prevResource: any) => prevResource.uuid === updatedResource.uuid);
                                                        return existingResource ? [...prevSelectedResources.filter((res: any) => res.uuid !== updatedResource.uuid), { ...existingResource, pages: updatedResource.pages || existingResource.pages }] : [updatedResource];
                                                    }
                                                });
                                            },
                                        })}
                                    />
                                
                                
                            : 
                                (
                                    <Space direction="vertical" style={{height: "100%"}} className="cm-flex-center cm-secondary-text cm-width100">
                                        <div className='cm-font-fam500 cm-font-opacity-black-85 cm-font-size16'>No resources found</div>
                                        <div className='cm-font-opacity-black-67 cm-font'>Add resources to share with your buyers</div>
                                        {
                                            data?.resources.length === 0 && search === "" && 
                                                <Button type='primary' className="cm-cursor-pointer cm-button-icon cm-margin-top15" onClick={() => setIsResourceOpen(true)}>
                                                    <Space><MaterialSymbolsRounded font='upload' size='20'/>Upload</Space>
                                                </Button>
                                        }
                                        {
                                            (selectedCategory.length > 0 || sortBy.key !== CREATED_AT) && 
                                                <Button className="cm-margin-top15 cm-cursor-pointer" onClick={() => {setSortBy({key: CREATED_AT, displayname: "Created at"}); setSelectedCategory([])}}>
                                                    Reset filters
                                                </Button>
                                        }
                                    </Space>
                                )
                        )
                }
            </div>
            { 
                selectedResources?.length > 0 &&
                    <div className={"j-bottom-resource-added-card cm-flex-space-between cm-padding15"}>
                        {
                            module && module === "templates" ?
                                <Space>
                                    <Checkbox onChange={(event) => setIsAddToRoomChecked(event.target.checked)}></Checkbox>
                                    <span className="cm-flex-align-center" style={{color: "#fff"}}>Add resources to the rooms created from this template</span>
                                </Space>
                            :
                                <Text className="cm-flex-align-center cm-font-size16" style={{color: "#fff"}}>{selectedResources.length} Selected</Text>
                        }
                        <Space className="cm-flex-justify-end">
                            <Button className="cm-font-size14" ghost onClick={() => {setSelectedResources([]); setSelectedRowKeys([])}}>
                                Cancel
                            </Button>
                            {
                                selectedResources.length === 1 && selectedResources[0]?.content.type === RESOURCE_TYPE_PDF && pdfCustomPageSelection && resourceView === "grid_view" &&
                                    <Button className="cm-font-size14" onClick={() => handleSelectPageClick(selectedResources[0])}>
                                        Select Pages
                                    </Button>    
                            }
                            <Button type="primary" className="cm-flex-center cm-font-size14" onClick={() => onAddResource(selectedResources, isAddToRoomChecked)}>
                                Add Resource {module && module === "templates" &&  `(${selectedResources.length})`}
                            </Button>
                        </Space>
                    </div>
            }
            <SellerResourceViewerModal
                isOpen          =   {viewFile.isOpen}
                onClose         =   {viewFile.onClose}
                fileInfo        =   {viewFile.resourceInfo}
                track           =   {false}
            />
        </>
    )
}

export default LibraryFiles