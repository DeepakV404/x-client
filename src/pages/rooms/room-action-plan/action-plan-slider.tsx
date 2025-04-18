import { Drawer } from "antd";

import RoomMutualActionPlan from ".";

const ActionPlanSlider = (props: {isOpen: boolean, onClose: () => void, actionId: string}) => {

    const { onClose, isOpen }   =   props;
    
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
                    <RoomMutualActionPlan {...props} />
            }
        </Drawer>
    )
}

export default ActionPlanSlider