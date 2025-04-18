import { useContext, useEffect, useState } from "react";
import { Button, message, Popconfirm, Space, theme, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import { StrictModeDroppable } from "../../../../buyer-view/pages/journey/droppable";
import { ACCOUNT_TYPE_GTM, DECK_EMPTY_RESOURCE_IMAGE } from "../../../../constants/module-constants";
import { FEATURE_DECK } from "../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { DECK_RESOURCES } from "../../api/library-query";
import { LibraryAgent } from "../../api/library-agent";
import { GlobalContext } from "../../../../globals";

import AnalyticsResourceViewerModal from "../../../../components/analytics-resource-viewer";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import LibraryModal from "../../../rooms/library/library-modal/library-modal";
import Loading from "../../../../utils/loading";

const { Text }  =   Typography

const DeckResources = (props: { deck: any }) => {

    const { deck }                          =   props
    
    const { token: { colorPrimary } }       =   theme.useToken();

    const colorBgBlur                       =   "#f7fbff";

    const { linkId }                        =   useParams()

    const { $user, $accountType  }          =   useContext(GlobalContext);

    const EditDeckPermission                =    PermissionCheckers.__checkPermission($user.role, FEATURE_DECK, 'update');

    const { data: resourceData, loading: resourceLoading }  =   useQuery(DECK_RESOURCES, {
        variables: {
            deckUuid   :   linkId
        },
        fetchPolicy: "network-only"
    });
    
    const [resources, setResources]                 =   useState([]);
    const [showLibraryModal, setShowLibraryModal]   =   useState<boolean>(false);
    const [resourceAnalytics, setResourceAnalytics] =   useState({
        isOpen  :   false,
        resource:   null
    })

    useEffect(() => {
        setResources(resourceData?.deckResources)
    }, [resourceData])

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor :   isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          :   isDraggingOver ? `1px dashed ${colorPrimary}` : " 1px solid #fff",
        borderRadius    :   "4px",
        padding         :   "1px",
    
    });

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index) {
            const reOrderStepList = Array.from(resources);
            const [reOrderedItem] = reOrderStepList.splice(result.source.index, 1);
            reOrderStepList.splice(result.destination.index, 0, reOrderedItem);
            setResources(reOrderStepList);

            LibraryAgent.updateDeckResourceOrder({
                variables: {
                    deckUuid        :   linkId,
                    resourceUuid    :   result.draggableId,
                    order           :   result.destination.index + 1
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        }
    }

    const handleAddResourcesClick = () => {
        setShowLibraryModal(true)
    }

    const handleShowHide = (resource: any) => {
        LibraryAgent.updateDeckResources({
            variables: {
                deckUuid                :   linkId,
                resourceUuid            :   resource.uuid,
                isHidden                :   !resource.isHidden
            },
            onCompletion: () => {
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })    
    }

    const handleDelete = (resource: any) => { 
        const messageLoading = message.loading("Deleting resource...", 0)
        LibraryAgent.DeleteDeckResources({
            variables: {
                deckUuid             :   linkId,
                resourceUuids        :   [resource.uuid],
            },
            onCompletion: () => {
                messageLoading()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })     
    }

    const handleSelectResource = (resources: any) => {

        const resourceInputs = resources.map((resource: any) => ({
            libraryResource  :  {
                uuid    : resource.uuid,
                pages   : resource.pages,
            }
        }));        

        const messageLoading = message.loading("Adding Resources...")
        LibraryAgent.addDeckResources({
            variables: {
                deckUuid             :      linkId,
                resourceInputs       :      resourceInputs
            },
            onCompletion: () => {
                messageLoading()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        setShowLibraryModal(false)
    }

    if(resourceLoading) return <Loading />

    return (
        <>
            <Space className="cm-flex-space-between cm-padding15">
                <Text className="cm-font-fam500 cm-font-size14 cm-secondary-text">Shared {$accountType === ACCOUNT_TYPE_GTM ? "Resources" : "Assets"} ({resources?.length ?? 0})</Text>
                {EditDeckPermission && <Button className="cm-icon-button cm-flex-center" icon={<MaterialSymbolsRounded className="cm-secondary-text" font="add" size="20" weight="400"/>} onClick={handleAddResourcesClick}><div className="cm-font-size14 cm-secondary-text">Add {$accountType === ACCOUNT_TYPE_GTM ? "Resources" : "Assets"}</div></Button>}
            </Space>
            <div style={{lineHeight: "1.5"}} className="cm-secondary-text cm-padding-inline15">You can hide or rearrange {$accountType === ACCOUNT_TYPE_GTM ? "resources" : "assets"} here, and the updates will be visible to the viewer.</div>
            <div className="cm-margin-top20 cm-padding-inline15" style={{height: "calc(100% - 140px)", overflow: "auto", width: "100%"}}>
                {
                    resources?.length > 0 ? 
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <StrictModeDroppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} style={{ ...getListStyle(snapshot.isDraggingOver)}}>
                                        {
                                            resources?.map((_resource: any, index: number) => (
                                                <Draggable key={_resource.uuid} draggableId={_resource.uuid} index={index} isDragDisabled={!EditDeckPermission}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} key={_resource.uuid} className={`${!_resource.isHidden ? "cm-background-white" : "cm-background-gray" } cm-border-radius6 cm-margin-bottom10 cm-padding-block10 cm-padding-inline10 cm-cursor-pointer j-library-deck-resource-card`} style={{ ...provided.draggableProps.style, border: "1px solid #E8E8EC"}} onClick={() => setResourceAnalytics({ isOpen: true, resource: _resource, })}>
                                                            <div className="cm-flex-align-center cm-margin-bottom15">
                                                                <div {...provided.dragHandleProps} onClick={(e) => e.stopPropagation()} className="cm-margin-right5">
                                                                    <MaterialSymbolsRounded font="drag_indicator" size="21" className="cm-cursor-dragger" color="#8b8b8b"/>
                                                                </div>
                                                                <Space size={15}>
                                                                    <div style={{ width: "55px", height: "30px"}} className="cm-border-radius6" >
                                                                        <img width={"100%"} height={"100%"} className="cm-width100 cm-border-radius4 cm-object-fit-contain" src={ _resource?.content?.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage( _resource.content.type ) } />
                                                                    </div>
                                                                    <Space direction="vertical">
                                                                        <Text className="cm-font-opacity-black-65" style={{ width: "200px" }} ellipsis={{ tooltip: _resource.title }} >{_resource.title}</Text>
                                                                    </Space>
                                                                </Space>
                                                            </div>
                                                            <div className="cm-width100 cm-flex-align-center cm-flex-space-between cm-gap15">
                                                                <div>
                                                                    <Space size={15} className="cm-flex-align-center">
                                                                        <Space size={6} className="cm-font-opacity-black-65 cm-flex" >
                                                                            <MaterialSymbolsRounded font={"timer"} size="18" weight="400" className="cm-font-opacity-black-65" />
                                                                                {_resource?.report?.timeSpent > 0 ? (
                                                                                    <Text className="cm-flex-align-center cm-whitespace-nowrap" style={{maxWidth: "130px"}} ellipsis={{tooltip: ""}}>
                                                                                        {CommonUtil.__getFormatDuration(_resource.report.timeSpent).map((_stamp: any) =>`${_stamp.value} ${_stamp.unit}`).join(" ")}
                                                                                    </Text>
                                                                                ) : (
                                                                                    "0"
                                                                                )}
                                                                        </Space>
                                                                        <Space size={6} className="cm-font-opacity-black-65 cm-flex" >
                                                                            <MaterialSymbolsRounded font={"visibility"} size="18" weight="400" className="cm-font-opacity-black-65" />
                                                                                {_resource?.report?.views > 0 ? (
                                                                                    <div className="cm-flex-align-center cm-whitespace-nowrap">
                                                                                        {_resource.report.views}
                                                                                    </div>
                                                                                ) : (
                                                                                    "0"
                                                                                )}
                                                                        </Space>
                                                                        <Space size={6} className="cm-font-opacity-black-65 cm-flex">
                                                                            <MaterialSymbolsRounded font={"download"} size="18" weight="400" className="cm-font-opacity-black-65" />
                                                                                {_resource?.report?.downloadCount > 0 ? (
                                                                                    <div className="cm-flex-align-center cm-whitespace-nowrap">
                                                                                        {_resource.report.downloadCount}
                                                                                    </div>
                                                                                ) : (
                                                                                    "0"
                                                                                )}
                                                                        </Space>
                                                                    </Space>
                                                                </div>
                                                                <Space>
                                                                    {EditDeckPermission && (
                                                                        <>
                                                                            <Button className="cm-icon-button cm-flex-center cm-border-radius6" title={_resource.isHidden ? "Show" : "Hide"} style={{height: "28px", width: "28px"}} icon={ <MaterialSymbolsRounded font={_resource.isHidden ? "visibility" : "visibility_off" } size="16" weight="400" />}onClick={(e) => {e.stopPropagation(), handleShowHide(_resource);}}/>
                                                                            <Popconfirm
                                                                                placement           =   "bottomLeft"
                                                                                title               =   {<div className="cm-font-fam500">Remove resource</div>}
                                                                                description         =   {<div className="cm-font-size13">Are you sure you want to remove this resource from this link?</div>}
                                                                                icon                =   {null}
                                                                                okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0", lineHeight:"22px"}, danger: true}}
                                                                                cancelButtonProps   =   {{style: {fontSize: "12px", lineHeight:"22px"}, danger: true, ghost: true}}
                                                                                okText              =   {"Delete"}
                                                                                onCancel            =   {(event: any) => {
                                                                                    event.stopPropagation()
                                                                                }}
                                                                                onConfirm           =   {(event: any) => {
                                                                                    event.stopPropagation()
                                                                                    handleDelete(_resource)
                                                                                }}
                                                                            >
                                                                                <Button style={{borderColor: "#ff4d4f87", height: "28px", width: "28px"}} danger className="cm-icon-button cm-flex-center cm-border-radius6" icon={ <MaterialSymbolsRounded font={"delete"} size="16" weight="400" color="#ff4d4fcf"/>} onClick={(e) => { e.stopPropagation()}} />
                                                                            </Popconfirm>
                                                                        </>
                                                                    )}
                                                                </Space>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>
                        </DragDropContext>
                    :
                        <Space direction="vertical" className="cm-flex-center cm-height100">
                            <img height={70} width={70} src={DECK_EMPTY_RESOURCE_IMAGE} alt="No resources found" />
                            <Text className="cm-font-size16 cm-margin-top20 cm-secondary-text">Add {$accountType === ACCOUNT_TYPE_GTM ? "resources" : "assets"} here</Text>
                        </Space>
                }
            </div>
            <LibraryModal
                isOpen                  =   {showLibraryModal}
                onClose                 =   {() => setShowLibraryModal(false)}
                getSelectedResourceId   =   {(resources: any) => {handleSelectResource(resources); setShowLibraryModal(false)}}   
                initialFilter           =   {[]}
                multipleResource        =   {true}
                pdfCustomPageSelection  =   {{isPDFSelection: true, type: deck, module: "deck"}}
                setIsDrawerOpen         =   {setShowLibraryModal}
                resourceViewMode        =   {"list_view"}
            />
            <AnalyticsResourceViewerModal 
                module      =   {{"type": "deck", "deckId": linkId ?? ""}} 
                isOpen      =   {resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({isOpen: false, resource: null})} 
                resource    =   {resourceAnalytics.resource}/>
        </>
    );
  };
  
  export default DeckResources;
  