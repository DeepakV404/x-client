import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { Input, Space, Tag, } from 'antd';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

import { LibraryAgent } from '../../api/library-agent';
import { CommonUtil } from '../../../../utils/common-util';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { BaseTagProp, TagProp } from '.';

const colors = [
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
    "magenta",
    "red"
];

const getRandomColor = () => {
    return colors[(Math.floor(Math.random() * colors.length))];
}

interface TagComponentProps {
    deckId      :   string;
    tags        :   any;
    error?      :   ApolloError;
    mappedTags  :   any
}

const TagComponent: React.FC<TagComponentProps> = (props) => {

    const { deckId, tags, mappedTags }                  =   props;

    const inputRef: any                                 =   useRef();

    const [selectedTags, setSelectedTags]               =   useState<TagProp[]>(mappedTags);
    const [inputValue, setInputValue]                   =   useState('');
    const [filteredTags, setFilteredTags]               =   useState<TagProp[]>(tags);
    const [randomColor, setRandormColor]                =   useState<string>(getRandomColor());
    const [currentFocusedTag, setCurrentFocusedTag]     =   useState<number | "create" | undefined>(undefined);

    const $$CreateTagAndAssociate = (deckId: string, input: any, onCompleteCallback: any) => {  
        const uuid      =   self.crypto.randomUUID();
        const newTag    =   { ...input, uuid };                
        setFilteredTags(() => [...tags, newTag]);
        setSelectedTags((prevTags) => [...prevTags, newTag]);
        setInputValue('');
        LibraryAgent._dCreateAndAssociateTag({
            variables: {
                deckUuid    :   deckId,
                input       :   {...input, uuid : uuid}
            },
            onCompletion: () => {
                onCompleteCallback()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const $$AssociateTag = (deckId: string, tagId: string, onCompleteCallback: any) => { 
        setSelectedTags((prevTags) => [...prevTags, ...filteredTags.filter((tag) => tag.uuid === tagId)])        
        LibraryAgent._dAssociateTag({
            variables: {
                deckUuid    :   deckId,
                tagUuid     :   tagId
            },
            onCompletion: () => {
                onCompleteCallback()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const $$RemoveTag = (deckId: string, tagId: string, onCompleteCallback: any) => {                   
        setSelectedTags((prevTags) => prevTags.filter((tag) => tag.uuid !== tagId));
        LibraryAgent._dRemoveTag({
            variables: {
                deckUuid    :   deckId,
                tagUuid     :   tagId
            },
            onCompletion: () => {
                onCompleteCallback()
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    useEffect(() => {
        inputRef?.current?.focus()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value) {
            setFilteredTags((prevTags) => prevTags.filter((tag) => 
                tag.name.toLowerCase().includes(value.toLowerCase())
            ));
        } else {
            setFilteredTags(tags);
        }
        if(!value){
            setRandormColor(getRandomColor())
        }

        if(!currentFocusedTag && value){
            setCurrentFocusedTag("create")
        }
    };

    const resetOnComplete = () => {
        setInputValue('');
        setRandormColor(getRandomColor());
        inputRef?.current?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            if(currentFocusedTag === "create" && inputValue){
                $$CreateTagAndAssociate(
                    deckId, 
                    {
                        name        :   inputValue,
                        properties  :   {
                            colorCode: randomColor
                        },
                    },
                    () => resetOnComplete()
                )
            }else{
                if(typeof currentFocusedTag === "number" && currentFocusedTag >= 0 && currentFocusedTag < filteredTags.length){
                    if(filteredTags[currentFocusedTag]?.uuid){
                        if(!(selectedTags.filter(_tag => _tag.uuid === filteredTags[currentFocusedTag].uuid).length > 0)){
                            $$AssociateTag(
                                deckId,
                                filteredTags[currentFocusedTag].uuid!,
                                () => resetOnComplete()
                            )
                        }
                    }
                }
            }
        } 
        else if (e.key === 'Backspace' && !inputValue && selectedTags.length){
            $$RemoveTag(deckId, selectedTags.at(-1)?.uuid!, () => resetOnComplete())
        }
        else if (e.key === "ArrowDown"){
            setCurrentFocusedTag((prevIndex: any) => {
                if (prevIndex === 0 && filteredTags.length > 1) {
                    return prevIndex + 1;
                } else if (prevIndex === "create") {
                    return 0;
                } else if (typeof prevIndex === "number") {
                    if (prevIndex === filteredTags.length - 1) {
                        return "create";
                    } else {
                        return prevIndex + 1;
                    }
                } else {
                    return filteredTags.length - 1;
                }
            });
        } 
        else if (e.key === "ArrowUp"){
            setCurrentFocusedTag((prevIndex: any) => {
                if (prevIndex === 0) {
                    return "create";
                } else if (prevIndex === "create") {
                    return filteredTags.length - 1;
                } else if (typeof prevIndex === "number" && prevIndex > 0) {
                    return prevIndex - 1;
                } else {
                    return filteredTags.length - 1;
                }
            });
        } 
        else if (e.key === "Escape"){
            setCurrentFocusedTag(undefined);
        }

    };

    const handleTagClick = (type: "existing" | "new", tag?: BaseTagProp, existingTagId?: string) => {
        if(type === "new"){
            $$CreateTagAndAssociate(
                deckId, 
                tag,
                () => resetOnComplete()
            )
        }else if(type === "existing"){
            if(!(selectedTags.filter(_tag => _tag.uuid === existingTagId).length > 0)){
                $$AssociateTag(
                    deckId,
                    existingTagId!,
                    () => resetOnComplete()
                )
            }else{
                resetOnComplete()
            }
        }
    };

    const handleTagRemove = (tagId: string) => {
        $$RemoveTag(
            deckId,
            tagId,
            () => resetOnComplete()
        )
    };

    return (
        <div className="j-all-tags-listing-wrapper" onClick={(event) => event.stopPropagation()}>
            <div className="j-selected-tags-input">
                {selectedTags.map((tag) => (
                    <Tag key={tag.uuid} color={tag?.properties?.colorCode ?? "default"} style={{paddingRight: "2px"}}>
                        <Space className='cm-flex' size={2}>
                            {tag.name}
                            <MaterialSymbolsRounded className='cm-cursor-pointer' font='close' size='14' onClick={() => handleTagRemove(tag.uuid)}/>
                        </Space>
                    </Tag>
                ))}
                <div className='j-tag-input-wrapper'>
                    <Input
                        ref             =   {inputRef}
                        size            =   'large'
                        prefix          =   {selectedTags.length < 1 ? <MaterialSymbolsRounded font='search' size='18' color='#bfbfbf'/> : null}
                        placeholder     =   {'Search for a tag'}
                        variant         =   'borderless'
                        value           =   {inputValue}
                        onChange        =   {handleInputChange}
                        onKeyDown       =   {handleKeyDown}
                        className       =   "j-tag-input"
                    />
                </div>
            </div>
            
            <div className="cm-padding10 j-tag-listing">
                <div className='cm-font-size12 cm-font-opacity-black-65 cm-padding-bottom5'>Select an option or type to create one</div>
                {filteredTags.map((tag, index) => (
                    <div 
                        className       =   {`j-tag-listing-item-wrap ${currentFocusedTag === index ? "focused" : ""}`} 
                        onClick         =   {() => handleTagClick("existing", undefined, tag.uuid)}
                        onMouseOver     =   {() => setCurrentFocusedTag(index)}      
                    >
                        <Tag key={tag.uuid} color={tag?.properties?.colorCode ?? "default"}>
                            <Space className='cm-flex' size={2}>
                                {tag.name}
                            </Space>
                        </Tag>
                    </div>
                ))}
                {
                    inputValue &&
                        <div 
                            className   =   {`cm-cursor-pointer j-create-tag-wrapper ${currentFocusedTag === "create" ? "focused" : ""}`}
                            onClick     =   {() => handleTagClick("new", {
                                name        :   inputValue,
                                properties  :   {
                                    colorCode   :   randomColor
                                }
                            })}
                        >
                            <span className='cm-font-opacity-black-65 cm-font-size12'>Create</span> <Tag color={randomColor}>{inputValue}</Tag>
                        </div>
                }
            </div>
        </div>
    );
};

export default TagComponent;

