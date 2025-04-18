import { Popover } from 'antd';
import { ReactNode } from 'react';

import TagContent from './tag-content';

export interface BaseTagProp
{
    name        :   string;
    properties  :   {
        colorCode   :  string;
    };
}

export interface TagProp extends BaseTagProp
{
    uuid        :   string;
}

export interface TagComponentProps
{
    deckId      :   string; 
    children    :   ReactNode;
    mappedTags  :   TagProp[];
    tagsData    : {
        _dTags  : TagProp[];
    };
    tagsError   : any;

}

const Tags = (props: TagComponentProps) => {

    const { children, mappedTags, deckId, tagsData, tagsError }  =   props;

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Popover
                destroyTooltipOnHide
                className       =   'j-tag-popover'
                overlayClassName=   'j-tag-popover-overlay'
                placement       =   'bottomLeft'
                trigger         =   {["click"]}
                arrow           =   {false}
                content         =   {
                    <TagContent 
                        deckId      =   {deckId}
                        tags        =   {tagsData?._dTags ?? []}
                        error       =   {tagsError}
                        mappedTags  =   {mappedTags}
                    />
                }
            >
                {children}
            </Popover>
        </div>
    )
}

export default Tags