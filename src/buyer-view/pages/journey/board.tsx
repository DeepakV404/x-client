import { useEffect, useState } from 'react'; 
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Space } from 'antd';

import ActionItemCard from './action-item-card';
import ActionSlider from './action-slider';

interface ActionInfoProps
{
    isOpen          :   boolean;
    actionId        :   string;
}

const Board = (props: {actionsList: any}) =>  {

    const { actionsList }   =   props;

    const [searchParams, setSearchParams]   =   useSearchParams();
    const navigate                          =   useNavigate();

    const [actionItems, updateActionItems]  =   useState(actionsList);
    const [showDrawer, setShowDrawer]       =   useState<ActionInfoProps>({
        isOpen      :   false,
        actionId    :   ""
    });

    const closeModal = () => {
        const param = searchParams.get("actionPointId");
      
        if (param) {
            searchParams.delete('actionPointId');
            setSearchParams(searchParams);
            setShowDrawer({
                isOpen      :   false,
                actionId    :   ""
            })
        }
    };

    useEffect(() => {
        updateActionItems(actionsList)
    }, [actionsList])

    useEffect(() => {
        const openActionPoint = searchParams.get('actionPointId');
        if(openActionPoint){
            setShowDrawer({isOpen: true, actionId: openActionPoint})
        }
    }, [searchParams])

    return (
        <>
            <Space direction='vertical' size={8} className='cm-width100 j-action-droppable'>
                {actionItems.map((_actionItem: any) => {
                    return (
                        <ActionItemCard 
                            key             =   {_actionItem.uuid} 
                            actionItem      =   {_actionItem}
                            onClick         =   {(actionId: string) => {
                                navigate({
                                    search: `?${createSearchParams({
                                        actionPointId: actionId
                                    })}`
                                });
                            }}
                        />
                    );
                })}
            </Space>
            <ActionSlider 
                isOpen      =   {showDrawer.isOpen} 
                onClose     =   {() => closeModal()}
                actionId    =   {showDrawer.actionId}
            />
        </>
    );
}

export default Board;
