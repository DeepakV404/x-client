import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { Button, Collapse, List, Space, Switch, Typography, theme } from "antd";

import { StrictModeDroppable } from "../../../../../../buyer-view/pages/journey/droppable";
import { RoomTemplateAgent } from "../../../../../templates/api/room-template-agent";
import { CAROUSEL_EMPTY, MODULE_TEMPLATE } from "../../../../../../constants/module-constants";
import { WidgetsAgent } from "../../../../../custom-sections/api/widgets-agent";
import { ERROR_CONFIG } from "../../../../../../config/error-config";
import { CommonUtil } from "../../../../../../utils/common-util";
import { RoomsAgent } from "../../../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../../../components/MaterialSymbolsRounded";
import LibraryModal from "../../../../library/library-modal/library-modal";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import WidgetTitle from "../../widget-title";

const { Text }      =   Typography;

const EditCarouselWidget = (props : { onClose: any, sectionId: string, widget: any, module: any }) => {

    const { widget, sectionId, onClose, module } = props;

    const { token: { colorPrimary } } = theme.useToken();
    let colorBgBlur = "#f7fbff";

    const [componentsList, setComponentsList]     =   useState([]);
    const [showLibrary, setShowLibrary]         =   useState<boolean>(false);

    const __widget          =   { ...widget }
    const __titleProperty   =   { ...__widget.title }

    useEffect(() => {
        setComponentsList(widget.components)
    }, [widget])

    const handleTitleEnable = (state: any, event: any) => {
        event.stopPropagation();

        __titleProperty["enabled"] = state;

        WidgetsAgent.updateWidgetNoRefetch({
            variables: {
                sectionUuid : sectionId,
                widgetUuid  : __widget.uuid,
                input: {
                    title: __titleProperty,
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    }

    const handleTitleChangeDebounce = (debounce((title: any) => {
        handleTitleChange(title);
    }, 1000));

    const handleTitleChange = (title: string) => {

        __titleProperty["value"] = title;

        WidgetsAgent.updateWidgetNoRefetch({
            variables: {
                sectionUuid : sectionId,
                widgetUuid  : __widget.uuid,
                input: {
                    title: __titleProperty,
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    };


    const handleOnDragEnd = (result: any) => {

        if(result.source.index !== result.destination.index) {
            const reOrderStepList = Array.from(componentsList);
            const [reOrderedItem] = reOrderStepList.splice(result.source.index, 1);
            reOrderStepList.splice(result.destination.index, 0, reOrderedItem);
            setComponentsList(reOrderStepList);
            RoomsAgent.componentReOrder({
                variables: {
                    componentUuid   : result.draggableId, 
                    widgetUuid      : __widget.uuid,
                    targetOrder     : (result.destination.index + 1)
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Order updated successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }   
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor: isDraggingOver ? `${colorBgBlur}` : "#fff",
        border: isDraggingOver ? `1px dashed ${colorPrimary}` : " 1px solid #fff",
        padding: isDraggingOver ? "5px" : "0px",
    });

    const handleDeleteUser = (id: number) =>{
        WidgetsAgent.deleteComponent({
            variables: {
                widgetUuid      : __widget.uuid,
                componentUuid   : __widget.components[id - 1].uuid,
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    const handleSelectedResource = (resources: any) => {
        resources.map((resource: any) => {
            if(module === MODULE_TEMPLATE){
                RoomTemplateAgent.AddResourceComponent({
                    variables: {
                        widgetUuid      :   __widget.uuid,
                        resourceInput   :  {
                            uuid :  resource.uuid
                        }
                    },
                    onCompletion: () => {
                        setShowLibrary(false)
                    },
                    errorCallBack: () => {}
                })
            }else{
                RoomsAgent.AddResourceComponent({
                    variables: {
                        widgetUuid      :   __widget.uuid,
                        resourceInput   :  {
                            uuid :  resource.uuid
                        }
                    },
                    onCompletion: () => {
                        setShowLibrary(false)
                    },
                    errorCallBack: () => {}
                })
            }
        })
    }

    return (
        <>
            <div className="j-demo-form-header cm-font-fam600 cm-font-size16">
                <Space className="cm-width100 cm-flex-space-between">
                    Edit Carousel Widget
                    <MaterialSymbolsRounded font="close" size="20" className="cm-cursor-pointer" onClick={() => onClose()} />
                </Space>
            </div>
            <div className="cm-padding15 cm-overflow-auto" style={{ height: "calc(100% - 100px)" }}>
                <Collapse
                    className    =  "cm-margin-bottom15"
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel header={<div className="cm-width100 cm-flex-space-between cm-flex-align-center">Title<Switch size='small' defaultValue={__titleProperty.enabled} onChange={handleTitleEnable}/></div>} key={__widget.uuid}>
                        <WidgetTitle value={__titleProperty.value} onChange={handleTitleChangeDebounce} placeholder="Title" bordered/>
                    </CollapsePanel>
                </Collapse>
                <Collapse
                    defaultActiveKey={["carousel"]}
                    expandIcon   =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel  header={<div className="cm-width100 cm-flex-space-between">Carousel<Switch size='small' defaultValue={true} disabled/></div>} key={"carousel"}> 
                        {
                            widget.components.length > 0 
                            ?
                            (
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <StrictModeDroppable droppableId="reorder">
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef}>
                                                <List size="small" itemLayout="horizontal" style = {{...getListStyle(snapshot.isDraggingOver), borderRadius: "8px"}}>
                                                    {componentsList.map((record: any, index: number) => (
                                                        
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
                                                                            <img className="cm-flex" src={record.content?.resource?.value?.content?.thumbnailUrl ? record.content.resource.value.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(record?.content?.resource?.value?.content?.type)} style={{width: "100px", height: "50px", borderRadius: "6px", objectFit: "scale-down"}}/>
                                                                            <Text style={{ maxWidth: "400px" }} ellipsis={{ tooltip: record?.content?.resource?.value?.title }}>
                                                                                {record?.content?.resource?.value?.title || "Empty Card"}
                                                                            </Text>
                                                                        </Space>
                                                                        <MaterialSymbolsRounded font="delete" size="18" color="#DF2222" className="cm-cursor-pointer" onClick={() => handleDeleteUser(record.order)}/>
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
                                <div className="cm-flex-center" style={{height: "300px"}}>
                                    <img src={CAROUSEL_EMPTY} style={{borderRadius: "12px", width: "200px", height: "200px"}}/>
                                </div>
                        }
                        <div className="cm-width100 cm-margin-top10">
                            <Button type="primary" ghost className="cm-width100" onClick={() => setShowLibrary(true)}>Add Resource</Button> 
                        </div> 
                    </CollapsePanel>
                </Collapse>
            </div>
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resources: any) => {handleSelectedResource(resources); setShowLibrary(false)}}
                multipleResource        =   {true}
                pdfCustomPageSelection  =   {{isPDFSelection: true, widget: widget, module: "widget"}}
            />
        </>
    );
};

export default EditCarouselWidget;
