import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Space, Tag, Typography, theme } from 'antd';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { GlobalContext } from '../../../../globals';
import { FEATURE_ROOMS } from '../../../../config/role-permission-config';
import { PermissionCheckers } from '../../../../config/role-permission';
import { StrictModeDroppable } from '../../../../buyer-view/pages/journey/droppable';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';
import { RoomsAgent } from '../../api/rooms-agent';
import { R_USECASE_CATEGORIES, R_USECASES } from '../../api/rooms-query';

import SomethingWentWrong from '../../../../components/error-pages/something-went-wrong';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import Loading from '../../../../utils/loading';

const { Text }  =   Typography;

const UsecaseSelector = (props: { currentUsecase: any, setCurrentUsecase: any, setOpen: any, selectedRef: any, setShowEdit?: any }) => {

    const { currentUsecase, setCurrentUsecase, setOpen, selectedRef, setShowEdit }    =   props;

    const { roomId }    =   useParams();

    const { $user }    =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const { token: { colorPrimary } }       =   theme.useToken();
    const colorBgBlur                       =   "#f7fbff";

    const [selectedCategory, setSelectedCategory]   =   useState("all");
    const [usecaseData, setUsecaseData]             =   useState<any[]>([]);    

    const { data, error }                           =   useQuery(R_USECASES, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid    :   roomId
        },
    });

    const { data: usecase, loading: usecaseLoading,  error: usecaseError }  =   useQuery(R_USECASE_CATEGORIES, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid    :   roomId
        },

    });
    
    const handleListSelect = (usecase: any) => {
        setCurrentUsecase(usecase)
        setOpen(false)

        if (selectedRef.current) {
            selectedRef.current.blur();
        }
    }

    useEffect(() => {
        if(data) {
            let filteredUsecases = data._rUsecases;
            if(selectedCategory !== "all") {
                filteredUsecases = filteredUsecases.filter((usecase: any) => usecase.categories.some((category: any) => category.uuid === selectedCategory));
            }
            setUsecaseData(filteredUsecases);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if(data) {
            setUsecaseData(data._rUsecases)
        }
    }, [data])

    const updateDemoOrder = (result: any) => {
        
        if(result.source.index !== result.destination.index){
            RoomsAgent.updateDemoOrder({
                variables: {
                    usecaseUuid    :   result.draggableId,
                    order          :   result.destination.index
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess(`Usecase updated successfully`);
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleDeleteUsecase = (usecaseUuid: string) => {

        RoomsAgent.removeUsecase({
            variables: {
                usecaseUuid    :   usecaseUuid
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Usecase removed successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ?  `${colorBgBlur}` : "#fff",
        border          : isDraggingOver ?  `1px dashed ${colorPrimary}` : " 1px solid #fff",
        padding         : isDraggingOver ?  "10px"   : "5px",
        margin          : "5px",
        borderRadius    : "5px"
    });

    if( error || usecaseError ) return <SomethingWentWrong/>

    return (
        <Space direction='vertical' className='cm-width100' size={0}>
            <Space direction='vertical' className="cm-width100 cm-padding10 j-buyer-usecase-selector-header" size={10}>
                <div className='cm-font-fam500'>Category</div>
                <div className='j-usecases-category-listing'>
                    <div onClick={() => setSelectedCategory("all")} className={`j-buyer-usecase-group cm-cursor-pointer cm-font-size12 ${selectedCategory === "all" ? "selected" : "cm-secondary-text"}`}>All</div>
                    {
                        usecaseLoading ? <Loading/> : 
                            usecase && usecase._rUsecaseCategories.map((_category: any) => (
                                _category.usecasesCount > 0 && (
                                    <div onClick={() => setSelectedCategory(_category.uuid)} className={`j-buyer-usecase-group cm-cursor-pointer cm-font-size12 ${selectedCategory === _category.uuid ? "selected" : "cm-secondary-text"}`}>
                                        {_category.name}
                                    </div>
                                )
                            ))
                    }
                </div>
            </Space>

            <DragDropContext onDragEnd={(result) => {updateDemoOrder(result)}}>
                <StrictModeDroppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={{...getListStyle(snapshot.isDraggingOver), height: "calc(100vh - 500px)", minHeight: "180px"}} className='cm-overflow-y j-demo-dropdown-select-root'>
                            {
                                usecaseData && usecaseData.length > 0 ?
                                    (usecaseData.map((_usecase: any) => (
                                        <Draggable key={_usecase.uuid} draggableId={_usecase.uuid} index={_usecase.order}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                                    <Space className={`cm-cursor-pointer cm-width100 cm-flex-space-between j-demo-usecase-list-item ${currentUsecase && currentUsecase.uuid === _usecase.uuid ? "selected" : ""}`} size={18} onClick={() => handleListSelect(_usecase)}>
                                                        <div className='cm-flex-align-center'>
                                                            <Space direction='horizontal' size={4}>
                                                                {
                                                                    selectedCategory === "all" &&
                                                                        <div {...provided.dragHandleProps} onClick={(e) => e.stopPropagation()}>
                                                                            <MaterialSymbolsRounded font="drag_indicator" size="19" className='cm-cursor-dragger'/>
                                                                        </div>
                                                                }
                                                                <Space direction='vertical' size={0}>
                                                                    <Text style={{maxWidth: "600px", lineHeight: "15px"}} ellipsis={{tooltip: _usecase.title}} className='cm-font-size14 cm-font-fam400 cm-margin-left5'>{_usecase.title}</Text>
                                                                    <Text style={{maxWidth: "600px"}} ellipsis={{tooltip: _usecase.description}} className='cm-font-size11 cm-font-opacity-black-65 cm-font-fam400 cm-margin-left5'>{_usecase.description}</Text>
                                                                </Space>
                                                            </Space>
                                                        </div>
                                                        <Space size={10} className='cm-margin-right5'>
                                                            {
                                                                _usecase.categories.map((category: any) => (<Tag key={category.uuid} className='cm-font-size12 cm-transparent-bg-color'>{category.name}</Tag>))
                                                            }
                                                            {/* <MaterialSymbolsRounded font="tour" size="19" color={_usecase.hasWalkthrough ? "#3176CD" : "#3176CD52"}/>
                                                            <MaterialSymbolsRounded font="smart_display" size="19" color={_usecase.hasVideo ? "#DF2222" : "#DF222252"}/> */}
                                                            <Space>
                                                                {
                                                                    RoomEditPermission &&
                                                                        <Button size='small' className='cm-font-size11 cm-flex-center' style={{background: "#fff", lineHeight: "20px"}} onClick={(e) => {e.stopPropagation(); setShowEdit({visibility: true, usecase:_usecase})}}>
                                                                            Edit
                                                                        </Button>
                                                                }
                                                                {
                                                                    RoomEditPermission &&
                                                                        <Button size='small' className='cm-font-size11 cm-flex-center' style={{background: "#fff", lineHeight: "20px"}} onClick={(e) => {e.stopPropagation(); handleDeleteUsecase(_usecase.uuid)}}>
                                                                            Delete
                                                                        </Button>
                                                                }
                                                            </Space>
                                                        </Space>
                                                    </Space>
                                                </div>
                                            )}
                                        </Draggable>
                                    )))
                                :
                                    <div className='cm-light-text cm-flex-center j-demo-dropdown-select-empty-root' style={{minHeight: "180px", height: "calc(100vh - 500px)"}}>No usecases found</div>
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
        </Space>
    )
}

export default UsecaseSelector