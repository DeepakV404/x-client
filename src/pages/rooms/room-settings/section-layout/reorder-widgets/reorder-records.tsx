import { useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { Drawer, List, Space, Typography, theme } from "antd";

import { StrictModeDroppable } from "../../../../../buyer-view/pages/journey/droppable";
import { ERROR_CONFIG } from "../../../../../config/error-config";
import { CommonUtil } from "../../../../../utils/common-util";
import { RoomsAgent } from "../../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../../components/MaterialSymbolsRounded";
import DemoUsecaseNotFound from "../../../../../components/no-result-found";

const { Text } = Typography;

export const WIDGET_TYPE_TITLE_CONFIG: any = {
    "TEXT"          :   "Text",
    "RESOURCE"      :   "Resource",
    "BUTTON"        :   "Button",
    "CAROUSEL"      :   "Carousel",
    "EMBEDDED"      :   "Embed",
    "FEATURE"       :   "Feature",
    "CONTACT_CARD"  :   "Contact Card",
    "TEAMS_CARD"    :   "Profile Board",
    "FILE_UPLOAD"   :   "File Upload",
    "HEADER"        :   "Header"
}

const ReorderWidgets= (props : any) => {

    const { isOpen, onClose, widgets, sectionId } = props;

    const { token: { colorPrimary } } = theme.useToken();
    let colorBgBlur = "#f7fbff";

    const [sectionData, setSectionData]     =   useState<any>([])

    useEffect(() => {
        setSectionData(widgets)
    }, [widgets])

    const handleOnDragEnd = (result: any) => {
        if(result.source.index !== result.destination.index) {
            const reOrderStepList = Array.from(sectionData);
            const [reOrderedItem] = reOrderStepList.splice(result.source.index, 1);
            reOrderStepList.splice(result.destination.index, 0, reOrderedItem);
            setSectionData(reOrderStepList);

            const recordId = widgets[result.source.index].uuid;
            RoomsAgent.widgetReOrder({
                variables: {
                    sectionUuid : sectionId, 
                    widgetUuid  : recordId,
                    targetOrder : (result.destination.index + 1)
                },
                onCompletion: () => {
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }

    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor : isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          : isDraggingOver ? `1px dashed ${colorPrimary}` : " 1px solid #fff",
    });

    return (
        <Drawer className="j-demo-creation-slider" width={500} onClose={onClose} open={isOpen} headerStyle={{ display: "none" }} destroyOnClose >
            <div className="j-demo-form-header cm-font-fam600 cm-font-size16">
                <Space className="cm-width100 cm-flex-space-between">
                    Reorder Your Widgets
                    <MaterialSymbolsRounded font="close" size="20" className="cm-cursor-pointer" onClick={() => onClose()} />
                </Space>
            </div>
            <div className="cm-padding15 cm-overflow-auto" style={{ height: "calc(100% - 100px)" }}>
                {
                    sectionData.length > 0 
                    ?
                    (
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <StrictModeDroppable droppableId="reorder">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        <List size="small" itemLayout="horizontal" style = {{...getListStyle(snapshot.isDraggingOver), borderRadius: "8px"}}>
                                            {sectionData.map((record: any, index: number) => (
                                                <Draggable key={record.uuid} draggableId={record.uuid} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref =   {provided.innerRef}
                                                            {...provided.draggableProps}
                                                        >
                                                            <List.Item className="j-room-record-item cm-margin-bottom10">
                                                                <Space>
                                                                    <div className="cm-cursor-dragger" {...provided.dragHandleProps} onClick={(e) => e.stopPropagation()}>
                                                                        <MaterialSymbolsRounded font="drag_indicator" size="18" className="cm-light-text" />
                                                                    </div>
                                                                    <div className="cm-flex-align-center">
                                                                        <div style={{width: "90px"}} className="cm-flex-align-center cm-font-size12">{WIDGET_TYPE_TITLE_CONFIG[record.type]}</div>
                                                                        <Text style={{maxWidth: "300px"}} ellipsis={{tooltip: record.title.value.replace(/<[^>]*>/g, '')}} className="cm-font-size13 cm-font-opacity-black-65">| {record.title.value && record.title.value.replace(/<[^>]*>/g, '') !== "" ? record.title.value.replace(/<[^>]*>/g, '') : 'No Title'}</Text>
                                                                    </div>
                                                                </Space>
                                                            </List.Item>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                                {provided.placeholder}
                                        </List>
                                    </div>
                                )}
                            </StrictModeDroppable>
                        </DragDropContext>
                    ) 
                : 
                    (
                        <div className="cm-flex-justify-center cm-height100">
                            <DemoUsecaseNotFound message={"No Widgets Found"} />
                        </div>
                    )
                }
            </div>
        </Drawer>
    );
};

export default ReorderWidgets;
