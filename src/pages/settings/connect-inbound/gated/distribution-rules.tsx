import { useState } from "react";
import { Card, Space } from "antd";
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import { StrictModeDroppable } from "../../../../buyer-view/pages/journey/droppable";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import RuleBuilderSlider from "./rule-builder-slider";

const DistributionRules = () => {

    const [openBuilder, setOpenBuilder] =   useState(false);

    let rulesItems = [
        {
            id  :   "123124",
            name:   "Mid market target leads - healthcare",
            desc:   <span>Rule set contains 3 and condtions and is mapped to <span className="cm-font-fam500">Healthcare deal closure</span> template</span>   
        },
        {
            id  :   "123123",
            name:   "Mid market target leads",
            desc:   <span>Rule set contains 3 and condtions and is mapped to <span className="cm-font-fam500">Deal closure</span> template</span>   
        },
    ]

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor :   isDraggingOver ? "#fffbf7" : "#fff",
        border          :   isDraggingOver ? "1px dashed #ffe8c8" : " 1px solid #fff",
        padding         :   isDraggingOver ? "5px"   : "0px",
        height          :   "calc(100% - 65px)",
        borderRadius    :   "8px"
    });

    const handleOnDragEnd = () => {

    }

    return (
        <>
            <Space className="cm-width100 cm-flex-space-between">
                <Space className="cm-margin-bottom20" direction="vertical" size={4}>
                    <div className='cm-font-fam600 cm-font-size15'>Distribution Rules</div>
                    <div className='cm-font-size12'>These rules will be evaluated after the <span className="cm-font-fam600">matching rules</span></div>
                </Space>
                <Space className="cm-font-fam500 cm-cursor-pointer cm-primary-color" size={4} onClick={() => setOpenBuilder(true)}>
                    <MaterialSymbolsRounded font="add_circle" size="18"/>
                    <div className="cm-font-size13">Create new rule</div>
                </Space>
            </Space>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <StrictModeDroppable droppableId='distribution-rules'>
                    {(provided, snapshot) => (
                        <Space 
                            {...provided.droppableProps} 
                            ref         =   {provided.innerRef} 
                            direction   =   "vertical" 
                            className   =   "cm-width100"
                            style       =   {getListStyle(snapshot.isDraggingOver)}
                        >
                            {
                                rulesItems.map((_ruleSet: any, index: number) => (
                                    <Draggable key={_ruleSet.id} draggableId={_ruleSet.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} key={_ruleSet.id}>
                                                <Card {...provided.draggableProps} className="j-distribution-rule-card cm-cursor-pointer">
                                                    <Space size={20}>
                                                        <div {...provided.dragHandleProps} className="cm-cursor-dragger" onClick={(e) => e.stopPropagation()}>
                                                            <MaterialSymbolsRounded font="drag_indicator" size="20" color="#5b5b5b" />
                                                        </div>
                                                        <Space  direction="vertical">
                                                            <div className="cm-font-fam600">{_ruleSet.name}</div>
                                                            <div className="cm-font-size11">{_ruleSet.desc}</div>
                                                        </Space>    
                                                    </Space>
                                                </Card>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </Space>
                    )}
                </StrictModeDroppable>
            </DragDropContext>

            <RuleBuilderSlider
                isOpen  =   {openBuilder}
                onClose =   {() => setOpenBuilder(false)}
            />
        </>
    )
}

export default DistributionRules