import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Mention, MentionsInput } from "react-mentions";
import { useQuery } from "@apollo/client";
import { Button, Space, Typography } from "antd";
import { toLower } from "lodash";

import { PREVIEW_USER_ICON } from "../../constants/module-constants";
import { P_SECTIONS } from "../../buyer-view/api/buyers-query";
import { R_SECTIONS } from "../../pages/rooms/api/rooms-query";
import { CommonUtil } from "../../utils/common-util";

import useLocalization from "../../custom-hooks/use-translation-hook";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import Emoji from "../Emoji";

const { Text }  =   Typography

const CommentBox = (props :{ onComplete: any, sellers?: any, buyers: any, message? : any, className?: string}) => {

    const { onComplete, sellers, buyers, message, className}  =   props;

    const { roomId }    =   useParams();
    
    const { data: sectionsData } = message ? useQuery(R_SECTIONS, {
        variables: { 
            roomUuid: roomId 
        },
        fetchPolicy: "network-only"
    }) : useQuery(P_SECTIONS, {
        fetchPolicy: "network-only"
    });
    
    const { translate } = useLocalization();

    const [value, setValue]     =   useState("");
    const suggestionRefs        =   useRef<Array<HTMLDivElement | null>>([]);

    const parseBuyersAndSeller = (comment: any) => {
        // Used to parse buyers and sellers
        let users = sellers?.concat(buyers);
        let formattedComment = comment.replace(/\{@u#([a-zA-Z0-9-]+)\}/g, function (commentId: string, parsedId: string) {
            if (parsedId === 'Everyone') {
                return `@Everyone`
            }
            let mentionedUser: any = users?.find((_user: any) => _user.uuid === parsedId);
            if (mentionedUser) {
                if (mentionedUser?.__typename === "AccountUserOutput") {
                    return `{@s#${parsedId}}`;
                } else {
                    return `{@b#${parsedId}}`;
                }
            }
            return commentId;
        });
        return formattedComment;
    };
    
    const onFinish = () => {
        if(!value.trim()){
            return CommonUtil.__showError("Comment cannot be empty!")
        }
        onComplete(parseBuyersAndSeller(value))
        setValue("")
    }

    const mentionData = message ?  
        [
            ...((sellers || []).filter((user: any) => user.status === "ACTIVE" || user.status === "INVITED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'seller' }))),
            ...((buyers || []).filter((user: any) => user.status === "ACTIVE" || user.status === "INVITED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'buyer' }))),
            { id: 'Everyone', display: 'Everyone', emailId: '', profileImage: PREVIEW_USER_ICON, type: '' },
        ] 
    :
        [
            ...((buyers || []).filter((user: any) => user.status === "ACTIVE" || user.status === "INVITED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'buyer' }))),
            ...((sellers || []).filter((user: any) => user.status === "ACTIVE" || user.status === "INVITED").map((item: any) => ({ id: item.uuid, display: CommonUtil.__getFullName(item.firstName, item.lastName), emailId: item.emailId, profileImage: item.profileUrl, type: 'seller' }))),
            { id: 'Everyone', display: 'Everyone', emailId: '', profileImage: PREVIEW_USER_ICON, type: '' },
        ]    
    
    const getName = (id: string) => {
        if (id === 'Everyone') {
            return '@Everyone';
        }
        let user = (sellers || []).concat(buyers || []).find((user: any) => user.uuid === id);
        return `@${user ? CommonUtil.__getFullName(user.firstName, user.lastName) : id}`;
    };    

    const getSections = () => {
        const sections = message ? sectionsData?._rSections : sectionsData?._pSections;
        return sections?.filter((item: any) => item.type !== "NEXT_STEPS").map((item: any) => ({ id: item.uuid, emoji: item.emoji, sectionName: item.title })) || [];
    };
    
    const getSectionName = (id: string) => {
        const sections = message ? sectionsData?._rSections : sectionsData?._pSections;
        const section = sections?.find((item: any) => item.uuid === id);
        return `#${section ? section.title : "unknown_section"}`;
    };

    const handleEnter = (event: any) => {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault()
            onFinish()
        }
    }

    const handleScrollToActive = (index: number) => {                        
        const currentRef = suggestionRefs.current[index];        
        if (currentRef) {
            currentRef.scrollIntoView({
                behavior: "smooth",
                block: "center", 
                inline: "nearest",
            });
        }
    };

    return (
        <div className={`j-action-box-layout ${className ? className : ""}`}>
            <MentionsInput 
                className                     =   "j-comment-mention"
                allowSuggestionsAboveCursor   =   {true}
                value                         =   {value} 
                onChange                      =   {(e => setValue(e.target.value))} 
                onKeyDown                     =   {(event) => handleEnter(event)} 
                placeholder                   =   {message ? "Use @ for users and # for sections" : translate("common-placeholder.comment-box")}
                autoFocus
            >
                <Mention
                    trigger             =   "@"
                    data                =   {(search: any) => {
                        return mentionData.filter((_item: any) => toLower(_item.display).includes(toLower(search)))
                    }}
                    markup              =   {"{@u#__id__}"}
                    displayTransform    =   {(id) => getName(id)}
                    renderSuggestion    =   {(user: any, _search: string, __, index: number, focused: boolean) => {                        
                        const refCallback   = (el: HTMLDivElement | null) => {                                                        
                            suggestionRefs.current[index] = el;
                        };
                        if(focused)         handleScrollToActive(index);
                        const isFirstSeller = user.type === 'seller' && (index === 0 || mentionData[index - 1]?.type !== 'seller');
                        const isFirstBuyer = user.type === 'buyer' && (index === 0 || mentionData.filter((_item: any) => toLower(_item.display).includes(toLower(_search)))[index - 1]?.type !== 'buyer');
                        if (user.id === 'Everyone') {
                            return (
                                <Space className={`j-comment-mention-item cm-font-fam500`} size={12}>
                                    <div className="j-everyone-icon" style={{background: "var(--bg-color)", border: "1px solid var(--bg-color)"}}>
                                        <MaterialSymbolsRounded font="groups" size="16" color="var(--primary-color)"/>
                                    </div>
                                    <Text className="cm-font-fam500">{user.display}</Text>
                                </Space>
                            );
                        }

                        return (
                            <>
                                {isFirstSeller && <div className={`j-comment-mention-header cm-background-white cm-light-text cm-padding-left15 cm-padding5 ${!message && "cm-margin-top5"} cm-font-size12`}>{message ? "Team Members" : "Sales Team"}</div>}
                                {isFirstBuyer && <div className={`j-comment-mention-header cm-background-white cm-light-text cm-padding-left15 cm-padding5 ${message && "cm-margin-top5"} cm-font-size12`}>{message ? "Buying Committee" : "Your People"}</div>}
                                
                                <div className="j-comment-mention-item cm-font-fam500">
                                    <div className="cm-flex-align-center" style={{columnGap: "12px"}} ref={refCallback}>
                                        <img className="cm-object-fit-scale-down cm-border-light cm-border-radius6" height={28} width={28} src={user.profileImage ?? PREVIEW_USER_ICON} />
                                        <Space direction="vertical" size={0}>
                                            <Text ellipsis={{tooltip: user.display}} style={{maxWidth: "160px", lineHeight: "16px"}} className="cm-font-fam500">{user.display}</Text>
                                            <Text ellipsis={{tooltip: user.emailId}} style={{maxWidth: "150px", lineHeight: "14px"}} className="cm-font-size12">{user.emailId}</Text>
                                        </Space>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                />
                <Mention
                    appendSpaceOnAdd
                    trigger             =   "#"
                    data                =   {(search: any) => getSections().filter((_item: any) => toLower(_item.sectionName).includes(toLower(search)))}
                    markup              =   {"{@sec#__id__}"}
                    displayTransform    =   {(id) => getSectionName(id)}
                    renderSuggestion    =   {(_section: any, _, __, index: number, focused: boolean) => {
                        const refCallback = (el: HTMLDivElement | null) => {
                            suggestionRefs.current[index] = el;
                        };
                        if(focused)     handleScrollToActive(index);
                        return(
                            <>
                                {index === 0 && <div className="j-comment-mention-header cm-background-white cm-padding-bottom10 cm-light-text">Sections</div>}
                                <div className="j-comment-mention-item cm-font-fam500">
                                    <div className="cm-flex cm-gap8" ref={refCallback}>
                                        <Emoji font={_section.emoji} size="14"/>
                                        <Text ellipsis={{tooltip: _section.sectionName}} style={{width: "100%"}} className="cm-font-fam500">{_section.sectionName}</Text>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                />
            </MentionsInput>        
            <div className="j-action-send-btn">
                <Button type="primary" ghost onClick={onFinish} className="cm-border-none"><MaterialSymbolsRounded font="send" size="32" filled className="cm-cursor-pointer"/></Button>
            </div>
        </div>
    )
}

export default CommentBox