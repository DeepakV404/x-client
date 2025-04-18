import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Badge, Button, Dropdown, Space, theme, Typography } from "antd"
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import { StrictModeDroppable } from "../../../../buyer-view/pages/journey/droppable";
import { PermissionCheckers } from "../../../../config/role-permission"
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { SettingsAgent } from "../../api/settings-agent";
import { ROOM_STAGES } from "../../api/settings-query";
import { GlobalContext } from "../../../../globals";

import DeleteConfirmation from "../../../../components/confirmation/delete-confirmation";
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import OptionsEditModal from "../options-edit-modal";
import OptionsAddModal from "../options-add-modal";
import Loading from "../../../../utils/loading";

const { Text } = Typography

const RoomStages = () => {

    const { token: { colorPrimary } }     =   theme.useToken();

    let colorBgBlur = "#f7fbff";

    const { $user } = useContext(GlobalContext);

    const [roomStageData, setRoomStageData]     =   useState([]);
    const [showModal, setShowModal]             =   useState<any>({
        visible         :   false,
        type            :   {name: "", op: ""},
        currentStage    :   null
    });

    const [deleteState, setDeleteState]     =   useState({
        visibility      :   false,
        currentCategory :   null 
    });

    const [showEditOptionModal, setShowEditOptionModal]     =   useState<any>({
        visible                 :   false,
        type                    :   {name: "", op: ""},
        currentResourceCategory :   ""
    });

    const { data, loading, error } = useQuery(ROOM_STAGES, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        setRoomStageData(data?.roomStages)
    },[data])
    
    const getMenuItems = (stage: any) => {
        return ([
            PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).update && stage.uuid !== "_rsOpen" && stage.uuid !== "_rsClosedLost" && stage.uuid !== "_rsClosedWon" ?
            {
                key: 'edit',
                icon: <MaterialSymbolsRounded font="edit" size="16" />,
                label: (
                    <span>Edit</span>
                ),
                onClick: () => {
                    setShowEditOptionModal({ visible: true, type: { name: "room_stage", op: "edit" }, currentResourceCategory: stage })
                },
            } : null,
            // PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).delete && stage.uuid !== "_rsOpen" && stage.uuid !== "_rsClosedLost" && stage.uuid !== "_rsClosedWon" ?
            // {
            //     key     :   'delete',
            //     icon    :   <MaterialSymbolsRounded font="delete" size="16" />,
            //     danger  :   true,
            //     label   :   "Delete",
            //     onClick :   () => {
            //         setDeleteState({
            //             visibility: true,
            //             currentCategory: stage
            //         })
            //     },
            // } : null,
        ])
    };

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor :   isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          :   isDraggingOver ? `1px dashed ${colorPrimary}` : " 1px solid #fff",
        borderRadius    :   "4px",
        padding         :   "2px",
        height          :   "calc(100% - 55px)",
        overflow        :   "auto"
    });

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index) {
            const reOrderStageList = Array.from(roomStageData);
            const [reOrderedItem] = reOrderStageList.splice(result.source.index, 1);
            reOrderStageList.splice(result.destination.index, 0, reOrderedItem);
            setRoomStageData(reOrderStageList);
            SettingsAgent.updateRoomStageOrder({
                variables: {
                    roomStageUuid   :   result.draggableId,
                    order           :   (result.destination.index + 1)
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleDelete = (stage: any) => {
        SettingsAgent.deleteRoomStage({
            variables: {
                roomStageUuid    :  stage.uuid 
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Category deleted successfully");
                setDeleteState({visibility: false, currentCategory: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                setDeleteState({visibility: false, currentCategory: null})
            }
        })  
    }

    if (error) return <SomethingWentWrong />

    return (
        <>
            <div className="cm-height100">
                <div className="j-setting-header cm-flex-space-between-center" style={{ height: "53px" }}>
                    <div className="cm-font-size16 cm-font-fam500">Room Stages</div>
                    {
                        PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).create
                        ?
                            <Button type='primary' className="j-setting-footer-btn cm-flex-center" onClick={() => setShowModal({ visible: true, currentStage: null })}>
                                Add
                            </Button>
                        :
                            null
                    }
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <StrictModeDroppable droppableId="steps">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref         =   {provided.innerRef}
                            style       =   {getListStyle(snapshot.isDraggingOver)}
                        >
                            {
                                data
                                ?
                                    (
                                        roomStageData?.length > 0 ?
                                            roomStageData.map((_roomStage: any, stageIndex: number) => (
                                                <Draggable key={_roomStage.uuid} draggableId={_roomStage.uuid} index={stageIndex} isDragDisabled={!PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).update}>
                                                    {(provided) => (
                                                            <div className='j-category-list-item cm-cursor-pointer cm-width100 cm-flex-space-between' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <Space>
                                                                    <div className='cm-cursor-dragger' {...provided.dragHandleProps} onClick={(e) => e.stopPropagation()}>
                                                                        <MaterialSymbolsRounded font='drag_indicator' size='16' color='#7a7a7a'/>
                                                                    </div>
                                                                    <Badge color={_roomStage?.properties?.color}></Badge>
                                                                    <Text style={{ maxWidth: "500px" }} ellipsis={{ tooltip: _roomStage?.label }}>{_roomStage?.label}</Text>
                                                                </Space>
                                                                {
                                                                    (PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).update || PermissionCheckers.__checkUsecaseCategoryPermisson($user.role).delete) && _roomStage.uuid !== "_rsOpen" && _roomStage.uuid !== "_rsClosedLost" && _roomStage.uuid !== "_rsClosedWon"  ?
                                                                        <Dropdown menu={{ items: getMenuItems(_roomStage) }} trigger={["click"]} className='show-on-hover-icon' overlayStyle={{ minWidth: "150px" }}>
                                                                            <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer">
                                                                                <MaterialSymbolsRounded font="more_vert" size="22" className='cm-secondary-text' />
                                                                            </div>
                                                                        </Dropdown>
                                                                    :
                                                                        null
                                                                }
                                                            </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        :
                                            <div className='cm-empty-text cm-flex-center' style={{ height: "calc(100vh - 160px)" }}>No Room Stages found</div>
                                    )
                                :
                                    (loading ? <div style={{ height: "calc(100vh - 160px)" }}><Loading /></div> : null)
                            }
                            {provided.placeholder}
                        </div>
                    )}
                    </StrictModeDroppable>
                </DragDropContext>
            </div>
            <OptionsAddModal
                isOpen  =   {showModal.visible}
                onClose =   {() => setShowModal({ visible: false, currentStage: null })}
                type    =   {{name: "room_stage", op: "add"}}
            />
            <OptionsEditModal
                isOpen                  =   {showEditOptionModal.visible && showEditOptionModal.type.op === "edit"}
                onClose                 =   {() => setShowEditOptionModal({visible: false, type: {name: "", op: ""}})}
                type                    =   {showEditOptionModal.type}
                currentResourceCategory =   {showEditOptionModal.currentResourceCategory}
            />
            <DeleteConfirmation 
                isOpen      =   {deleteState.visibility}
                onOk        =   {() => handleDelete(deleteState.currentCategory)}
                onCancel    =   {() => {setDeleteState({visibility: false, currentCategory: null})}}
                header      =   "Delete Category"
                body        =   "Are you sure you want to delete this room stage? This cannot be undone."
            />
        </>
    )
}

export default RoomStages