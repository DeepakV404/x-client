
import { FC, ReactNode } from 'react';
import { Popover } from 'antd';

import PopoverContent from './comment-view';

interface CommentPopoverProps
{
    children        :   ReactNode;
    actionId        :   string;
    sellers         :   any
    buyers          :   any
}

const CommentPopover : FC <CommentPopoverProps> = (props) => {

    const { children, actionId, buyers, sellers }   =   props;

    return (
        <Popover
            content         =   {<PopoverContent actionId={actionId} buyers={buyers} sellers={sellers}/>}
            trigger         =   {"click"}
            placement       =   'bottomRight'
        >
            {children}
        </Popover>
    );
};

export default CommentPopover;
