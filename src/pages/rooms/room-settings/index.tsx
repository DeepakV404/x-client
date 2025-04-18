import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Col, Popover, Row, Space, theme } from 'antd';

import { StrictModeDroppable } from '../../../buyer-view/pages/journey/droppable';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';
import { useRoomContext } from '../room-layout';
import { RoomsAgent } from '../api/rooms-agent';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import CustomSection from './custom-section';
import SectionPopoverContent from './room-section-popover.tsx/section-popover-content';

let colorBgBlur = "#f7fbff";

type RoomSection = {
    uuid: string;
    type: string;
};

export function useCustomSectionContext() {
    return useOutletContext<any>() || {};
}

const RoomSettings = (props: {sectionsData: any}) => {

    const { sectionsData }  =   props;

    const { token: { colorPrimary } }       =   theme.useToken();
    const { room, account, tourRef }        =   useRoomContext();
    const location                          =   useLocation();
    const metaData                          =   room.metadata;
    const pathname                          =   location.pathname;
    const navigate                          =   useNavigate()
    const section                           =   pathname.split('/').pop() || '';

    const { $isVendorMode, $isVendorOrg }    =   useContext(GlobalContext);

    const hasBuyers = room.buyers.length > 0;

    const [roomsSectionList, setRoomsSectionList]   =   useState<RoomSection[]>([])

    useEffect(() => {
        setRoomsSectionList(sectionsData)
    }, [sectionsData])

    useEffect(() => {
        const section = roomsSectionList[0];
        if (section && !location.pathname.split("/")[5]) {
            const searchParams = CommonUtil.__getQueryParams(location.search);

            searchParams?.onboarded === "true" ? 
                navigate(`${section?.uuid}?onboarded=true`)
            :
                navigate(section?.uuid);
        }
    }, [roomsSectionList])

    const handleOnDragEnd = (section: any) => {
        if(section.source.index !== section.destination.index){
            const reOrderSectionList = Array.from(roomsSectionList);
            const [reOrderedItem] = reOrderSectionList.splice(section.source.index, 1);
            reOrderSectionList.splice(section.destination.index, 0, reOrderedItem);

            const updateRoomSectionData = new Promise<void>((resolve, reject) => {
                try {
                    setRoomsSectionList(reOrderSectionList);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });

            updateRoomSectionData.then(() => {
                return RoomsAgent.updateSectionOrder({
                    variables: {
                        sectionUuid: section.draggableId,
                        order: section.destination.index + 1
                    },
                    onCompletion: () => {},
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                    }
                })
            })
        }
    }

    const getListStyle = (isDraggingOver: any) => ({
        backgroundColor :   isDraggingOver ? `${colorBgBlur}` : "#fff",
        border          :   isDraggingOver ?  `1px dashed ${colorPrimary}` : " 1px solid #fff",
        borderRadius    :   "6px",
    });

    const filteredRoomsSectionList = roomsSectionList?.filter((section: any) =>  ($isVendorMode || $isVendorOrg) ? !(section?.type === "NEXT_STEPS") : roomsSectionList)

    return (
        <>
            <Row gutter={16} className='cm-height100 cm-margin0'>
                <Col flex={"260px"} className='cm-height100 j-room-section-menubar cm-padding-inline0' key={"room-sider"}>
                    <div className='j-room-setup-sider-wrapper cm-height100'>
                        <Space className="cm-flex-space-between cm-padding15">
                            <span className="cm-font-size12 cm-font-fam600 cm-secondary-text cm-letter-spacing08">SECTIONS</span>
                            <Popover
                                content         =   {<SectionPopoverContent hasBuyers={hasBuyers}/>}
                                trigger         =   {"click"}
                                placement       =   'rightTop'
                                overlayClassName=   "j-template-add-section-popover"
                            >
                                <Space size={4} className="cm-cursor-pointer">
                                    <MaterialSymbolsRounded font="add" size="18" color="#0065E5"/>
                                    <div className="cm-font-size13 cm-font-fam500 cm-active-color">Add</div>
                                </Space>
                            </Popover>
                        </Space>
                        <div className='j-room-section-list cm-scrollbar-none'>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <StrictModeDroppable droppableId ='steps'>
                                    {(provided, snapshot) => (
                                        <div 
                                            {...provided.droppableProps} 
                                            ref             =   {provided.innerRef} 
                                            style           =   {getListStyle(snapshot.isDraggingOver)} 
                                        >
                                            {
                                                filteredRoomsSectionList.map((_section: any, index: number) => {
                                                    return (
                                                        <Draggable 
                                                            key         =   {_section?.uuid} 
                                                            draggableId =   {_section?.uuid} 
                                                            index       =   {index}
                                                        >
                                                            {(provided) => (
                                                                <CustomSection provided={provided} key={_section?.uuid} step={_section} sectionId={section} roomsSectionList={filteredRoomsSectionList}/>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )} 
                                </StrictModeDroppable>
                            </DragDropContext>
                        </div>
                    </div>
                </Col>
                <Col className="j-room-section-body cm-height100" flex={"auto"} style={{maxWidth: "calc(100% - 260px)", padding: "0px", marginRight: "0px"}}>
                    <Outlet context={{"metaData": metaData, "room": room, "account": account, "roomsSectionList": roomsSectionList, "tourRef" : tourRef}}/>
                </Col>
            </Row>
        </>
    )
}

export default RoomSettings 