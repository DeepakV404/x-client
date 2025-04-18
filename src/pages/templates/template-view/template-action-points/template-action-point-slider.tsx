import { FC } from 'react';
import { Drawer } from 'antd';

import TemplateActionPoint from './template-action-point';

interface ActionSliderProps
{
    isOpen      :   boolean;
    onClose     :   () => void;
    actionId    :   string;
}

const TemplateActionPointSlider: FC<ActionSliderProps> = (props) => {

    const { onClose, isOpen, actionId }   =   props;

    return (
        
        <Drawer
            width       =   {700}
            onClose     =   {onClose}
            open        =   {isOpen}
            headerStyle =   {{display:'none'}}
            className   =   'j-drawer-action-view'
        >
            {
                isOpen &&
                    <TemplateActionPoint onClose={onClose} actionId={actionId}/>
            }
        </Drawer>
    )
}

export default TemplateActionPointSlider;