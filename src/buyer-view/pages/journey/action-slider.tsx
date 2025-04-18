import { FC } from 'react';
import { Drawer } from 'antd';

import ActionView from './action-view';

interface ActionSliderProps
{
    isOpen      :   boolean;
    onClose     :   () => void;
    actionId    :   string;
}

const ActionSlider: FC<ActionSliderProps> = (props) => {

    const { onClose, isOpen }   =   props;

    return (
        
        <Drawer
            width           =   {700}
            onClose         =   {onClose}
            open            =   {isOpen}
            headerStyle     =   {{display:'none'}}
            rootClassName   =   'j-buyer-ap-drawer-wrapper'
            className       =   'j-drawer-buyer-action-view'
        >
            {
                isOpen &&
                    <ActionView {...props} />
            }
        </Drawer>
    )
}

export default ActionSlider;